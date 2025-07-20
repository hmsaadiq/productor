// FRONTEND QR CODE MODAL COMPONENT: This file defines the QRCodeModal component for the React frontend.
// It displays a modal dialog for showing or scanning a QR code representing the current cake configuration.
//
// Design Patterns: Uses the Modal/Dialog pattern (via Headless UI), Context pattern for global state, and conditional rendering for display/scan modes.
// Data Structures: Uses context objects, state for scan results, and objects for QR data.
// Security: No direct security features; only displays or encodes configuration data.

// Import React and useState for component logic and state management.
import React, { useState } from 'react';
// Import Dialog from Headless UI for accessible modal dialogs.
import { Dialog } from '@headlessui/react';
// Import QRCodeSVG from qrcode.react for generating QR codes.
import { QRCodeSVG } from 'qrcode.react';
// Import useConfig hook to access current cake configuration from context.
import { useConfig } from '../context/ConfigContext';

// Define the props for the QRCodeModal component.
interface QRCodeModalProps {
  isOpen: boolean; // Whether the modal is open.
  onClose: () => void; // Function to close the modal.
  mode: 'display' | 'scan'; // Whether to display or scan a QR code.
}

// QRCodeModal component displays a modal for showing or scanning a QR code.
export default function QRCodeModal({ isOpen, onClose, mode }: QRCodeModalProps) {
  // Get current cake configuration from context.
  const { config } = useConfig();
  // Local state for scan result (not implemented in this version).
  const [scanResult, setScanResult] = useState<string>('');

  // Prepare QR data by combining config with a timestamp.
  const qrData = {
    ...config,
    timestamp: new Date().toISOString(),
  };

  // Handle QR code download as PNG image.
  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    const svg = document.querySelector('svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'cake-config.png';
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  // Render the modal UI.
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-lg max-w-sm w-full mx-4 p-6">
          <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
            {mode === 'display' ? 'Your Cake Configuration' : 'Scan QR Code'}
          </Dialog.Title>

          {mode === 'display' ? (
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                <QRCodeSVG value={JSON.stringify(qrData)} size={200} />
              </div>
              <button
                onClick={handleDownload}
                className="btn btn-primary"
              >
                Download QR Code
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Camera access is required to scan QR codes
              </p>
              {/* Add QR scanner implementation here */}
            </div>
          )}

          <button
            onClick={onClose}
            className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </Dialog>
  );
} 