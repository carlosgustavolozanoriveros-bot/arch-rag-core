import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
import { google } from 'googleapis';
import { DAILY_DOWNLOAD_LIMIT } from '@/lib/wompi';

export const maxDuration = 15;

/**
 * GET /api/download/[resourceId]
 * 
 * Protected download endpoint with Fair Use Policy.
 * Verifies auth + purchase → returns a direct Google Drive API download URL
 * with embedded short-lived access_token. Browser downloads directly from
 * Google's servers — no Vercel proxy, no blob, no file size limit.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ resourceId: string }> }
) {
  try {
    const { resourceId } = await params;

    if (!resourceId) {
      return NextResponse.json({ error: 'Resource ID required' }, { status: 400 });
    }

    // Get authenticated user
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión para descargar', requireLogin: true },
        { status: 401 }
      );
    }

    const userId = user.id;
    const serviceClient = createServiceRoleClient();

    // Check access using the DB function
    const { data: hasAccess, error: accessError } = await serviceClient
      .rpc('user_has_access', {
        p_user_id: userId,
        p_resource_id: resourceId,
      });

    if (accessError) {
      console.error('Access check error:', accessError);
      return NextResponse.json({ error: 'Error checking access' }, { status: 500 });
    }

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'No tienes acceso a este recurso. Cómpralo primero.', requirePurchase: true },
        { status: 403 }
      );
    }

    // ── Fair Use Policy: Daily Download Limit ──
    const { data: profile } = await serviceClient
      .from('user_profiles')
      .select('role')
      .eq('id', userId)
      .single();

    const isAdmin = profile?.role === 'admin';

    const { data: singlePurchase } = await serviceClient
      .from('purchases')
      .select('id')
      .eq('user_id', userId)
      .eq('resource_id', resourceId)
      .eq('purchase_type', 'single')
      .eq('status', 'approved')
      .maybeSingle();

    const hasSinglePurchase = !!singlePurchase;

    if (!isAdmin && !hasSinglePurchase) {
      const now = new Date();
      const colombiaOffset = -5 * 60;
      const localTime = new Date(now.getTime() + (colombiaOffset + now.getTimezoneOffset()) * 60000);
      const startOfDay = new Date(localTime.getFullYear(), localTime.getMonth(), localTime.getDate());
      const startOfDayUTC = new Date(startOfDay.getTime() - (colombiaOffset + now.getTimezoneOffset()) * 60000);

      const { count, error: countError } = await serviceClient
        .from('downloads')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('downloaded_at', startOfDayUTC.toISOString());

      if (countError) {
        console.error('Download count error:', countError);
        return NextResponse.json({ error: 'Error checking download limit' }, { status: 500 });
      }

      if ((count || 0) >= DAILY_DOWNLOAD_LIMIT) {
        return NextResponse.json({
          error: `Has alcanzado el límite de ${DAILY_DOWNLOAD_LIMIT} descargas diarias.`,
          dailyLimitReached: true,
          remainingToday: 0,
        }, { status: 429 });
      }
    }

    // Get the resource info
    const { data: resource, error: resourceError } = await serviceClient
      .from('aec_resources')
      .select('url_accion, nombre_ui, drive_file_id')
      .eq('id', resourceId)
      .single();

    if (resourceError || !resource?.url_accion) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    // Log the download (fire-and-forget)
    serviceClient
      .from('downloads')
      .insert({ user_id: userId, resource_id: resourceId })
      .then(({ error }: { error: any }) => {
        if (error) console.error('Download log error:', error);
      });

    // Extract file ID
    const fileId = resource.drive_file_id || extractFileId(resource.url_accion);

    if (!fileId) {
      // Fallback: return the raw url_accion
      return NextResponse.json({
        ok: true,
        downloadUrl: resource.url_accion,
        fileName: resource.nombre_ui || 'download',
      });
    }

    // Generate a short-lived Google Drive API access token
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    const accessToken = await auth.getAccessToken();
    if (!accessToken) {
      // Fallback to Google Drive public URL
      return NextResponse.json({
        ok: true,
        downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`,
        fileName: resource.nombre_ui || 'download',
      });
    }

    // Get file name from Drive
    const drive = google.drive({ version: 'v3', auth });
    const fileMeta = await drive.files.get({ fileId, fields: 'name' });
    const fileName = fileMeta.data.name || `${resource.nombre_ui || 'download'}`;

    // Return direct Google Drive API URL with embedded token
    // Browser downloads directly from Google — no proxy, no blob, no size limit,
    // no virus scan confirmation page
    const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&access_token=${accessToken}`;

    return NextResponse.json({
      ok: true,
      downloadUrl,
      fileName,
    });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/** Extract Google Drive file ID from various URL formats */
function extractFileId(url: string): string | null {
  const patterns = [
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}
