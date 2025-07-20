// FRONTEND CAKE CUSTOMIZATION COMPONENT: This file defines the CakeCustomizer component for the React frontend.
// It provides the UI for users to select cake size, layers, flavor, add-ons, and custom text.
//
// Design Patterns: Uses the React Component pattern, Context pattern for global state, and controlled component pattern for form inputs.
// Data Structures: Uses arrays for options, React state/context, and objects for configuration.
// Security: Limits input length for text, disables invalid options, and uses controlled components to prevent unsafe input.

// Import React and useEffect for component logic and side effects.
import React, { useEffect } from 'react';
// Import useConfig hook to access and update global cake configuration state.
import { useConfig } from '../context/ConfigContext';
// Import calculatePrice utility to compute the price based on configuration.
import { calculatePrice } from '../utils/priceCalculator';

// Define available cake sizes as an array of strings.
const SIZES = ['8', '10', '12', 'Bento'];
// Define available cake flavors as an array of strings.
const FLAVORS = ['vanilla', 'chocolate', 'strawberry', 'red velvet'];
// Define available add-ons as an array of strings.
const ADDONS = ['fruit', 'text', 'filling'];
// Define available product types
const PRODUCT_TYPES = ['cake', 'cookies', 'muffins'] as const;
// Define available shapes for cakes
const SHAPES = ['circle', 'heart'] as const;
// Define available box sizes for cookies/muffins
const BOX_SIZES = [4, 6, 12] as const;
// Define available flavors for cookies/muffins
const COOKIE_MUFFIN_FLAVORS = ['chocolate chip', 'red velvet', 'vanilla', 'oatmeal', 'peanut butter'];

