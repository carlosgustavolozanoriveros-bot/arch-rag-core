'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  version?: string | null;
  url_thumbnail?: string | null;
  etiquetas_duras?: string[];
  tamano?: string | null;
  contenido_incluido?: string | null;
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

type CardState = 'idle' | 'loading' | 'downloading' | 'checkout' | 'purchased' | 'subscriber' | 'daily_limit';

export function ProductCard({ product, userRole, purchased = false, onRequireLogin }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [cardState, setCardState] = useState<CardState>('idle');
  const [hasPurchased, setHasPurchased] = useState(purchased);
  const [isUserSubscriber, setIsUserSubscriber] = useState(false);
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const isUserSubscriberRef = useRef(false);
  const hasPurchasedRef = useRef(purchased);

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

      // PRIORITY: Check pending payment FIRST (after Wompi redirect + page reload)
      // Must run before subscriber check so the auto-download card shows "Descargando..."
      const pendingPayment = localStorage.getItem('aec_pending_payment');
      if (pendingPayment) {
        try {
          const payment = JSON.parse(pendingPayment);
          if (payment.productId === product.id && Date.now() - payment.timestamp < 300000) {
            setCardState('loading'); // Show "Procesando pago..."
            const purchaseType = payment.purchaseType || 'single';
            
            // Poll until webhook confirms the payment
            const pollPurchase = async (retries: number) => {
              let confirmed = false;
              
              if (purchaseType === 'subscription') {
                // For subscriptions, check if user role became 'subscriber'
                const { data: freshProfile } = await supabase
                  .from('user_profiles')
                  .select('role, subscription_expires_at')
                  .eq('id', session.user.id)
                  .single();
                confirmed = freshProfile && (
                  freshProfile.role === 'admin' ||
                  (freshProfile.role === 'subscriber' && freshProfile.subscription_expires_at && new Date(freshProfile.subscription_expires_at) > new Date())
                );
                if (confirmed) {
                  setIsUserSubscriber(true);
                  isUserSubscriberRef.current = true;
                }
              } else {
                // For single purchases, check purchases table
                const { data: purchase } = await supabase
                  .from('purchases')
                  .select('id, status')
                  .eq('user_id', session.user.id)
                  .eq('resource_id', product.id)
                  .eq('purchase_type', 'single')
                  .eq('status', 'approved')
                  .maybeSingle();
                confirmed = !!purchase;
                if (confirmed) {
                  setHasPurchased(true);
                  hasPurchasedRef.current = true;
                }
              }
              
              if (confirmed) {
                localStorage.removeItem('aec_pending_payment');
                // Skip download if already downloaded (prevents double download)
                const doneKey = `aec_download_done_${product.id}`;
                if (localStorage.getItem(doneKey)) {
                  setHasPurchased(true);
                  hasPurchasedRef.current = true;
                  setCardState('purchased');
                  return;
                }
                // Clear guard key so triggerDownload is not blocked
                localStorage.removeItem(`aec_downloading_${product.id}`);
                triggerDownload(product.id);
                return;
              }
              
              if (retries > 0) {
                setTimeout(() => pollPurchase(retries - 1), 2000);
              } else {
                // Timeout
                localStorage.removeItem('aec_pending_payment');
                if (isSubscriber) {
                  setIsUserSubscriber(true);
                  isUserSubscriberRef.current = true;
                  setCardState('subscriber');
                } else {
                  setCardState('idle');
                }
              }
            };
            
            // Start polling, up to 15 retries (30 seconds total)
            pollPurchase(15);
            return;
          } else {
            localStorage.removeItem('aec_pending_payment');
          }
        } catch (e) {
          localStorage.removeItem('aec_pending_payment');
        }
      }

      // Subscriber check (only runs if no pending payment)
      if (isSubscriber) {
        setIsUserSubscriber(true);
        isUserSubscriberRef.current = true;
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
        hasPurchasedRef.current = true;
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
                  // Save BEFORE Wompi opens — survives page redirect
                  localStorage.setItem('aec_pending_payment', JSON.stringify({
                    productId: product.id,
                    purchaseType: intent.purchaseType || 'single',
                    timestamp: Date.now(),
                  }));
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
      // Save BEFORE Wompi opens — survives page redirect
      localStorage.setItem('aec_pending_payment', JSON.stringify({
        productId: product.id,
        purchaseType: 'single',
        timestamp: Date.now(),
      }));
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
      // Save BEFORE Wompi opens — survives page redirect
      localStorage.setItem('aec_pending_payment', JSON.stringify({
        productId: product.id,
        purchaseType: 'subscription',
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Subscribe error:', error);
      setCardState('idle');
    }
  }, [userId, onRequireLogin]);

  // Trigger download via direct URL
  const triggerDownload = useCallback(async (resourceId: string) => {
    // Prevent duplicate downloads (survives component remount)
    const guardKey = `aec_downloading_${resourceId}`;
    if (localStorage.getItem(guardKey)) return;
    localStorage.setItem(guardKey, '1');
    setCardState('downloading');
    try {
      const res = await fetch(`/api/download/${resourceId}`);
      const data = await res.json();
      
      if (!res.ok) {
        console.error('Download error:', data.error);
        
        // Handle daily limit reached
        if (res.status === 429 && data.dailyLimitReached) {
          localStorage.removeItem(guardKey);
          setCardState('daily_limit');
          return;
        }
        
        alert(data.error || 'Error al descargar el archivo');
        localStorage.removeItem(guardKey);
        setCardState(isUserSubscriberRef.current ? 'subscriber' : (hasPurchasedRef.current ? 'purchased' : 'idle'));
        return;
      }

      // Access confirmed — remove pending payment NOW (before file download)
      // so if Wompi redirects mid-download, polling won't trigger a second download.
      localStorage.removeItem('aec_pending_payment');
      
      if (data.downloadUrl && data.token) {
        // Fetch file directly from Google API into a browser Blob
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
      // Clean up and show "Descargar" button so user can re-download
      localStorage.removeItem(guardKey);
      // Mark download as completed (prevents double download on redirect)
      localStorage.setItem(`aec_download_done_${resourceId}`, Date.now().toString());
      // Mark as purchased so button stays as "Descargar"
      setHasPurchased(true);
      hasPurchasedRef.current = true;
      setCardState('purchased');
    } catch (err) {
      console.error('Failed to trigger download:', err);
      localStorage.removeItem(guardKey);
      setCardState(isUserSubscriberRef.current ? 'subscriber' : (hasPurchasedRef.current ? 'purchased' : 'idle'));
    }
  }, [product.id]);

  // Handle download (manual click — always allow)
  const handleDownload = useCallback(() => {
    // Clear the 'download done' flag so manual re-downloads work
    localStorage.removeItem(`aec_download_done_${product.id}`);
    localStorage.removeItem(`aec_downloading_${product.id}`);
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
      // Save BEFORE Wompi opens — survives page redirect
      localStorage.setItem('aec_pending_payment', JSON.stringify({
        productId: product.id,
        purchaseType: 'single_discounted',
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Discounted buy error:', error);
      setCardState('daily_limit');
    }
  }, [userId, product.id, triggerDownload]);

  // Listen for global subscription events so all cards update instantly
  useEffect(() => {
    const handleGlobalSub = () => {
      setIsUserSubscriber(true);
      isUserSubscriberRef.current = true;
      setCardState('subscriber');
    };
    window.addEventListener('subscription_purchased', handleGlobalSub);
    return () => window.removeEventListener('subscription_purchased', handleGlobalSub);
  }, []);

  // Checkout callbacks
  // Strategy: Start download immediately AND keep aec_pending_payment as fallback.
  // - If download completes before Wompi redirects → triggerDownload removes
  //   aec_pending_payment → no double download on reload.
  // - If Wompi redirects before download completes → aec_pending_payment survives
  //   → polling system handles it on reload.
  const handleCheckoutSuccess = useCallback(() => {
    const isSub = checkoutData?.purchaseType === 'subscription';

    setHasPurchased(true);
    hasPurchasedRef.current = true;

    // Refresh timestamp so pending payment survives redirect if download doesn't finish
    const pendingPayment = localStorage.getItem('aec_pending_payment');
    if (pendingPayment) {
      try {
        const parsed = JSON.parse(pendingPayment);
        parsed.timestamp = Date.now();
        localStorage.setItem('aec_pending_payment', JSON.stringify(parsed));
      } catch (e) { /* ignore */ }
    }

    if (isSub) {
      setIsUserSubscriber(true);
      isUserSubscriberRef.current = true;
    }

    setCheckoutData(null);

    if (isSub) {
      // For subscriptions: DON'T download here. Wompi always redirects,
      // and the polling system will handle the download on reload.
      // Just show loading state until the redirect happens.
      setCardState('loading');
      setTimeout(() => {
        window.dispatchEvent(new Event('subscription_purchased'));
      }, 100);
    } else {
      // For single purchases: try to download immediately
      const doneKey = `aec_download_done_${product.id}`;
      if (localStorage.getItem(doneKey)) {
        setCardState('purchased');
      } else {
        // Set done flag BEFORE download — if Wompi redirects mid-download,
        // the polling system will see this flag and skip the duplicate download.
        localStorage.setItem(doneKey, Date.now().toString());
        localStorage.removeItem(`aec_downloading_${product.id}`);
        setCardState('downloading');
        setTimeout(() => {
          triggerDownload(product.id);
        }, 500);
      }
    }
  }, [product.id, triggerDownload, checkoutData]);

  const handleCheckoutError = useCallback((error: string) => {
    console.error('Payment error:', error);
    localStorage.removeItem('aec_pending_payment');
    setCardState(isUserSubscriberRef.current ? 'subscriber' : (hasPurchasedRef.current ? 'purchased' : 'idle'));
    setCheckoutData(null);
  }, []);

  const handleCheckoutClose = useCallback(() => {
    // DON'T remove aec_pending_payment — user might have paid but Wompi
    // returned PENDING status. The polling system will handle it on reload.
    setCardState(isUserSubscriberRef.current ? 'subscriber' : (hasPurchasedRef.current ? 'purchased' : 'idle'));
    setCheckoutData(null);
  }, []);

  // Determine which buttons to show
  const isDownloading = cardState === 'downloading';
  const isLoading = cardState === 'loading';
  const showDownload = !isDownloading && !isLoading && (cardState === 'purchased' || cardState === 'subscriber' || hasPurchased) && cardState !== 'daily_limit';
  const showDailyLimit = cardState === 'daily_limit';
  const showBuyButtons = !showDownload && !showDailyLimit && !isLoading && !isDownloading;

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
          {/* Size badge */}
          {product.tamano && (
            <div className="product-card-badge-size">{product.tamano}</div>
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

          {product.contenido_incluido && (
            <div className="product-card-contents">
              📦 {product.contenido_incluido}
            </div>
          )}

          <div className="product-card-footer">
            {isDownloading ? (
              <button className="product-card-download-btn" disabled style={{ opacity: 0.8, cursor: 'wait' }}>
                <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', marginRight: '6px' }}>⏳</span>
                Descargando...
              </button>
            ) : isLoading ? (
              <button className="product-card-download-btn" disabled style={{ opacity: 0.8, cursor: 'wait' }}>
                <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', marginRight: '6px' }}>⏳</span>
                Procesando pago...
              </button>
            ) : showDownload ? (
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
