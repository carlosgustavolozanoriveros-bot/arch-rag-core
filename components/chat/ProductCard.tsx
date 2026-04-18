'use client';

import { useState } from 'react';

interface ProductData {
  id: string;
  nombre_ui: string;
  nombre_archivo?: string | null;
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
 * Input:  https://drive.usercontent.google.com/download?id=XXXXX&export=view&authuser=0
 * Output: https://drive.google.com/thumbnail?id=XXXXX&sz=w400
 */
function toEmbeddableUrl(url: string): string {
  // Extract Google Drive file ID from various URL formats
  const patterns = [
    /[?&]id=([a-zA-Z0-9_-]+)/,           // ?id=XXXXX or &id=XXXXX
    /\/d\/([a-zA-Z0-9_-]+)/,              // /d/XXXXX/
    /\/file\/d\/([a-zA-Z0-9_-]+)/,        // /file/d/XXXXX/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w400`;
    }
  }

  // Not a Google Drive URL, return as-is
  return url;
}

export function ProductCard({ product, userRole, purchased = false, onRequireLogin }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);

  const formatCategory = (cat: string) => {
    return cat.replace(/_/g, ' ');
  };

  // Clean display name
  const displayName = (() => {
    if (product.nombre_archivo) {
      return product.nombre_archivo.replace(/^[A-Z]+-[A-Z]+-\d+_/, '').replace(/_/g, ' ');
    }
    return product.nombre_ui;
  })();

  const price = product.precio_usd ? Number(product.precio_usd) : 8;
  const thumbnailUrl = product.url_thumbnail ? toEmbeddableUrl(product.url_thumbnail) : null;

  const handleBuy = () => {
    if (!userRole) {
      onRequireLogin?.();
      return;
    }
    console.log('Buy product:', product.id);
  };

  return (
    <div className="product-card">
      <div className="product-card-thumb">
        {thumbnailUrl && !imgError ? (
          <img
            src={thumbnailUrl}
            alt={displayName}
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
      </div>

      <div className="product-card-body">
        {product.categoria && (
          <div className="product-card-category">
            {formatCategory(product.categoria)}
          </div>
        )}

        <h4 className="product-card-title">{displayName}</h4>

        <div className="product-card-footer">
          <span className="product-card-price">${price}</span>
          <button
            className="product-card-buy-btn"
            onClick={handleBuy}
          >
            {purchased ? '✓ Comprado' : 'Comprar'}
          </button>
        </div>
      </div>
    </div>
  );
}
