import { MetalPrice } from './types';

// For initial deployment, we'll use mock data that looks realistic
// In production, this would scrape from Kitco/Yahoo Finance via API routes
export function getMockPrices(): MetalPrice[] {
  // Base prices with small random variations to simulate live data
  const variation = () => (Math.random() - 0.5) * 0.02; // ±1%
  
  return [
    {
      symbol: 'CU',
      name: 'Copper',
      price: +(4.95 * (1 + variation())).toFixed(4),
      change: +((Math.random() - 0.4) * 2).toFixed(2),
      unit: '$/lb'
    },
    {
      symbol: 'AL',
      name: 'Aluminum',
      price: +(3190 * (1 + variation())).toFixed(2),
      change: +((Math.random() - 0.4) * 2).toFixed(2),
      unit: '$/t'
    },
    {
      symbol: 'NI',
      name: 'Nickel',
      price: +(17010 * (1 + variation())).toFixed(2),
      change: +((Math.random() - 0.5) * 1).toFixed(2),
      unit: '$/t'
    },
    {
      symbol: 'AG',
      name: 'Silver',
      price: +(69.80 * (1 + variation())).toFixed(2),
      change: +((Math.random() - 0.3) * 4).toFixed(2),
      unit: '$/oz'
    },
    {
      symbol: 'PT',
      name: 'Platinum',
      price: +(1887 * (1 + variation())).toFixed(2),
      change: +((Math.random() - 0.3) * 3).toFixed(2),
      unit: '$/oz'
    },
    {
      symbol: 'PD',
      name: 'Palladium',
      price: +(1406 * (1 + variation())).toFixed(2),
      change: +((Math.random() - 0.2) * 5).toFixed(2),
      unit: '$/oz'
    },
    {
      symbol: 'AU',
      name: 'Gold',
      price: +(2980 * (1 + variation())).toFixed(2),
      change: +((Math.random() - 0.3) * 2).toFixed(2),
      unit: '$/oz'
    },
    {
      symbol: 'REMX',
      name: 'Rare Earths ETF',
      price: +(42.50 * (1 + variation())).toFixed(2),
      change: +((Math.random() - 0.5) * 3).toFixed(2),
      unit: ''
    },
    {
      symbol: 'LIT',
      name: 'Lithium ETF',
      price: +(38.20 * (1 + variation())).toFixed(2),
      change: +((Math.random() - 0.4) * 4).toFixed(2),
      unit: ''
    },
  ];
}
