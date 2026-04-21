import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
import { generatePaymentReference, generateIntegrityHash, PRICING, toCents } from '@/lib/wompi';

/**
 * POST /api/checkout
 * 
 * Creates a pending purchase record and returns Wompi widget configuration.
 * Uses server-side auth session — no userId needed from client.
 * 
 * Body: { resourceId?: string, purchaseType: 'single' | 'subscription' }
 */
export async function POST(req: NextRequest) {
  try {
    const { resourceId, purchaseType } = await req.json();

    if (!purchaseType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (purchaseType === 'single' && !resourceId) {
      return NextResponse.json({ error: 'resourceId required for single purchase' }, { status: 400 });
    }

    // Get user from server-side auth (secure)
    const authClient = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await authClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
    }

    const userId = user.id;
    const userEmail = user.email;
    const supabase = createServiceRoleClient();

    // Check if already purchased (single only)
    if (purchaseType === 'single' && resourceId) {
      const { data: existing } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', userId)
        .eq('resource_id', resourceId)
        .eq('purchase_type', 'single')
        .eq('status', 'approved')
        .single();

      if (existing) {
        return NextResponse.json({ error: 'Already purchased', alreadyPurchased: true }, { status: 409 });
      }
    }

    // Determine amount
    const amountCop = purchaseType === 'subscription' ? PRICING.SUBSCRIPTION_COP : PRICING.SINGLE_PACK_COP;
    const amountCents = toCents(amountCop);

    // Generate payment reference
    const reference = generatePaymentReference();

    // Generate integrity hash for Wompi widget
    const integrityHash = generateIntegrityHash(reference, amountCents);

    // Create pending purchase record
    const { error: insertError } = await supabase.from('purchases').insert({
      user_id: userId,
      resource_id: purchaseType === 'single' ? resourceId : null,
      payment_ref: reference,
      amount_cop: amountCop,
      purchase_type: purchaseType,
      status: 'pending',
    });

    if (insertError) {
      console.error('Error creating purchase:', insertError);
      return NextResponse.json({ error: 'Failed to create purchase' }, { status: 500 });
    }

    // Return Wompi widget config
    return NextResponse.json({
      reference,
      amountCents,
      currency: PRICING.CURRENCY,
      publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY,
      integrityHash,
      customerEmail: userEmail,
      purchaseType,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
