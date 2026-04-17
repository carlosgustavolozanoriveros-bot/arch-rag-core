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
  let activeTools: any = {};
  if (isAuthenticated) {
    // If authenticated, ONLY allow search and show product cards
    activeTools = { search_products: tools.search_products, show_product_cards: tools.show_product_cards };
  } else {
    // If not, allow search and require login
    activeTools = { search_products: tools.search_products, require_login: tools.require_login };
  }

  // Inject authentication state into the system prompt
  const dynamicSystemPrompt = `${SYSTEM_PROMPT}\n\n[USER AUTHENTICATION STATUS]\nThe user is currently ${isAuthenticated ? 'AUTHENTICATED AND LOGGED IN' : 'NOT AUTHENTICATED'}.\n${isAuthenticated ? 'You MUST completely ignore any previous instructions to ask the user to log in. Since they are logged in, NEVER call require_login. Instead, use `show_product_cards` directly to present the products.' : 'If you find products, you MUST call `require_login` as stated in your main instructions.'}`;

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: dynamicSystemPrompt,
    messages: modelMessages,
    tools: activeTools,
    toolChoice: 'auto',
    stopWhen: stepCountIs(5),
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


