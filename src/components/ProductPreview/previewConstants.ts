// Color maps and size scales for product preview renderers.

// Cake layer fill colors by flavor
export const CAKE_FLAVOR_COLORS: Record<string, string> = {
  vanilla: '#F5E6CA',
  chocolate: '#5C3A1E',
  strawberry: '#F4A0B3',
  'red velvet': '#8B1A1A',
};

// Filling stripe colors (lighter/contrasting variant of flavor)
export const CAKE_FILLING_COLORS: Record<string, string> = {
  vanilla: '#FFF3E0',
  chocolate: '#8D6E63',
  strawberry: '#F8C8D8',
  'red velvet': '#C62828',
};

// Cake size to scale factor
export const CAKE_SIZE_SCALES: Record<string, number> = {
  Bento: 0.6,
  '8': 0.75,
  '10': 0.9,
  '12': 1.0,
};

// Fruit decoration colors (fixed positions on top of cake)
export const FRUIT_COLORS = ['#E53935', '#FF9800', '#4CAF50', '#F44336', '#8BC34A'];

// Cookie/muffin flavor colors
export const BOX_ITEM_COLORS: Record<string, string> = {
  'chocolate chip': '#D2A86E',
  'red velvet': '#8B1A1A',
  vanilla: '#F5E6CA',
  oatmeal: '#C4A57A',
  'peanut butter': '#C68D3E',
};
