import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { verifyWebhookSignature } from '@/lib/wompi';
import { shareFileWithEmail, shareAllFoldersWithEmail } from '@/lib/google-drive';

/**
 * POST /api/webhooks/wompi
 * 
 * Receives Wompi payment webhook notifications.
 * On APPROVED: grants Google Drive access to the buyer.
 * 
 * Wompi webhook payload:
 * {
 *   event: "transaction.updated",
 *   data: {
 *     transaction: {
 *       id: "...",
 *       status: "APPROVED",
 *       amount_in_cents: 1500000,
 *       reference: "AEC-...",
 *       customer_email: "...",
 *       payment_method_type: "PSE" | "NEQUI" | "CARD"
 *     }
 *   },
 *   sent_at: "2026-04-21T...",
 *   timestamp: 1234567890
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const checksum = req.headers.get('x-event-checksum') || '';

    const { event, data, timestamp } = body;

    // Only process transaction updates
    if (event !== 'transaction.updated') {
      return NextResponse.json({ message: 'Event ignored' }, { status: 200 });
    }

    const transaction = data?.transaction;
    if (!transaction) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { id: transactionId, status, amount_in_cents, reference, payment_method_type } = transaction;

    // Verify webhook signature
    const isValid = verifyWebhookSignature(
      transactionId,
      status,
      amount_in_cents,
      timestamp,
      checksum
    );

    if (!isValid) {
      console.error('❌ Invalid Wompi webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const supabase = createServiceRoleClient();

    // Find the pending purchase by reference
    const { data: purchase, error: findError } = await supabase
      .from('purchases')
      .select('*, user_profiles!inner(id, email, role)')
      .eq('payment_ref', reference)
      .single();

    if (findError || !purchase) {
      console.error('❌ Purchase not found for reference:', reference);
      return NextResponse.json({ error: 'Purchase not found' }, { status: 404 });
    }

    const userEmail = (purchase as any).user_profiles?.email;
    const userId = purchase.user_id;

    if (status === 'APPROVED') {
      // Update purchase status
      await supabase
        .from('purchases')
        .update({
          status: 'approved',
          payment_method: payment_method_type || 'unknown',
        })
        .eq('id', purchase.id);

      if (purchase.purchase_type === 'single') {
        // === INDIVIDUAL PURCHASE ===
        // Get the drive_file_id for this resource
        const { data: resource } = await supabase
          .from('aec_resources')
          .select('drive_file_id')
          .eq('id', purchase.resource_id)
          .single();

        if (resource?.drive_file_id && userEmail) {
          try {
            await shareFileWithEmail(resource.drive_file_id, userEmail);
            console.log(`✅ Individual purchase: shared ${purchase.resource_id} with ${userEmail}`);
          } catch (driveError) {
            console.error('⚠️ Drive sharing failed (purchase still approved):', driveError);
            // Don't fail the webhook — purchase is approved, Drive sharing can be retried
          }
        }

      } else if (purchase.purchase_type === 'subscription') {
        // === SUBSCRIPTION ===
        // Update user profile to subscriber
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        await supabase
          .from('user_profiles')
          .update({
            role: 'subscriber',
            subscription_expires_at: expiresAt.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);

        // Share all root folders
        if (userEmail) {
          try {
            await shareAllFoldersWithEmail(userEmail);
            console.log(`✅ Subscription: shared all folders with ${userEmail}`);
          } catch (driveError) {
            console.error('⚠️ Drive folder sharing failed (subscription still active):', driveError);
          }
        }
      }

      console.log(`✅ Payment APPROVED: ${reference} (${purchase.purchase_type})`);

    } else if (status === 'DECLINED' || status === 'VOIDED' || status === 'ERROR') {
      // Update purchase as rejected
      await supabase
        .from('purchases')
        .update({ status: 'rejected' })
        .eq('id', purchase.id);

      console.log(`❌ Payment ${status}: ${reference}`);
    }

    return NextResponse.json({ message: 'Webhook processed' }, { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
