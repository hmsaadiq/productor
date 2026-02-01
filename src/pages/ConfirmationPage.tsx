// FRONTEND ORDER CONFIRMATION PAGE: This file defines the ConfirmationPage component for the React frontend.
// It displays the order confirmation, order details, and options to view QR code, order another cake, or view order history.
//
// Design Patterns: Uses the React Component pattern, Context pattern for global state, and modal/dialog pattern for QR code.
// Data Structures: Uses React state (useState), context objects, and props for component communication.
// Security: Redirects unauthenticated users, handles errors securely, and does not expose sensitive data.

// Import React, useEffect, useState, and useRef for component logic, side effects, state management, and refs.
import React, { useEffect, useState, useRef } from 'react';
// Import useNavigate from React Router for programmatic navigation.
import { useNavigate } from 'react-router-dom';
// Import MUI components for enhanced confirmation page UI
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Divider,
  Stack,
  Alert,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  CheckCircle,
  QrCode,
  ShoppingCart,
  History,
  LocalShipping,
  Cake,
  Receipt,
} from '@mui/icons-material';
// Import useConfig hook to access global state (user, config, resetConfig).
import { useConfig } from '../context/ConfigContext';
// Import createOrder utility to create a new order in the backend.
import { createOrder } from '../utils/orderService';
// Import QRCodeModal for displaying the order as a QR code.
import QRCodeModal from '../components/QRCodeModal';

// Stepper steps
const steps = ['Customize', 'Delivery Details', 'Payment', 'Confirmation'];

