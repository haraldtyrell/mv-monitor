'use client';

import dynamic from 'next/dynamic';
import { NewsItem } from '@/lib/types';

interface GlobeProps {
  events: NewsItem[];
  onEventClick?: (event: NewsItem) => void;
}

// Lazy load Three.js canvas component
const GlobeCanvas = dynamic(() => import('./GlobeCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a]">
      <div className="text-center text-gray-500">
        <div className="text-4xl mb-2 animate-pulse">🌍</div>
        <p className="text-sm">Loading 3D globe...</p>
      </div>
    </div>
  ),
});

export function Globe({ events, onEventClick }: GlobeProps) {
  return (
    <div className="w-full h-full bg-[#0a0a0a] relative">
      <GlobeCanvas events={events} onEventClick={onEventClick} />
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-black/70 rounded-lg p-3 text-xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span className="text-gray-300">Supply Chain</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span className="text-gray-300">Trade/Market</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-gray-300">Mining/Env</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-gray-300">Conflict</span>
          </div>
        </div>
      </div>
    </div>
  );
}


