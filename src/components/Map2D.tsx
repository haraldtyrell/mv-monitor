'use client';

import { useEffect, useRef, useState } from 'react';
import { NewsItem, EVENT_COLORS, EventCategory } from '@/lib/types';

interface Map2DProps {
  events: NewsItem[];
  onEventClick?: (event: NewsItem) => void;
}

// Map old categories to new event types
function getEventType(category: string): EventCategory {
  const mapping: Record<string, EventCategory> = {
    'MINING': 'MINING',
    'SUPPLY CHAIN': 'SUPPLY_CHAIN',
    'POLICY': 'TRADE_POLICY',
    'MARKET': 'MARKET',
    'TECH': 'SUPPLY_CHAIN',
  };
  return mapping[category] || 'MARKET';
}

export function Map2D({ events, onEventClick }: Map2DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let isMounted = true;
    
    const initMap = async () => {
      // Dynamically import Leaflet and its CSS
      const L = await import('leaflet');
      
      // Add CSS to head
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }
      
      if (!isMounted || !containerRef.current || mapInstanceRef.current) return;
      
      // Create map with dark theme
      const map = L.map(containerRef.current, {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 8,
        zoomControl: true,
        attributionControl: false,
      });

      // Dark tile layer (CartoDB Dark Matter)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Add event markers
      const eventsWithCoords = events.filter(e => e.coordinates);
      
      for (const event of eventsWithCoords) {
        if (!event.coordinates) continue;
        
        const eventType = getEventType(event.category);
        const color = EVENT_COLORS[eventType];
        const size = 8 + (event.severity * 3);
        
        // Create custom circle marker
        const marker = L.circleMarker(
          [event.coordinates.lat, event.coordinates.lng],
          {
            radius: size,
            fillColor: color,
            color: '#ffffff',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
          }
        );
        
        // Popup content
        const popupContent = `
          <div style="background: #1a1a1a; color: #fff; padding: 8px; border-radius: 6px; min-width: 200px;">
            <div style="font-size: 10px; color: ${color}; margin-bottom: 4px;">
              ${event.category} • S${event.severity}
            </div>
            <div style="font-size: 12px; font-weight: 500; margin-bottom: 4px;">
              ${event.title.substring(0, 100)}${event.title.length > 100 ? '...' : ''}
            </div>
            ${event.country ? `<div style="font-size: 10px; color: #888;">📍 ${event.country}</div>` : ''}
            <a href="${event.link}" target="_blank" style="font-size: 10px; color: #22d3ee; text-decoration: none;">
              ↗ Read more
            </a>
          </div>
        `;
        
        marker.bindPopup(popupContent, {
          className: 'dark-popup',
          closeButton: true,
        });
        
        marker.on('click', () => {
          if (onEventClick) {
            onEventClick(event);
          }
        });
        
        marker.addTo(map);
      }

      mapInstanceRef.current = map;
      setIsLoaded(true);
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
    };
  }, [events, onEventClick]);

  return (
    <div className="relative w-full h-full">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a] z-10">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2 animate-pulse">🗺️</div>
            <p className="text-sm">Loading map...</p>
          </div>
        </div>
      )}
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{ background: '#0a0a0a' }}
      />
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-black/70 rounded-lg p-3 text-xs z-[1000]">
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
