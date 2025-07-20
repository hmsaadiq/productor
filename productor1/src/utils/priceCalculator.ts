// FRONTEND PRICE CALCULATION UTILITY FILE: This file provides a function to calculate the price of a cake based on its configuration in the React frontend.
// It is used by the CakeCustomizer and other components to show real-time pricing.
//
// Design Patterns: Uses the Utility function pattern for stateless calculation.
// Data Structures: Uses objects for price tables, arrays for add-ons, and numbers for calculations.
// Security: No direct security features; only performs calculations.

// Update CakeConfig type to match new context (with productType, etc.)
interface CakeConfig {
  productType: 'cake' | 'cookies' | 'muffins';
  size?: string;
  layers?: number;
  flavor?: string;
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

// Base prices for each cake size.
const BASE_PRICES = {
  '8': 50,
  '10': 75,
  '12': 100,
  'Bento': 40,
};
// Base prices for cookie/muffin boxes
const BOX_PRICES = {
  4: 20,
  6: 28,
  12: 50,
};

// Multiplier for each additional layer (beyond the first).
const LAYER_MULTIPLIER = 1.5;
// Prices for each add-on type.
const ADDON_PRICES = {
  fruit: 15,
  text: 10,
  filling: 20,
};

// Calculate the total price for a given configuration (cake, cookies, or muffins)
export const calculatePrice = (config: CakeConfig): number => {
  if (config.productType === 'cake') {
    // Cake pricing logic (as before)
    let total = BASE_PRICES[config.size as keyof typeof BASE_PRICES] || 0;
    if (config.layers && config.layers > 1) {
      total *= Math.pow(LAYER_MULTIPLIER, config.layers - 1);
    }
    if (config.addons) {
      config.addons.forEach(addon => {
        total += ADDON_PRICES[addon as keyof typeof ADDON_PRICES] || 0;
      });
    }
    return Math.round(total);
  } else if (config.productType === 'cookies' || config.productType === 'muffins') {
    // Cookies/muffins pricing: base price per box size, no add-ons, up to 2 flavors
    const boxPrice = config.boxSize ? BOX_PRICES[config.boxSize] : 0;
    return boxPrice;
  }
  return 0;
}; 