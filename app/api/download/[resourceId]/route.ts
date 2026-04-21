import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';

/**
 * GET /api/download/[resourceId]
 * 
 * Protected download endpoint.
 * Verifies user has access (purchase or subscription) then redirects to Drive URL.
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

    // Get the download URL
    const { data: resource, error: resourceError } = await serviceClient
      .from('aec_resources')
      .select('url_accion, nombre_ui')
      .eq('id', resourceId)
      .single();

    if (resourceError || !resource?.url_accion) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    // Log the download (fire-and-forget, don't slow the redirect)
    serviceClient
      .from('downloads')
      .insert({ user_id: userId, resource_id: resourceId })
      .then(({ error }: { error: any }) => {
        if (error) console.error('Download log error:', error);
      });

    // Build direct download URL (bypasses Google Drive virus scan warning)
    let downloadUrl = resource.url_accion;
    const fileIdMatch = downloadUrl.match(/(?:[?&]id=|\/d\/|\/file\/d\/)([a-zA-Z0-9_-]+)/);
    if (fileIdMatch?.[1]) {
      downloadUrl = `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}&confirm=t`;
    }

    // Redirect to direct download
    return NextResponse.redirect(downloadUrl, 302);
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
