import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { revokeAllFoldersAccess } from '@/lib/google-drive';

/**
 * GET /api/cron/expire-subscriptions
 * 
 * Cron job: runs daily to expire subscriptions.
 * Finds users with expired subscriptions, revokes their Drive access,
 * and sets their role back to 'free'.
 * 
 * Protected by CRON_SECRET header to prevent unauthorized access.
 * 
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/expire-subscriptions",
 *     "schedule": "0 6 * * *"
 *   }]
 * }
 */
export async function GET(req: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceRoleClient();

    // Find expired subscribers
    const { data: expiredUsers, error } = await supabase
      .from('user_profiles')
      .select('id, email')
      .eq('role', 'subscriber')
      .lt('subscription_expires_at', new Date().toISOString());

    if (error) {
      console.error('Error fetching expired subscribers:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!expiredUsers || expiredUsers.length === 0) {
      console.log('✅ No expired subscriptions found');
      return NextResponse.json({ message: 'No expired subscriptions', processed: 0 });
    }

    console.log(`🔄 Processing ${expiredUsers.length} expired subscriptions...`);

    let revokedCount = 0;
    let errorCount = 0;

    for (const user of expiredUsers) {
      try {
        // Revoke Drive access
        if (user.email) {
          await revokeAllFoldersAccess(user.email);
        }

        // Update profile to free
        await supabase
          .from('user_profiles')
          .update({
            role: 'free',
            subscription_expires_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        revokedCount++;
        console.log(`✅ Revoked: ${user.email}`);
      } catch (err) {
        errorCount++;
        console.error(`❌ Failed to revoke: ${user.email}`, err);
      }
    }

    const summary = {
      message: 'Cron completed',
      processed: expiredUsers.length,
      revoked: revokedCount,
      errors: errorCount,
    };

    console.log('📊 Cron summary:', summary);
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
