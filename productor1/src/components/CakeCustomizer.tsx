import React, { useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';
import { calculatePrice } from '../utils/priceCalculator';

const SIZES = ['8', '10', '12', 'Bento'];
const FLAVORS = ['vanilla', 'chocolate', 'strawberry', 'red velvet'];
const ADDONS = ['fruit', 'text', 'filling'];

export default function CakeCustomizer() {
  const { config, setConfig } = useConfig();

  useEffect(() => {
    const newPrice = calculatePrice(config);
    setConfig({ ...config, price: newPrice });
  }, [config.size, config.layers, config.flavor, config.addons]);

  const handleSizeChange = (size: string) => {
    // If switching to Bento size, reset layers to 1
    if (size === 'Bento' && config.layers > 1) {
      setConfig({ ...config, size, layers: 1 });
    } else {
      setConfig({ ...config, size });
    }
  };

  const handleLayersChange = (layers: number) => {
    // Prevent multiple layers for Bento size
    if (config.size === 'Bento' && layers > 1) {
      return;
    }
    setConfig({ ...config, layers });
  };

  const handleFlavorChange = (flavor: string) => {
    setConfig({ ...config, flavor });
  };

  const handleAddonChange = (addon: string) => {
    const newAddons = config.addons.includes(addon)
      ? config.addons.filter(a => a !== addon)
      : [...config.addons, addon];
    setConfig({ ...config, addons: newAddons });
  };

  const handleTextChange = (text: string) => {
    if (text.length <= 40) {
      setConfig({ ...config, text });
    }
  };

  const isBentoSize = config.size === 'Bento';

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        {/* Size Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Size
          </label>
          <div className="grid grid-cols-4 gap-4">
            {SIZES.map(size => (
              <button
                key={size}
                onClick={() => handleSizeChange(size)}
                className={`btn ${
                  config.size === size ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                {size}"
              </button>
            ))}
          </div>
        </div>

        {/* Layers Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Layers
          </label>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(layer => (
              <button
                key={layer}
                onClick={() => handleLayersChange(layer)}
                className={`btn ${
                  config.layers === layer ? 'btn-primary' : 'btn-secondary'
                } ${isBentoSize && layer > 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isBentoSize && layer > 1}
              >
                {layer} Layer{layer > 1 ? 's' : ''}
              </button>
            ))}
          </div>
          {isBentoSize && (
            <p className="mt-2 text-sm text-gray-500">
              Bento cakes are only available in single layer
            </p>
          )}
        </div>

        {/* Flavor Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Flavor
          </label>
          <div className="grid grid-cols-2 gap-4">
            {FLAVORS.map(flavor => (
              <button
                key={flavor}
                onClick={() => handleFlavorChange(flavor)}
                className={`btn ${
                  config.flavor === flavor ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                {flavor.charAt(0).toUpperCase() + flavor.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Add-ons Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add-ons
          </label>
          <div className="space-y-2">
            {ADDONS.map(addon => (
              <label key={addon} className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.addons.includes(addon)}
                  onChange={() => handleAddonChange(addon)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">
                  {addon.charAt(0).toUpperCase() + addon.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Text Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Writing on Cake
          </label>
          <input
            type="text"
            value={config.text}
            onChange={(e) => handleTextChange(e.target.value)}
            maxLength={40}
            placeholder="Enter text (max 40 characters)"
            className="input"
          />
          <p className="mt-1 text-sm text-gray-500">
            {40 - config.text.length} characters remaining
          </p>
        </div>
      </div>
    </div>
  );
} 