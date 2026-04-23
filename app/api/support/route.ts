import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { ticket_type, description } = body;

    if (!ticket_type || !description) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const { error } = await supabase
      .from('support_tickets')
      .insert({
        user_id: session.user.id,
        ticket_type,
        description
      });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Support API error:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
