// FRONTEND PRICE SUMMARY COMPONENT: This file defines the PriceSummary component for the React frontend.
// It displays a summary of the current cake configuration and the total price.
//
// Design Patterns: Uses the React Component pattern, Context pattern for global state, and presentational component pattern.
// Data Structures: Uses context objects, arrays for add-ons, and formatting utilities.
// Security: No direct security features; only displays data from context.

// Import React for component creation.
import React from 'react';
// Import useConfig hook to access current cake configuration from context.
import { useConfig } from '../context/ConfigContext';

// PriceSummary component displays the current cake configuration and price.
export default function PriceSummary() {
  // Get current config from context.
  const { config } = useConfig();

  // Helper function to format price as NGN currency.
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      currencyDisplay: 'narrowSymbol',
    }).format(price);
  };

  // Render the summary UI.
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Order Summary
      </h2>

      <div className="space-y-4">
        {/* Product Type */}
        <div className="flex justify-between">
          <span className="text-gray-600">Product</span>
          <span className="font-medium capitalize">{config.productType}</span>
        </div>

        {/* Cake Options */}
        {config.productType === 'cake' && (
          <>
            <div className="flex justify-between">
              <span className="text-gray-600">Shape</span>
              <span className="font-medium capitalize">{config.shape}</span>
            </div>
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
            {/* Show add-ons if any are selected */}
            {config.addons && config.addons.length > 0 && (
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
            {/* Show custom text if provided */}
            {config.text && (
              <div className="flex justify-between">
                <span className="text-gray-600">Text</span>
                <span className="font-medium">{config.text}</span>
              </div>
            )}
          </>
        )}

        {/* Cookies/Muffins Options */}
        {(config.productType === 'cookies' || config.productType === 'muffins') && (
          <>
            <div className="flex justify-between">
              <span className="text-gray-600">Box Size</span>
              <span className="font-medium">{config.boxSize ? `Box of ${config.boxSize}` : '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Flavors</span>
              <span className="font-medium capitalize">
                {config.boxFlavors && config.boxFlavors.length > 0
                  ? config.boxFlavors.join(', ')
                  : 'No flavors selected'}
              </span>
            </div>
          </>
        )}

        {/* Delivery Details (if present) */}
        {config.deliveryDetails && config.deliveryDetails.name && (
          <>
            <div className="border-t pt-4">
              <span className="text-gray-600 font-bold">Delivery Details</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Name</span>
              <span className="font-medium">{config.deliveryDetails.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Address</span>
              <span className="font-medium">{config.deliveryDetails.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone</span>
              <span className="font-medium">{config.deliveryDetails.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">State</span>
              <span className="font-medium">{config.deliveryDetails.state}</span>
            </div>
          </>
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

      {/* Placeholder for cake/box preview */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
        <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-gray-500 text-sm">
            {config.productType === 'cake'
              ? `${config.size}" ${config.flavor}`
              : config.productType === 'cookies'
              ? `Cookies: ${config.boxSize || ''}`
              : config.productType === 'muffins'
              ? `Muffins: ${config.boxSize || ''}`
              : ''}
          </span>
        </div>
      </div>
    </div>
  );
} 