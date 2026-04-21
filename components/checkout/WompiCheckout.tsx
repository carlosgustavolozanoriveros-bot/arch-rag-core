'use client';

import { useEffect, useRef, useCallback } from 'react';

interface WompiCheckoutProps {
  isOpen: boolean;
  reference: string;
  amountCents: number;
  currency: string;
  publicKey: string;
  integrityHash: string;
  customerEmail?: string;
  purchaseType: 'single' | 'subscription';
  onClose: () => void;
  onSuccess: () => void;
  onError: (error: string) => void;
}

/**
 * WompiCheckout — Modal that loads the Wompi payment widget
 * 
 * Uses Wompi's JavaScript widget to handle payments directly.
 * The widget handles PSE, Nequi, and card payments.
 */
export function WompiCheckout({
  isOpen,
  reference,
  amountCents,
  currency,
  publicKey,
  integrityHash,
  customerEmail,
  purchaseType,
  onClose,
  onSuccess,
  onError,
}: WompiCheckoutProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const scriptLoaded = useRef(false);

  // Load Wompi widget script
  useEffect(() => {
    if (!isOpen || scriptLoaded.current) return;

    const script = document.createElement('script');
    script.src = 'https://checkout.wompi.co/widget.js';
    script.async = true;
    script.onload = () => {
      scriptLoaded.current = true;
    };
    document.body.appendChild(script);

    return () => {
      // Don't remove script on cleanup — it's idempotent
    };
  }, [isOpen]);

  // Handle Wompi response
  const handleWompiResponse = useCallback((event: MessageEvent) => {
    if (event.data?.source === 'wompi-widget') {
      const { transaction } = event.data;
      if (transaction?.status === 'APPROVED') {
        onSuccess();
      } else if (transaction?.status === 'DECLINED' || transaction?.status === 'ERROR') {
        onError(transaction?.status_message || 'Pago rechazado');
      }
    }
  }, [onSuccess, onError]);

  useEffect(() => {
    window.addEventListener('message', handleWompiResponse);
    return () => window.removeEventListener('message', handleWompiResponse);
  }, [handleWompiResponse]);

  if (!isOpen) return null;

  const amountFormatted = (amountCents / 100).toLocaleString('es-CO');
  const label = purchaseType === 'subscription' ? 'Suscripción PRO Mensual' : 'Pack Individual';

  return (
    <div className="wompi-overlay" onClick={onClose}>
      <div className="wompi-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="wompi-modal-header">
          <h3>💳 Confirmar Pago</h3>
          <button className="wompi-close-btn" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        {/* Summary */}
        <div className="wompi-summary">
          <div className="wompi-summary-row">
            <span>Tipo</span>
            <span>{label}</span>
          </div>
          <div className="wompi-summary-row wompi-total">
            <span>Total</span>
            <span>${amountFormatted} COP</span>
          </div>
          {purchaseType === 'subscription' && (
            <p className="wompi-recurring-note">
              Se renovará automáticamente cada 30 días. Puedes cancelar en cualquier momento.
            </p>
          )}
        </div>

        {/* Wompi Payment Form */}
        <form ref={formRef} className="wompi-form">
          <script
            src="https://checkout.wompi.co/widget.js"
            data-render="button"
            data-public-key={publicKey}
            data-currency={currency}
            data-amount-in-cents={amountCents.toString()}
            data-reference={reference}
            data-signature-integrity={integrityHash}
            data-customer-data-email={customerEmail}
            data-redirect-url={`${typeof window !== 'undefined' ? window.location.origin : ''}/api/checkout/redirect`}
          />
        </form>

        {/* Fallback button if widget doesn't render */}
        <div className="wompi-fallback">
          <a
            href={`https://checkout.wompi.co/l/${publicKey}?currency=${currency}&amount-in-cents=${amountCents}&reference=${reference}&signature-integrity=${integrityHash}&customer-data-email=${customerEmail || ''}`}
            target="_blank"
            rel="noopener noreferrer"
            className="wompi-fallback-btn"
          >
            Pagar ${amountFormatted} COP
          </a>
        </div>

        {/* Security note */}
        <p className="wompi-security">
          🔒 Pago seguro procesado por Wompi. No almacenamos datos de tu tarjeta.
        </p>
      </div>
    </div>
  );
}
