'use client';

import { useState, useEffect, useRef } from 'react';
import { NewsItem, EVENT_COLORS, EventCategory } from '@/lib/types';

interface GlobeProps {
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

// Convert lat/lng to 2D position on a circular projection
function latLngTo2D(
  lat: number, 
  lng: number, 
  width: number, 
  height: number, 
  rotation: number
): { x: number; y: number; visible: boolean } {
  const adjustedLng = (lng + rotation) % 360;
  const normalizedLng = adjustedLng > 180 ? adjustedLng - 360 : adjustedLng;
  
  // Simple orthographic projection
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (normalizedLng * Math.PI) / 180;
  
  const x = width / 2 + (width / 2 - 20) * Math.sin(lngRad) * Math.cos(latRad);
  const y = height / 2 - (height / 2 - 20) * Math.sin(latRad);
  
  // Determine if point is on visible side
  const visible = normalizedLng >= -90 && normalizedLng <= 90;
  
  return { x, y, visible };
}

export function Globe({ events, onEventClick }: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 });
  const [hoveredEvent, setHoveredEvent] = useState<NewsItem | null>(null);

  // Auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(r => (r + 0.3) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Handle resize
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const size = Math.min(rect.width, rect.height);
        setDimensions({ width: size, height: size });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const eventsWithCoords = events.filter(e => e.coordinates);
  const { width, height } = dimensions;
  const radius = Math.min(width, height) / 2 - 20;

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-[#0a0a0a] relative">
      <svg 
        width={width} 
        height={height} 
        viewBox={`0 0 ${width} ${height}`}
        className="select-none"
      >
        {/* Globe background */}
        <defs>
          <radialGradient id="globeGradient" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#2a4a6a" />
            <stop offset="100%" stopColor="#0d1f2d" />
          </radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Globe sphere */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          fill="url(#globeGradient)"
          stroke="#1a3a5a"
          strokeWidth="2"
        />
        
        {/* Grid lines */}
        {[-60, -30, 0, 30, 60].map(lat => {
          const y = height / 2 - radius * Math.sin((lat * Math.PI) / 180);
          const xRadius = radius * Math.cos((lat * Math.PI) / 180);
          return (
            <ellipse
              key={`lat-${lat}`}
              cx={width / 2}
              cy={y}
              rx={xRadius}
              ry={xRadius * 0.3}
              fill="none"
              stroke="#1a3a5a"
              strokeWidth="0.5"
              opacity="0.3"
            />
          );
        })}
        
        {/* Event markers */}
        {eventsWithCoords.map(event => {
          if (!event.coordinates) return null;
          
          const { x, y, visible } = latLngTo2D(
            event.coordinates.lat,
            event.coordinates.lng,
            width,
            height,
            rotation
          );
          
          if (!visible) return null;
          
          const eventType = getEventType(event.category);
          const color = EVENT_COLORS[eventType];
          const size = 4 + event.severity * 2;
          
          return (
            <g key={event.id}>
              <circle
                cx={x}
                cy={y}
                r={size}
                fill={color}
                filter="url(#glow)"
                opacity="0.9"
                className="cursor-pointer transition-all duration-200 hover:opacity-100"
                style={{ transform: hoveredEvent?.id === event.id ? 'scale(1.5)' : 'scale(1)' }}
                onMouseEnter={() => setHoveredEvent(event)}
                onMouseLeave={() => setHoveredEvent(null)}
                onClick={() => onEventClick?.(event)}
              />
              <circle
                cx={x}
                cy={y}
                r={size + 2}
                fill="none"
                stroke={color}
                strokeWidth="1"
                opacity="0.5"
              />
            </g>
          );
        })}
      </svg>
      
      {/* Hover tooltip */}
      {hoveredEvent && (
        <div className="absolute top-4 left-4 bg-gray-900/95 rounded-lg p-3 shadow-xl border border-gray-700 max-w-xs z-10">
          <div className="flex items-center gap-2 mb-1">
            <span 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: EVENT_COLORS[getEventType(hoveredEvent.category)] }}
            />
            <span className="text-xs text-gray-400">{hoveredEvent.category}</span>
            <span className="text-xs text-orange-400">S{hoveredEvent.severity}</span>
          </div>
          <p className="text-sm text-white line-clamp-2">{hoveredEvent.title}</p>
          {hoveredEvent.country && (
            <p className="text-xs text-gray-500 mt-1">📍 {hoveredEvent.country}</p>
          )}
        </div>
      )}
      
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
      
      {/* Events counter */}
      <div className="absolute top-4 right-4 bg-black/70 rounded-lg px-3 py-2 text-xs">
        <span className="text-gray-400">Events: </span>
        <span className="text-white font-semibold">{eventsWithCoords.length}</span>
      </div>
    </div>
  );
}
