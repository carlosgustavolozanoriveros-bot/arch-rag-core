import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const serviceRole = createServiceRoleClient();
    const { data: { session } } = await supabase.auth.getSession();

    // Get the latest news
    const { data: news } = await serviceRole
      .from('app_news')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    let hasUnread = false;

    if (session?.user && news && news.length > 0) {
      // Check if there are unread news
      const { data: profile } = await serviceRole
        .from('user_profiles')
        .select('last_news_read_at')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        const lastRead = profile.last_news_read_at ? new Date(profile.last_news_read_at) : new Date(0);
        const latestNews = new Date(news[0].created_at);
        hasUnread = latestNews > lastRead;
      }
    }

    return NextResponse.json({ news: news || [], hasUnread });
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Mark news as read
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const serviceRole = createServiceRoleClient();
    await serviceRole
      .from('user_profiles')
      .update({ last_news_read_at: new Date().toISOString() })
      .eq('id', session.user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark news read error:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
