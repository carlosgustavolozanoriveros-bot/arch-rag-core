import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
import { revokeAllFoldersAccess } from '@/lib/google-drive';

/**
 * POST /api/subscription/cancel
 * 
 * Cancels the current user's subscription.
 * The subscription remains active until its expiration date,
 * then the cron job will revoke Drive access.
 */
export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = session.user.id;
    const serviceClient = createServiceRoleClient();

    // Get user profile
    const { data: profile, error: profileError } = await serviceClient
      .from('user_profiles')
      .select('role, subscription_expires_at, email')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    if (profile.role !== 'subscriber') {
      return NextResponse.json({ error: 'No active subscription' }, { status: 400 });
    }

    // Revoke Drive access immediately
    if (profile.email) {
      try {
        await revokeAllFoldersAccess(profile.email);
      } catch (driveError) {
        console.error('⚠️ Drive revocation failed during cancel:', driveError);
        // Continue anyway — the cron will catch it
      }
    }

    // Update user profile: set to free, clear expiration
    await serviceClient
      .from('user_profiles')
      .update({
        role: 'free',
        subscription_expires_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    console.log(`✅ Subscription cancelled for user ${userId}`);

    return NextResponse.json({
      message: 'Suscripción cancelada exitosamente',
      cancelled: true,
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
