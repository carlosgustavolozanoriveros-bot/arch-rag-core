import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { session_id, user_id } = await req.json();

    if (!session_id || !user_id) {
      return NextResponse.json({ error: 'Missing session_id or user_id' }, { status: 400 });
    }

    const supabase = createServiceRoleClient();

    // Sync anonymous chats to user
    const { error } = await supabase.rpc('sync_anonymous_session', {
      p_session_id: session_id,
      p_user_id: user_id,
    });

    if (error) {
      console.error('Session sync error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session sync error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
