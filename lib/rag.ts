import { createServiceRoleClient } from '@/lib/supabase/server';
import type { MatchedResource } from '@/lib/supabase/types';
import { embed } from 'ai';
import { google } from '@ai-sdk/google';

/**
 * Generate embedding vector for a text query using Gemini API
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) throw new Error('GOOGLE_GENERATIVE_AI_API_KEY not configured');

  const { embedding } = await embed({
    model: google.textEmbeddingModel('gemini-embedding-001'),
    value: text,
  });
  
  return embedding;
}

/**
 * Generate embedding for document ingestion (different task type)
 */
export async function generateDocumentEmbedding(text: string): Promise<number[]> {
  return generateEmbedding(text);
}

/**
 * Search AEC resources by semantic similarity using pgvector
 */
export async function searchResources(
  query: string,
  threshold: number = 0.50,
  limit: number = 5
): Promise<MatchedResource[]> {
  const embedding = await generateEmbedding(query);
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase.rpc('match_resources', {
    query_embedding: JSON.stringify(embedding),
    match_threshold: threshold,
    match_count: limit,
  });

  if (error) {
    console.error('RAG search error:', error);
    throw new Error(`Search failed: ${error.message}`);
  }

  return (data || []) as MatchedResource[];
}

/**
 * Get specific resources by IDs (for product cards)
 */
export async function getResourcesByIds(ids: string[]): Promise<MatchedResource[]> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('aec_resources')
    .select('id, nombre_ui, chunk_semantico, tipo_recurso, categoria, subcategoria, version_revit, es_parametrico, url_thumbnail, precio_usd, etiquetas_duras')
    .in('id', ids);

  if (error) {
    console.error('Get resources error:', error);
    throw new Error(`Failed to get resources: ${error.message}`);
  }

  return (data || []).map((r: any) => ({ ...r, similarity: 1.0 })) as MatchedResource[];
}
