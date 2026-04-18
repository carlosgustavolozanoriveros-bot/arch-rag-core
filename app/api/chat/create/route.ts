import { createServiceRoleClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { sessionId, title, userId } = await req.json();
  
  const supabase = createServiceRoleClient();

  const insertData: any = {
    session_id: sessionId,
    title: title || 'Nueva conversación',
  };
  
  if (userId) {
    insertData.user_id = userId;
  }

  const { data: newChat, error } = await supabase
    .from('chats')
    .insert(insertData)
    .select('id')
    .single();

  if (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ chatId: newChat.id });
}
