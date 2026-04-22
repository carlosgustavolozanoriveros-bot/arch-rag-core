import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { chatId, role, content, toolCalls } = await req.json();

    if (!chatId || !role || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createServiceRoleClient();

    const { error } = await supabase.from('messages').insert({
      chat_id: chatId,
      role,
      content,
      tool_calls: toolCalls || null,
    });

    if (error) {
      console.error('Error saving message:', error);
      return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save message error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
