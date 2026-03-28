import { MetalPrice } from './types';

// Fetch real prices from Yahoo Finance via our API route
export async function fetchPrices(): Promise<MetalPrice[]> {
  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/prices`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch prices');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching prices:', error);
    return getMockPrices();
  }
}

// Fallback mock prices
export function getMockPrices(): MetalPrice[] {
  return [
    { symbol: 'CU', name: 'Copper', price: 4.85, change: 0.52, unit: '$/lb' },
    { symbol: 'AU', name: 'Gold', price: 2950, change: 0.31, unit: '$/oz' },
    { symbol: 'AG', name: 'Silver', price: 32.50, change: 1.23, unit: '$/oz' },
    { symbol: 'PT', name: 'Platinum', price: 980, change: -0.45, unit: '$/oz' },
    { symbol: 'PD', name: 'Palladium', price: 1020, change: -1.12, unit: '$/oz' },
    { symbol: 'AL', name: 'Aluminum', price: 2450, change: 0.15, unit: '$/t' },
    { symbol: 'NI', name: 'Nickel', price: 16800, change: -0.33, unit: '$/t' },
    { symbol: 'REMX', name: 'Rare Earths ETF', price: 42.50, change: 2.10, unit: '' },
    { symbol: 'LIT', name: 'Lithium ETF', price: 38.20, change: -0.85, unit: '' },
  ];
}
