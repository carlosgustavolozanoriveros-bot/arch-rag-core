'use client';

import { useState } from 'react';

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

export function ProductCard({ product, userRole, purchased = false, onRequireLogin }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);

  const price = product.precio_usd ? Number(product.precio_usd) : 8;
  const thumbnailUrl = product.url_thumbnail ? toEmbeddableUrl(product.url_thumbnail) : null;

  // Description: use descripcion_card if available, otherwise truncate chunk_semantico
  const description = product.descripcion_card 
    || (product.chunk_semantico ? product.chunk_semantico.slice(0, 100) + '...' : '');

  const handleBuy = () => {
    if (!userRole) {
      onRequireLogin?.();
      return;
    }
    console.log('Buy product:', product.id);
  };

  const handleSubscribe = () => {
    if (!userRole) {
      onRequireLogin?.();
      return;
    }
    console.log('Subscribe from product:', product.id);
  };

  return (
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
          <button className="product-card-buy-btn" onClick={handleBuy}>
            Comprar ${price}
          </button>
          <button className="product-card-sub-btn" onClick={handleSubscribe}>
            PRO $20/mes
          </button>
        </div>
      </div>
    </div>
  );
}