// CakeCustomizer component provides the UI for customizing a cake order.
export default function CakeCustomizer() {
  // Get current config and updater from context.
  const { config, setConfig } = useConfig();

  // useEffect: Recalculate price whenever relevant config fields change.
  useEffect(() => {
    const newPrice = calculatePrice(config); // Calculate new price.
    setConfig({ ...config, price: newPrice }); // Update config with new price.
  }, [config.size, config.layers, config.flavor, config.addons]);

  // Handle size selection. If switching to Bento, force layers to 1.
  const handleSizeChange = (size: string) => {
    if (size === 'Bento' && config.layers > 1) {
      setConfig({ ...config, size, layers: 1 });
    } else {
      setConfig({ ...config, size });
    }
  };

  // Handle layer selection. Prevent multiple layers for Bento size.
  const handleLayersChange = (layers: number) => {
    if (config.size === 'Bento' && layers > 1) {
      return;
    }
    setConfig({ ...config, layers });
  };

  // Handle flavor selection.
  const handleFlavorChange = (flavor: string) => {
    setConfig({ ...config, flavor });
  };

  // Handle add-on selection (toggle in array).
  const handleAddonChange = (addon: string) => {
    const newAddons = config.addons.includes(addon)
      ? config.addons.filter(a => a !== addon)
      : [...config.addons, addon];
    setConfig({ ...config, addons: newAddons });
  };

  // Handle custom text input, limit to 40 characters.
  const handleTextChange = (text: string) => {
    if (text.length <= 40) {
      setConfig({ ...config, text });
    }
  };

  // Handle product type selection
  const handleProductTypeChange = (type: 'cake' | 'cookies' | 'muffins') => {
    // Reset config fields not relevant to the selected product
    if (type === 'cake') {
      setConfig({
        ...config,
        productType: type,
        size: '',
        layers: 1,
        flavor: '',
        addons: [],
        text: '',
        shape: 'circle',
        boxSize: undefined,
        boxFlavors: [],
        price: 0,
      });
    } else {
      setConfig({
        ...config,
        productType: type,
        size: undefined,
        layers: undefined,
        flavor: undefined,
        addons: [],
        text: '',
        shape: undefined,
        boxSize: undefined,
        boxFlavors: [],
        price: 0,
      });
    }
  };

  // Add shape selection for cakes
  const handleShapeChange = (shape: 'circle' | 'heart') => {
    setConfig({ ...config, shape });
  };

  // Box size selection for cookies/muffins
  const handleBoxSizeChange = (boxSize: 4 | 6 | 12) => {
    setConfig({ ...config, boxSize, boxFlavors: [] }); // Reset flavors on box size change
  };

  // Box flavor selection for cookies/muffins (max 2 flavors)
  const handleBoxFlavorChange = (flavor: string) => {
    const current = config.boxFlavors || [];
    if (current.includes(flavor)) {
      setConfig({ ...config, boxFlavors: current.filter(f => f !== flavor) });
    } else if (current.length < 2) {
      setConfig({ ...config, boxFlavors: [...current, flavor] });
    }
  };

  // Boolean for whether Bento size is selected.
  const isBentoSize = config.size === 'Bento';

  // Render the customization UI.
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        {/* Product Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product
          </label>
          <div className="grid grid-cols-3 gap-4">
            {PRODUCT_TYPES.map(type => (
              <button
                key={type}
                onClick={() => handleProductTypeChange(type)}
                className={`btn ${config.productType === type ? 'btn-primary' : 'btn-secondary'}`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Cake Options */}
        {config.productType === 'cake' && (
          <>
            {/* Shape Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shape
              </label>
              <div className="grid grid-cols-2 gap-4">
                {SHAPES.map(shape => (
                  <button
                    key={shape}
                    onClick={() => handleShapeChange(shape)}
                    className={`btn ${config.shape === shape ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {shape.charAt(0).toUpperCase() + shape.slice(1)}
                  </button>
                ))}
              </div>
            </div>
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
                    className={`btn ${config.size === size ? 'btn-primary' : 'btn-secondary'}`}
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
                    className={`btn ${config.layers === layer ? 'btn-primary' : 'btn-secondary'} ${config.size === 'Bento' && layer > 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={config.size === 'Bento' && layer > 1}
                  >
                    {layer} Layer{layer > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
              {config.size === 'Bento' && (
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
                    className={`btn ${config.flavor === flavor ? 'btn-primary' : 'btn-secondary'}`}
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
                      checked={config.addons?.includes(addon) || false}
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
                value={config.text || ''}
                onChange={(e) => handleTextChange(e.target.value)}
                maxLength={40}
                placeholder="Enter text (max 40 characters)"
                className="input"
              />
              <p className="mt-1 text-sm text-gray-500">
                {40 - (config.text ? config.text.length : 0)} characters remaining
              </p>
            </div>
          </>
        )}

        {/* Cookies/Muffins Options */}
        {(config.productType === 'cookies' || config.productType === 'muffins') && (
          <>
            {/* Box Size Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Box Size
              </label>
              <div className="grid grid-cols-3 gap-4">
                {BOX_SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => handleBoxSizeChange(size)}
                    className={`btn ${config.boxSize === size ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    Box of {size}
                  </button>
                ))}
              </div>
            </div>
            {/* Flavor Selection (max 2) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flavors (Choose up to 2)
              </label>
              <div className="grid grid-cols-2 gap-4">
                {COOKIE_MUFFIN_FLAVORS.map(flavor => (
                  <button
                    key={flavor}
                    onClick={() => handleBoxFlavorChange(flavor)}
                    className={`btn ${config.boxFlavors?.includes(flavor) ? 'btn-primary' : 'btn-secondary'} ${config.boxFlavors && config.boxFlavors.length >= 2 && !config.boxFlavors.includes(flavor) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={config.boxFlavors && config.boxFlavors.length >= 2 && !config.boxFlavors.includes(flavor)}
                  >
                    {flavor.charAt(0).toUpperCase() + flavor.slice(1)}
                  </button>
                ))}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {2 - (config.boxFlavors ? config.boxFlavors.length : 0)} flavor(s) remaining
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 