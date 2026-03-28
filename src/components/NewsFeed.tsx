'use client';

import { NewsItem } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface NewsFeedProps {
  items: NewsItem[];
}

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

export function NewsFeed({ items }: NewsFeedProps) {
  return (
    <div className="flex-1 overflow-auto">
      {/* Tabs */}
      <div className="flex border-b border-gray-800 px-6">
        <button className="px-4 py-3 text-white border-b-2 border-cyan-500 text-sm">
          ≡ Feed
        </button>
        <button className="px-4 py-3 text-gray-500 hover:text-gray-300 text-sm">
          ◆ Minerals
        </button>
        <button className="px-4 py-3 text-gray-500 hover:text-gray-300 text-sm">
          ▽ Filters
        </button>
      </div>
      
      {/* News Items */}
      <div className="divide-y divide-gray-800">
        {items.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
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
