'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';
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

// Convert lat/lng to 3D position on sphere
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return new THREE.Vector3(x, y, z);
}

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  return (
    <Sphere ref={earthRef} args={[1, 64, 64]}>
      <meshStandardMaterial
        color="#1a3a5c"
        metalness={0.3}
        roughness={0.7}
      />
    </Sphere>
  );
}

function EventMarker({ 
  event, 
  onClick 
}: { 
  event: NewsItem; 
  onClick?: (e: NewsItem) => void;
}) {
  const markerRef = useRef<THREE.Mesh>(null);
  
  const position = useMemo(() => {
    if (!event.coordinates) return new THREE.Vector3(0, 0, 0);
    return latLngToVector3(event.coordinates.lat, event.coordinates.lng, 1.02);
  }, [event.coordinates]);
  
  const color = useMemo(() => {
    const eventType = getEventType(event.category);
    return EVENT_COLORS[eventType];
  }, [event.category]);
  
  const size = 0.015 + (event.severity * 0.005);
  
  if (!event.coordinates) return null;

  return (
    <mesh
      ref={markerRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(event);
      }}
    >
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

function GlobeScene({ 
  events, 
  onEventClick 
}: { 
  events: NewsItem[]; 
  onEventClick?: (e: NewsItem) => void;
}) {
  const eventsWithCoords = events.filter(e => e.coordinates);
  
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <Earth />
      
      {eventsWithCoords.map((event) => (
        <EventMarker 
          key={event.id} 
          event={event} 
          onClick={onEventClick}
        />
      ))}
      
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={1.5}
        maxDistance={4}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export function Globe({ events, onEventClick }: GlobeProps) {
  return (
    <div className="w-full h-full bg-[#0a0a0a]">
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 45 }}
        style={{ background: '#0a0a0a' }}
      >
        <GlobeScene events={events} onEventClick={onEventClick} />
      </Canvas>
      
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
