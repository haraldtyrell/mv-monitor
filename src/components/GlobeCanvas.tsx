'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { NewsItem, EVENT_COLORS, EventCategory } from '@/lib/types';

interface GlobeCanvasProps {
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

export default function GlobeCanvas({ events, onEventClick }: GlobeCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.5], fov: 45 }}
      style={{ background: '#0a0a0a', width: '100%', height: '100%' }}
    >
      <GlobeScene events={events} onEventClick={onEventClick} />
    </Canvas>
  );
}
