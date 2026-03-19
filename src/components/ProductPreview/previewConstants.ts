// Color maps and size scales for product preview renderers.

// Cake layer fill colors by flavor
export const CAKE_FLAVOR_COLORS: Record<string, string> = {
  vanilla: '#F5E6CA',
  chocolate: '#5C3A1E',
  'red velvet': '#8B1A1A',
  biscoff: '#C8860A',
  carrot: '#E8901A',
  lemon: '#F0E04A',
  coconut: '#EFF7EE',
  mocha: '#7B4F2E',
  confetti: '#F472B6',
  'lemon and blueberry': '#9B59B6',
  // legacy
  strawberry: '#F4A0B3',
};

// Text colors that contrast against each layer fill
export const CAKE_FLAVOR_TEXT_COLORS: Record<string, string> = {
  vanilla: '#8B6914',
  chocolate: '#F5E6CA',
  'red velvet': '#F5E6CA',
  biscoff: '#FFF8EE',
  carrot: '#FFF8EE',
  lemon: '#5A5200',
  coconut: '#3A7A30',
  mocha: '#F5E6CA',
  confetti: '#7A1048',
  'lemon and blueberry': '#F0E8FF',
  strawberry: '#7A1048',
};

// Filling stripe colors keyed by filling name
export const FILLING_COLORS: Record<string, string> = {
  caramel: '#D4A017',
  'lemon curd': '#F7E04A',
  'fresh strawberries': '#E84C6A',
  'fresh blueberries': '#3B2A8C',
  nutella: '#6B3A1F',
  'strawberry puree': '#D63B5F',
  'dulce de leche': '#C9832F',
  'cream cheese': '#FDEBD0',
  'biscoff filling': '#B87333',
};

// Cake size to scale factor
export const CAKE_SIZE_SCALES: Record<string, number> = {
  '6': 0.65,
  '8': 0.75,
  '10': 0.9,
  '12': 1.0,
  Bento: 0.6,
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
