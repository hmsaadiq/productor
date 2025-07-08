interface CakeConfig {
  size: string;
  layers: number;
  flavor: string;
  addons: string[];
  text: string;
}

const BASE_PRICES = {
  '8': 50,
  '10': 75,
  '12': 100,
  'Bento': 40,
};

const LAYER_MULTIPLIER = 1.5;
const ADDON_PRICES = {
  fruit: 15,
  text: 10,
  filling: 20,
};

export const calculatePrice = (config: CakeConfig): number => {
  let total = BASE_PRICES[config.size as keyof typeof BASE_PRICES] || 0;
  
  // Apply layer multiplier
  if (config.layers > 1) {
    total *= Math.pow(LAYER_MULTIPLIER, config.layers - 1);
  }
  
  // Add addon prices
  config.addons.forEach(addon => {
    total += ADDON_PRICES[addon as keyof typeof ADDON_PRICES] || 0;
  });
  
  return Math.round(total);
}; 