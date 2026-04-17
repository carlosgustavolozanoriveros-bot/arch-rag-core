import { searchResources, getResourcesByIds } from '@/lib/rag';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { action, query, resourceIds } = await req.json();

    if (action === 'search') {
      const results = await searchResources(query, 0.50, 5);
      return NextResponse.json({ results });
    }

    if (action === 'get_by_ids') {
      const results = await getResourcesByIds(resourceIds);
      return NextResponse.json({ results });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Tool execution error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
