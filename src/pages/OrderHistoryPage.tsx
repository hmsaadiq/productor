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
  IconButton,
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
  Edit,
} from '@mui/icons-material';
// Import useConfig hook to access global user state from context.
import { useConfig } from '../context/ConfigContext';
// Import getUserOrders utility to fetch user's orders from backend.
import { getUserOrders } from '../utils/orderService';
// Import Order type for type safety.
import { Order } from '../types/order';
// Import supabase for real-time subscriptions
import { supabase } from '../utils/supabase';
import EditOrderModal from '../components/EditOrderModal';
import { CancelOrderButton } from '../components/CancelOrderButton';
import { formatStatus, getStatusColor } from '../utils/orderStatusHelpers';

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
  // Local state for status update notification
  const [statusUpdateNotification, setStatusUpdateNotification] = useState<string | null>(null);
  // State for edit modal
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

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

    // Set up real-time subscription for order updates
    if (user) {
      const subscription = supabase
        .channel('user-orders')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Order updated:', payload);
            // Update the specific order in state
            setOrders(prev => 
              prev.map(order => 
                order.id === payload.new.id ? { ...order, ...payload.new } : order
              )
            );
            // Show notification
            setStatusUpdateNotification(`Order #${payload.new.id.toString().slice(-6)} status updated to ${payload.new.status}`);
            setTimeout(() => setStatusUpdateNotification(null), 5000);
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
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
    totalSpent: orders.reduce((sum, order) => {
      if (order.total_price) {
        return sum + order.total_price;
      } else if (order.config?.price) {
        return sum + order.config.price;
      }
      return sum;
    }, 0),
  };

  // Check if order can be edited
  const canEditOrder = (status: string) => {
    return status === 'pending' || status === 'confirmed';
  };

  // Handle edit order
  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
  };

  // Refresh orders after edit
  const handleEditSuccess = async () => {
    if (!user) return;
    try {
      const userOrders = await getUserOrders(user);
      setOrders(userOrders);
      setFilteredOrders(userOrders);
    } catch (err) {
      console.error('Error reloading orders:', err);
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
        {/* Status Update Notification */}
        {statusUpdateNotification && (
          <Alert 
            severity="info" 
            onClose={() => setStatusUpdateNotification(null)}
            sx={{ mb: 3 }}
          >
            {statusUpdateNotification}
          </Alert>
        )}

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
                        {order.items && order.items.length > 0
                          ? `${order.items.length} item${order.items.length > 1 ? 's' : ''}`
                          : order.config.productType === 'cake'
                          ? `${order.config.size}" ${order.config.flavor} Cake`
                          : order.config.productType === 'cookies'
                          ? `Cookies Box of ${order.config.boxSize}`
                          : order.config.productType === 'muffins'
                          ? `Muffins Box of ${order.config.boxSize}`
                          : 'Order'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.created_at ? new Date(order.created_at).toLocaleString() : 'Unknown date'} • Order #{order.id.toString().slice(-6)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', currencyDisplay: 'narrowSymbol' }).format(
                        order.total_price || order.config?.price || 0
                      )}
                    </Typography>
                    <Chip
                      label={formatStatus(order.status)}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails sx={{ p: 3, pt: 0 }}>
                  <Divider sx={{ mb: 3 }} />
                  
                  {/* Cancellation Info */}
                  {order.status === 'cancelled' && order.cancelled_at && (
                    <Box sx={{ mb: 3, p: 2, border: 2, borderColor: 'error.main', bgcolor: 'background.paper', borderRadius: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold" color="error.dark" gutterBottom>
                        Order Cancelled
                      </Typography>
                      <Typography variant="body2">
                        <strong>Cancelled:</strong> {new Date(order.cancelled_at).toLocaleString()}
                      </Typography>
                      <Typography variant="body2">
                        <strong>By:</strong> {order.cancelled_by_role === 'admin' ? 'Admin' : 'Customer'}
                      </Typography>
                      {order.cancellation_reason && (
                        <Typography variant="body2">
                          <strong>Reason:</strong> {order.cancellation_reason}
                        </Typography>
                      )}
                      {order.previous_status && (
                        <Typography variant="body2">
                          <strong>Previous Status:</strong> {order.previous_status}
                        </Typography>
                      )}
                    </Box>
                  )}
                  
                  {/* Action Buttons */}
                  <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                    <CancelOrderButton
                      order={order}
                      isAdmin={false}
                      onSuccess={handleEditSuccess}
                    />
                    {canEditOrder(order.status) && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleEditOrder(order)}
                      >
                        Edit Order
                      </Button>
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                    {/* Product Details */}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        {order.items && order.items.length > 0 ? 'Order Items' : 'Product Details'}
                      </Typography>
                      
                      {/* Display cart items if available */}
                      {order.items && order.items.length > 0 ? (
                        <Stack spacing={3}>
                          {order.items.map((item: any, index: number) => (
                            <Box key={index} sx={{ p: 2, border: 1, borderColor: 'grey.200', borderRadius: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                                  {item.productType}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Qty: {item.quantity} × ₦{item.unitPrice} = ₦{item.quantity * item.unitPrice}
                                </Typography>
                              </Box>
                              
                              {/* Item customization details */}
                              <Box sx={{ ml: 2 }}>
                                {item.productType === 'cake' && (
                                  <Typography variant="body2" color="text.secondary">
                                    {item.customization.size}" {item.customization.shape} • {item.customization.layers} layer{item.customization.layers > 1 ? 's' : ''} • {item.customization.flavor}
                                    {item.customization.text && ` • "${item.customization.text}"`}
                                  </Typography>
                                )}
                                {(item.productType === 'cookies' || item.productType === 'muffins') && (
                                  <Typography variant="body2" color="text.secondary">
                                    Box of {item.customization.boxSize} • {item.customization.boxFlavors?.join(', ') || 'No flavors'}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          ))}
                        </Stack>
                      ) : (
                        /* Legacy single item display */
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
                      )}
                    </Box>
                    
                    {/* Delivery Details */}
                    {((order.items && order.shipping_address) || (order.config?.deliveryDetails?.name)) && (
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <LocalShipping sx={{ color: 'primary.main', mr: 1 }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Delivery Details
                          </Typography>
                        </Box>
                        
                        <Stack spacing={2}>
                          {order.shipping_address ? (
                            /* New cart-based delivery details */
                            <>
                              <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                                  Name
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {order.shipping_address.name}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                                  Address
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {order.shipping_address.address}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', gap: 4 }}>
                                <Box>
                                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                                    Phone
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {order.shipping_address.phone}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                                    State
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {order.shipping_address.state}
                                  </Typography>
                                </Box>
                              </Box>
                            </>
                          ) : order.config?.deliveryDetails?.name && (
                            /* Legacy delivery details */
                            <>
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
                            </>
                          )}
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

      {/* Edit Order Modal */}
      {editingOrder && (
        <EditOrderModal
          isOpen={!!editingOrder}
          onClose={() => setEditingOrder(null)}
          order={editingOrder}
          onSuccess={handleEditSuccess}
        />
      )}
    </Box>
  );
} 
