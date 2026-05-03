/**
 * AEC Resource Ingestion Script (JSON version)
 * Reads inventario_maestro.json → Generates embeddings → Inserts into Supabase
 * 
 * Usage: npx tsx scripts/ingest-json.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

import * as fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { embed } from 'ai';
import { google } from '@ai-sdk/google';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function generateEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: google.textEmbeddingModel('gemini-embedding-001'),
    value: text,
  });
  return embedding;
}

function cleanTextForEmbedding(chunk: string): string {
  return chunk
    .replace(/https?:\/\/[^\s]+/g, '')
    .replace(/[A-Z]{3}-[A-Z0-9]{3,4}-\d{3}/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseEtiquetas(raw: string): string[] {
  if (!raw) return [];
  return raw.split(',').map(s => s.trim()).filter(Boolean);
}

interface ResourceJSON {
  id: string;
  nombre_ui: string;
  chunk_semantico: string;
  nombre_archivo?: string;
  tipo_recurso?: string;
  categoria?: string;
  subcategoria?: string;
  version?: string;
  etiquetas_duras?: string;
  descripcion_card?: string;
  tamano?: string;
  drive_file_id?: string;
  url_thumbnail?: string;
  url_accion?: string;
  contenido_incluido?: string;
}

async function main() {
  console.log('🏗️  AEC Resource Ingestion Script (JSON)');
  console.log('='.repeat(50));

  // 1. Read JSON
  const jsonPath = 'D:/organizar recursos/organizado/inventario_maestro.json';
  console.log(`\n📂 Reading: ${jsonPath}`);
  
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ Could not find inventario_maestro.json');
    process.exit(1);
  }

  const content = fs.readFileSync(jsonPath, 'utf-8');
  const rows: ResourceJSON[] = JSON.parse(content);
  
  console.log(`✅ Found ${rows.length} resources\n`);

  // 2. First, delete all existing resources
  console.log('🗑️  Clearing existing data...');
  const { error: delError } = await supabase.from('aec_resources').delete().neq('id', '___none___');
  if (delError) {
    console.error(`❌ Delete error: ${delError.message}`);
  } else {
    console.log('✅ Table cleared\n');
  }

  // 3. Process each row
  let success = 0;
  let errors = 0;
  let skipped = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const { id, nombre_ui, chunk_semantico } = row;

    if (!id || !chunk_semantico) {
      console.log(`⚠️  Skipping row ${i + 1} with missing id/chunk`);
      skipped++;
      continue;
    }

    console.log(`📦 [${i + 1}/${rows.length}] ${id} — ${nombre_ui}`);

    try {
      // Clean text and generate embedding
      const cleanText = cleanTextForEmbedding(chunk_semantico);
      console.log(`   → Generating embedding (${cleanText.length} chars)...`);
      
      const embedding = await generateEmbedding(cleanText);
      console.log(`   → Embedding generated (${embedding.length} dimensions)`);

      // Parse etiquetas from comma-separated string to array
      const etiquetas = parseEtiquetas(row.etiquetas_duras || '');

      // Upsert into Supabase
      const { error } = await supabase.from('aec_resources').upsert({
        id,
        nombre_ui,
        chunk_semantico,
        nombre_archivo: row.nombre_archivo || null,
        tipo_recurso: row.tipo_recurso || 'familia_revit',
        categoria: row.categoria || '',
        subcategoria: row.subcategoria || '',
        version: row.version || null,
        url_thumbnail: row.url_thumbnail || null,
        url_accion: row.url_accion || null,
        etiquetas_duras: etiquetas,
        descripcion_card: row.descripcion_card || null,
        drive_file_id: row.drive_file_id || null,
        tamano: row.tamano || null,
        contenido_incluido: row.contenido_incluido || null,
        embedding: JSON.stringify(embedding),
      }, { onConflict: 'id' });

      if (error) {
        console.error(`   ❌ DB Error: ${error.message}`);
        errors++;
      } else {
        console.log(`   ✅ Inserted`);
        success++;
      }

      // Rate limit: 100ms between calls
      await new Promise(r => setTimeout(r, 100));

    } catch (err) {
      console.error(`   ❌ Error: ${err}`);
      errors++;
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`🎉 Ingestion complete!`);
  console.log(`   ✅ Success: ${success}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`   ⚠️  Skipped: ${skipped}`);
  console.log(`   📊 Total: ${rows.length}`);
}

main().catch(console.error);
