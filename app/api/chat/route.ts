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
    onFinish: async ({ text, steps }) => {
      if (currentChatId) {
        let toolCallsData: any = null;

        // In AI SDK v4, tool results live in step.content as content parts
        if (steps) {
          for (const step of steps as any[]) {
            if (step.content && Array.isArray(step.content)) {
              // Log content types for debugging
              const contentTypes = step.content.map((p: any) => ({ type: p.type, toolName: p.toolName, hasResult: !!p.result }));
              console.log('[onFinish] step.content parts:', JSON.stringify(contentTypes));
              
              for (const part of step.content) {
                if (part.type === 'tool-result' && part.toolName === 'search_products') {
                  const results = part.result?.results;
                  if (results?.length > 0) {
                    toolCallsData = { search_results: results };
                    console.log('[onFinish] Found search results:', results.length, 'items');
                  }
                }
              }
            }
          }
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


