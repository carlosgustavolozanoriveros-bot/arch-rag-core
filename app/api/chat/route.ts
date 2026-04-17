import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { SYSTEM_PROMPT } from '@/lib/ai/system-prompt';
import { tools } from '@/lib/ai/tools';
import { createServiceRoleClient } from '@/lib/supabase/server';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, sessionId, chatId, isAuthenticated } = await req.json();

  const supabase = createServiceRoleClient();

  // Ensure chat exists in DB
  let currentChatId = chatId;
  if (!currentChatId && sessionId) {
    const { data: newChat } = await supabase
      .from('chats')
      .insert({ session_id: sessionId, title: messages[0]?.content?.slice(0, 100) || 'Nueva conversación' })
      .select('id')
      .single();
    currentChatId = newChat?.id;
  }

  // Save user message to DB
  const lastUserMessage = messages[messages.length - 1];
  if (currentChatId && lastUserMessage?.role === 'user') {
    await supabase.from('messages').insert({
      chat_id: currentChatId,
      role: 'user',
      content: lastUserMessage.content,
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

  // Select tools based on auth state
  const activeTools = isAuthenticated
    ? tools
    : { search_products: tools.search_products, require_login: tools.require_login };

  const result = streamText({
    model: google('gemini-1.5-flash'),
    system: SYSTEM_PROMPT,
    messages: contextMessages,
    tools: activeTools,
    toolChoice: 'auto',
    onFinish: async ({ text }) => {
      // Save assistant response to DB
      if (currentChatId && text) {
        await supabase.from('messages').insert({
          chat_id: currentChatId,
          role: 'assistant',
          content: text,
        });
      }
    },
  });

  // Return stream response with chatId in headers
  return result.toTextStreamResponse({
    headers: currentChatId ? { 'X-Chat-Id': currentChatId } : undefined,
  });
}


