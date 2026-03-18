import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Divider,
  Stack,
  Chip,
  Skeleton,
} from '@mui/material';
import {
  Delete,
  Add,
  Remove,
  ShoppingCartOutlined,
  ArrowBack,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { items, loading, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="text" width={200} height={56} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={140} height={28} sx={{ mb: 4 }} />
        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: 2 }}>
            <Stack spacing={2}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rounded" height={120} />
              ))}
            </Stack>
          </Box>
          <Box sx={{ width: { xs: '100%', md: 400 } }}>
            <Skeleton variant="rounded" height={260} />
          </Box>
        </Box>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <ShoppingCartOutlined sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Add some delicious cakes to get started!
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/customize"
          size="large"
        >
          Start Customizing
        </Button>
      </Container>
    );
  }

  const formatCustomization = (customization: any) => {
    const details = [];
    if (customization.size) details.push(`Size: ${customization.size}`);
    if (customization.layers) details.push(`Layers: ${customization.layers}`);
    if (customization.flavor) details.push(`Flavor: ${customization.flavor}`);
    if (customization.shape) details.push(`Shape: ${customization.shape}`);
    if (customization.text) details.push(`Text: "${customization.text}"`);
    if (customization.boxSize) details.push(`Box Size: ${customization.boxSize}`);
    if (customization.boxFlavors?.length) details.push(`Flavors: ${customization.boxFlavors.join(', ')}`);
    if (customization.addons?.length) details.push(`Add-ons: ${customization.addons.join(', ')}`);
    return details;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Continue Shopping
        </Button>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          Shopping Cart
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Cart Items */}
        <Box sx={{ flex: 2 }}>
          <Stack spacing={2}>
            {items.map((item) => (
              <Card key={item.id} elevation={1}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {item.productType?.charAt(0).toUpperCase() + item.productType?.slice(1) || 'Product'}
                      </Typography>
                      
                      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {formatCustomization(item.customization).map((detail, index) => (
                          <Chip
                            key={index}
                            label={detail}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', border: 1, borderColor: 'grey.300', borderRadius: 1 }}>
                          <IconButton
                            size="small"
                            sx={{ minWidth: 40, minHeight: 40 }}
                            onClick={() => updateQuantity(item.id!, Math.max(1, item.quantity - 1))}
                          >
                            <Remove />
                          </IconButton>
                          <Typography sx={{ px: 2, minWidth: 40, textAlign: 'center' }}>
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            sx={{ minWidth: 40, minHeight: 40 }}
                            onClick={() => updateQuantity(item.id!, item.quantity + 1)}
                          >
                            <Add />
                          </IconButton>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary">
                          ₦{item.unitPrice.toLocaleString()} each
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        ₦{(item.unitPrice * item.quantity).toLocaleString()}
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={() => removeFromCart(item.id!)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>

        {/* Order Summary */}
        <Box sx={{ width: { xs: '100%', md: 400 } }}>
          <Card elevation={2} sx={{ position: 'sticky', top: 20 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Order Summary
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal ({totalItems} items)</Typography>
                  <Typography>₦{totalPrice.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Delivery</Typography>
                  <Typography color="success.main">Free</Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Total
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  ₦{totalPrice.toLocaleString()}
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                component={Link}
                to="/delivery"
                sx={{ borderRadius: 2 }}
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}