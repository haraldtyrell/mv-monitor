// Keyword-based severity classification
// S4 = Critical, S3 = High, S2 = Medium, S1 = Low

const S4_KEYWORDS = [
  'force majeure', 'sanctions', 'war', 'conflict', 'critical shortage',
  'attack', 'strikes', 'blockade', 'embargo', 'military', 'explosion',
  'shutdown', 'halt', 'emergency', 'crisis', 'collapse'
];

const S3_KEYWORDS = [
  'policy', 'tariff', 'export ban', 'regulation', 'ban', 'restriction',
  'government', 'law', 'legislation', 'ministry', 'decree', 'investigation',
  'antitrust', 'penalty', 'fine', 'compliance'
];

const S2_KEYWORDS = [
  'price', 'production', 'guidance', 'forecast', 'outlook', 'quarterly',
  'earnings', 'revenue', 'profit', 'loss', 'investment', 'acquisition',
  'merger', 'partnership', 'contract', 'deal', 'agreement'
];

// Mineral keywords for extraction
const MINERALS = [
  'copper', 'aluminum', 'aluminium', 'nickel', 'silver', 'platinum',
  'palladium', 'gold', 'lithium', 'cobalt', 'uranium', 'rare earth',
  'rare earths', 'REE', 'silicon', 'zinc', 'lead', 'tin', 'iron ore',
  'manganese', 'graphite', 'vanadium', 'tungsten', 'molybdenum'
];

// Country patterns
const COUNTRIES: Record<string, string[]> = {
  'China': ['china', 'chinese', 'beijing'],
  'Russia': ['russia', 'russian', 'moscow'],
  'USA': ['united states', 'u.s.', 'us ', 'american', 'washington'],
  'Australia': ['australia', 'australian'],
  'Canada': ['canada', 'canadian'],
  'Chile': ['chile', 'chilean'],
  'Peru': ['peru', 'peruvian'],
  'DRC': ['congo', 'drc', 'kinshasa'],
  'Indonesia': ['indonesia', 'indonesian', 'jakarta'],
  'South Africa': ['south africa', 'south african'],
  'Brazil': ['brazil', 'brazilian'],
  'Zimbabwe': ['zimbabwe'],
  'Iran': ['iran', 'iranian', 'tehran'],
  'Global': ['global', 'worldwide', 'international']
};

export function classifySeverity(title: string, description?: string): 1 | 2 | 3 | 4 {
  const text = `${title} ${description || ''}`.toLowerCase();
  
  // Check S4 first (most severe)
  for (const keyword of S4_KEYWORDS) {
    if (text.includes(keyword)) return 4;
  }
  
  // Check S3
  for (const keyword of S3_KEYWORDS) {
    if (text.includes(keyword)) return 3;
  }
  
  // Check S2
  for (const keyword of S2_KEYWORDS) {
    if (text.includes(keyword)) return 2;
  }
  
  // Default to S1
  return 1;
}

export function extractMineral(title: string, description?: string): string | undefined {
  const text = `${title} ${description || ''}`.toLowerCase();
  
  for (const mineral of MINERALS) {
    if (text.includes(mineral.toLowerCase())) {
      // Capitalize first letter
      return mineral.charAt(0).toUpperCase() + mineral.slice(1);
    }
  }
  
  return undefined;
}

export function extractCountry(title: string, description?: string): string | undefined {
  const text = `${title} ${description || ''}`.toLowerCase();
  
  for (const [country, patterns] of Object.entries(COUNTRIES)) {
    for (const pattern of patterns) {
      if (text.includes(pattern)) {
        return country;
      }
    }
  }
  
  return undefined;
}

export function categorizeNews(title: string, description?: string): 'MINING' | 'SUPPLY CHAIN' | 'POLICY' | 'MARKET' | 'TECH' {
  const text = `${title} ${description || ''}`.toLowerCase();
  
  if (text.includes('supply chain') || text.includes('logistics') || text.includes('shipping') || text.includes('transport')) {
    return 'SUPPLY CHAIN';
  }
  if (text.includes('policy') || text.includes('regulation') || text.includes('government') || text.includes('law') || text.includes('ban')) {
    return 'POLICY';
  }
  if (text.includes('technology') || text.includes('innovation') || text.includes('research') || text.includes('battery')) {
    return 'TECH';
  }
  if (text.includes('price') || text.includes('market') || text.includes('trading') || text.includes('stock') || text.includes('etf')) {
    return 'MARKET';
  }
  
  return 'MINING';
}
