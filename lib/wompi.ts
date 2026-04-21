import crypto from 'crypto';

/**
 * Wompi (Colombia) — Payment gateway helpers
 * 
 * Handles webhook signature verification, payment reference generation,
 * and integrity hash generation for the checkout widget.
 * 
 * Docs: https://docs.wompi.co/
 */

/**
 * Verify Wompi webhook signature (HMAC SHA256)
 * Wompi sends: POST with header `X-Event-Checksum`
 * 
 * The checksum is calculated as:
 * SHA256(event.transaction.id + event.transaction.status + event.transaction.amount_in_cents + timestamp + EVENTS_SECRET)
 */
export function verifyWebhookSignature(
  transactionId: string,
  status: string,
  amountInCents: number,
  timestamp: number,
  receivedChecksum: string
): boolean {
  const secret = process.env.WOMPI_EVENTS_SECRET;
  if (!secret) throw new Error('WOMPI_EVENTS_SECRET not configured');

  const concatenated = `${transactionId}${status}${amountInCents}${timestamp}${secret}`;
  const hash = crypto.createHash('sha256').update(concatenated).digest('hex');

  return hash === receivedChecksum;
}

/**
 * Generate a unique payment reference for Wompi
 * Format: AEC-{timestamp}-{random}
 */
export function generatePaymentReference(): string {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(4).toString('hex');
  return `AEC-${timestamp}-${random}`;
}

/**
 * Generate integrity hash for Wompi checkout widget
 * 
 * The hash ensures the payment amount hasn't been tampered with.
 * Calculated as: SHA256(reference + amount_in_cents + currency + integrity_secret)
 */
export function generateIntegrityHash(
  reference: string,
  amountInCents: number,
  currency: string = 'COP'
): string {
  const secret = process.env.WOMPI_INTEGRITY_SECRET;
  if (!secret) throw new Error('WOMPI_INTEGRITY_SECRET not configured');

  const concatenated = `${reference}${amountInCents}${currency}${secret}`;
  return crypto.createHash('sha256').update(concatenated).digest('hex');
}

/**
 * Pricing constants
 */
export const PRICING = {
  SINGLE_PACK_COP: 15000,
  SUBSCRIPTION_COP: 70000,
  CURRENCY: 'COP',
} as const;

/**
 * Convert COP amount to cents (Wompi uses centavos)
 */
export function toCents(amountCop: number): number {
  return amountCop * 100;
}
