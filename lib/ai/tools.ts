import { tool } from 'ai';
import { z } from 'zod';

export const searchProducts = tool({
  description: 'Busca recursos AEC en el catálogo por similitud semántica. Usa esta herramienta cuando el usuario describe lo que necesita para su proyecto.',
  inputSchema: z.object({
    query: z.string().describe('La consulta de búsqueda en lenguaje natural. Ej: "familias de gimnasio", "patrones de pisos de madera", "bloques de título para planos"'),
  }),
});

export const requireLogin = tool({
  description: 'Solicita al usuario que inicie sesión con Google para ver los detalles de los productos encontrados. Usa SIEMPRE antes de mostrar product cards.',
  inputSchema: z.object({
    message: z.string().describe('Mensaje personalizado explicando qué encontraste y por qué debe iniciar sesión. Ej: "He encontrado 3 packs perfectos para tu proyecto de spa..."'),
    productCount: z.number().describe('Número de productos encontrados'),
  }),
});

export const showProductCards = tool({
  description: 'Muestra las cards de producto al usuario logueado. Solo usar DESPUÉS de que el usuario se haya autenticado.',
  inputSchema: z.object({
    resourceIds: z.array(z.string()).describe('Array de IDs de recursos AEC a mostrar. Ej: ["DEP-INT-001", "DEP-INT-002"]'),
    contextMessage: z.string().describe('Mensaje de contexto explicando por qué estos productos son ideales para su proyecto'),
  }),
});

export const tools = {
  search_products: searchProducts,
  require_login: requireLogin,
  show_product_cards: showProductCards,
};
