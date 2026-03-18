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
  FormHelperText,
  InputLabel,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  LocalShipping,
  Payment,
  ArrowBack,
} from '@mui/icons-material';
import AnimatedStepper, { Step } from '../components/AnimatedStepper/AnimatedStepper';
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


export default function DeliveryDetailsPage() {
  const navigate = useNavigate();
  const { user } = useConfig();
  const { items, totalPrice, clearCart } = useCart();
  // Local state for form fields
  const [form, setForm] = useState({
    name: '',
    email: user?.email || '',
    address: '',
    phone: '',
    state: '',
  });
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [error, setError] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Validate form fields with inline per-field errors
  const validate = () => {
    const errors: {[key: string]: string} = {};
    if (!form.name.trim()) errors.name = 'Full name is required.';
    if (!form.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Enter a valid email address.';
    }
    if (!form.address.trim()) errors.address = 'Delivery address is required.';
    if (!form.phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!/^\d{10,15}$/.test(form.phone.replace(/\D/g, ''))) {
      errors.phone = 'Enter a valid phone number (10-15 digits).';
    }
    if (!form.state) errors.state = 'Please select a state.';
    setFieldErrors(errors);
    const valid = Object.keys(errors).length === 0;
    if (valid) setError(null);
    return valid;
  };

  // Handle "Proceed to Payment" button
  const handleProceed = () => {
    if (!validate()) return;
    // Store delivery details in localStorage for now (will be part of order creation)
    localStorage.setItem('deliveryDetails', JSON.stringify(form));
    setShowPayment(true);
  };

  // Handle payment success — supports both authenticated and guest checkout
  const handlePaymentSuccess = async () => {
    setSubmitting(true);
    try {
      const deliveryDetails = JSON.parse(localStorage.getItem('deliveryDetails') || '{}');
      const orderId = await createOrderFromCart(items, deliveryDetails);

      await clearCart();
      localStorage.removeItem('deliveryDetails');
      setShowPayment(false);
      setPaymentError(null);
      navigate('/confirmation', { state: { orderId } });
    } catch (error) {
      console.error('Error creating order:', error);
      setPaymentError('Failed to create order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle payment error
  const handlePaymentError = (error: Error) => {
    setPaymentError(error.message || 'Payment failed. Please try again.');
  };

  // If no items in cart, redirect
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
          
          {/* Progress Stepper */}
          <Paper elevation={1} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, mb: 4 }}>
            <AnimatedStepper currentStep={1}>
              <Step>Delivery</Step>
              <Step>Payment</Step>
            </AnimatedStepper>
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
                p: { xs: 2, md: 4 },
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
                {/* Name Field */}
                <TextField
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                  error={!!fieldErrors.name}
                  helperText={fieldErrors.name}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                {/* Email Field — required for payment receipt */}
                <TextField
                  label="Email Address"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                  type="email"
                  placeholder="e.g. name@example.com"
                  error={!!fieldErrors.email}
                  helperText={fieldErrors.email}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                {/* Address Field */}
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
                  error={!!fieldErrors.address}
                  helperText={fieldErrors.address}
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
                  error={!!fieldErrors.phone}
                  helperText={fieldErrors.phone}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                {/* State Field - Updated: MUI Select */}
                <FormControl fullWidth required error={!!fieldErrors.state}>
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
                  {fieldErrors.state && <FormHelperText>{fieldErrors.state}</FormHelperText>}
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
          <Box sx={{ flex: 1, minWidth: { xs: '100%', md: 300 }, width: { xs: '100%', md: 'auto' } }}>
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

            {/* Payment Section */}
            {showPayment && (
              <Paper
                elevation={2}
                sx={{
                  p: { xs: 2, md: 4 },
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

                {submitting ? (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <CircularProgress size={32} sx={{ mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      Processing your order...
                    </Typography>
                  </Box>
                ) : (
                  <PaymentForm
                    amount={totalPrice}
                    userEmail={form.email}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                )}

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