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

type CardState = 'idle' | 'loading' | 'checkout' | 'purchased' | 'subscriber' | 'daily_limit';

export function ProductCard({ product, userRole, purchased = false, onRequireLogin }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [cardState, setCardState] = useState<CardState>('idle');
  const [hasPurchased, setHasPurchased] = useState(purchased);
  const [isUserSubscriber, setIsUserSubscriber] = useState(false);
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

      // Fetch actual role from DB (not from potentially stale prop)
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role, subscription_expires_at')
        .eq('id', session.user.id)
        .single();

      const isSubscriber = profile && (
        profile.role === 'admin' || 
        (profile.role === 'subscriber' && profile.subscription_expires_at && new Date(profile.subscription_expires_at) > new Date())
      );

      if (isSubscriber) {
        setIsUserSubscriber(true);
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
      // Check if there's a pending purchase intent for THIS product (after login redirect)
      const intentStr = localStorage.getItem('aec_purchase_intent');
      if (intentStr) {
        try {
          const intent = JSON.parse(intentStr);
          // Only auto-trigger if intent is for this product and less than 5 min old
          if (intent.productId === product.id && Date.now() - intent.timestamp < 300000) {
            localStorage.removeItem('aec_purchase_intent');
            // Small delay to let UI settle, then auto-trigger checkout
            setTimeout(async () => {
              try {
                const res = await fetch('/api/checkout', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    resourceId: intent.purchaseType === 'single' ? product.id : undefined,
                    purchaseType: intent.purchaseType,
                  }),
                });
                const data = await res.json();
                if (res.ok) {
                  setCheckoutData(data);
                  setCardState('checkout');
                }
              } catch (e) {
                console.error('Auto-checkout error:', e);
              }
            }, 800);
          }
        } catch (e) {
          localStorage.removeItem('aec_purchase_intent');
        }
      }
    }

    checkAccess();
  }, [product.id, userRole]);

  // Handle individual purchase
  const handleBuy = useCallback(async () => {
    if (!userId) {
      // Save purchase intent so it auto-triggers after login
      localStorage.setItem('aec_purchase_intent', JSON.stringify({
        productId: product.id,
        purchaseType: 'single',
        timestamp: Date.now(),
      }));
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
      // Save purchase intent so it auto-triggers after login
      localStorage.setItem('aec_purchase_intent', JSON.stringify({
        productId: product.id,
        purchaseType: 'subscription',
        timestamp: Date.now(),
      }));
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

  // Trigger download via direct URL
  const triggerDownload = useCallback(async (resourceId: string) => {
    try {
      setCardState('loading');
      const res = await fetch(`/api/download/${resourceId}`);
      const data = await res.json();
      
      if (!res.ok) {
        console.error('Download error:', data.error);
        
        // Handle daily limit reached
        if (res.status === 429 && data.dailyLimitReached) {
          setCardState('daily_limit');
          return;
        }
        
        alert(data.error || 'Error al descargar el archivo');
        setCardState(isUserSubscriber ? 'subscriber' : (hasPurchased ? 'purchased' : 'idle'));
        return;
      }
      
      if (data.downloadUrl && data.token) {
        // Fetch file directly from Google API into a browser Blob
        // This avoids Vercel proxy AND Google's "automated queries" direct-link block
        const fileRes = await fetch(data.downloadUrl, {
          headers: {
            'Authorization': `Bearer ${data.token}`
          }
        });

        if (!fileRes.ok) {
          throw new Error('Error downloading from Google Drive');
        }

        // Convert to blob and trigger local download
        const blob = await fileRes.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = data.fileName || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up memory
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      }
      setCardState(isUserSubscriber ? 'subscriber' : (hasPurchased ? 'purchased' : 'idle'));
    } catch (err) {
      console.error('Failed to trigger download:', err);
      setCardState(isUserSubscriber ? 'subscriber' : (hasPurchased ? 'purchased' : 'idle'));
    }
  }, [hasPurchased, isUserSubscriber]);

  // Handle download
  const handleDownload = useCallback(() => {
    triggerDownload(product.id);
  }, [product.id, triggerDownload]);

  // Handle discounted purchase for subscribers who hit daily limit
  const handleBuyDiscounted = useCallback(async () => {
    if (!userId) return;

    setCardState('loading');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId: product.id,
          purchaseType: 'single_discounted',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // If already purchased, just download it
        if (data.alreadyPurchased) {
          setHasPurchased(true);
          triggerDownload(product.id);
          return;
        }
        console.error('Discounted checkout error:', data.error);
        setCardState('daily_limit');
        return;
      }

      setCheckoutData(data);
      setCardState('checkout');
    } catch (error) {
      console.error('Discounted buy error:', error);
      setCardState('daily_limit');
    }
  }, [userId, product.id, triggerDownload]);

  // Listen for global subscription events so all cards update instantly
  useEffect(() => {
    const handleGlobalSub = () => {
      setIsUserSubscriber(true);
      setCardState('subscriber');
    };
    window.addEventListener('subscription_purchased', handleGlobalSub);
    return () => window.removeEventListener('subscription_purchased', handleGlobalSub);
  }, []);

  // Checkout callbacks
  const handleCheckoutSuccess = useCallback(() => {
    const isSub = checkoutData?.purchaseType === 'subscription';
    
    setCardState('purchased');
    setHasPurchased(true);
    
    if (isSub) {
      window.dispatchEvent(new Event('subscription_purchased'));
    }
    
    setCheckoutData(null);
    // Auto-start download after successful payment
    setTimeout(() => {
      triggerDownload(product.id);
    }, 500);
  }, [product.id, triggerDownload, checkoutData]);

  const handleCheckoutError = useCallback((error: string) => {
    console.error('Payment error:', error);
    setCardState(isUserSubscriber ? 'subscriber' : (hasPurchased ? 'purchased' : 'idle'));
    setCheckoutData(null);
  }, [hasPurchased, isUserSubscriber]);

  const handleCheckoutClose = useCallback(() => {
    setCardState(isUserSubscriber ? 'subscriber' : (hasPurchased ? 'purchased' : 'idle'));
    setCheckoutData(null);
  }, [hasPurchased, isUserSubscriber]);

  // Determine which buttons to show
  const showDownload = (cardState === 'purchased' || cardState === 'subscriber' || hasPurchased) && cardState !== 'daily_limit';
  const showDailyLimit = cardState === 'daily_limit';
  const showBuyButtons = !showDownload && !showDailyLimit && cardState !== 'loading';
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
            ) : showDailyLimit ? (
              <>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '6px', lineHeight: 1.3 }}>
                  Límite diario alcanzado
                </div>
                <button className="product-card-buy-btn" onClick={handleBuyDiscounted} style={{ background: 'linear-gradient(135deg, #d4af37, #b8962e)' }}>
                  ⬇ Descargar por $8.000
                </button>
              </>
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
