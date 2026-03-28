import { Ticker } from '@/components/Ticker';
import { Header } from '@/components/Header';
import { NewsFeed } from '@/components/NewsFeed';
import { GlobeMapContainer } from '@/components/GlobeMapContainer';
import { getMockPrices } from '@/lib/prices';
import { fetchAllFeeds } from '@/lib/rss';
import { CounterStats, NewsItem, MetalPrice } from '@/lib/types';

export const revalidate = 300; // Revalidate every 5 minutes
export const dynamic = 'force-dynamic'; // Always fetch fresh data

async function getNewsItems(): Promise<NewsItem[]> {
  try {
    return await fetchAllFeeds();
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return [];
  }
}

// Fetch prices directly from Yahoo Finance (server-side)
async function fetchPricesDirectly(): Promise<MetalPrice[]> {
  const YAHOO_SYMBOLS: Record<string, { symbol: string; name: string; unit: string }> = {
    'CU': { symbol: 'HG=F', name: 'Copper', unit: '$/lb' },
    'AU': { symbol: 'GC=F', name: 'Gold', unit: '$/oz' },
    'AG': { symbol: 'SI=F', name: 'Silver', unit: '$/oz' },
    'PT': { symbol: 'PL=F', name: 'Platinum', unit: '$/oz' },
    'PD': { symbol: 'PA=F', name: 'Palladium', unit: '$/oz' },
    'AL': { symbol: 'ALI=F', name: 'Aluminum', unit: '$/t' },
    'NI': { symbol: '^SPGSIKTR', name: 'Nickel', unit: '$/t' },
    'REMX': { symbol: 'REMX', name: 'Rare Earths ETF', unit: '' },
    'LIT': { symbol: 'LIT', name: 'Lithium ETF', unit: '' },
  };

  const prices: MetalPrice[] = [];

  const fetchPrice = async (symbol: string): Promise<{ price: number; change: number } | null> => {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
        next: { revalidate: 300 },
      });

      if (!response.ok) return null;

      const data = await response.json();
      if (!data.chart?.result?.[0]) return null;

      const meta = data.chart.result[0].meta;
      const price = meta.regularMarketPrice;
      const previousClose = meta.previousClose || price;
      const change = previousClose > 0 ? ((price - previousClose) / previousClose) * 100 : 0;

      return { price, change: +change.toFixed(2) };
    } catch {
      return null;
    }
  };

  const entries = Object.entries(YAHOO_SYMBOLS);
  const results = await Promise.all(
    entries.map(async ([metalSymbol, config]) => {
      const result = await fetchPrice(config.symbol);
      return { metalSymbol, config, result };
    })
  );

  const fallbacks: Record<string, { price: number; change: number }> = {
    'CU': { price: 4.85, change: 0.52 },
    'AU': { price: 2950, change: 0.31 },
    'AG': { price: 32.50, change: 1.23 },
    'PT': { price: 980, change: -0.45 },
    'PD': { price: 1020, change: -1.12 },
    'AL': { price: 2450, change: 0.15 },
    'NI': { price: 16800, change: -0.33 },
    'REMX': { price: 42.50, change: 2.10 },
    'LIT': { price: 38.20, change: -0.85 },
  };

  for (const { metalSymbol, config, result } of results) {
    if (result && result.price > 0) {
      prices.push({
        symbol: metalSymbol,
        name: config.name,
        price: +result.price.toFixed(2),
        change: result.change,
        unit: config.unit,
      });
    } else {
      const fb = fallbacks[metalSymbol] || { price: 0, change: 0 };
      prices.push({
        symbol: metalSymbol,
        name: config.name,
        price: fb.price,
        change: fb.change,
        unit: config.unit,
      });
    }
  }

  return prices;
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
  let prices: MetalPrice[];
  let newsItems: NewsItem[];
  
  try {
    [prices, newsItems] = await Promise.all([
      fetchPricesDirectly(),
      getNewsItems(),
    ]);
  } catch (error) {
    console.error('Error fetching data:', error);
    prices = getMockPrices();
    newsItems = [];
  }
  
  const stats = calculateStats(newsItems);

  return (
    <main className="min-h-screen flex flex-col">
      {/* Price Ticker */}
      <Ticker prices={prices} />
      
      {/* Header with counters */}
      <Header stats={stats} />
      
      {/* Main content */}
      <div className="flex flex-1 min-h-0">
        {/* News Feed */}
        <div className="w-full lg:w-1/2 flex flex-col border-r border-gray-800 overflow-hidden">
          <NewsFeed items={newsItems} prices={prices} />
        </div>
        
        {/* Right side - Globe/Map */}
        <div className="hidden lg:block w-1/2 min-h-[500px]">
          <GlobeMapContainer events={newsItems} />
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
