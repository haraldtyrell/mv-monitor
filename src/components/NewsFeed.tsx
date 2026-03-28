'use client';

import { useState } from 'react';
import { NewsItem, FilterState, MetalPrice, EventCategory, MineralGroup } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { FilterPanel } from './FilterPanel';

interface NewsFeedProps {
  items: NewsItem[];
  prices?: MetalPrice[];
}

type TabType = 'feed' | 'minerals' | 'filters';

const severityColors: Record<number, string> = {
  1: 'bg-gray-700 text-gray-300',
  2: 'bg-blue-900/50 text-blue-400',
  3: 'bg-orange-900/50 text-orange-400',
  4: 'bg-red-900/50 text-red-400',
};

const categoryColors: Record<string, string> = {
  'MINING': 'bg-purple-900/50 text-purple-400',
  'SUPPLY CHAIN': 'bg-orange-900/50 text-orange-400',
  'POLICY': 'bg-blue-900/50 text-blue-400',
  'MARKET': 'bg-green-900/50 text-green-400',
  'TECH': 'bg-cyan-900/50 text-cyan-400',
};

// Mineral to group mapping
const MINERAL_TO_GROUP: Record<string, string> = {
  'Lithium': 'BATTERY',
  'Cobalt': 'BATTERY',
  'Nickel': 'BATTERY',
  'Graphite': 'BATTERY',
  'Manganese': 'BATTERY',
  'Gold': 'PRECIOUS',
  'Silver': 'PRECIOUS',
  'Platinum': 'PRECIOUS',
  'Palladium': 'PRECIOUS',
  'Copper': 'INDUSTRIAL',
  'Aluminum': 'INDUSTRIAL',
  'Zinc': 'INDUSTRIAL',
  'Lead': 'INDUSTRIAL',
  'Iron': 'INDUSTRIAL',
  'REE': 'REE',
  'Rare Earth': 'REE',
  'Neodymium': 'REE',
  'Dysprosium': 'REE',
  'Uranium': 'STRATEGIC',
  'Tungsten': 'STRATEGIC',
  'Titanium': 'STRATEGIC',
  'Vanadium': 'STRATEGIC',
};

const defaultFilters: FilterState = {
  timeHorizon: '7d',
  eventTypes: [],
  severities: [],
  mineralGroups: [],
};

