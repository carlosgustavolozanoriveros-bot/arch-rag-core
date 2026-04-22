import { streamText, convertToModelMessages, stepCountIs } from 'ai';
import { google } from '@ai-sdk/google';
import { SYSTEM_PROMPT } from '@/lib/ai/system-prompt';
import { tools } from '@/lib/ai/tools';
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

  const activeTools = { search_products: tools.search_products };

  const dynamicSystemPrompt = `${SYSTEM_PROMPT}`;

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: dynamicSystemPrompt,
    messages: modelMessages,
    tools: activeTools,
    toolChoice: 'auto',
    stopWhen: stepCountIs(5),
    onFinish: async ({ text, steps, toolCalls, toolResults }) => {
      // Save assistant response to DB
      if (currentChatId) {
        // Extract search results from any available source
        let toolCallsData: any = null;

        // Method 1: Check top-level toolResults
        if (toolResults && Array.isArray(toolResults)) {
          for (const tr of toolResults as any[]) {
            if (tr.toolName === 'search_products' || tr.type === 'search_products') {
              const results = tr.result?.results || tr.results;
              if (results?.length > 0) {
                toolCallsData = { search_results: results };
              }
            }
          }
        }

        // Method 2: Check top-level toolCalls
        if (!toolCallsData && toolCalls && Array.isArray(toolCalls)) {
          for (const tc of toolCalls as any[]) {
            if (tc.toolName === 'search_products') {
              const results = tc.result?.results || tc.args?.results;
              if (results?.length > 0) {
                toolCallsData = { search_results: results };
              }
            }
          }
        }

        // Method 3: Check steps
        if (!toolCallsData && steps) {
          for (const step of steps as any[]) {
            // Check step.toolResults
            if (step.toolResults) {
              for (const tr of Array.isArray(step.toolResults) ? step.toolResults : [step.toolResults]) {
                const r = tr as any;
                if (r.toolName === 'search_products') {
                  const results = r.result?.results || r.results;
                  if (results?.length > 0) {
                    toolCallsData = { search_results: results };
                  }
                }
              }
            }
            // Check step.toolCalls
            if (!toolCallsData && step.toolCalls) {
              for (const tc of Array.isArray(step.toolCalls) ? step.toolCalls : [step.toolCalls]) {
                const t = tc as any;
                if (t.toolName === 'search_products' && t.result?.results?.length > 0) {
                  toolCallsData = { search_results: t.result.results };
                }
              }
            }
          }
        }

        // Log for debugging if we still didn't find results
        if (!toolCallsData) {
          console.log('[onFinish] No search results found. steps keys:', 
            steps ? steps.map((s: any) => Object.keys(s)) : 'no steps',
            'toolCalls:', toolCalls ? JSON.stringify(toolCalls).slice(0, 200) : 'none',
            'toolResults:', toolResults ? JSON.stringify(toolResults).slice(0, 200) : 'none'
          );
        }

        if (text || toolCallsData) {
          await supabase.from('messages').insert({
            chat_id: currentChatId,
            role: 'assistant',
            content: text || '',
            tool_calls: toolCallsData,
          });
        }
      }
    },
  });

  // Return stream response with chatId in headers
  return result.toUIMessageStreamResponse({
    headers: currentChatId ? { 'X-Chat-Id': currentChatId } : undefined,
  });
}


