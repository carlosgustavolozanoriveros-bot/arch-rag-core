/**
 * AEC Resource Ingestion Script
 * Reads datots.xlsx → Generates embeddings → Inserts into Supabase
 * 
 * Usage: npx tsx scripts/ingest-excel.ts
 */

import * as XLSX from 'xlsx';
import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
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
  // Remove URLs and technical IDs from the chunk for cleaner embeddings
  return chunk
    .replace(/https?:\/\/[^\s]+/g, '')
    .replace(/[A-Z]{3}-[A-Z]{3}-\d{3}/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseEtiquetas(raw: string): string[] {
  if (!raw) return [];
  try {
    // Try parsing as JSON array
    const parsed = JSON.parse(raw.replace(/'/g, '"'));
    if (Array.isArray(parsed)) return parsed;
    return [String(parsed)];
  } catch {
    // Fallback: split by comma
    return raw.split(',').map(s => s.trim()).filter(Boolean);
  }
}

async function main() {
  console.log('🏗️  AEC Resource Ingestion Script');
  console.log('='.repeat(50));

  // 1. Read Excel
  const excelPath = path.resolve(__dirname, '..', 'datots.xlsx');
  console.log(`\n📂 Reading: ${excelPath}`);
  
  // Copy Excel from parent directory if not in project root
  const altPath = path.resolve(__dirname, '..', '..', 'datots.xlsx');
  let workbook: XLSX.WorkBook;
  
  try {
    workbook = XLSX.readFile(excelPath);
  } catch {
    try {
      workbook = XLSX.readFile(altPath);
      console.log(`   (Found at alternate path: ${altPath})`);
    } catch {
      console.error('❌ Could not find datots.xlsx');
      process.exit(1);
    }
  }

  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet);

  console.log(`✅ Found ${rows.length} resources\n`);

  // 2. Process each row
  let success = 0;
  let errors = 0;

  for (const row of rows) {
    const id = row['id_producto'];
    const nombre_ui = row['nombre_ui'];
    const chunk = row['chunk_semantico'];

    if (!id || !chunk) {
      console.log(`⚠️  Skipping row with missing id/chunk`);
      errors++;
      continue;
    }

    console.log(`📦 Processing: ${id} — ${nombre_ui}`);

    try {
      // Clean text and generate embedding
      const cleanText = cleanTextForEmbedding(chunk);
      console.log(`   → Generating embedding (${cleanText.length} chars)...`);
      
      const embedding = await generateEmbedding(cleanText);
      console.log(`   → Embedding generated (${embedding.length} dimensions)`);

      // Parse etiquetas
      const etiquetas = parseEtiquetas(row['etiquetas_duras'] || '');

      // Upsert into Supabase
      const { error } = await supabase.from('aec_resources').upsert({
        id,
        nombre_ui,
        chunk_semantico: chunk,
        nombre_archivo: row['nombre_archivo'] || null,
        tipo_recurso: row['tipo_recurso'] || 'familia_revit',
        categoria: row['categoria'] || '',
        subcategoria: row['subcategoria'] || '',
        version_revit: row['version_revit'] || '2020',
        es_parametrico: row['es_parametrico'] === 'true' || row['es_parametrico'] === 'TRUE',
        url_thumbnail: row['url_thumbnail'] || null,
        url_accion: row['url_accion'] || null,
        etiquetas_duras: etiquetas,
        precio_usd: 8.00,
        embedding: JSON.stringify(embedding),
      }, { onConflict: 'id' });

      if (error) {
        console.error(`   ❌ DB Error: ${error.message}`);
        errors++;
      } else {
        console.log(`   ✅ Inserted/Updated`);
        success++;
      }

      // Rate limit: ~1 request per second for Gemini API
      await new Promise(r => setTimeout(r, 1000));

    } catch (err) {
      console.error(`   ❌ Error: ${err}`);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`🎉 Ingestion complete!`);
  console.log(`   ✅ Success: ${success}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`   📊 Total: ${rows.length}`);
}

main().catch(console.error);
