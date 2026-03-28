import { NextResponse } from 'next/server';
import { fetchAllFeeds } from '@/lib/rss';

export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
  try {
    const items = await fetchAllFeeds();
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Feed fetch error:', error);
    return NextResponse.json({ items: [], error: 'Failed to fetch feeds' }, { status: 500 });
  }
}
