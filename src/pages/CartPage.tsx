import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Divider,
  Stack,
  Skeleton,
  useTheme,
} from '@mui/material';
import {
  Delete,
  Add,
  Remove,
  ShoppingCartOutlined,
  ArrowBack,
  Lock,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { items, loading, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const borderColor = isDark ? '#48232c' : '#f3e7ea';
  const surfaceColor = isDark ? '#2d161c' : '#ffffff';

  const formatCustomization = (customization: any) => {
    const details: string[] = [];
    if (customization.size) details.push(`${customization.size}"`);
    if (customization.layers) details.push(`${customization.layers} layer${customization.layers > 1 ? 's' : ''}`);
    if (customization.flavor) details.push(customization.flavor);
    if (customization.shape) details.push(customization.shape);
    if (customization.text) details.push(`"${customization.text}"`);
    if (customization.boxSize) details.push(`Box of ${customization.boxSize}`);
    if (customization.boxFlavors?.length) details.push(customization.boxFlavors.join(', '));
    if (customization.addons?.length) details.push(customization.addons.join(', '));
    return details.join(' · ');
  };

  const getEmoji = (productType: string) => {
    if (productType === 'cake') return '🎂';
    if (productType === 'cookies') return '🍪';
    if (productType === 'muffins') return '🧁';
    return '🎁';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Skeleton variant="text" width={200} height={56} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={140} height={28} sx={{ mb: 4 }} />
        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', lg: 'row' } }}>
          <Box sx={{ flex: 1 }}>
            <Stack spacing={2}>
              {[1, 2, 3].map((i) => <Skeleton key={i} variant="rounded" height={100} sx={{ borderRadius: '1rem' }} />)}
            </Stack>
          </Box>
          <Box sx={{ width: { xs: '100%', lg: 380 } }}>
            <Skeleton variant="rounded" height={300} sx={{ borderRadius: '1rem' }} />
          </Box>
        </Box>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <Box
          sx={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            bgcolor: isDark ? '#391c23' : '#fdf2f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <ShoppingCartOutlined sx={{ fontSize: 44, color: isDark ? '#48232c' : '#e5c8ce' }} />
        </Box>
        <Typography variant="h5" fontWeight={800} color="text.primary" gutterBottom>
          Your basket is empty
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Add some delicious cakes to get started!
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/customize"
          size="large"
          sx={{ borderRadius: '0.75rem', fontWeight: 700, px: 4, py: 1.5 }}
        >
          Design a Cake
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 8 }}>
      <Container maxWidth="lg" sx={{ pt: 5 }}>
        {/* Header */}
        <Box sx={{ mb: 5 }}>
          <Button
            startIcon={<ArrowBack sx={{ fontSize: '18px !important' }} />}
            onClick={() => navigate(-1)}
            sx={{ mb: 2, color: 'text.secondary', fontWeight: 600, '&:hover': { color: 'primary.main' } }}
          >
            Continue Shopping
          </Button>
          <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ letterSpacing: '-0.02em' }}>
            Shopping Basket
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {totalItems} item{totalItems !== 1 ? 's' : ''} in your basket
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', lg: 'row' }, alignItems: 'flex-start' }}>
          {/* Cart Items */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack spacing={2}>
              {items.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    bgcolor: surfaceColor,
                    border: `1px solid ${borderColor}`,
                    borderRadius: '1rem',
                    p: 2.5,
                    display: 'flex',
                    gap: 2,
                    transition: 'box-shadow 0.2s',
                    '&:hover': {
                      boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.3)' : '0 8px 30px rgba(27,13,17,0.08)',
                    },
                  }}
                >
                  {/* Emoji thumbnail */}
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: '0.75rem',
                      bgcolor: isDark ? '#391c23' : '#fdf2f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      flexShrink: 0,
                    }}
                  >
                    {getEmoji(item.productType || '')}
                  </Box>

                  {/* Details */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                      <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ textTransform: 'capitalize' }}>
                        {item.productType?.charAt(0).toUpperCase() + item.productType?.slice(1) || 'Product'}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={800} color="primary.main" sx={{ ml: 2, flexShrink: 0 }}>
                        ₦{(item.unitPrice * item.quantity).toLocaleString()}
                      </Typography>
                    </Box>

                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                      {formatCustomization(item.customization) || 'Custom order'}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {/* Qty controls */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          border: `1px solid ${borderColor}`,
                          borderRadius: '0.6rem',
                          overflow: 'hidden',
                        }}
                      >
                        <IconButton
                          size="small"
                          sx={{ width: 34, height: 34, borderRadius: 0, color: 'text.secondary', '&:hover': { bgcolor: isDark ? '#391c23' : '#f3e7ea', color: 'primary.main' } }}
                          onClick={() => updateQuantity(item.id!, Math.max(1, item.quantity - 1))}
                        >
                          <Remove sx={{ fontSize: 16 }} />
                        </IconButton>
                        <Typography sx={{ px: 2, minWidth: 32, textAlign: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          sx={{ width: 34, height: 34, borderRadius: 0, color: 'text.secondary', '&:hover': { bgcolor: isDark ? '#391c23' : '#f3e7ea', color: 'primary.main' } }}
                          onClick={() => updateQuantity(item.id!, item.quantity + 1)}
                        >
                          <Add sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" color="text.disabled">
                          ₦{item.unitPrice.toLocaleString()} each
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => removeFromCart(item.id!)}
                          sx={{
                            color: 'text.disabled',
                            '&:hover': { color: 'error.main', bgcolor: 'rgba(239,68,68,0.08)' },
                            transition: 'all 0.2s',
                          }}
                        >
                          <Delete sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Order Summary */}
          <Box sx={{ width: { xs: '100%', lg: 380 }, flexShrink: 0 }}>
            <Box
              sx={{
                bgcolor: surfaceColor,
                border: `1px solid ${borderColor}`,
                borderRadius: '1rem',
                p: 3,
                position: 'sticky',
                top: 100,
                boxShadow: isDark ? '0 8px 40px rgba(0,0,0,0.3)' : '0 8px 40px rgba(27,13,17,0.08)',
              }}
            >
              <Typography variant="h6" fontWeight={800} color="text.primary" sx={{ mb: 3 }}>
                Order Summary
              </Typography>

              {/* Item breakdown */}
              <Stack spacing={1.5} sx={{ mb: 3 }}>
                {items.map((item) => (
                  <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                      <Box sx={{ width: 32, height: 32, borderRadius: '0.4rem', bgcolor: isDark ? '#391c23' : '#fdf2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                        {getEmoji(item.productType || '')}
                      </Box>
                      <Typography variant="body2" color="text.secondary" noWrap sx={{ textTransform: 'capitalize' }}>
                        {item.productType} ×{item.quantity}
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={600} color="text.primary">
                      ₦{(item.unitPrice * item.quantity).toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              <Divider sx={{ borderColor, mb: 2 }} />

              {/* Totals */}
              <Stack spacing={1.5} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Subtotal ({totalItems} items)</Typography>
                  <Typography variant="body2" fontWeight={600} color="text.primary">₦{totalPrice.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Delivery</Typography>
                  <Typography variant="body2" fontWeight={600} color="#16a34a">Free</Typography>
                </Box>
              </Stack>

              <Divider sx={{ borderColor, mb: 2.5 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={800} color="text.primary">Total</Typography>
                <Typography variant="h5" fontWeight={900} color="primary.main" sx={{ letterSpacing: '-0.02em' }}>
                  ₦{totalPrice.toLocaleString()}
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                component={Link}
                to="/delivery"
                sx={{
                  borderRadius: '0.75rem',
                  fontWeight: 700,
                  py: 1.5,
                  fontSize: '1rem',
                  boxShadow: '0 8px 20px rgba(239,57,102,0.25)',
                  '&:hover': { boxShadow: '0 8px 28px rgba(239,57,102,0.35)' },
                }}
              >
                Proceed to Checkout
              </Button>

              <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5} sx={{ mt: 2 }}>
                <Lock sx={{ fontSize: 13, color: 'text.disabled' }} />
                <Typography variant="caption" color="text.disabled">
                  SSL Secure Checkout
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
