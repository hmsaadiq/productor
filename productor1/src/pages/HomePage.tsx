// FRONTEND LANDING PAGE COMPONENT: This file defines the HomePage component for the React frontend.
// It serves as the landing page, introducing the app and providing navigation to the configurator and QR code scanner.
//
// Design Patterns: Uses the React Component pattern, presentational component pattern, and modal/dialog pattern for QR code.
// Data Structures: Uses React state (useState) for modal control.
// Security: No direct security features; only displays static and navigational content.

// Import React and useState for component logic and state management.
import React, { useState } from 'react';
// Import useNavigate from React Router for programmatic navigation.
import { useNavigate } from 'react-router-dom';
// Import QRCodeModal for displaying/scanning QR codes.
import QRCodeModal from '../components/QRCodeModal';

// HomePage component displays the landing UI and navigation options.
export default function HomePage() {
  // Get navigate function for routing.
  const navigate = useNavigate();
  // Local state to control QR code modal visibility.
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Customize Your Perfect Cake
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Design your dream cake with our easy-to-use configurator. Choose size, flavor, layers, and more!
          </p>
        </div>

        <div className="mt-10 flex justify-center space-x-4">
          {/* Button to navigate to the cake configurator */}
          <button
            onClick={() => navigate('/customize')}
            className="btn btn-primary px-8 py-3 text-lg"
          >
            Start Customizing
          </button>
          {/* Button to open QR code scanner modal */}
          <button
            onClick={() => setIsQRModalOpen(true)}
            className="btn btn-secondary px-8 py-3 text-lg"
          >
            Scan QR Code
          </button>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900">Multiple Sizes</h3>
              <p className="mt-2 text-gray-500">
                Choose from various sizes including our special Bento cakes
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900">Custom Text</h3>
              <p className="mt-2 text-gray-500">
                Add your personal message to make it special
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900">Premium Add-ons</h3>
              <p className="mt-2 text-gray-500">
                Enhance your cake with fruits, fillings, and more
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* QR code modal for scanning (mode="scan") */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        mode="scan"
      />
    </div>
  );
} 