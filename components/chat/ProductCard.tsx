'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { WompiCheckout } from '../checkout/WompiCheckout';

interface ProductData {
  id: string;
  nombre_ui: string;
  nombre_archivo?: string | null;
  descripcion_card?: string | null;
  chunk_semantico?: string;
  tipo_recurso?: string;
  categoria?: string;
  subcategoria?: string;
  version_revit?: string;
  es_parametrico?: boolean;
  url_thumbnail?: string | null;
  precio_usd?: number | string;
  etiquetas_duras?: string[];
  similarity?: number;
}

interface ProductCardProps {
  product: ProductData;
  userRole?: 'free' | 'subscriber' | 'admin' | null;
  purchased?: boolean;
  onRequireLogin?: () => void;
}

/**
 * Transform Google Drive download URLs to embeddable thumbnail URLs
 */
function toEmbeddableUrl(url: string): string {
  const patterns = [
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w400`;
    }
  }
  return url;
}

/** Format tipo_recurso for display */
function formatTipoRecurso(tipo: string): string {
  const map: Record<string, string> = {
    'familia_revit': 'Familia Revit',
    'proyecto_revit': 'Proyecto Revit',
    'bloque_autocad': 'Bloque AutoCAD',
    'escena_d5': 'Escena D5 Render',
    'curso': 'Curso',
    'textura': 'Textura',
    'modelo_3d': 'Modelo 3D',
  };
  return map[tipo] || tipo.replace(/_/g, ' ');
}

type CardState = 'idle' | 'loading' | 'checkout' | 'purchased' | 'subscriber';

export function ProductCard({ product, userRole, purchased = false, onRequireLogin }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [cardState, setCardState] = useState<CardState>('idle');
  const [hasPurchased, setHasPurchased] = useState(purchased);
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const thumbnailUrl = product.url_thumbnail ? toEmbeddableUrl(product.url_thumbnail) : null;

  // Description: use descripcion_card if available, otherwise truncate chunk_semantico
  const description = product.descripcion_card
    || (product.chunk_semantico ? product.chunk_semantico.slice(0, 100) + '...' : '');

  // Check if user is subscriber or has purchased this product
  useEffect(() => {
    async function checkAccess() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) return;

      setUserId(session.user.id);

      // Check if subscriber
      if (userRole === 'subscriber' || userRole === 'admin') {
        setCardState('subscriber');
        return;
      }

      // Check if already purchased this specific product
      const { data: existingPurchase } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('resource_id', product.id)
        .eq('purchase_type', 'single')
        .eq('status', 'approved')
        .maybeSingle();

      if (existingPurchase) {
        setHasPurchased(true);
        setCardState('purchased');
      }
    }

    checkAccess();
  }, [product.id, userRole]);

  // Handle individual purchase
  const handleBuy = useCallback(async () => {
    if (!userId) {
      onRequireLogin?.();
      return;
    }

    setCardState('loading');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId: product.id,
          purchaseType: 'single',
          userId,
        }),
      });

      const data = await res.json();

      if (data.alreadyPurchased) {
        setHasPurchased(true);
        setCardState('purchased');
        return;
      }

      if (!res.ok) {
        console.error('Checkout error:', data.error);
        setCardState('idle');
        return;
      }

      setCheckoutData(data);
      setCardState('checkout');
    } catch (error) {
      console.error('Buy error:', error);
      setCardState('idle');
    }
  }, [userId, product.id, onRequireLogin]);

  // Handle subscription purchase
  const handleSubscribe = useCallback(async () => {
    if (!userId) {
      onRequireLogin?.();
      return;
    }

    setCardState('loading');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purchaseType: 'subscription',
          userId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Checkout error:', data.error);
        setCardState('idle');
        return;
      }

      setCheckoutData(data);
      setCardState('checkout');
    } catch (error) {
      console.error('Subscribe error:', error);
      setCardState('idle');
    }
  }, [userId, onRequireLogin]);

  // Handle download
  const handleDownload = useCallback(() => {
    window.open(`/api/download/${product.id}`, '_blank');
  }, [product.id]);

  // Checkout callbacks
  const handleCheckoutSuccess = useCallback(() => {
    setCardState('purchased');
    setHasPurchased(true);
    setCheckoutData(null);
    // Auto-start download after successful payment
    setTimeout(() => {
      window.open(`/api/download/${product.id}`, '_blank');
    }, 500);
  }, [product.id]);

  const handleCheckoutError = useCallback((error: string) => {
    console.error('Payment error:', error);
    setCardState('idle');
    setCheckoutData(null);
  }, []);

  const handleCheckoutClose = useCallback(() => {
    setCardState('idle');
    setCheckoutData(null);
  }, []);

  // Determine which buttons to show
  const showDownload = cardState === 'purchased' || cardState === 'subscriber' || hasPurchased;
  const showBuyButtons = !showDownload && cardState !== 'loading';
  const isLoading = cardState === 'loading';

  return (
    <>
      <div className="product-card">
        <div className="product-card-thumb">
          {thumbnailUrl && !imgError ? (
            <img
              src={thumbnailUrl}
              alt={product.nombre_ui}
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              fontSize: '36px',
              background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%)',
              color: 'var(--text-muted)',
            }}>
              🏗️
            </div>
          )}
          {/* Subscriber badge */}
          {cardState === 'subscriber' && (
            <div className="product-card-badge-pro">PRO ✓</div>
          )}
        </div>

        <div className="product-card-body">
          {product.tipo_recurso && (
            <div className="product-card-category">
              {formatTipoRecurso(product.tipo_recurso)}
            </div>
          )}

          <h4 className="product-card-title">{product.nombre_ui}</h4>

          {description && (
            <p className="product-card-desc">{description}</p>
          )}

          <div className="product-card-footer">
            {showDownload ? (
              <button className="product-card-download-btn" onClick={handleDownload}>
                ⬇ Descargar
              </button>
            ) : isLoading ? (
              <button className="product-card-buy-btn" disabled>
                Procesando...
              </button>
            ) : showBuyButtons ? (
              <>
                <button className="product-card-buy-btn" onClick={handleBuy}>
                  Comprar $15,000
                </button>
                <button className="product-card-sub-btn" onClick={handleSubscribe}>
                  PRO $70,000/mes
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Wompi Checkout Modal */}
      {checkoutData && (
        <WompiCheckout
          isOpen={cardState === 'checkout'}
          reference={checkoutData.reference}
          amountCents={checkoutData.amountCents}
          currency={checkoutData.currency}
          publicKey={checkoutData.publicKey}
          integrityHash={checkoutData.integrityHash}
          customerEmail={checkoutData.customerEmail}
          purchaseType={checkoutData.purchaseType}
          onClose={handleCheckoutClose}
          onSuccess={handleCheckoutSuccess}
          onError={handleCheckoutError}
        />
      )}
    </>
  );
}
