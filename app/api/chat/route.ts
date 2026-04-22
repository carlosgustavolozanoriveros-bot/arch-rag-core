import { streamText, convertToModelMessages, stepCountIs, tool } from 'ai';
import { z } from 'zod';
import { google } from '@ai-sdk/google';
import { SYSTEM_PROMPT } from '@/lib/ai/system-prompt';
import { searchResources } from '@/lib/rag';
import { createServiceRoleClient } from '@/lib/supabase/server';

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages, sessionId, chatId, isAuthenticated } = await req.json();

  // Normalize messages for AI SDK v6 schema compatibility
  const modelMessages = await convertToModelMessages(messages);

  const supabase = createServiceRoleClient();

  // chatId should already be set by the frontend via /api/chat/create
  let currentChatId = chatId;

  // Save user message to DB
  const lastUserMessage = modelMessages[modelMessages.length - 1];
  if (currentChatId && lastUserMessage?.role === 'user') {
    const textContent = (lastUserMessage.content?.[0] as any)?.text || '';
    await supabase.from('messages').insert({
      chat_id: currentChatId,
      role: 'user',
      content: textContent,
    });
  }

  // Build context: load conversation history from DB for memory
  let dbMessages: { role: string; content: string }[] = [];
  if (currentChatId) {
    const { data } = await supabase
      .from('messages')
      .select('role, content')
      .eq('chat_id', currentChatId)
      .order('created_at', { ascending: true })
      .limit(50);
    if (data) dbMessages = data;
  }

  // Use DB messages for context if available, otherwise use direct messages
  const contextMessages = dbMessages.length > 0
    ? dbMessages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))
    : messages;

  // Capture search results via closure — the tool writes here, onFinish reads
  let capturedSearchResults: any[] | null = null;

  // Inline tool with result capture
  const searchProductsTool = tool({
    description: 'Busca recursos AEC en el catálogo por similitud semántica. Usa esta herramienta cuando el usuario describe lo que necesita para su proyecto. NOTA CRÍTICA: El sistema mostrará las visualizaciones de las tarjetas automáticamente. NO incluyas listas manuales, viñetas, descripciones ni precios de los productos en tu respuesta de texto. Solo da un breve mensaje entusiasta de que encontraste opciones.',
    inputSchema: z.object({
      query: z.string().describe('La consulta de búsqueda en lenguaje natural'),
    }),
    execute: async ({ query }: { query: string }) => {
      try {
        const results = await searchResources(query, 0.30, 5);
        if (results.length === 0) {
          return { found: false, message: 'No se encontraron recursos para esa búsqueda.', results: [] };
        }
        // Capture results for DB persistence
        capturedSearchResults = results;
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

  const activeTools = { search_products: searchProductsTool };

  const dynamicSystemPrompt = `${SYSTEM_PROMPT}`;

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: dynamicSystemPrompt,
    messages: modelMessages,
    tools: activeTools,
    toolChoice: 'auto',
    stopWhen: stepCountIs(5),
    onFinish: async ({ text }) => {
      if (currentChatId && (text || capturedSearchResults)) {
        await supabase.from('messages').insert({
          chat_id: currentChatId,
          role: 'assistant',
          content: text || '',
          tool_calls: capturedSearchResults
            ? { search_results: capturedSearchResults }
            : null,
        });
      }
    },
  });

  // Return stream response with chatId in headers
  return result.toUIMessageStreamResponse({
    headers: currentChatId ? { 'X-Chat-Id': currentChatId } : undefined,
  });
}
