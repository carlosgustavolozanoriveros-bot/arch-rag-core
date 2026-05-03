/**
 * AEC Resource Ingestion Script (CSV version)
 * Reads inventario_maestro.csv → Generates embeddings → Inserts into Supabase
 * 
 * Usage: npx tsx scripts/ingest-csv.ts
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
  console.error('   Need: GOOGLE_GENERATIVE_AI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
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
    .replace(/[A-Z]{3}-[A-Z]{3}-\d{3}/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseCSV(content: string): Record<string, string>[] {
  const rows: Record<string, string>[] = [];
  const lines: string[] = [];
  
  // Parse CSV handling quoted fields with commas and newlines
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    
    if (char === '"') {
      if (inQuotes && content[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (current.trim()) {
        lines.push(current);
      }
      current = '';
      // Skip \r\n
      if (char === '\r' && content[i + 1] === '\n') i++;
    } else {
      current += char;
    }
  }
  if (current.trim()) lines.push(current);
  
  if (lines.length === 0) return rows;
  
  // Parse header
  const headers = parseCSVLine(lines[0]);
  
  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[j] || '';
    }
    rows.push(row);
  }
  
  return rows;
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  
  return values;
}

function parseEtiquetas(raw: string): string[] {
  if (!raw) return [];
  return raw.split(',').map(s => s.trim()).filter(Boolean);
}

async function main() {
  console.log('🏗️  AEC Resource Ingestion Script (CSV)');
  console.log('='.repeat(50));

  // 1. Read CSV
  const csvPath = path.resolve(__dirname, '..', '..', 'inventario_maestro.csv');
  console.log(`\n📂 Reading: ${csvPath}`);
  
  if (!fs.existsSync(csvPath)) {
    console.error('❌ Could not find inventario_maestro.csv');
    process.exit(1);
  }

  const content = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(content);
  
  console.log(`✅ Found ${rows.length} resources\n`);

  // 2. Process each row
  let success = 0;
  let errors = 0;
  let skipped = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const id = row['id'];
    const nombre_ui = row['nombre_ui'];
    const chunk = row['chunk_semantico'];

    if (!id || !chunk) {
      console.log(`⚠️  Skipping row ${i + 2} with missing id/chunk`);
      skipped++;
      continue;
    }

    console.log(`📦 [${i + 1}/${rows.length}] ${id} — ${nombre_ui}`);

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
        version: row['version'] || null,
        url_thumbnail: row['url_thumbnail'] || null,
        url_accion: row['url_accion'] || null,
        etiquetas_duras: etiquetas,
        descripcion_card: row['descripcion_card'] || null,
        drive_file_id: row['drive_file_id'] || null,
        tamano: row['tamano'] || null,
        contenido_incluido: row['contenido_incluido'] || null,
        embedding: JSON.stringify(embedding),
      }, { onConflict: 'id' });

      if (error) {
        console.error(`   ❌ DB Error: ${error.message}`);
        errors++;
      } else {
        console.log(`   ✅ Inserted`);
        success++;
      }

      // Rate limit: wait between API calls
      // Gemini allows ~1500 RPM for embeddings, so 100ms delay is safe
      await new Promise(r => setTimeout(r, 100));

    } catch (err) {
      console.error(`   ❌ Error: ${err}`);
      errors++;
      // Wait a bit longer on error (might be rate limit)
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
