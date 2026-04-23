import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
import { google } from 'googleapis';

// No need for long duration — we just verify access and redirect
export const maxDuration = 15;

/**
 * GET /api/download/[resourceId]
 * 
 * Protected download endpoint.
 * Verifies user has access, then generates a temporary direct download URL
 * from Google Drive — the browser downloads directly from Google, not through Vercel.
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
      // Fallback: redirect to Drive URL
      return NextResponse.redirect(resource.url_accion, 302);
    }

    // Authenticate with Google Drive API using service account
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    // Get a fresh access token
    const accessToken = await auth.getAccessToken();

    if (!accessToken) {
      return NextResponse.json({ error: 'Failed to get download token' }, { status: 500 });
    }

    // Redirect to direct Google Drive download URL with service account token
    // The browser downloads directly from Google — no Vercel proxy bottleneck
    const directUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

    // Get file metadata for the filename
    const drive = google.drive({ version: 'v3', auth });
    const fileMeta = await drive.files.get({
      fileId,
      fields: 'name',
    });

    const fileName = fileMeta.data.name || `${resource.nombre_ui || 'download'}`;

    // Return redirect with auth header — use fetch on client side
    // Since we can't set auth headers on a redirect, return the URL + token for client-side download
    return NextResponse.json({
      downloadUrl: directUrl,
      token: accessToken,
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
