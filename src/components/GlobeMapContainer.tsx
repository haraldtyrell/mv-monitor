'use client';

import { useState, Suspense, lazy } from 'react';
import { NewsItem } from '@/lib/types';

// Lazy load heavy components
const Globe = lazy(() => import('./Globe').then(mod => ({ default: mod.Globe })));
const Map2D = lazy(() => import('./Map2D').then(mod => ({ default: mod.Map2D })));

interface GlobeMapContainerProps {
  events: NewsItem[];
}

type ViewMode = 'globe' | 'map';

export function GlobeMapContainer({ events }: GlobeMapContainerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [selectedEvent, setSelectedEvent] = useState<NewsItem | null>(null);

  const handleEventClick = (event: NewsItem) => {
    setSelectedEvent(event);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="relative w-full h-full bg-[#0a0a0a]">
      {/* View Toggle */}
      <div className="absolute top-4 left-4 z-[1000] flex gap-1 bg-black/70 rounded-lg p-1">
        <button
          onClick={() => setViewMode('globe')}
          className={`px-3 py-1.5 text-xs rounded transition-colors ${
            viewMode === 'globe'
              ? 'bg-cyan-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          🌍 Globe
        </button>
        <button
          onClick={() => setViewMode('map')}
          className={`px-3 py-1.5 text-xs rounded transition-colors ${
            viewMode === 'map'
              ? 'bg-cyan-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          🗺️ Map
        </button>
      </div>

      {/* Visualization */}
      <Suspense 
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2 animate-pulse">
                {viewMode === 'globe' ? '🌍' : '🗺️'}
              </div>
              <p className="text-sm">Loading {viewMode}...</p>
            </div>
          </div>
        }
      >
        {viewMode === 'globe' ? (
          <Globe events={events} onEventClick={handleEventClick} />
        ) : (
          <Map2D events={events} onEventClick={handleEventClick} />
        )}
      </Suspense>

      {/* Event Details Popup */}
      {selectedEvent && (
        <div className="absolute bottom-4 left-4 right-4 z-[1001] bg-gray-900/95 rounded-lg p-4 shadow-xl border border-gray-700 max-w-md">
          <button
            onClick={closeEventDetails}
            className="absolute top-2 right-2 text-gray-500 hover:text-white"
          >
            ✕
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-900/50 text-cyan-400">
              {selectedEvent.category}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-orange-900/50 text-orange-400">
              S{selectedEvent.severity}
            </span>
          </div>
          <h3 className="text-white font-medium mb-2 leading-snug">
            {selectedEvent.title}
          </h3>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3 text-gray-400">
              {selectedEvent.country && (
                <span className="flex items-center gap-1">
                  📍 {selectedEvent.country}
                </span>
              )}
              {selectedEvent.mineral && (
                <span>{selectedEvent.mineral}</span>
              )}
            </div>
            <a
              href={selectedEvent.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-500 hover:text-cyan-400 flex items-center gap-1"
            >
              ↗ Read more
            </a>
          </div>
        </div>
      )}

      {/* Event Counter */}
      <div className="absolute top-4 right-4 z-[1000] bg-black/70 rounded-lg px-3 py-2 text-xs">
        <span className="text-gray-400">Events with location: </span>
        <span className="text-white font-semibold">
          {events.filter(e => e.coordinates).length}
        </span>
      </div>
    </div>
  );
}
