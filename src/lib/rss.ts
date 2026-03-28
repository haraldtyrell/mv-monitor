import Parser from 'rss-parser';
import { NewsItem } from './types';
import { classifySeverity, extractMineral, extractCountry, categorizeNews } from './severity';

const parser = new Parser({
  timeout: 15000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; MV-Monitor/1.0)',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*',
  },
});

interface RSSSource {
  url: string;
  name: string;
}

const RSS_SOURCES: RSSSource[] = [
  // Google News is reliable
  { url: 'https://news.google.com/rss/search?q=mining+copper+gold+lithium&hl=en-US&gl=US&ceid=US:en', name: 'Google News' },
  { url: 'https://news.google.com/rss/search?q=critical+minerals+supply+chain&hl=en-US&gl=US&ceid=US:en', name: 'Google News' },
  { url: 'https://news.google.com/rss/search?q=rare+earth+metals&hl=en-US&gl=US&ceid=US:en', name: 'Google News' },
  // Reuters commodities section
  { url: 'https://news.google.com/rss/search?q=site:reuters.com+commodities+metals&hl=en-US&gl=US&ceid=US:en', name: 'Reuters' },
];

export async function fetchAllFeeds(): Promise<NewsItem[]> {
  const allItems: NewsItem[] = [];
  const seenTitles = new Set<string>();
  
  const results = await Promise.allSettled(
    RSS_SOURCES.map(async (source) => {
      try {
        const feed = await parser.parseURL(source.url);
        return feed.items.map((item) => ({
          id: item.guid || item.link || `${source.name}-${Date.now()}-${Math.random()}`,
          title: item.title || 'Untitled',
          link: item.link || '#',
          pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
          source: source.name,
          category: categorizeNews(item.title || '', item.contentSnippet),
          severity: classifySeverity(item.title || '', item.contentSnippet),
          country: extractCountry(item.title || '', item.contentSnippet),
          mineral: extractMineral(item.title || '', item.contentSnippet),
        }));
      } catch (error) {
        console.error(`Failed to fetch ${source.name}:`, error);
        return [];
      }
    })
  );
  
  for (const result of results) {
    if (result.status === 'fulfilled') {
      for (const item of result.value) {
        // Deduplicate by title
        const normalizedTitle = item.title.toLowerCase().trim();
        if (!seenTitles.has(normalizedTitle)) {
          seenTitles.add(normalizedTitle);
          allItems.push(item);
        }
      }
    }
  }
  
  // Sort by date descending
  allItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  
  // Limit to most recent 50 items
  return allItems.slice(0, 50);
}
