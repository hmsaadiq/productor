import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  Alert,
  Chip,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  CheckCircle,
  History,
  Cake,
} from '@mui/icons-material';
import { useConfig } from '../context/ConfigContext';
import { supabase } from '../utils/supabase';

// Stepper steps
const steps = ['Customize', 'Delivery Details', 'Payment', 'Confirmation'];

// ConfirmationPage component displays order confirmation and details - Updated: Enhanced with MUI design.
export default function ConfirmationPage() {
  // Get navigate function for routing.
  const navigate = useNavigate();
  const location = useLocation();
  const { user, resetConfig } = useConfig();
  const orderId = (location.state as any)?.orderId;

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Send branded confirmation email once when order id is available
  useEffect(() => {
    if (!orderId || !user) return;
    const sendEmail = async () => {
      const { data: order } = await supabase
        .from('orders')
        .select('items, total_price, shipping_address')
        .eq('id', orderId)
        .single();
      if (!order) return;
      const sa = order.shipping_address || {};
      await supabase.functions.invoke('send-order-confirmation', {
        body: {
          orderId,
          email: sa.email || user.email,
          name: sa.name || user.user_metadata?.full_name || '',
          items: order.items,
          total: order.total_price,
          address: sa.address,
          state: sa.state,
          deliveryDate: sa.deliveryDate,
          timeSlot: sa.timeSlot,
          instructions: sa.instructions,
        },
      });
    };
    sendEmail();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // Handle "Order Another Cake" button click.
  const handleContinueShopping = () => {
    resetConfig(); // Reset config to defaults.
    navigate('/customize'); // Go to configurator page.
  };

  if (!user) {
    return null;
  }

  // Render the confirmation UI - Updated: Enhanced with MUI components and better layout.
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
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
          {orderId && (
            <Chip
              label={`Order #${orderId}`}
              color="success"
              sx={{ fontSize: '1.1rem', px: 2, py: 1, mb: 1, fontWeight: 600 }}
            />
          )}
          <Chip
            label="Order Completed Successfully"
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
                        color: 'success.contrastText',
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
          {/* Order Success Message */}
          <Box sx={{ flex: 2 }}>
            <Card elevation={2} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  Your Order Has Been Placed!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Thank you for your order. We'll start preparing your items right away.
                </Typography>
                <Alert severity="success" sx={{ borderRadius: 2 }}>
                  <Typography variant="body2">
                    You'll receive an email confirmation with your order details shortly.
                  </Typography>
                </Alert>
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
                  Order More Items
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
            </Card>
          </Box>
        </Box>
      </Container>

      {/* QR code modal for displaying order as QR */}
      {/* <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        mode="display"
      /> */}
    </Box>
  );
} 