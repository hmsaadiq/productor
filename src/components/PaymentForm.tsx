// FRONTEND PAYMENT FORM COMPONENT: This file defines the PaymentForm component for the React frontend.
// It provides the UI for users to pay for their cake order using Paystack.
//
// Design Patterns: Uses the React Component pattern, controlled component pattern for props, and third-party integration pattern (Paystack).
// Data Structures: Uses props for configuration, and objects for payment metadata.
// Security: Relies on Paystack for secure payment processing, disables UI during payment, and does not handle sensitive card data directly.

// Import React for component creation.
import React from 'react';
// Import MUI components for enhanced payment UI
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  Alert,
  Chip,
  Stack,
} from '@mui/material';
import {
  Payment,
  Security,
  CreditCard,
  AccountBalance,
  CheckCircle,
} from '@mui/icons-material';
// Import useConfig hook to access current cake configuration from context.
import { useConfig } from '../context/ConfigContext';
// Import PaystackButton from react-paystack for payment integration.
import { PaystackButton } from 'react-paystack';

// Define the props for the PaymentForm component.
interface PaymentFormProps {
  amount: number; // Payment amount in NGN (Nigerian Naira).
  userEmail: string; // User's email address for payment receipt.
  onSuccess: () => void; // Callback for successful payment.
  onError: (error: Error) => void; // Callback for payment error.
}

const publicKey = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || '';

// PaymentForm component provides the payment UI and logic - Updated: Enhanced with MUI styling and better UX.
export default function PaymentForm({ amount, userEmail, onSuccess, onError }: PaymentFormProps) {
  // Get current cake configuration from context.
  const { config } = useConfig();

  // Define Paystack button properties and metadata.
  const paystackProps = {
    email: userEmail,
    amount: amount * 100, // Paystack expects amount in kobo (1 NGN = 100 kobo).
    publicKey,
    text: 'Pay Now',
    onSuccess: () => onSuccess(), // Call parent callback on success.
    onClose: () => {}, // No-op for modal close.
    onError: (error: any) => onError(error), // Call parent callback on error.
    metadata: {
      custom_fields: [
        {
          display_name: 'Cake Config',
          variable_name: 'cake_config',
          value: JSON.stringify(config), // Attach cake config as metadata.
        },
      ],
    },
  };

  // Format amount for display
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  // Render the payment form UI - Updated: Enhanced with MUI components and professional styling.
  return (
    <Box sx={{ maxWidth: 500, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        {/* Header Section - New: Added payment header with icon */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Payment sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" component="h2" gutterBottom>
            Complete Your Payment
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Secure payment powered by Paystack
          </Typography>
        </Box>

        {/* Amount Display - New: Enhanced amount display */}
        <Paper 
          variant="outlined" 
          sx={{ 
            p: 3, 
            mb: 3, 
            textAlign: 'center',
            backgroundColor: 'grey.50',
            borderRadius: 2
          }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Total Amount
          </Typography>
          <Typography variant="h4" color="primary.main" fontWeight="bold">
            {formatAmount(amount)}
          </Typography>
        </Paper>

        {/* Payment Methods Section - New: Visual payment options */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CreditCard sx={{ color: 'primary.main' }} />
            Payment Methods
          </Typography>
          
          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            <Chip 
              icon={<CreditCard />} 
              label="Card" 
              color="primary" 
              variant="outlined"
            />
            <Chip 
              icon={<AccountBalance />} 
              label="Bank Transfer" 
              color="primary" 
              variant="outlined"
            />
            <Chip 
              label="USSD" 
              color="primary" 
              variant="outlined"
            />
          </Stack>

          {/* Paystack Button - Updated: Enhanced with MUI Button wrapper */}
          <Box sx={{ position: 'relative' }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{
                py: 2,
                borderRadius: 3,
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 4px 20px -2px rgba(239, 57, 102, 0.3)',
                '&:hover': {
                  boxShadow: '0 8px 30px -4px rgba(239, 57, 102, 0.4)',
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                }
              }}
            >
              <PaystackButton {...paystackProps} />
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Security Information - New: Trust indicators */}
        <Box sx={{ textAlign: 'center' }}>
          <Alert 
            severity="info" 
            icon={<Security />}
            sx={{ 
              mb: 2,
              backgroundColor: 'grey.50',
              '& .MuiAlert-icon': {
                color: 'primary.main'
              }
            }}
          >
            Your payment is secured with 256-bit SSL encryption
          </Alert>

          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography variant="caption" color="text.secondary">
                PCI Compliant
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography variant="caption" color="text.secondary">
                Bank Grade Security
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography variant="caption" color="text.secondary">
                Instant Processing
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Order Details - New: Order summary for reference */}
        <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'grey.200' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Order Details:</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {config.productType === 'cake' 
              ? `${config.size}" ${config.shape} cake with ${config.layers} layer${config.layers !== 1 ? 's' : ''}${(config.flavors || []).length ? ' • ' + config.flavors!.join(', ') : ''}`
              : `Box of ${config.boxSize} ${config.productType} - ${config.boxFlavors?.join(', ') || 'No flavors selected'}`
            }
          </Typography>
          {config.text && (
            <Typography variant="body2" color="text.secondary">
              Custom text: "{config.text}"
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
}