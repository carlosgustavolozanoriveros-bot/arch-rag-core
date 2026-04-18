import { tool } from 'ai';
import { z } from 'zod';
import { searchResources, getResourcesByIds } from '@/lib/rag';

export const searchProducts = tool({
  description: 'Busca recursos AEC en el catálogo por similitud semántica. Usa esta herramienta cuando el usuario describe lo que necesita para su proyecto. NOTA CRÍTICA: El sistema mostrará las visualizaciones de las tarjetas automáticamente. NO incluyas listas manuales, viñetas, descripciones ni precios de los productos en tu respuesta de texto. Solo da un breve mensaje entusiasta de que encontraste opciones.',
  inputSchema: z.object({
    query: z.string().describe('La consulta de búsqueda en lenguaje natural. Ej: "familias de gimnasio", "patrones de pisos de madera"'),
  }),
  execute: async ({ query }: { query: string }) => {
    try {
      const results = await searchResources(query, 0.30, 5);
      if (results.length === 0) {
        return { found: false, message: 'No se encontraron recursos para esa búsqueda.', results: [] };
      }
      return {
        found: true,
        message: `Se encontraron ${results.length} recursos relevantes.`,
        results: results,
      };
    } catch (error) {
      console.error('Search products error:', error);
      return { found: false, message: 'Error al buscar productos.', results: [] };
    }
  },
} as any);

export const tools = {
  search_products: searchProducts,
};
