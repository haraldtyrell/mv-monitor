export interface MetalPrice {
  symbol: string;
  name: string;
  price: number;
  change: number;
  unit: string;
}

export type EventCategory = 
  | 'SUPPLY_CHAIN' 
  | 'TRADE_POLICY' 
  | 'MINING' 
  | 'MARKET' 
  | 'ENVIRONMENTAL' 
  | 'CONFLICT';

export type MineralGroup = 
  | 'REE' 
  | 'BATTERY' 
  | 'INDUSTRIAL' 
  | 'PRECIOUS' 
  | 'STRATEGIC';

export type Severity = 1 | 2 | 3 | 4;

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  source: string;
  category: 'MINING' | 'SUPPLY CHAIN' | 'POLICY' | 'MARKET' | 'TECH';
  severity: Severity;
  country?: string;
  mineral?: string;
  // For globe/map markers
  coordinates?: {
    lat: number;
    lng: number;
  };
  eventType?: EventCategory;
  mineralGroup?: MineralGroup;
}

export interface CounterStats {
  crit: number;  // S4
  high: number;  // S3
  loc: number;   // items with country
  min: number;   // mining category
  mv: number;    // MiningVisuals mentions (0 for now)
}

export interface FilterState {
  timeHorizon: '12h' | '48h' | '7d';
  eventTypes: EventCategory[];
  severities: Severity[];
  mineralGroups: MineralGroup[];
}

// Country coordinates for geocoding news events
export const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
  'Chile': { lat: -35.6751, lng: -71.543 },
  'Peru': { lat: -9.19, lng: -75.0152 },
  'Australia': { lat: -25.2744, lng: 133.7751 },
  'China': { lat: 35.8617, lng: 104.1954 },
  'Indonesia': { lat: -0.7893, lng: 113.9213 },
  'DRC': { lat: -4.0383, lng: 21.7587 },
  'Congo': { lat: -4.0383, lng: 21.7587 },
  'South Africa': { lat: -30.5595, lng: 22.9375 },
  'Russia': { lat: 61.524, lng: 105.3188 },
  'Canada': { lat: 56.1304, lng: -106.3468 },
  'Brazil': { lat: -14.235, lng: -51.9253 },
  'USA': { lat: 37.0902, lng: -95.7129 },
  'United States': { lat: 37.0902, lng: -95.7129 },
  'Mexico': { lat: 23.6345, lng: -102.5528 },
  'Argentina': { lat: -38.4161, lng: -63.6167 },
  'Bolivia': { lat: -16.2902, lng: -63.5887 },
  'Philippines': { lat: 12.8797, lng: 121.774 },
  'India': { lat: 20.5937, lng: 78.9629 },
  'Kazakhstan': { lat: 48.0196, lng: 66.9237 },
  'Myanmar': { lat: 21.9162, lng: 95.956 },
  'Zambia': { lat: -13.1339, lng: 27.8493 },
  'Zimbabwe': { lat: -19.0154, lng: 29.1549 },
  'Mongolia': { lat: 46.8625, lng: 103.8467 },
  'Papua New Guinea': { lat: -6.315, lng: 143.9555 },
  'Guinea': { lat: 9.9456, lng: -9.6966 },
  'Mali': { lat: 17.5707, lng: -3.9962 },
  'Burkina Faso': { lat: 12.2383, lng: -1.5616 },
  'Ghana': { lat: 7.9465, lng: -1.0232 },
  'Tanzania': { lat: -6.369, lng: 34.8888 },
  'Mozambique': { lat: -18.6657, lng: 35.5296 },
  'Vietnam': { lat: 14.0583, lng: 108.2772 },
  'Japan': { lat: 36.2048, lng: 138.2529 },
  'South Korea': { lat: 35.9078, lng: 127.7669 },
  'Germany': { lat: 51.1657, lng: 10.4515 },
  'UK': { lat: 55.3781, lng: -3.436 },
  'United Kingdom': { lat: 55.3781, lng: -3.436 },
  'France': { lat: 46.2276, lng: 2.2137 },
  'Spain': { lat: 40.4637, lng: -3.7492 },
  'Sweden': { lat: 60.1282, lng: 18.6435 },
  'Norway': { lat: 60.472, lng: 8.4689 },
  'Finland': { lat: 61.9241, lng: 25.7482 },
  'Poland': { lat: 51.9194, lng: 19.1451 },
  'Ukraine': { lat: 48.3794, lng: 31.1656 },
  'Turkey': { lat: 38.9637, lng: 35.2433 },
  'Iran': { lat: 32.4279, lng: 53.688 },
  'Saudi Arabia': { lat: 23.8859, lng: 45.0792 },
  'UAE': { lat: 23.4241, lng: 53.8478 },
  'Egypt': { lat: 26.8206, lng: 30.8025 },
  'Morocco': { lat: 31.7917, lng: -7.0926 },
  'Algeria': { lat: 28.0339, lng: 1.6596 },
  'Nigeria': { lat: 9.082, lng: 8.6753 },
};

// Map category to event color
export const EVENT_COLORS: Record<EventCategory, string> = {
  'SUPPLY_CHAIN': '#f97316', // Orange
  'TRADE_POLICY': '#3b82f6', // Blue
  'MINING': '#22c55e',       // Green
  'MARKET': '#3b82f6',       // Blue
  'ENVIRONMENTAL': '#22c55e', // Green
  'CONFLICT': '#ef4444',     // Red
};
