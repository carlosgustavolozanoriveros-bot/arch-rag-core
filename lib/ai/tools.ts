import { tool } from 'ai';
import { z } from 'zod';
import { searchResources, getResourcesByIds } from '@/lib/rag';

export const searchProducts = tool({
  description: 'Busca recursos AEC en el catálogo por similitud semántica. Usa esta herramienta cuando el usuario describe lo que necesita para su proyecto.',
  parameters: z.object({
    query: z.string().describe('La consulta de búsqueda en lenguaje natural. Ej: "familias de gimnasio", "patrones de pisos de madera", "bloques de título para planos"'),
  }),
  execute: async ({ query }) => {
    try {
      const results = await searchResources(query, 0.30, 5);
      if (results.length === 0) {
        return { found: false, message: 'No se encontraron recursos para esa búsqueda.', results: [] };
      }
      return {
        found: true,
        message: `Se encontraron ${results.length} recursos relevantes.`,
        results: results.map(r => ({
          id: r.id,
          nombre: r.nombre_ui,
          descripcion: r.chunk_semantico?.slice(0, 200),
          tipo: r.tipo_recurso,
          categoria: r.categoria,
          precio: r.precio_usd,
          similarity: r.similarity,
        })),
      };
    } catch (error) {
      console.error('Search products error:', error);
      return { found: false, message: 'Error al buscar productos.', results: [] };
    }
  },
});

export const requireLogin = tool({
  description: 'Solicita al usuario que inicie sesión con Google para ver los detalles de los productos encontrados. Usa SIEMPRE antes de mostrar product cards.',
  parameters: z.object({
    message: z.string().describe('Mensaje personalizado explicando qué encontraste y por qué debe iniciar sesión.'),
    productCount: z.number().describe('Número de productos encontrados'),
  }),
  // No execute — this is a client-side only tool (UI renders the login wall)
});

export const showProductCards = tool({
  description: 'Muestra las cards de producto al usuario logueado. Solo usar DESPUÉS de que el usuario se haya autenticado.',
  parameters: z.object({
    resourceIds: z.array(z.string()).describe('Array de IDs de recursos AEC a mostrar. Ej: ["DEP-INT-001", "DEP-INT-002"]'),
    contextMessage: z.string().describe('Mensaje de contexto explicando por qué estos productos son ideales para su proyecto'),
  }),
  // No execute — this is a client-side only tool (UI renders the cards)
});

export const tools = {
  search_products: searchProducts,
  require_login: requireLogin,
  show_product_cards: showProductCards,
};
