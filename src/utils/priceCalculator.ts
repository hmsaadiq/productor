// FRONTEND PRICE CALCULATION UTILITY FILE: This file provides a function to calculate the price of a cake based on its configuration in the React frontend.
// It is used by the CakeCustomizer and other components to show real-time pricing.
//
// Design Patterns: Uses the Utility function pattern for stateless calculation.
// Data Structures: Uses objects for price tables, arrays for add-ons, and numbers for calculations.
// Security: No direct security features; only performs calculations.

interface CakeConfig {
  productType: 'cake' | 'cookies' | 'muffins';
  size?: string;
  layers?: number;
  flavors?: string[];   // indexed by layer
  filling?: string;
  addons?: string[];
  text?: string;
  shape?: 'circle' | 'heart';
  boxSize?: 4 | 6 | 12;
  boxFlavors?: string[];
  price: number;
  deliveryDetails: {
    name: string;
    address: string;
    phone: string;
    state: string;
  };
}

const CAKE_PRICES: Record<string, Record<number, number>> = {
  '6':     { 1: 14000, 2: 22000, 3: 30000 },
  '8':     { 1: 18000, 2: 28000, 3: 38000 },
  '10':    { 1: 22000, 2: 36000, 3: 52000 },
  '12':    { 1: 28000, 2: 48000, 3: 68000 },
  'Bento': { 1: 9500  },
};

const FLAVOR_UPCHARGES: Record<string, number> = {
  vanilla: 0, chocolate: 0, 'red velvet': 0,
  biscoff: 5000, carrot: 2000, lemon: 2000,
  coconut: 2000, mocha: 2000, confetti: 3000,
  'lemon and blueberry': 5000,
};

const FILLING_BASE: Record<number, number> = { 2: 3000, 3: 5000 };

const FILLING_UPCHARGES: Record<string, number> = {
  'cream cheese': 3000,
  'biscoff filling': 3000,
};

const ADDON_PRICES: Record<string, number> = {
  butterflies: 2000,
  'light glitter': 2000,
  'heavy glitter': 5000,
  'light pearl detailing': 2500,
  'heavy pearl detailing': 5000,
  'other ornaments': 0,
};

const BOX_PRICES: Record<number, number> = { 4: 12000, 6: 18000, 12: 32000 };

export const calculatePrice = (config: CakeConfig): number => {
  if (config.productType === 'cake') {
    const size = config.size || '';
    const layers = config.layers || 1;

    const basePrice = CAKE_PRICES[size]?.[layers] || 0;

    const flavorUpcharge = (config.flavors || []).reduce((sum, f) => {
      return sum + (FLAVOR_UPCHARGES[f] || 0);
    }, 0);

    let fillingCost = 0;
    if (layers >= 2 && config.filling) {
      fillingCost = (FILLING_BASE[layers] || 0) + (FILLING_UPCHARGES[config.filling] || 0);
    }

    const addonCost = (config.addons || []).reduce((sum, a) => {
      return sum + (ADDON_PRICES[a] || 0);
    }, 0);

    return basePrice + flavorUpcharge + fillingCost + addonCost;
  } else if (config.productType === 'cookies' || config.productType === 'muffins') {
    return config.boxSize ? (BOX_PRICES[config.boxSize] || 0) : 0;
  }
  return 0;
};
