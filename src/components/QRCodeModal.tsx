// FRONTEND QR CODE MODAL COMPONENT: This file defines the QRCodeModal component for the React frontend.
// It displays a modal dialog for showing or scanning a QR code representing the current cake configuration.
//
// Design Patterns: Uses the Modal/Dialog pattern (via MUI Dialog), Context pattern for global state, and conditional rendering for display/scan modes.
// Data Structures: Uses context objects, state for scan results, and objects for QR data.
// Security: No direct security features; only displays or encodes configuration data.

// Import React for component creation.
import React from 'react';
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
} from '@mui/icons-material';
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

// QRCodeModal component displays a modal for showing or scanning a QR code - Updated: Enhanced with MUI styling and better UX.
export default function QRCodeModal({ isOpen, onClose, mode }: QRCodeModalProps) {
  // Get current cake configuration from context.
  const { config } = useConfig();

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
        downloadLink.download = 'productor1-cake-config.png';
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
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
          text: 'Check out my custom cake design from Productor1!',
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
              <QRCodeSVG 
                value={JSON.stringify(qrData)} 
                size={220}
                bgColor="#ffffff"
                fgColor="#1b0d11"
                level="M"
                includeMargin={true}
              />
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

            {/* Configuration Summary - New: Added quick summary */}
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="subtitle2" gutterBottom>
                Configuration Summary:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {config.productType === 'cake' 
                  ? `${config.size}" ${config.shape} ${config.flavor} cake`
                  : `Box of ${config.boxSize} ${config.productType}`
                }
                {config.text && ` • "${config.text}"`}
              </Typography>
            </Box>
          </Box>
        ) : (
          /* Scanner Mode - Updated: Enhanced scanner placeholder */
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CameraAlt sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            
            <Alert severity="info" sx={{ mb: 3 }}>
              Camera access is required to scan QR codes
            </Alert>

            <Typography variant="body1" color="text.secondary" gutterBottom>
              QR Code Scanner
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Point your camera at a Productor1 QR code to load a cake configuration.
            </Typography>

            {/* Scanner Implementation Placeholder - New: Better placeholder */}
            <Paper 
              variant="outlined" 
              sx={{ 
                mt: 3, 
                p: 4, 
                backgroundColor: 'grey.50',
                borderStyle: 'dashed'
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Scanner implementation coming soon...
              </Typography>
            </Paper>
          </Box>
        )}
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