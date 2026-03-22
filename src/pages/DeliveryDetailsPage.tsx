import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, TextField, Button, Select, MenuItem,
  FormControl, FormHelperText, InputLabel, Alert, CircularProgress,
  Stack, Paper, Chip, RadioGroup, FormControlLabel, Radio, useTheme,
  Divider, IconButton,
} from '@mui/material';
import {
  CheckCircle, Lock, ArrowBack, Add, Remove, Schedule, WbSunny, Brightness3,
} from '@mui/icons-material';
import { useConfig } from '../context/ConfigContext';
import { useCart } from '../context/CartContext';
import { createOrderFromCart } from '../utils/orderService';
import PaymentForm from '../components/PaymentForm';

const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo',
  'Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa',
  'Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara',
];

// Minimum delivery date: today + 2 days (48hr policy)
function getMinDate() {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().split('T')[0];
}

const TIME_SLOTS = [
  { value: 'morning', label: 'Morning Pickup', time: '9:00 AM – 12:00 PM', popular: false },
  { value: 'afternoon', label: 'Afternoon Pickup', time: '12:00 PM – 4:00 PM', popular: true },
  { value: 'evening', label: 'Evening Pickup', time: '4:00 PM – 7:00 PM', popular: false },
];

export default function DeliveryDetailsPage() {
  const navigate = useNavigate();
  const { user } = useConfig();
  const { items, totalPrice, clearCart, updateQuantity, removeFromCart } = useCart();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const borderColor = isDark ? '#48232c' : '#f3e7ea';
  const surfaceColor = isDark ? '#2d161c' : '#fff';
  const mutedBg = isDark ? '#391c23' : '#fcf8f9';

  const [form, setForm] = useState({
    name: '', email: user?.email || '', address: '', phone: '', state: '',
  });
  const [deliveryDate, setDeliveryDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('afternoon');
  const [instructions, setInstructions] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [contactEditMode, setContactEditMode] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validateContact = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = 'Full name is required.';
    if (!form.email.trim()) errors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email.';
    if (!form.phone.trim()) errors.phone = 'Phone is required.';
    else if (!/^\d{10,15}$/.test(form.phone.replace(/\D/g, ''))) errors.phone = 'Enter a valid phone (10-15 digits).';
    if (!form.state) errors.state = 'Please select a state.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateDelivery = () => {
    const errors: Record<string, string> = {};
    if (!form.address.trim()) errors.address = 'Delivery address is required.';
    if (!deliveryDate) errors.deliveryDate = 'Please select a delivery date.';
    setFieldErrors(prev => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };

  const handleContactConfirm = () => {
    if (!validateContact()) return;
    setContactEditMode(false);
  };

  const handleProceed = () => {
    if (!validateDelivery()) return;
    localStorage.setItem('deliveryDetails', JSON.stringify({ ...form, deliveryDate, timeSlot, instructions }));
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    setSubmitting(true);
    try {
      const deliveryDetails = JSON.parse(localStorage.getItem('deliveryDetails') || '{}');
      const orderId = await createOrderFromCart(items, deliveryDetails);
      await clearCart();
      localStorage.removeItem('deliveryDetails');
      navigate('/confirmation', { state: { orderId } });
    } catch {
      setPaymentError('Failed to create order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) { navigate('/cart'); return null; }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="xl">
        {/* ── 3-Step Stepper ── */}
        <Box sx={{ maxWidth: 600, mx: 'auto', mb: 6, px: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Step 1 */}
            {[
              { num: 1, label: 'Contact', done: !contactEditMode },
              { num: 2, label: 'Delivery', done: showPayment, active: contactEditMode === false && !showPayment },
              { num: 3, label: 'Payment', done: false, active: showPayment },
            ].map((step, i) => (
              <React.Fragment key={step.num}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                  <Box sx={{
                    width: 40, height: 40, borderRadius: '50%',
                    bgcolor: step.done || step.active ? 'primary.main' : 'transparent',
                    border: step.done || step.active ? 'none' : `2px solid ${isDark ? '#48232c' : '#e5d0d6'}`,
                    color: step.done || step.active ? '#fff' : isDark ? '#48232c' : '#e5d0d6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.9rem',
                    boxShadow: step.active ? '0 0 0 4px rgba(239,57,102,0.15)' : 'none',
                    transition: 'all 0.3s',
                  }}>
                    {step.done ? <CheckCircle sx={{ fontSize: 20 }} /> : step.num}
                  </Box>
                  <Typography variant="caption" sx={{ mt: 1, position: 'absolute', top: 44, fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: step.active ? 'text.primary' : step.done ? 'primary.main' : 'text.disabled', whiteSpace: 'nowrap' }}>
                    {step.label}
                  </Typography>
                </Box>
                {i < 2 && (
                  <Box sx={{ flex: 1, height: 2, mx: 1, bgcolor: step.done ? 'primary.main' : borderColor, transition: 'background-color 0.3s' }} />
                )}
              </React.Fragment>
            ))}
          </Box>
        </Box>

        {/* ── Main Layout ── */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4, alignItems: 'flex-start' }}>
          {/* ── Left: Forms ── */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>

            {/* Step 1: Contact Info */}
            {contactEditMode ? (
              <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: '1rem', border: `1px solid`, borderColor: 'primary.main', position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', bgcolor: 'primary.main', borderRadius: '4px 0 0 4px' }} />
                <Typography variant="h6" fontWeight={700} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: 'primary.main', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>1</Box>
                  Contact Details
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                  <TextField label="Full Name" name="name" value={form.name} onChange={handleChange} fullWidth error={!!fieldErrors.name} helperText={fieldErrors.name} />
                  <TextField label="Email Address" name="email" value={form.email} onChange={handleChange} type="email" fullWidth error={!!fieldErrors.email} helperText={fieldErrors.email} />
                  <TextField label="Phone Number" name="phone" value={form.phone} onChange={handleChange} type="tel" placeholder="e.g. 08012345678" fullWidth error={!!fieldErrors.phone} helperText={fieldErrors.phone} />
                  <FormControl fullWidth error={!!fieldErrors.state}>
                    <InputLabel>State</InputLabel>
                    <Select name="state" value={form.state} onChange={handleChange as any} label="State">
                      {NIGERIAN_STATES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                    </Select>
                    {fieldErrors.state && <FormHelperText>{fieldErrors.state}</FormHelperText>}
                  </FormControl>
                </Box>
                <Button variant="contained" onClick={handleContactConfirm} sx={{ mt: 3, borderRadius: '0.75rem', px: 4, fontWeight: 700 }}>
                  Confirm Contact Info
                </Button>
              </Paper>
            ) : (
              <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', border: `1px solid ${borderColor}`, opacity: 0.8, transition: 'opacity 0.2s', '&:hover': { opacity: 1 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight={700}>Contact Details</Typography>
                      <CheckCircle sx={{ color: 'success.main', fontSize: 18 }} />
                    </Box>
                    <Typography variant="body2" color="text.primary" fontWeight={500}>{form.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{form.phone} · {form.state}</Typography>
                  </Box>
                  <Button size="small" sx={{ color: 'primary.main', fontWeight: 700, textTransform: 'none' }} onClick={() => setContactEditMode(true)}>Edit</Button>
                </Box>
              </Paper>
            )}

            {/* Step 2: Delivery — only active after contact is confirmed */}
            {!contactEditMode && !showPayment && (
              <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: '1rem', border: '1px solid', borderColor: 'primary.main', position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', bgcolor: 'primary.main', borderRadius: '4px 0 0 4px' }} />
                <Typography variant="h6" fontWeight={700} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: 'primary.main', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>2</Box>
                  Delivery Details
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
                  {/* Date + Address */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                      label="Delivery Date"
                      type="date"
                      value={deliveryDate}
                      onChange={e => setDeliveryDate(e.target.value)}
                      inputProps={{ min: getMinDate() }}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!fieldErrors.deliveryDate}
                      helperText={fieldErrors.deliveryDate || 'Minimum 48 hours notice required'}
                    />
                    <TextField
                      label="Delivery Address"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      multiline rows={3}
                      fullWidth
                      error={!!fieldErrors.address}
                      helperText={fieldErrors.address || 'Full address including area/landmark'}
                    />
                  </Box>

                  {/* Time Slots */}
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary', mb: 1.5, display: 'block' }}>
                      Preferred Time
                    </Typography>
                    <RadioGroup value={timeSlot} onChange={e => setTimeSlot(e.target.value)}>
                      <Stack spacing={1.5}>
                        {TIME_SLOTS.map(slot => (
                          <Box
                            key={slot.value}
                            onClick={() => setTimeSlot(slot.value)}
                            sx={{
                              display: 'flex', alignItems: 'center', gap: 2,
                              p: 1.5,
                              border: '2px solid',
                              borderColor: timeSlot === slot.value ? 'primary.main' : borderColor,
                              bgcolor: timeSlot === slot.value ? 'rgba(239,57,102,0.05)' : 'transparent',
                              borderRadius: '0.75rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              position: 'relative',
                              '&:hover': { borderColor: 'primary.light' },
                            }}
                          >
                            {slot.popular && (
                              <Chip label="POPULAR" size="small" sx={{ position: 'absolute', top: -1, right: 8, bgcolor: 'primary.main', color: '#fff', fontSize: '0.6rem', fontWeight: 700, height: 18 }} />
                            )}
                            <Radio value={slot.value} size="small" sx={{ p: 0.5 }} />
                            <Box>
                              <Typography variant="body2" fontWeight={700} color="text.primary">{slot.label}</Typography>
                              <Typography variant="caption" color="text.secondary">{slot.time}</Typography>
                            </Box>
                            {timeSlot === slot.value && <Schedule sx={{ ml: 'auto', color: 'primary.main', fontSize: 20 }} />}
                          </Box>
                        ))}
                      </Stack>
                    </RadioGroup>
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary', mb: 1, display: 'block' }}>
                        Special Instructions
                      </Typography>
                      <TextField
                        multiline rows={2}
                        value={instructions}
                        onChange={e => setInstructions(e.target.value)}
                        fullWidth
                        placeholder="Gate code, please call on arrival, etc."
                        size="small"
                      />
                    </Box>
                  </Box>
                </Box>

                {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{error}</Alert>}
                <Button variant="contained" size="large" onClick={handleProceed} sx={{ mt: 3, borderRadius: '0.75rem', px: 5, fontWeight: 700 }}>
                  Continue to Payment
                </Button>
              </Paper>
            )}

            {/* Step 3: Payment */}
            {showPayment ? (
              <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: '1rem', border: '1px solid', borderColor: 'primary.main', position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', bgcolor: 'primary.main', borderRadius: '4px 0 0 4px' }} />
                <Typography variant="h6" fontWeight={700} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: 'primary.main', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>3</Box>
                  Payment
                </Typography>
                {submitting ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress size={36} sx={{ mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">Processing your order...</Typography>
                  </Box>
                ) : (
                  <PaymentForm amount={totalPrice} userEmail={form.email} onSuccess={handlePaymentSuccess} onError={(e: Error) => setPaymentError(e.message)} />
                )}
                {paymentError && <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{paymentError}</Alert>}
              </Paper>
            ) : !contactEditMode && (
              <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', border: `1px solid ${borderColor}`, opacity: 0.6 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ color: 'text.disabled', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 28, height: 28, borderRadius: '50%', border: `2px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>3</Box>
                  Payment Method
                </Typography>
                <Button disabled fullWidth sx={{ mt: 2, borderRadius: '9999px', bgcolor: isDark ? '#2d161c' : '#f3e7ea', color: 'text.disabled' }}>
                  Complete Delivery Step First
                </Button>
              </Paper>
            )}
          </Box>

          {/* ── Right: Sticky Order Summary ── */}
          <Box sx={{ width: { xs: '100%', lg: 380 }, flexShrink: 0 }}>
            <Box sx={{ position: { lg: 'sticky' }, top: 100 }}>
              <Paper elevation={0} sx={{ borderRadius: '1rem', border: `1px solid ${borderColor}`, overflow: 'hidden' }}>
                {/* Header */}
                <Box sx={{ p: 3, borderBottom: `1px solid ${borderColor}`, bgcolor: mutedBg }}>
                  <Typography variant="h6" fontWeight={700}>Order Summary</Typography>
                  <Typography variant="caption" color="text.secondary">{items.length} item{items.length !== 1 ? 's' : ''}</Typography>
                </Box>

                {/* Items */}
                <Box sx={{ p: 3, maxHeight: 360, overflowY: 'auto', '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { bgcolor: borderColor, borderRadius: 2 } }}>
                  <Stack spacing={2.5}>
                    {items.map(item => (
                      <Box key={item.id} sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ width: 56, height: 56, borderRadius: '0.5rem', bgcolor: isDark ? '#391c23' : '#f3e7ea', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.5rem' }}>
                          🎂
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography variant="body2" fontWeight={700} color="text.primary" noWrap>
                              {item.productType?.charAt(0).toUpperCase() + item.productType?.slice(1)}
                            </Typography>
                            <Typography variant="body2" fontWeight={700} color="primary.main">₦{(item.unitPrice * item.quantity).toLocaleString()}</Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {item.customization?.size ? `${item.customization.size}" · ` : ''}
                            {item.customization?.layers ? `${item.customization.layers}L` : ''}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                            <IconButton size="small" sx={{ width: 24, height: 24, bgcolor: isDark ? '#391c23' : '#f3e7ea', '&:hover': { bgcolor: isDark ? '#48232c' : '#e5d0d6' } }} onClick={() => updateQuantity(item.id!, Math.max(1, item.quantity - 1))}>
                              <Remove sx={{ fontSize: 14 }} />
                            </IconButton>
                            <Typography variant="body2" fontWeight={500}>{item.quantity}</Typography>
                            <IconButton size="small" sx={{ width: 24, height: 24, bgcolor: isDark ? '#391c23' : '#f3e7ea', '&:hover': { bgcolor: isDark ? '#48232c' : '#e5d0d6' } }} onClick={() => updateQuantity(item.id!, item.quantity + 1)}>
                              <Add sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                {/* Totals + CTA */}
                <Box sx={{ p: 3, bgcolor: mutedBg, borderTop: `1px solid ${borderColor}` }}>
                  <Stack spacing={1.5} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                      <Typography variant="body2" fontWeight={500}>₦{totalPrice.toLocaleString()}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Delivery</Typography>
                      <Typography variant="body2" fontWeight={500} color="success.main">Free</Typography>
                    </Box>
                    <Divider sx={{ borderColor }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle1" fontWeight={700}>Total</Typography>
                      <Typography variant="subtitle1" fontWeight={700} color="primary.main">₦{totalPrice.toLocaleString()}</Typography>
                    </Box>
                  </Stack>
                  {!showPayment && !contactEditMode && (
                    <Button
                      variant="contained" fullWidth size="large"
                      onClick={handleProceed}
                      sx={{ borderRadius: '0.75rem', py: 1.5, fontWeight: 700, boxShadow: '0 8px 20px rgba(239,57,102,0.3)', mb: 1.5 }}
                    >
                      Place Order
                    </Button>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.75 }}>
                    <Lock sx={{ fontSize: 14, color: 'text.disabled' }} />
                    <Typography variant="caption" color="text.disabled">SSL Secure Payment</Typography>
                  </Box>
                </Box>
              </Paper>

              <Button startIcon={<ArrowBack />} onClick={() => navigate('/cart')} sx={{ mt: 2, textTransform: 'none', color: 'text.secondary' }} fullWidth>
                Back to Cart
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
