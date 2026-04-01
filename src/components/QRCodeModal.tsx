// FRONTEND QR CODE MODAL COMPONENT: This file defines the QRCodeModal component for the React frontend.
// It displays a modal dialog for showing or scanning a QR code representing the current cake configuration.
//
// Design Patterns: Uses the Modal/Dialog pattern (via MUI Dialog), Context pattern for global state, and conditional rendering for display/scan modes.
// Data Structures: Uses context objects, state for scan results, and objects for QR data.
// Security: No direct security features; only displays or encodes configuration data.

// Import React for component creation.
import React, { useRef, useState, useEffect } from 'react';
// Import MUI components for enhanced QR modal UI
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Paper,
  IconButton,
  Alert,
  Divider,
  Stack,
} from '@mui/material';
import {
  Close,
  QrCode,
  Download,
  CameraAlt,
  Share,
  ContentCopy,
  Upload,
} from '@mui/icons-material';
// Import QRCodeSVG from qrcode.react for generating QR codes.
import { QRCodeSVG } from 'qrcode.react';
// Import useConfig hook to access current cake configuration from context.
import { useConfig } from '../context/ConfigContext';
// Import useNavigate for redirecting after successful scan.
import { useNavigate } from 'react-router-dom';
// Import Html5Qrcode for camera-based QR scanning.
import { Html5Qrcode } from 'html5-qrcode';
// Import CheckCircle icon for success state.
import CheckCircle from '@mui/icons-material/CheckCircle';

// Define the props for the QRCodeModal component.
interface QRCodeModalProps {
  isOpen: boolean; // Whether the modal is open.
  onClose: () => void; // Function to close the modal.
  mode: 'display' | 'scan'; // Whether to display or scan a QR code.
}

