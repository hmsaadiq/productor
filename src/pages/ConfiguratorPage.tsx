// FRONTEND CAKE CONFIGURATOR PAGE: This file defines the ConfiguratorPage component for the React frontend.
// It provides the main UI for customizing a cake, showing a summary, and handling payment and authentication.
//
// Design Patterns: Uses the React Component pattern, Context pattern for global state, modal/dialog pattern, and conditional rendering for payment/auth.
// Data Structures: Uses React state (useState), context objects, and props for component communication.
// Security: Requires authentication for payment, disables payment if config is incomplete, and handles errors securely.

// Import React and useState for component logic and state management.
import React, { useState } from 'react';
// Import useNavigate from React Router for programmatic navigation.
import { useNavigate } from 'react-router-dom';
// Import MUI components for enhanced configurator UI
import {
  Box,
  Container,
  Paper,
  Button,
  Stack,
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import {
  QrCode,
  ArrowForward,
  Login,
  CheckCircle,
  ShoppingCart,
} from '@mui/icons-material';
// Import useConfig hook to access global state (user, config).
import { useConfig } from '../context/ConfigContext';
// Import useCart hook to add items to cart
import { useCart } from '../context/CartContext';
// Import CakeCustomizer for cake options UI.
import CakeCustomizer from '../components/CakeCustomizer';
// Import PriceSummary for displaying current config and price.
import PriceSummary from '../components/PriceSummary';
// Import LoginModal for authentication.
import LoginModal from '../components/LoginModal';
// Import QRCodeModal for displaying QR code of config.
import QRCodeModal from '../components/QRCodeModal';

// ConfiguratorPage component provides the main cake customization and order flow - Updated: Enhanced with MUI design.
export default function ConfiguratorPage() {
  // Get navigate function for routing.
  const navigate = useNavigate();
  // Get config and user from context.
  const { config, user, resetConfig } = useConfig();
  // Get cart functions from context
  const { addToCart } = useCart();
  // Local state for login modal visibility.
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // Local state for QR code modal visibility.
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  // Local state for add to cart loading
  const [addingToCart, setAddingToCart] = useState(false);

  // Boolean for whether the user can proceed (must select required fields based on product)
  const canProceed = (() => {
    if (config.productType === 'cake') {
      return config.size && config.flavor && config.shape;
    } else if (config.productType === 'cookies' || config.productType === 'muffins') {
      return config.boxSize && config.boxFlavors && config.boxFlavors.length > 0;
    }
    return false;
  })();

  // Handle "Add to Cart" button click - NEW FLOW: Add to cart instead of direct checkout
  const handleAddToCart = async () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    
    setAddingToCart(true);
    try {
      await addToCart({
        productType: config.productType,
        customization: config,
        quantity: 1,
        unitPrice: config.price,
      });
      // Reset the configuration after adding to cart
      resetConfig();
      // Navigate to cart page
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  // Render the configurator UI - Updated: Enhanced with MUI layout and components.
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 4 }}>
      <Container maxWidth="xl">
        {/* Page Header - New: Added page title and breadcrumb */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Customize Your Order
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Design your perfect cake with our easy-to-use configurator
          </Typography>
        </Box>

        {/* Main Layout - Updated: Enhanced split layout with MUI */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            gap: 4,
            alignItems: 'flex-start',
          }}
        >
          {/* Left Column - Customizer - Updated: Enhanced with Paper wrapper */}
          <Box sx={{ flex: 2, minWidth: 0 }}>
            <Paper
              elevation={2}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <CakeCustomizer />
            </Paper>
          </Box>

          {/* Right Column - Summary and Actions - Updated: Enhanced sticky sidebar */}
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Box
              sx={{
                position: { lg: 'sticky' },
                top: { lg: 32 },
              }}
            >
              {/* Price Summary - Updated: Enhanced wrapper */}
              <Paper
                elevation={2}
                sx={{
                  borderRadius: 3,
                  mb: 3,
                  overflow: 'hidden',
                }}
              >
                <PriceSummary />
              </Paper>

              {/* Action Buttons - Updated: Enhanced with MUI styling */}
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Ready to Order?
                </Typography>
                
                {/* Configuration Status - New: Added status indicator */}
                <Box sx={{ mb: 3 }}>
                  {canProceed ? (
                    <Chip
                      icon={<CheckCircle />}
                      label="Configuration Complete"
                      color="success"
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    <Chip
                      label="Please complete your selection"
                      color="warning"
                      variant="outlined"
                      size="small"
                    />
                  )}
                </Box>

                <Stack spacing={2}>
                  {/* QR Code Button - Updated: Enhanced with MUI styling */}
                  <Button
                    variant="outlined"
                    startIcon={<QrCode />}
                    onClick={() => setIsQRModalOpen(true)}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      py: 1.5,
                    }}
                    fullWidth
                  >
                    Generate QR Code
                  </Button>

                  <Divider sx={{ my: 1 }} />

                  {/* Add to Cart Button - NEW FLOW: Primary action */}
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingCart />}
                    onClick={handleAddToCart}
                    disabled={!canProceed || addingToCart}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                    }}
                    fullWidth
                  >
                    {addingToCart ? 'Adding to Cart...' : user ? 'Add to Cart' : 'Login to Add to Cart'}
                  </Button>

                  {/* Help Text - New: Added helpful guidance */}
                  {!canProceed && (
                    <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
                      {config.productType === 'cake'
                        ? 'Please select size, flavor, and shape to continue'
                        : 'Please select box size and flavors to continue'
                      }
                    </Typography>
                  )}
                </Stack>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Login modal for authentication */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* QR code modal for displaying config as QR */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        mode="display"
      />
    </Box>
  );
} 