import { streamText, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';
import { SYSTEM_PROMPT } from '@/lib/ai/system-prompt';
import { tools } from '@/lib/ai/tools';
import { createServiceRoleClient } from '@/lib/supabase/server';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, sessionId, chatId, isAuthenticated } = await req.json();
  
  // Normalize messages for AI SDK v6 schema compatibility
  const modelMessages = await convertToModelMessages(messages);

  const supabase = createServiceRoleClient();

  // Ensure chat exists in DB
  let currentChatId = chatId;
  if (!currentChatId && sessionId) {
    // Extract first message text for title
    const firstMsg = modelMessages[0];
    const title = (firstMsg?.content?.[0] as any)?.text || 'Nueva conversación';
    
    const { data: newChat } = await supabase
      .from('chats')
      .insert({ session_id: sessionId, title: title.slice(0, 100) })
      .select('id')
      .single();
    currentChatId = newChat?.id;
  }

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

  // Select tools based on auth state
  const activeTools = isAuthenticated
    ? tools
    : { search_products: tools.search_products, require_login: tools.require_login };

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: SYSTEM_PROMPT,
    messages: modelMessages,
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
  return result.toUIMessageStreamResponse({
    headers: currentChatId ? { 'X-Chat-Id': currentChatId } : undefined,
  });
}


