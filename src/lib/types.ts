export interface MetalPrice {
  symbol: string;
  name: string;
  price: number;
  change: number;
  unit: string;
}

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  source: string;
  category: 'MINING' | 'SUPPLY CHAIN' | 'POLICY' | 'MARKET' | 'TECH';
  severity: 1 | 2 | 3 | 4;
  country?: string;
  mineral?: string;
}

export interface CounterStats {
  crit: number;  // S4
  high: number;  // S3
  loc: number;   // items with country
  min: number;   // mining category
  mv: number;    // MiningVisuals mentions (0 for now)
}
