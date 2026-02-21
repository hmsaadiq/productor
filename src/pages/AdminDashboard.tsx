import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Chip,
  Box,
  Alert,
  Button,
} from '@mui/material';
import { supabase } from '../utils/supabase';
import { useConfig } from '../context/ConfigContext';

interface Order {
  id: number;
  user_id: string;
  items: any;
  status: string;
  total_price: number;
  shipping_address: any;
  created_at: string;
  config: any;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useConfig();
  const [userProfiles, setUserProfiles] = useState<{[key: string]: any}>({});
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    checkAdminAndLoadOrders();
    
    // Real-time subscription for new orders
    const subscription = supabase
      .channel('orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        loadOrders();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load user profiles for orders
  useEffect(() => {
    const loadUserProfiles = async () => {
      if (orders.length > 0) {
        const userIds = Array.from(new Set(orders.map(order => order.user_id)));
        const { data } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', userIds);
        
        const profilesMap: {[key: string]: any} = {};
        data?.forEach(profile => {
          profilesMap[profile.id] = profile;
        });
        setUserProfiles(profilesMap);
      }
    };
    loadUserProfiles();
  }, [orders]);

  const checkAdminAndLoadOrders = async () => {
    if (!user) return;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    
    if (profile?.is_admin) {
      loadOrders();
    } else {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading orders:', error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);
    
    if (error) {
      console.error('Error updating order:', error);
    } else {
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'in_progress': return 'primary';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Total Orders: {orders.length}
      </Alert>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <TableRow>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {userProfiles[order.user_id]?.full_name || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {userProfiles[order.user_id]?.email || order.user_id}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.shipping_address?.phone || order.config?.deliveryDetails?.phone || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.shipping_address?.state || order.config?.deliveryDetails?.state || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {Array.isArray(order.items) ? order.items.length : 1} item(s)
                    </Typography>
                  </TableCell>
                  <TableCell>₦{(order.total_price || order.config?.price || 0).toLocaleString()}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      size="small"
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="confirmed">Confirmed</MenuItem>
                      <MenuItem value="in_progress">In Progress</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    >
                      {expandedOrder === order.id ? 'Hide' : 'Show'}
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedOrder === order.id && (
                  <TableRow>
                    <TableCell colSpan={9} sx={{ bgcolor: 'grey.50', p: 3 }}>
                      <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
                        {/* Order Items */}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                            Order Items
                          </Typography>
                          {Array.isArray(order.items) ? (
                            order.items.map((item: any, idx: number) => (
                              <Box key={idx} sx={{ mb: 2, p: 2, bgcolor: 'white', borderRadius: 1 }}>
                                <Typography variant="body2" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                                  {item.productType || 'Item'} (Qty: {item.quantity || 1})
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {item.productType === 'cake' && item.customization && (
                                    `${item.customization.size}" ${item.customization.shape} • ${item.customization.layers} layer(s) • ${item.customization.flavor}${item.customization.text ? ` • "${item.customization.text}"` : ''}`
                                  )}
                                  {(item.productType === 'cookies' || item.productType === 'muffins') && item.customization && (
                                    `Box of ${item.customization.boxSize} • ${item.customization.boxFlavors?.join(', ') || 'No flavors'}`
                                  )}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                  ₦{item.unitPrice} × {item.quantity} = ₦{(item.unitPrice * item.quantity).toLocaleString()}
                                </Typography>
                              </Box>
                            ))
                          ) : order.config ? (
                            <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1 }}>
                              <Typography variant="body2" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                                {order.config.productType}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {order.config.productType === 'cake' && (
                                  `${order.config.size}" ${order.config.shape} • ${order.config.layers} layer(s) • ${order.config.flavor}`
                                )}
                                {(order.config.productType === 'cookies' || order.config.productType === 'muffins') && (
                                  `Box of ${order.config.boxSize}`
                                )}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant="body2">No items</Typography>
                          )}
                        </Box>
                        
                        {/* Delivery Address */}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                            Delivery Address
                          </Typography>
                          <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1 }}>
                            {order.shipping_address ? (
                              <>
                                <Typography variant="body2"><strong>Name:</strong> {order.shipping_address.name}</Typography>
                                <Typography variant="body2"><strong>Phone:</strong> {order.shipping_address.phone}</Typography>
                                <Typography variant="body2"><strong>Address:</strong> {order.shipping_address.address}</Typography>
                                <Typography variant="body2"><strong>State:</strong> {order.shipping_address.state}</Typography>
                              </>
                            ) : order.config?.deliveryDetails ? (
                              <>
                                <Typography variant="body2"><strong>Name:</strong> {order.config.deliveryDetails.name}</Typography>
                                <Typography variant="body2"><strong>Phone:</strong> {order.config.deliveryDetails.phone}</Typography>
                                <Typography variant="body2"><strong>Address:</strong> {order.config.deliveryDetails.address}</Typography>
                                <Typography variant="body2"><strong>State:</strong> {order.config.deliveryDetails.state}</Typography>
                              </>
                            ) : (
                              <Typography variant="body2">No delivery details</Typography>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}