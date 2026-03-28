'use client';

import { MetalPrice } from '@/lib/types';

interface TickerProps {
  prices: MetalPrice[];
}

export function Ticker({ prices }: TickerProps) {
  // Duplicate prices for seamless scrolling
  const duplicatedPrices = [...prices, ...prices];
  
  return (
    <div className="bg-[#111] border-b border-gray-800 overflow-hidden">
      <div className="ticker-scroll flex whitespace-nowrap py-2">
        {duplicatedPrices.map((metal, index) => (
          <div
            key={`${metal.symbol}-${index}`}
            className="flex items-center gap-2 px-6 border-r border-gray-800"
          >
            <span className="text-gray-400 text-sm">{metal.name}</span>
            <span className="text-white font-semibold">
              ${metal.price.toLocaleString()}
            </span>
            <span
              className={`text-sm flex items-center ${
                metal.change >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {metal.change >= 0 ? '↗' : '↘'}
              {metal.change >= 0 ? '+' : ''}
              {metal.change}%
            </span>
            <span className="text-gray-500 text-xs">{metal.unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
