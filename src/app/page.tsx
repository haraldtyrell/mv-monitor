import { Ticker } from '@/components/Ticker';
import { Header } from '@/components/Header';
import { NewsFeed } from '@/components/NewsFeed';
import { getMockPrices } from '@/lib/prices';
import { fetchAllFeeds } from '@/lib/rss';
import { CounterStats, NewsItem } from '@/lib/types';

export const revalidate = 300; // Revalidate every 5 minutes

async function getNewsItems(): Promise<NewsItem[]> {
  try {
    return await fetchAllFeeds();
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return [];
  }
}

function calculateStats(items: NewsItem[]): CounterStats {
  return {
    crit: items.filter(i => i.severity === 4).length,
    high: items.filter(i => i.severity === 3).length,
    loc: items.filter(i => i.country).length,
    min: items.filter(i => i.category === 'MINING').length,
    mv: 0,
  };
}

export default async function Home() {
  const [prices, newsItems] = await Promise.all([
    Promise.resolve(getMockPrices()),
    getNewsItems(),
  ]);
  
  const stats = calculateStats(newsItems);

  return (
    <main className="min-h-screen flex flex-col">
      {/* Price Ticker */}
      <Ticker prices={prices} />
      
      {/* Header with counters */}
      <Header stats={stats} />
      
      {/* Main content */}
      <div className="flex flex-1">
        {/* News Feed */}
        <div className="w-full lg:w-1/2 flex flex-col border-r border-gray-800">
          <NewsFeed items={newsItems} />
        </div>
        
        {/* Right side - Globe placeholder */}
        <div className="hidden lg:flex w-1/2 items-center justify-center bg-[#0a0a0a] p-8">
          <div className="text-center text-gray-600">
            <div className="text-6xl mb-4">🌍</div>
            <p className="text-sm">Globe visualization coming soon</p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-cyan-500 text-xl font-bold">MV</span>
          <span className="text-white font-semibold">MINING VISUALS</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <span>Stockholm: {new Date().toLocaleTimeString('en-SE', { timeZone: 'Europe/Stockholm', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          <span>UTC: {new Date().toLocaleTimeString('en-GB', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>
        <p className="text-gray-600 text-sm">© 2026 MiningVisuals. All rights reserved.</p>
      </footer>
    </main>
  );
}
