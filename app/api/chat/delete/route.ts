import { NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';

export async function DELETE(req: Request) {
  try {
    const { chatId } = await req.json();
    if (!chatId) {
      return NextResponse.json({ error: 'Chat ID required' }, { status: 400 });
    }

    // Verify user owns this chat
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const serviceClient = createServiceRoleClient();

    // Verify ownership
    const { data: chat } = await serviceClient
      .from('chats')
      .select('user_id')
      .eq('id', chatId)
      .single();

    if (!chat || chat.user_id !== user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // Delete messages first, then chat
    await serviceClient.from('messages').delete().eq('chat_id', chatId);
    await serviceClient.from('chats').delete().eq('id', chatId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete chat error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
