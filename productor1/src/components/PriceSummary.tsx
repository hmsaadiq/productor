import React from 'react';
import { useConfig } from '../context/ConfigContext';

export default function PriceSummary() {
  const { config } = useConfig();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Order Summary
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Size</span>
          <span className="font-medium">{config.size}"</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Layers</span>
          <span className="font-medium">{config.layers}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Flavor</span>
          <span className="font-medium capitalize">{config.flavor}</span>
        </div>

        {config.addons.length > 0 && (
          <div>
            <span className="text-gray-600">Add-ons</span>
            <ul className="mt-1 space-y-1">
              {config.addons.map(addon => (
                <li key={addon} className="flex justify-between">
                  <span className="text-gray-500 capitalize">{addon}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {config.text && (
          <div className="flex justify-between">
            <span className="text-gray-600">Text</span>
            <span className="font-medium">{config.text}</span>
          </div>
        )}

        <div className="border-t pt-4">
          <div className="flex justify-between">
            <span className="text-lg font-medium">Total</span>
            <span className="text-lg font-medium text-primary-600">
              {formatPrice(config.price)}
            </span>
          </div>
        </div>
      </div>

      {/* Placeholder for cake preview */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
        <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-gray-500 text-sm">
            {config.size}" {config.flavor}
          </span>
        </div>
      </div>
    </div>
  );
} 