export function NewsFeed({ items, prices = [] }: NewsFeedProps) {
  const [activeTab, setActiveTab] = useState<TabType>('feed');
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Filter items based on current filters
  const filteredItems = items.filter(item => {
    // Time horizon filter
    const pubDate = new Date(item.pubDate);
    const now = new Date();
    const hoursAgo = (now.getTime() - pubDate.getTime()) / (1000 * 60 * 60);
    
    if (filters.timeHorizon === '12h' && hoursAgo > 12) return false;
    if (filters.timeHorizon === '48h' && hoursAgo > 48) return false;
    if (filters.timeHorizon === '7d' && hoursAgo > 168) return false;

    // Severity filter (if any selected)
    if (filters.severities.length > 0 && !filters.severities.includes(item.severity)) {
      return false;
    }

    // Event type filter (if any selected)
    if (filters.eventTypes.length > 0) {
      const categoryMapping: Record<string, string> = {
        'MINING': 'MINING',
        'SUPPLY CHAIN': 'SUPPLY_CHAIN',
        'POLICY': 'TRADE_POLICY',
        'MARKET': 'MARKET',
        'TECH': 'SUPPLY_CHAIN',
      };
      const mappedCategory = categoryMapping[item.category] || 'MARKET';
      if (!filters.eventTypes.includes(mappedCategory as EventCategory)) {
        return false;
      }
    }

    // Mineral group filter (if any selected)
    if (filters.mineralGroups.length > 0 && item.mineral) {
      const group = MINERAL_TO_GROUP[item.mineral];
      if (!group || !filters.mineralGroups.includes(group as MineralGroup)) {
        return false;
      }
    }

    return true;
  });

  const activeFilterCount = 
    filters.eventTypes.length + 
    filters.severities.length + 
    filters.mineralGroups.length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-800 px-6">
        <button 
          onClick={() => setActiveTab('feed')}
          className={`px-4 py-3 text-sm transition-colors ${
            activeTab === 'feed' 
              ? 'text-white border-b-2 border-cyan-500' 
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          ≡ Feed {filteredItems.length !== items.length && `(${filteredItems.length})`}
        </button>
        <button 
          onClick={() => setActiveTab('minerals')}
          className={`px-4 py-3 text-sm transition-colors ${
            activeTab === 'minerals' 
              ? 'text-white border-b-2 border-cyan-500' 
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          ◆ Minerals
        </button>
        <button 
          onClick={() => setActiveTab('filters')}
          className={`px-4 py-3 text-sm transition-colors flex items-center gap-2 ${
            activeTab === 'filters' 
              ? 'text-white border-b-2 border-cyan-500' 
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          ▽ Filters
          {activeFilterCount > 0 && (
            <span className="bg-cyan-600 text-white text-xs px-1.5 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'feed' && (
          <div className="divide-y divide-gray-800">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No events match current filters</p>
                <button 
                  onClick={() => setFilters(defaultFilters)}
                  className="mt-2 text-cyan-500 hover:text-cyan-400 text-sm"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filteredItems.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))
            )}
          </div>
        )}

        {activeTab === 'minerals' && (
          <MineralsPanel prices={prices} />
        )}

        {activeTab === 'filters' && (
          <FilterPanel filters={filters} onChange={setFilters} />
        )}
      </div>
    </div>
  );
}

function MineralsPanel({ prices }: { prices: MetalPrice[] }) {
  // Group minerals by category
  const groups = {
    'Precious Metals': prices.filter(p => ['AU', 'AG', 'PT', 'PD'].includes(p.symbol)),
    'Industrial Metals': prices.filter(p => ['CU', 'AL', 'NI'].includes(p.symbol)),
    'ETFs & Indices': prices.filter(p => ['REMX', 'LIT'].includes(p.symbol)),
  };

  return (
    <div className="p-4 space-y-6">
      {Object.entries(groups).map(([groupName, metals]) => (
        <div key={groupName}>
          <h3 className="text-sm font-semibold text-gray-400 mb-3">{groupName}</h3>
          <div className="space-y-2">
            {metals.map(metal => (
              <div 
                key={metal.symbol}
                className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg"
              >
                <div>
                  <div className="text-white font-medium">{metal.name}</div>
                  <div className="text-gray-500 text-xs">{metal.symbol}</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">
                    ${metal.price.toLocaleString()} {metal.unit}
                  </div>
                  <div className={`text-sm ${metal.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {metal.change >= 0 ? '+' : ''}{metal.change}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  let timeAgo = 'recently';
  try {
    timeAgo = formatDistanceToNow(new Date(item.pubDate), { addSuffix: true });
  } catch {
    // Keep default
  }

  return (
    <div className="px-6 py-4 hover:bg-gray-900/50 transition-colors">
      {/* Top row: Category, Severity, Time */}
      <div className="flex items-center gap-3 mb-2">
        <span className={`text-xs px-2 py-0.5 rounded ${categoryColors[item.category] || categoryColors['MINING']}`}>
          {item.category}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded ${severityColors[item.severity]}`}>
          S{item.severity}
        </span>
        <span className="text-gray-500 text-xs flex items-center gap-1">
          ⏱ {timeAgo}
        </span>
      </div>
      
      {/* Title */}
      <h3 className="text-white font-medium mb-2 leading-snug">
        {item.title}
      </h3>
      
      {/* Bottom row: Location, Mineral, Source */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-400">
          {item.country && (
            <span className="flex items-center gap-1">
              📍 {item.country}
            </span>
          )}
          {item.mineral && (
            <span>{item.mineral}</span>
          )}
        </div>
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-500 text-sm hover:text-cyan-400 flex items-center gap-1"
        >
          ↗ Source
        </a>
      </div>
    </div>
  );
}
