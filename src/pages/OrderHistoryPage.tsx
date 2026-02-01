// FRONTEND ORDER HISTORY PAGE: This file defines the OrderHistoryPage component for the React frontend.
// It displays a list of the user's past orders, including details and status.
//
// Design Patterns: Uses the React Component pattern, Context pattern for global state, and presentational component pattern for order cards.
// Data Structures: Uses React state (useState), context objects, arrays for orders, and custom types for order data.
// Security: Only fetches orders for the authenticated user, handles errors securely, and does not expose sensitive data.

// Import React, useEffect, and useState for component logic, side effects, and state management.
import React, { useEffect, useState } from 'react';
// Import MUI components for enhanced order history UI
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
  Alert,
  CircularProgress,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  History,
  ExpandMore,
  Receipt,
  LocalShipping,
  Cake,
  FilterList,
  TrendingUp,
  ShoppingBag,
  CheckCircle,
  Schedule,
  Refresh,
} from '@mui/icons-material';
// Import useConfig hook to access global user state from context.
import { useConfig } from '../context/ConfigContext';
// Import getUserOrders utility to fetch user's orders from backend.
import { getUserOrders } from '../utils/orderService';
// Import Order type for type safety.
import { Order } from '../types/order';

// OrderHistoryPage component displays the user's order history - Updated: Enhanced with MUI design.
export default function OrderHistoryPage() {
  // Get user from context.
  const { user } = useConfig();
  // Local state for list of orders.
  const [orders, setOrders] = useState<Order[]>([]);
  // Local state for filtered orders.
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  // Local state for loading indicator.
  const [loading, setLoading] = useState(true);
  // Local state for error messages.
  const [error, setError] = useState<string | null>(null);
  // Local state for status filter.
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // useEffect: Fetch user's orders when component mounts or user changes.
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const userOrders = await getUserOrders(user); // Fetch orders from backend.
        setOrders(userOrders); // Store orders in state.
        setFilteredOrders(userOrders);
        setError(null);
      } catch (err) {
        setError('Failed to load order history'); // Show error if fetch fails.
        console.error('Error loading orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Filter orders based on status
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    }
  }, [orders, statusFilter]);

  // Calculate statistics
  const stats = {
    total: orders.length,
    completed: orders.filter(order => order.status === 'completed').length,
    pending: orders.filter(order => order.status === 'pending').length,
    totalSpent: orders.reduce((sum, order) => sum + order.config.price, 0),
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'confirmed': return 'info';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  // Show loading UI while fetching orders - Updated: Enhanced with MUI components.
  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="md">
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
              Loading Order History
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please wait while we fetch your orders...
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  // Show error UI if fetch failed - Updated: Enhanced with MUI components.
  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="md">
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
              startIcon={<Refresh />}
              onClick={() => window.location.reload()}
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

  // Render the order history UI - Updated: Enhanced with MUI components and better layout.
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 4 }}>
      <Container maxWidth="lg">
        {/* Page Header - Updated: Enhanced with MUI styling */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <History sx={{ color: 'primary.main', mr: 1, fontSize: 32 }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              Order History
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Track and manage all your previous orders
          </Typography>
        </Box>

        {/* Statistics Cards - New: Added order statistics */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <Card elevation={2} sx={{ flex: 1, minWidth: 200, borderRadius: 2 }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <ShoppingBag sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Orders
              </Typography>
            </CardContent>
          </Card>
          
          <Card elevation={2} sx={{ flex: 1, minWidth: 200, borderRadius: 2 }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {stats.completed}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed
              </Typography>
            </CardContent>
          </Card>
          
          <Card elevation={2} sx={{ flex: 1, minWidth: 200, borderRadius: 2 }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Schedule sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {stats.pending}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending
              </Typography>
            </CardContent>
          </Card>
          
          <Card elevation={2} sx={{ flex: 1, minWidth: 200, borderRadius: 2 }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', currencyDisplay: 'narrowSymbol' }).format(stats.totalSpent)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Spent
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Filter Section - New: Added status filter */}
        <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FilterList sx={{ color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mr: 2 }}>
              Filter Orders
            </Typography>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Orders</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* Orders List - Updated: Enhanced with MUI components */}
        {filteredOrders.length === 0 ? (
          <Paper
            elevation={2}
            sx={{
              p: 8,
              textAlign: 'center',
              borderRadius: 3,
            }}
          >
            <Receipt sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              {statusFilter === 'all' ? 'No Orders Found' : `No ${statusFilter} Orders`}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {statusFilter === 'all' 
                ? "You haven't placed any orders yet. Start customizing your first cake!"
                : `You don't have any ${statusFilter} orders at the moment.`
              }
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={3}>
            {filteredOrders.map((order) => (
              <Accordion
                key={order.id}
                elevation={2}
                sx={{
                  borderRadius: 2,
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': { margin: 0 },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    p: 3,
                    '& .MuiAccordionSummary-content': {
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                    <Cake sx={{ color: 'primary.main' }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {order.config.productType === 'cake'
                          ? `${order.config.size}" ${order.config.flavor} Cake`
                          : order.config.productType === 'cookies'
                          ? `Cookies Box of ${order.config.boxSize}`
                          : order.config.productType === 'muffins'
                          ? `Muffins Box of ${order.config.boxSize}`
                          : ''}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Unknown date'} • Order #{order.id.toString().slice(-6)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', currencyDisplay: 'narrowSymbol' }).format(order.config.price)}
                    </Typography>
                    <Chip
                      label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      color={getStatusColor(order.status) as any}
                      size="small"
                    />
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails sx={{ p: 3, pt: 0 }}>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                    {/* Product Details */}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Product Details
                      </Typography>
                      
                      <Stack spacing={2}>
                        {/* Cake Options */}
                        {order.config.productType === 'cake' && (
                          <>
                            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                              <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                                  Shape
                                </Typography>
                                <Typography variant="body2" sx={{ textTransform: 'capitalize', fontWeight: 500 }}>
                                  {order.config.shape}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                                  Layers
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {order.config.layers}
                                </Typography>
                              </Box>
                            </Box>
                            
                            {order.config.addons && order.config.addons.length > 0 && (
                              <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                                  Add-ons
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                                  {order.config.addons.map((addon) => (
                                    <Chip key={addon} label={addon} size="small" variant="outlined" />
                                  ))}
                                </Box>
                              </Box>
                            )}
                            
                            {order.config.text && (
                              <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                                  Message
                                </Typography>
                                <Typography variant="body2" sx={{ fontStyle: 'italic', fontWeight: 500 }}>
                                  "{order.config.text}"
                                </Typography>
                              </Box>
                            )}
                          </>
                        )}
                        
                        {/* Cookies/Muffins Options */}
                        {(order.config.productType === 'cookies' || order.config.productType === 'muffins') && (
                          <>
                            <Box>
                              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                                Box Size
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {order.config.boxSize ? `Box of ${order.config.boxSize}` : '-'}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                                Flavors
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                                {order.config.boxFlavors && order.config.boxFlavors.length > 0
                                  ? order.config.boxFlavors.map((flavor) => (
                                      <Chip key={flavor} label={flavor} size="small" variant="outlined" />
                                    ))
                                  : <Typography variant="body2">No flavors selected</Typography>
                                }
                              </Box>
                            </Box>
                          </>
                        )}
                      </Stack>
                    </Box>
                    
                    {/* Delivery Details */}
                    {order.config.deliveryDetails && order.config.deliveryDetails.name && (
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <LocalShipping sx={{ color: 'primary.main', mr: 1 }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Delivery Details
                          </Typography>
                        </Box>
                        
                        <Stack spacing={2}>
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                              Name
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {order.config.deliveryDetails.name}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                              Address
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {order.config.deliveryDetails.address}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 4 }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                                Phone
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {order.config.deliveryDetails.phone}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                                State
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {order.config.deliveryDetails.state}
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>
                      </Box>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
} 