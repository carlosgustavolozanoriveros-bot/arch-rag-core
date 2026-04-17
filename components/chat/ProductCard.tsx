'use client';

import { useState } from 'react';
import type { MatchedResource } from '@/lib/supabase/types';

interface ProductCardProps {
  product: MatchedResource;
  userRole?: 'free' | 'subscriber' | 'admin';
  purchased?: boolean;
}

export function ProductCard({ product, userRole, purchased = false }: ProductCardProps) {
  const [status, setStatus] = useState<'idle' | 'buying' | 'purchased'>(
    purchased ? 'purchased' : 'idle'
  );

  const formatCategory = (cat: string) => {
    return cat.replace(/_/g, ' ').replace(/y /g, 'y ');
  };

  const truncateDesc = (text: string, maxLen: number = 180) => {
    if (text.length <= maxLen) return text;
    return text.slice(0, maxLen).trim() + '...';
  };

  const handleBuy = () => {
    setStatus('buying');
    // TODO: Integrate Wompi modal
    console.log('Buy product:', product.id);
  };

  return (
    <div className="product-card">
      <div className="product-card-thumb">
        {product.url_thumbnail ? (
          <img
            src={product.url_thumbnail}
            alt={product.nombre_ui}
            loading="lazy"
          />
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            fontSize: '40px',
            background: 'var(--bg-tertiary)',
          }}>
            📦
          </div>
        )}
      </div>

      <div className="product-card-body">
        <div className="product-card-category">
          {formatCategory(product.subcategoria)}
        </div>

        <h4 className="product-card-title">{product.nombre_ui}</h4>

        <p className="product-card-desc">
          {truncateDesc(product.chunk_semantico)}
        </p>

        <div className="product-card-tags">
          <span className="product-card-tag revit">
            Revit {product.version_revit}+
          </span>
          {product.es_parametrico && (
            <span className="product-card-tag parametric">
              Paramétrico
            </span>
          )}
          <span className="product-card-tag">
            {product.tipo_recurso === 'familia_revit' ? 'Familias .rfa' : 'Proyecto .rvt'}
          </span>
        </div>

        <div className="product-card-footer">
          <div className="product-card-price">
            ${product.precio_usd} <span>USD</span>
          </div>

          <div className="product-card-actions">
            {status === 'purchased' || userRole === 'subscriber' ? (
              <button className="btn btn-sm btn-download">
                ↓ Descargar
              </button>
            ) : (
              <>
                <button
                  className="btn btn-sm btn-gold"
                  onClick={handleBuy}
                  disabled={status === 'buying'}
                >
                  {status === 'buying' ? '...' : 'Comprar'}
                </button>
                <button className="btn btn-sm btn-outline">
                  PRO $20/mes
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
