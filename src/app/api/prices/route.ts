import { NextResponse } from 'next/server';
import { MetalPrice } from '@/lib/types';

// Yahoo Finance symbols mapping
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

interface YahooChartResponse {
  chart: {
    result: Array<{
      meta: {
        regularMarketPrice: number;
        previousClose: number;
        symbol: string;
      };
    }>;
    error: null | { code: string; description: string };
  };
}

async function fetchYahooPrice(symbol: string): Promise<{ price: number; change: number } | null> {
  try {
    // Use Yahoo Finance chart API (public, no auth needed)
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    
    if (!response.ok) {
      console.error(`Yahoo API error for ${symbol}: ${response.status}`);
      return null;
    }
    
    const data: YahooChartResponse = await response.json();
    
    if (data.chart.error || !data.chart.result?.[0]) {
      return null;
    }
    
    const meta = data.chart.result[0].meta;
    const price = meta.regularMarketPrice;
    const previousClose = meta.previousClose || price;
    const change = previousClose > 0 
      ? ((price - previousClose) / previousClose) * 100 
      : 0;
    
    return {
      price,
      change: +change.toFixed(2),
    };
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error);
    return null;
  }
}

export async function GET() {
  const prices: MetalPrice[] = [];
  
  // Fetch all prices in parallel
  const entries = Object.entries(YAHOO_SYMBOLS);
  const results = await Promise.all(
    entries.map(async ([metalSymbol, config]) => {
      const result = await fetchYahooPrice(config.symbol);
      return { metalSymbol, config, result };
    })
  );
  
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
      // Use fallback
      prices.push(getFallbackPrice(metalSymbol, config));
    }
  }
  
  return NextResponse.json(prices);
}

function getFallbackPrice(symbol: string, config: { name: string; unit: string }): MetalPrice {
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
  
  const fb = fallbacks[symbol] || { price: 0, change: 0 };
  return {
    symbol,
    name: config.name,
    price: fb.price,
    change: fb.change,
    unit: config.unit,
  };
}