// QRCodeModal component displays a modal for showing or scanning a QR code - Updated: Enhanced with MUI styling and better UX.
export default function QRCodeModal({ isOpen, onClose, mode }: QRCodeModalProps) {
  // Get current cake configuration and setter from context.
  const { config, setConfig } = useConfig();
  const navigate = useNavigate();

  // Scanner state.
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scannedConfig, setScannedConfig] = useState<any>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stop and clear scanner helper.
  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (_) {
        // Ignore errors on stop (e.g. scanner already stopped).
      }
      scannerRef.current = null;
    }
    setScanning(false);
  };

  // Cleanup scanner when modal closes or component unmounts.
  useEffect(() => {
    if (!isOpen) {
      stopScanner();
      setScanError(null);
      setScannedConfig(null);
    }
    return () => { stopScanner(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Start the html5-qrcode scanner.
  const handleStartScan = async () => {
    setScanError(null);
    setScannedConfig(null);
    setScanning(true);

    // Wait one tick so the #qr-reader div is mounted.
    await new Promise(r => setTimeout(r, 50));

    try {
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          // Success callback.
          try {
            const parsed = JSON.parse(decodedText);
            if (!parsed.productType) throw new Error('Not a valid Productor QR code.');
            const { timestamp, ...cakeConfig } = parsed;
            setScannedConfig(cakeConfig);
            stopScanner();
          } catch (e: any) {
            setScanError(e.message || 'Invalid QR code data.');
            stopScanner();
          }
        },
        () => { /* ignore per-frame decode failures */ },
      );
    } catch (e: any) {
      setScanError(e.message || 'Could not access camera.');
      setScanning(false);
      scannerRef.current = null;
    }
  };

  // Handle QR code scan from an uploaded image file.
  const handleUploadScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setScanError(null);
    setScannedConfig(null);
    try {
      const scanner = new Html5Qrcode('qr-upload-region');
      const decodedText = await scanner.scanFile(file, true);
      const parsed = JSON.parse(decodedText);
      if (!parsed.productType) throw new Error('Not a valid Productor QR code.');
      const { timestamp, ...cakeConfig } = parsed;
      setScannedConfig(cakeConfig);
    } catch (e: any) {
      setScanError(e.message || 'Could not read QR code from image.');
    }
  };

  // Load the scanned config and navigate to /customize.
  const handleLoadConfig = () => {
    if (scannedConfig) {
      setConfig(scannedConfig);
      onClose();
      navigate('/customize');
    }
  };

  // Prepare QR data by combining config with a timestamp.
  const qrData = {
    ...config,
    timestamp: new Date().toISOString(),
  };

  // Handle QR code download as PNG image.
  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    const svg = svgContainerRef.current?.querySelector('svg') ?? null;
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
        downloadLink.download = 'frosted-crusts-cake-config.png';
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
    }
  };

  // Handle copying QR data to clipboard - New: Added clipboard functionality
  const handleCopyData = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(qrData, null, 2));
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy QR data:', err);
    }
  };

  // Handle sharing QR code - New: Added share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Cake Configuration',
          text: 'Check out my custom cake design from Frosted Crusts!',
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  // Render the modal UI - Updated: Enhanced with MUI components and improved layout.
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        }
      }}
    >
      {/* Header Section - Updated: Enhanced with icon and close button */}
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {mode === 'display' ? (
            <QrCode sx={{ color: 'primary.main' }} />
          ) : (
            <CameraAlt sx={{ color: 'primary.main' }} />
          )}
          <Typography variant="h6" component="span">
            {mode === 'display' ? 'Your Cake Configuration' : 'Scan QR Code'}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: 'grey.500' }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {mode === 'display' ? (
          <Box sx={{ textAlign: 'center' }}>
            {/* QR Code Display - Updated: Enhanced with better styling */}
            <Paper 
              elevation={3}
              sx={{ 
                p: 3, 
                mb: 3, 
                display: 'inline-block',
                borderRadius: 2,
                backgroundColor: 'white'
              }}
            >
              <div ref={svgContainerRef}>
                <QRCodeSVG
                  value={JSON.stringify(qrData)}
                  size={220}
                  bgColor="#ffffff"
                  fgColor="#1b0d11"
                  level="M"
                  includeMargin={true}
                />
              </div>
            </Paper>

            {/* Description - New: Added helpful description */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              This QR code contains your complete cake configuration. 
              Share it with friends or save it for later!
            </Typography>

            {/* Action Buttons - Updated: Enhanced with MUI buttons and icons */}
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={handleDownload}
                sx={{ borderRadius: 2 }}
              >
                Download
              </Button>
              <Button
                variant="outlined"
                startIcon={<ContentCopy />}
                onClick={handleCopyData}
                sx={{ borderRadius: 2 }}
              >
                Copy Data
              </Button>
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <Button
                  variant="outlined"
                  startIcon={<Share />}
                  onClick={handleShare}
                  sx={{ borderRadius: 2 }}
                >
                  Share
                </Button>
              )}
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Load from QR image */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Load a different configuration</Typography>
              <Button
                variant="outlined"
                startIcon={<Upload />}
                onClick={() => fileInputRef.current?.click()}
                sx={{ borderRadius: 2 }}
              >
                Upload QR Image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleUploadScan}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Configuration Summary - New: Added quick summary */}
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="subtitle2" gutterBottom>
                Configuration Summary:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {config.productType === 'cake'
                  ? (
                    <>
                      <span>{config.size}" {config.shape} cake</span>
                      {(config.flavors || []).map((f, i) => (
                        <span key={i}> • Layer {i + 1}: {f}</span>
                      ))}
                      {config.filling && <span> • Filling: {config.filling}</span>}
                    </>
                  )
                  : `Box of ${config.boxSize} ${config.productType}`
                }
                {config.text && ` • "${config.text}"`}
              </Typography>
            </Box>
          </Box>
        ) : (
          /* Scanner Mode */
          <Box sx={{ textAlign: 'center', py: 2 }}>
            {/* Idle state */}
            {!scanning && !scannedConfig && !scanError && (
              <>
                <CameraAlt sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
                  Camera access is required to scan QR codes
                </Alert>
                <Typography variant="body1" gutterBottom>QR Code Scanner</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Point your camera at a Frosted Crusts QR code to load a cake configuration.
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button variant="contained" startIcon={<CameraAlt />} onClick={handleStartScan} sx={{ borderRadius: 2 }}>
                    Start Camera
                  </Button>
                  <Button variant="outlined" startIcon={<Upload />} onClick={() => fileInputRef.current?.click()} sx={{ borderRadius: 2 }}>
                    Upload Image
                  </Button>
                </Stack>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleUploadScan}
                />
              </>
            )}

            {/* Scanning state — #qr-reader must always be in the DOM while scanning */}
            {scanning && (
              <>
                <Box id="qr-reader" sx={{ width: '100%', mb: 2 }} />
                <Button variant="outlined" color="inherit" onClick={stopScanner} sx={{ borderRadius: 2 }}>
                  Cancel
                </Button>
              </>
            )}

            {/* Success state */}
            {scannedConfig && !scanning && (
              <>
                <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" color="success.main" gutterBottom>QR Code Scanned!</Typography>
                <Paper variant="outlined" sx={{ p: 2, mb: 3, textAlign: 'left', borderRadius: 2 }}>
                  <Typography variant="body2">
                    <strong>Type:</strong> {scannedConfig.productType}
                  </Typography>
                  {scannedConfig.size && (
                    <Typography variant="body2"><strong>Size:</strong> {scannedConfig.size}"</Typography>
                  )}
                  {scannedConfig.flavors?.length > 0 && (
                    scannedConfig.flavors.map((f: string, i: number) => (
                      <Typography key={i} variant="body2"><strong>Layer {i + 1}:</strong> {f}</Typography>
                    ))
                  )}
                </Paper>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button variant="contained" onClick={handleLoadConfig} sx={{ borderRadius: 2 }}>
                    Load Configuration
                  </Button>
                  <Button variant="outlined" onClick={() => { setScannedConfig(null); setScanError(null); }} sx={{ borderRadius: 2 }}>
                    Scan Again
                  </Button>
                </Stack>
              </>
            )}

            {/* Error state */}
            {scanError && !scanning && !scannedConfig && (
              <>
                <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>{scanError}</Alert>
                <Button variant="contained" onClick={() => { setScanError(null); }} sx={{ borderRadius: 2 }}>
                  Try Again
                </Button>
              </>
            )}
          </Box>
        )}
        {/* Hidden region required by Html5Qrcode.scanFile — never visible */}
        <div id="qr-upload-region" style={{ display: 'none' }} />
      </DialogContent>

      {/* Footer Actions - Updated: Enhanced with MUI DialogActions */}
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          color="inherit"
          sx={{ 
            textTransform: 'none',
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'grey.100',
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}