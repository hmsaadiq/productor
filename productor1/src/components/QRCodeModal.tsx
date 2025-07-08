import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { QRCodeSVG } from 'qrcode.react';
import { useConfig } from '../context/ConfigContext';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'display' | 'scan';
}

export default function QRCodeModal({ isOpen, onClose, mode }: QRCodeModalProps) {
  const { config } = useConfig();
  const [scanResult, setScanResult] = useState<string>('');

  const qrData = {
    ...config,
    timestamp: new Date().toISOString(),
  };

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