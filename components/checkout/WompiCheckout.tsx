'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

declare global {
  interface Window {
    WidgetCheckout: any;
  }
}

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
 * WompiCheckout — Loads the Wompi WidgetCheckout programmatically.
 * 
 * Uses `new WidgetCheckout({...}).open(callback)` as per Wompi docs.
 * The script is loaded once, then the widget is opened when `isOpen` becomes true.
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
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const widgetOpened = useRef(false);

  // Load Wompi widget script once
  useEffect(() => {
    if (document.querySelector('script[src="https://checkout.wompi.co/widget.js"]')) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.wompi.co/widget.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Wompi widget script');
      onError('No se pudo cargar el sistema de pagos');
    };
    document.head.appendChild(script);
  }, [onError]);

  // Open widget when ready
  useEffect(() => {
    if (!isOpen || !scriptLoaded || widgetOpened.current) return;
    if (!window.WidgetCheckout) {
      console.error('WidgetCheckout not available');
      onError('Sistema de pagos no disponible');
      return;
    }

    widgetOpened.current = true;

    try {
      const checkout = new window.WidgetCheckout({
        currency: currency,
        amountInCents: amountCents,
        reference: reference,
        publicKey: publicKey,
        signature: {
          integrity: integrityHash,
        },
        redirectUrl: `${window.location.origin}`,
        customerData: customerEmail ? {
          email: customerEmail,
        } : undefined,
      });

      checkout.open((result: any) => {
        widgetOpened.current = false;
        const transaction = result?.transaction;

        if (!transaction) {
          // User closed the widget
          onClose();
          return;
        }

        if (transaction.status === 'APPROVED') {
          onSuccess();
        } else if (transaction.status === 'DECLINED' || transaction.status === 'ERROR') {
          onError(transaction.statusMessage || 'Pago rechazado');
        } else if (transaction.status === 'VOIDED') {
          onError('Pago anulado');
        } else {
          // PENDING or other — webhook will handle it
          onClose();
        }
      });
    } catch (err) {
      console.error('Error opening Wompi widget:', err);
      widgetOpened.current = false;
      onError('Error al abrir el sistema de pagos');
    }
  }, [isOpen, scriptLoaded, reference, amountCents, currency, publicKey, integrityHash, customerEmail, onClose, onSuccess, onError]);

  // Reset when closed
  useEffect(() => {
    if (!isOpen) {
      widgetOpened.current = false;
    }
  }, [isOpen]);

  // This component doesn't render anything visible — the widget is a Wompi overlay
  return null;
}
