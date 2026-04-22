import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get('chatId');

    if (!chatId) {
      return NextResponse.json({ error: 'Chat ID is required' }, { status: 400 });
    }

    const supabase = createServiceRoleClient();
    
    // Fetch messages for the given chat ID (include tool_calls)
    const { data: messages, error } = await supabase
      .from('messages')
      .select('id, role, content, tool_calls, created_at')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) {
      console.error('Error fetching chat history:', error);
      return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }

    // Format for AI SDK's UIMessage (must include 'parts' for useChat compatibility)
    const formattedMessages = messages.map((msg: any) => {
      const parts: any[] = [{ type: 'text', text: msg.content }];

      // Reconstruct tool parts for assistant messages with search results
      if (msg.role === 'assistant' && msg.tool_calls?.search_results) {
        parts.push({
          type: 'tool-search_products',
          state: 'output-available',
          output: { results: msg.tool_calls.search_results },
        });
      }

      return {
        id: msg.id,
        role: msg.role as 'user' | 'assistant' | 'system' | 'data',
        content: msg.content,
        parts,
        createdAt: new Date(msg.created_at)
      };
    });

    return NextResponse.json({ messages: formattedMessages });
  } catch (error) {
    console.error('Unexpected error in chat history API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
