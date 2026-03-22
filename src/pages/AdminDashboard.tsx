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
  Divider,
  Skeleton,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { InboxOutlined } from '@mui/icons-material';
import { supabase } from '../utils/supabase';
import { useConfig } from '../context/ConfigContext';
import { CancelOrderButton } from '../components/CancelOrderButton';
import { Order as OrderType } from '../types/order';
import { AdminOrderStatusControls } from '../components/AdminOrderStatusControls';
import { OrderStatus } from '../utils/orderStatusHelpers';

interface Order {
  id: number;
  user_id: string;
  items: any;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'out_for_delivery' | 'delivered';
  total_price: number;
  shipping_address: any;
  created_at: string;
  config: any;
  updated_at?: string;
  cancelled_at?: string;
  cancelled_by?: string;
  cancelled_by_role?: 'user' | 'admin';
  cancellation_reason?: string;
  previous_status?: string;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useConfig();
  const [userProfiles, setUserProfiles] = useState<{[key: string]: any}>({});
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedMobileId, setExpandedMobileId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedMobileId(prev => (prev === id ? null : id));
  };

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
        // Filter out null — guest orders have no user_id, and .in() rejects null values
        const userIds = Array.from(new Set(orders.map(order => order.user_id).filter(Boolean)));
        if (userIds.length === 0) return;
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
        order.id === orderId ? { ...order, status: newStatus as Order['status'] } : order
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

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Skeleton variant="text" width={250} height={48} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={48} sx={{ mb: 3 }} />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {Array.from({ length: 9 }).map((_, i) => (
                  <TableCell key={i}><Skeleton variant="text" /></TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 9 }).map((_, j) => (
                    <TableCell key={j}><Skeleton variant="text" /></TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Total Orders: {orders.length}
      </Alert>

      {orders.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <InboxOutlined sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No orders yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Orders will appear here as customers place them.
          </Typography>
        </Box>
      ) : (
      <>
      {/* Desktop: Table view */}
      {!isMobile && (
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
                          {userProfiles[order.user_id]?.full_name || order.shipping_address?.name || 'Guest'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {userProfiles[order.user_id]?.email || order.shipping_address?.email || 'No email'}
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
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexDirection: 'column' }}>
                        <AdminOrderStatusControls
                          currentStatus={order.status as OrderStatus}
                          onStatusChange={async (newStatus: OrderStatus) => {
                            await updateOrderStatus(order.id, newStatus);
                          }}
                        />
                        <CancelOrderButton
                          order={{
                            id: String(order.id),
                            userId: order.user_id,
                            createdAt: order.created_at,
                            status: order.status,
                            config: order.config,
                          } as OrderType}
                          isAdmin={true}
                          onSuccess={loadOrders}
                        />
                      </Box>
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
                      <TableCell colSpan={9} sx={{ bgcolor: 'background.default', p: 3 }}>
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

                        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
                          {/* Order Items */}
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                              Order Items
                            </Typography>
                            {Array.isArray(order.items) ? (
                              order.items.map((item: any, idx: number) => (
                                <Box key={idx} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, borderLeft: '3px solid', borderColor: 'primary.main' }}>
                                  <Typography variant="body2" fontWeight="bold" sx={{ textTransform: 'capitalize', mb: 0.5 }}>
                                    {item.productType || 'Item'} (Qty: {item.quantity || 1})
                                  </Typography>
                                  {item.productType === 'cake' && item.customization && (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                                      <Typography variant="caption" color="text.secondary">
                                        <strong>Size:</strong> {item.customization.size}" • <strong>Shape:</strong> {item.customization.shape} • <strong>Layers:</strong> {item.customization.layers}
                                      </Typography>
                                      {(item.customization.flavors || []).length > 0
                                        ? (item.customization.flavors || []).map((f: string, li: number) => (
                                          <Typography key={li} variant="caption" color="text.secondary">
                                            <strong>Layer {li + 1} flavor:</strong> {f}
                                          </Typography>
                                        ))
                                        : item.customization.flavor && (
                                          <Typography variant="caption" color="text.secondary">
                                            <strong>Flavor:</strong> {item.customization.flavor}
                                          </Typography>
                                        )
                                      }
                                      {item.customization.filling && (
                                        <Typography variant="caption" color="text.secondary">
                                          <strong>Filling:</strong> {item.customization.filling}
                                        </Typography>
                                      )}
                                      {item.customization.addons?.length > 0 && (
                                        <Typography variant="caption" color="text.secondary">
                                          <strong>Add-ons:</strong> {item.customization.addons.join(', ')}
                                        </Typography>
                                      )}
                                      {item.customization.text && (
                                        <Typography variant="caption" color="text.secondary">
                                          <strong>Writing:</strong> "{item.customization.text}"
                                        </Typography>
                                      )}
                                    </Box>
                                  )}
                                  {(item.productType === 'cookies' || item.productType === 'muffins') && item.customization && (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                                      <Typography variant="caption" color="text.secondary">
                                        <strong>Box size:</strong> {item.customization.boxSize}
                                      </Typography>
                                      {item.customization.boxFlavors?.length > 0 && (
                                        <Typography variant="caption" color="text.secondary">
                                          <strong>Flavors:</strong> {item.customization.boxFlavors.join(', ')}
                                        </Typography>
                                      )}
                                    </Box>
                                  )}
                                  <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>
                                    ₦{item.unitPrice?.toLocaleString()} × {item.quantity} = ₦{(item.unitPrice * item.quantity).toLocaleString()}
                                  </Typography>
                                </Box>
                              ))
                            ) : order.config ? (
                              <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, borderLeft: '3px solid', borderColor: 'primary.main' }}>
                                <Typography variant="body2" fontWeight="bold" sx={{ textTransform: 'capitalize', mb: 0.5 }}>
                                  {order.config.productType}
                                </Typography>
                                {order.config.productType === 'cake' && (
                                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                                    <Typography variant="caption" color="text.secondary">
                                      <strong>Size:</strong> {order.config.size}" • <strong>Shape:</strong> {order.config.shape} • <strong>Layers:</strong> {order.config.layers}
                                    </Typography>
                                    {(order.config.flavors || []).length > 0
                                      ? (order.config.flavors || []).map((f: string, li: number) => (
                                        <Typography key={li} variant="caption" color="text.secondary">
                                          <strong>Layer {li + 1} flavor:</strong> {f}
                                        </Typography>
                                      ))
                                      : order.config.flavor && (
                                        <Typography variant="caption" color="text.secondary">
                                          <strong>Flavor:</strong> {order.config.flavor}
                                        </Typography>
                                      )
                                    }
                                    {order.config.filling && (
                                      <Typography variant="caption" color="text.secondary">
                                        <strong>Filling:</strong> {order.config.filling}
                                      </Typography>
                                    )}
                                    {order.config.addons?.length > 0 && (
                                      <Typography variant="caption" color="text.secondary">
                                        <strong>Add-ons:</strong> {order.config.addons.join(', ')}
                                      </Typography>
                                    )}
                                    {order.config.text && (
                                      <Typography variant="caption" color="text.secondary">
                                        <strong>Writing:</strong> "{order.config.text}"
                                      </Typography>
                                    )}
                                  </Box>
                                )}
                                {(order.config.productType === 'cookies' || order.config.productType === 'muffins') && (
                                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                                    <Typography variant="caption" color="text.secondary">
                                      <strong>Box size:</strong> {order.config.boxSize}
                                    </Typography>
                                    {order.config.boxFlavors?.length > 0 && (
                                      <Typography variant="caption" color="text.secondary">
                                        <strong>Flavors:</strong> {order.config.boxFlavors.join(', ')}
                                      </Typography>
                                    )}
                                  </Box>
                                )}
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
                            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                              {order.shipping_address ? (
                                <>
                                  <Typography variant="body2"><strong>Name:</strong> {order.shipping_address.name}</Typography>
                                  <Typography variant="body2"><strong>Phone:</strong> {order.shipping_address.phone}</Typography>
                                  <Typography variant="body2"><strong>Address:</strong> {order.shipping_address.address}</Typography>
                                  <Typography variant="body2"><strong>State:</strong> {order.shipping_address.state}</Typography>
                                  {order.shipping_address.deliveryDate && <Typography variant="body2"><strong>Date:</strong> {order.shipping_address.deliveryDate}</Typography>}
                                  {order.shipping_address.timeSlot && <Typography variant="body2"><strong>Time slot:</strong> {order.shipping_address.timeSlot}</Typography>}
                                  {order.shipping_address.instructions && <Typography variant="body2" sx={{ mt: 0.5, p: 1, bgcolor: 'warning.50', borderLeft: '3px solid', borderColor: 'warning.main', borderRadius: 0.5 }}><strong>Instructions:</strong> {order.shipping_address.instructions}</Typography>}
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
      )}

      {/* Mobile: Card view */}
      {isMobile && (
        <Box display="flex" flexDirection="column" gap={2}>
          {orders.map(order => (
            <Paper key={order.id} sx={{ p: 2, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {/* Header: ID + status chip */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    #{order.id}
                  </Typography>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status) as any}
                    size="small"
                  />
                </Box>

                {/* Customer */}
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {userProfiles[order.user_id]?.full_name || order.shipping_address?.name || 'Guest'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {userProfiles[order.user_id]?.email || order.shipping_address?.email || 'No email'}
                  </Typography>
                </Box>

                {/* Total + Date */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" fontWeight="bold">
                    ₦{(order.total_price || order.config?.price || 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(order.created_at).toLocaleDateString()}
                  </Typography>
                </Box>

                {/* Status controls */}
                <AdminOrderStatusControls
                  currentStatus={order.status as OrderStatus}
                  onStatusChange={async (newStatus: OrderStatus) => {
                    await updateOrderStatus(order.id, newStatus);
                  }}
                />
                <CancelOrderButton
                  order={{
                    id: String(order.id),
                    userId: order.user_id,
                    createdAt: order.created_at,
                    status: order.status,
                    config: order.config,
                  } as OrderType}
                  isAdmin={true}
                  onSuccess={loadOrders}
                />

                {/* View Details toggle */}
                <Button size="small" onClick={() => toggleExpand(order.id)}>
                  {expandedMobileId === order.id ? 'Hide Details' : 'View Details'}
                </Button>

                {/* Expandable details */}
                {expandedMobileId === order.id && (
                  <Box mt={2} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Cancellation info */}
                    {order.status === 'cancelled' && order.cancelled_at && (
                      <Box sx={{ p: 1.5, border: 1, borderColor: 'error.main', borderRadius: 1 }}>
                        <Typography variant="body2" fontWeight="bold" color="error.dark">
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
                            <strong>Previous status:</strong> {order.previous_status}
                          </Typography>
                        )}
                      </Box>
                    )}

                    <Divider />

                    {/* Order items */}
                    <Box>
                      <Typography variant="body2" fontWeight="bold" gutterBottom>
                        Order Items
                      </Typography>
                      {Array.isArray(order.items) ? (
                        order.items.map((item: any, idx: number) => (
                          <Box key={idx} sx={{ mb: 1, p: 1.5, bgcolor: 'background.default', borderRadius: 1, borderLeft: '3px solid', borderColor: 'primary.main' }}>
                            <Typography variant="body2" fontWeight="bold" sx={{ textTransform: 'capitalize', mb: 0.5 }}>
                              {item.productType || 'Item'} (Qty: {item.quantity || 1})
                            </Typography>
                            {item.productType === 'cake' && item.customization && (
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                                <Typography variant="caption" color="text.secondary">
                                  <strong>Size:</strong> {item.customization.size}" • <strong>Shape:</strong> {item.customization.shape} • <strong>Layers:</strong> {item.customization.layers}
                                </Typography>
                                {(item.customization.flavors || []).length > 0
                                  ? (item.customization.flavors || []).map((f: string, li: number) => (
                                    <Typography key={li} variant="caption" color="text.secondary">
                                      <strong>Layer {li + 1} flavor:</strong> {f}
                                    </Typography>
                                  ))
                                  : item.customization.flavor && (
                                    <Typography variant="caption" color="text.secondary">
                                      <strong>Flavor:</strong> {item.customization.flavor}
                                    </Typography>
                                  )
                                }
                                {item.customization.filling && (
                                  <Typography variant="caption" color="text.secondary">
                                    <strong>Filling:</strong> {item.customization.filling}
                                  </Typography>
                                )}
                                {item.customization.addons?.length > 0 && (
                                  <Typography variant="caption" color="text.secondary">
                                    <strong>Add-ons:</strong> {item.customization.addons.join(', ')}
                                  </Typography>
                                )}
                                {item.customization.text && (
                                  <Typography variant="caption" color="text.secondary">
                                    <strong>Writing:</strong> "{item.customization.text}"
                                  </Typography>
                                )}
                              </Box>
                            )}
                            {(item.productType === 'cookies' || item.productType === 'muffins') && item.customization && (
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                                <Typography variant="caption" color="text.secondary">
                                  <strong>Box size:</strong> {item.customization.boxSize}
                                </Typography>
                                {item.customization.boxFlavors?.length > 0 && (
                                  <Typography variant="caption" color="text.secondary">
                                    <strong>Flavors:</strong> {item.customization.boxFlavors.join(', ')}
                                  </Typography>
                                )}
                              </Box>
                            )}
                            <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 600 }}>
                              ₦{item.unitPrice?.toLocaleString()} × {item.quantity} = ₦{(item.unitPrice * item.quantity).toLocaleString()}
                            </Typography>
                          </Box>
                        ))
                      ) : order.config ? (
                        <Box sx={{ p: 1.5, bgcolor: 'background.default', borderRadius: 1, borderLeft: '3px solid', borderColor: 'primary.main' }}>
                          <Typography variant="body2" fontWeight="bold" sx={{ textTransform: 'capitalize', mb: 0.5 }}>
                            {order.config.productType}
                          </Typography>
                          {order.config.productType === 'cake' && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                              <Typography variant="caption" color="text.secondary">
                                <strong>Size:</strong> {order.config.size}" • <strong>Shape:</strong> {order.config.shape} • <strong>Layers:</strong> {order.config.layers}
                              </Typography>
                              {(order.config.flavors || []).length > 0
                                ? (order.config.flavors || []).map((f: string, li: number) => (
                                  <Typography key={li} variant="caption" color="text.secondary">
                                    <strong>Layer {li + 1} flavor:</strong> {f}
                                  </Typography>
                                ))
                                : order.config.flavor && (
                                  <Typography variant="caption" color="text.secondary">
                                    <strong>Flavor:</strong> {order.config.flavor}
                                  </Typography>
                                )
                              }
                              {order.config.filling && (
                                <Typography variant="caption" color="text.secondary">
                                  <strong>Filling:</strong> {order.config.filling}
                                </Typography>
                              )}
                              {order.config.addons?.length > 0 && (
                                <Typography variant="caption" color="text.secondary">
                                  <strong>Add-ons:</strong> {order.config.addons.join(', ')}
                                </Typography>
                              )}
                              {order.config.text && (
                                <Typography variant="caption" color="text.secondary">
                                  <strong>Writing:</strong> "{order.config.text}"
                                </Typography>
                              )}
                            </Box>
                          )}
                          {(order.config.productType === 'cookies' || order.config.productType === 'muffins') && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                              <Typography variant="caption" color="text.secondary">
                                <strong>Box size:</strong> {order.config.boxSize}
                              </Typography>
                              {order.config.boxFlavors?.length > 0 && (
                                <Typography variant="caption" color="text.secondary">
                                  <strong>Flavors:</strong> {order.config.boxFlavors.join(', ')}
                                </Typography>
                              )}
                            </Box>
                          )}
                        </Box>
                      ) : (
                        <Typography variant="body2">No items</Typography>
                      )}
                    </Box>

                    <Divider />

                    {/* Shipping address */}
                    <Box>
                      <Typography variant="body2" fontWeight="bold" gutterBottom>
                        Delivery Address
                      </Typography>
                      <Box sx={{ p: 1.5, bgcolor: 'background.default', borderRadius: 1 }}>
                        {order.shipping_address ? (
                          <>
                            <Typography variant="body2"><strong>Name:</strong> {order.shipping_address.name}</Typography>
                            <Typography variant="body2"><strong>Phone:</strong> {order.shipping_address.phone}</Typography>
                            <Typography variant="body2"><strong>Address:</strong> {order.shipping_address.address}</Typography>
                            <Typography variant="body2"><strong>State:</strong> {order.shipping_address.state}</Typography>
                            {order.shipping_address.deliveryDate && <Typography variant="body2"><strong>Date:</strong> {order.shipping_address.deliveryDate}</Typography>}
                            {order.shipping_address.timeSlot && <Typography variant="body2"><strong>Time slot:</strong> {order.shipping_address.timeSlot}</Typography>}
                            {order.shipping_address.instructions && <Typography variant="body2" sx={{ mt: 0.5, p: 1, bgcolor: 'warning.50', borderLeft: '3px solid', borderColor: 'warning.main', borderRadius: 0.5 }}><strong>Instructions:</strong> {order.shipping_address.instructions}</Typography>}
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
                )}
              </Box>
            </Paper>
          ))}
        </Box>
      )}
      </>
      )}
    </Container>
  );
}