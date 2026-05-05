import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
import { DAILY_DOWNLOAD_LIMIT } from '@/lib/wompi';

export const maxDuration = 15;

/**
 * GET /api/download/[resourceId]
 * 
 * Protected download endpoint with Fair Use Policy.
 * Verifies auth + purchase → returns Google Drive download URL.
 * Google Drive handles the actual file transfer (no Vercel limits).
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

    // Build Google Drive direct download URL
    const fileId = resource.drive_file_id || extractFileId(resource.url_accion);
    
    let downloadUrl: string;
    if (fileId) {
      // Direct download URL with confirm=t to bypass virus scan warning
      downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;
    } else {
      // Fallback to the raw url_accion
      downloadUrl = resource.url_accion;
    }

    // Return the download URL for the frontend to open
    return NextResponse.json({
      ok: true,
      downloadUrl,
      fileName: resource.nombre_ui || 'download',
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