// ConfirmationPage component displays order confirmation and details - Updated: Enhanced with MUI design.
export default function ConfirmationPage() {
  // Get navigate function for routing.
  const navigate = useNavigate();
  // Get config, user, and resetConfig from context.
  const { config, user, resetConfig } = useConfig();
  // Local state for order ID after creation.
  const [orderId, setOrderId] = useState<number | null>(null);
  // Local state for error messages.
  const [error, setError] = useState<string | null>(null);
  // Local state for loading indicator.
  const [loading, setLoading] = useState(true);
  // Local state for QR code modal visibility.
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  // Ref to prevent duplicate order creation
  const orderCreated = useRef(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    if (orderId !== null || orderCreated.current) return;
    
    const createNewOrder = async () => {
      if (orderCreated.current) return;
      orderCreated.current = true;
      try {
        setLoading(true);
        const id = await createOrder(user, config);
        setOrderId(id);
        setError(null);
        
        // Email notification disabled for now
        // try {
        //   await fetch('https://fcnxfgvbemgdrrcbmeie.supabase.co/functions/v1/send-order-email', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ record: { id, config, status: 'pending', created_at: new Date().toISOString() } })
        //   });
        //   console.log('Email notification sent successfully');
        // } catch (emailError) {
        //   console.log('Email notification failed:', emailError);
        //   // Don't fail the order if email fails
        // }
      } catch (err) {
        orderCreated.current = false; // Reset on error
        console.error('Full error object:', err);
        setError(`Failed to create order: ${err instanceof Error ? err.message : 'Unknown error'}`);
        console.error('Error creating order:', err);
      } finally {
        setLoading(false);
      }
    };
    createNewOrder();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle "Order Another Cake" button click.
  const handleContinueShopping = () => {
    resetConfig(); // Reset config to defaults.
    navigate('/customize'); // Go to configurator page.
  };

  // Show loading UI while order is being created - Updated: Enhanced with MUI components.
  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="sm">
          <Paper
            elevation={2}
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 3,
            }}
          >
            <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Processing Your Order
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please wait while we confirm your order details...
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  // Show error UI if order creation failed - Updated: Enhanced with MUI components.
  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="sm">
          <Paper
            elevation={2}
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 3,
            }}
          >
            <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
              {error}
            </Alert>
            <Button
              variant="contained"
              onClick={() => navigate('/customize')}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 4,
                py: 1.5,
              }}
            >
              Try Again
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  // Render the confirmation UI - Updated: Enhanced with MUI components and better layout.
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 4 }}>
      <Container maxWidth="lg">
        {/* Success Header - Updated: Enhanced with MUI styling */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <CheckCircle
            sx={{
              fontSize: 80,
              color: 'success.main',
              mb: 2,
            }}
          />
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: 'success.main',
            }}
          >
            Order Confirmed!
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            Thank you for your order
          </Typography>
          <Chip
            label={`Order #${orderId?.toString().slice(-6)}`}
            color="primary"
            variant="outlined"
            sx={{ fontSize: '1rem', px: 2, py: 1 }}
          />
        </Box>

        {/* Progress Stepper - New: Added completion stepper */}
        <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
          <Stepper activeStep={3} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  StepIconComponent={() => (
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'success.main',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }}
                    >
                      <CheckCircle sx={{ fontSize: 20 }} />
                    </Box>
                  )}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Main Content - Updated: Enhanced layout */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
          }}
        >
          {/* Order Details - Updated: Enhanced with MUI Card */}
          <Box sx={{ flex: 2 }}>
            <Card elevation={2} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Receipt sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Order Details
                  </Typography>
                </Box>

                <Stack spacing={3}>
                  {/* Product Type */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                      Product
                    </Typography>
                    <Typography variant="body1" sx={{ textTransform: 'capitalize', fontWeight: 500 }}>
                      {config.productType}
                    </Typography>
                  </Box>

                  {/* Cake Options */}
                  {config.productType === 'cake' && (
                    <>
                      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                            Shape
                          </Typography>
                          <Typography variant="body1" sx={{ textTransform: 'capitalize', fontWeight: 500 }}>
                            {config.shape}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                            Size
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {config.size}"
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                            Layers
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {config.layers}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                          Flavor
                        </Typography>
                        <Typography variant="body1" sx={{ textTransform: 'capitalize', fontWeight: 500 }}>
                          {config.flavor}
                        </Typography>
                      </Box>

                      {config.addons && config.addons.length > 0 && (
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                            Add-ons
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                            {config.addons.map((addon) => (
                              <Chip
                                key={addon}
                                label={addon.charAt(0).toUpperCase() + addon.slice(1)}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Box>
                      )}

                      {config.text && (
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                            Message
                          </Typography>
                          <Typography variant="body1" sx={{ fontStyle: 'italic', fontWeight: 500 }}>
                            "{config.text}"
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}

                  {/* Cookies/Muffins Options */}
                  {(config.productType === 'cookies' || config.productType === 'muffins') && (
                    <>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                          Box Size
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {config.boxSize ? `Box of ${config.boxSize}` : '-'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                          Flavors
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                          {config.boxFlavors && config.boxFlavors.length > 0
                            ? config.boxFlavors.map((flavor) => (
                                <Chip
                                  key={flavor}
                                  label={flavor}
                                  size="small"
                                  variant="outlined"
                                />
                              ))
                            : <Typography variant="body1">-</Typography>
                          }
                        </Box>
                      </Box>
                    </>
                  )}

                  {/* Delivery Details */}
                  {config.deliveryDetails && config.deliveryDetails.name && (
                    <>
                      <Divider />
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <LocalShipping sx={{ color: 'primary.main', mr: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Delivery Details
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                            Name
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {config.deliveryDetails.name}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                            Address
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {config.deliveryDetails.address}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 4 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                              Phone
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {config.deliveryDetails.phone}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                              State
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {config.deliveryDetails.state}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </>
                  )}

                  <Divider />
                  
                  {/* Total */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Total
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', currencyDisplay: 'narrowSymbol' }).format(config.price)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* Action Buttons - Updated: Enhanced sidebar with actions */}
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Card elevation={2} sx={{ borderRadius: 3, p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                What's Next?
              </Typography>
              
              <Stack spacing={2}>
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
                  View QR Code
                </Button>
                
                <Button
                  variant="contained"
                  startIcon={<Cake />}
                  onClick={handleContinueShopping}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    py: 1.5,
                  }}
                  fullWidth
                >
                  Order Another Cake
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<History />}
                  onClick={() => navigate('/history')}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    py: 1.5,
                  }}
                  fullWidth
                >
                  View Order History
                </Button>
              </Stack>

              <Divider sx={{ my: 3 }} />
              
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                <Typography variant="body2">
                  You'll receive an email confirmation shortly with your order details.
                </Typography>
              </Alert>
            </Card>
          </Box>
        </Box>
      </Container>

      {/* QR code modal for displaying order as QR */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        mode="display"
      />
    </Box>
  );
} 