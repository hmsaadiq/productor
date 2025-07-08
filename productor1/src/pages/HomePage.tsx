import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCodeModal from '../components/QRCodeModal';

export default function HomePage() {
  const navigate = useNavigate();
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
          <button
            onClick={() => navigate('/customize')}
            className="btn btn-primary px-8 py-3 text-lg"
          >
            Start Customizing
          </button>
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

      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        mode="scan"
      />
    </div>
  );
} 