// FRONTEND DELIVERY DETAILS PAGE: This file defines the DeliveryDetailsPage component for the React frontend.
// It collects delivery details (name, address, phone, state) and stores them in context before proceeding to payment/confirmation.
//
// Design Patterns: Uses the React Component pattern, Context pattern for global state, controlled component pattern for form inputs, and validation.
// Data Structures: Uses context objects, local state for form, and arrays for state options.
// Security: Validates input, requires all fields, and does not expose sensitive data.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Import MUI components for enhanced delivery details UI
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Stack,
} from '@mui/material';
import {
  LocalShipping,
  Payment,
  CheckCircle,
  ArrowBack,
} from '@mui/icons-material';
import { useConfig } from '../context/ConfigContext';
import { useCart } from '../context/CartContext';
import { createOrderFromCart } from '../utils/orderService';
import CartSummary from '../components/CartSummary';
import PaymentForm from '../components/PaymentForm';

// List of Nigerian states
const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

// Stepper steps
const steps = ['Customize', 'Delivery Details', 'Payment', 'Confirmation'];

export default function DeliveryDetailsPage() {
  const navigate = useNavigate();
  const { user } = useConfig();
  const { items, totalPrice, clearCart } = useCart();
  // Local state for form fields
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    state: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Validate form fields
  const validate = () => {
    if (!form.name || !form.address || !form.phone || !form.state) {
      setError('All fields are required.');
      return false;
    }
    if (!/^\d{10,15}$/.test(form.phone.replace(/\D/g, ''))) {
      setError('Enter a valid phone number (10-15 digits).');
      return false;
    }
    setError(null);
    return true;
  };

  // Handle "Proceed to Payment" button
  const handleProceed = () => {
    if (!validate()) return;
    // Store delivery details in localStorage for now (will be part of order creation)
    localStorage.setItem('deliveryDetails', JSON.stringify(form));
    setShowPayment(true);
  };

  // Handle payment success
  const handlePaymentSuccess = async () => {
    try {
      // Get delivery details from localStorage
      const deliveryDetails = JSON.parse(localStorage.getItem('deliveryDetails') || '{}');
      
      // Create order with all cart items
      await createOrderFromCart(user!, items, deliveryDetails);
      
      // Clear cart and navigate
      await clearCart();
      localStorage.removeItem('deliveryDetails');
      setShowPayment(false);
      setPaymentError(null);
      navigate('/confirmation');
    } catch (error) {
      console.error('Error creating order:', error);
      setPaymentError('Failed to create order. Please try again.');
    }
  };

  // Handle payment error
  const handlePaymentError = (error: Error) => {
    setPaymentError(error.message || 'Payment failed. Please try again.');
  };

  // If not logged in or no items in cart, redirect
  if (!user) {
    navigate('/');
    return null;
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 4 }}>
      <Container maxWidth="lg">
        {/* Page Header with Stepper - New: Added progress stepper */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/cart')}
            sx={{ mb: 3, textTransform: 'none' }}
          >
            Back to Cart
          </Button>
          
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 3 }}>
            Delivery Details
          </Typography>
          
          {/* Progress Stepper - New: Added order progress */}
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
            <Stepper activeStep={1} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    StepIconComponent={({ active, completed }) => (
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: completed ? 'success.main' : active ? 'primary.main' : 'grey.300',
                          color: 'white',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                        }}
                      >
                        {completed ? <CheckCircle sx={{ fontSize: 20 }} /> : index + 1}
                      </Box>
                    )}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Box>

        {/* Main Content - Updated: Enhanced layout with MUI */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            alignItems: 'flex-start',
          }}
        >
          {/* Delivery Form - Updated: Enhanced with MUI form components */}
          <Box sx={{ flex: 1 }}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                borderRadius: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LocalShipping sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Delivery Information
                </Typography>
              </Box>

              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleProceed();
                }}
                sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
              >
                {/* Name Field - Updated: MUI TextField */}
                <TextField
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                {/* Address Field - Updated: MUI TextField */}
                <TextField
                  label="Delivery Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  placeholder="Enter your complete delivery address"
                />

                {/* Phone Field - Updated: MUI TextField */}
                <TextField
                  label="Phone Number"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                  type="tel"
                  placeholder="e.g. 08012345678"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                {/* State Field - Updated: MUI Select */}
                <FormControl fullWidth required>
                  <InputLabel>State</InputLabel>
                  <Select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    label="State"
                    sx={{ borderRadius: 2 }}
                  >
                    {NIGERIAN_STATES.map((state) => (
                      <MenuItem key={state} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Error Display - Updated: MUI Alert */}
                {error && (
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}

                {/* Proceed Button - Updated: Enhanced MUI Button */}
                {!showPayment && (
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    endIcon={<Payment />}
                    sx={{
                      mt: 2,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                    }}
                  >
                    Proceed to Payment
                  </Button>
                )}
              </Box>
            </Paper>
          </Box>

          {/* Order Summary and Payment - Updated: Enhanced sidebar */}
          <Box sx={{ flex: 1, minWidth: 300 }}>
            {/* Cart Summary - Updated: Enhanced wrapper */}
            <Paper
              elevation={2}
              sx={{
                borderRadius: 3,
                mb: 3,
                overflow: 'hidden',
              }}
            >
              <CartSummary />
            </Paper>

            {/* Payment Section - Updated: Enhanced payment UI */}
            {showPayment && user && (
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  borderRadius: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Payment sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Payment
                  </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <PaymentForm
                  amount={totalPrice}
                  userEmail={user.email || ''}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />

                {/* Payment Error - Updated: MUI Alert */}
                {paymentError && (
                  <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                    {paymentError}
                  </Alert>
                )}
              </Paper>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
} 