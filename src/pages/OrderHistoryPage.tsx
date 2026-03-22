import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Container,
  Typography,
  Chip,
  Stack,
  Divider,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  TextField,
  InputAdornment,
  useTheme,
} from '@mui/material';
import {
  History,
  ExpandMore,
  Receipt,
  ShoppingBag,
  TrendingUp,
  AccessTime,
  Refresh,
  Edit,
  Search,
} from '@mui/icons-material';
import { useConfig } from '../context/ConfigContext';
import { getUserOrders } from '../utils/orderService';
import { Order } from '../types/order';
import { supabase } from '../utils/supabase';
import EditOrderModal from '../components/EditOrderModal';
import { CancelOrderButton } from '../components/CancelOrderButton';
import { formatStatus } from '../utils/orderStatusHelpers';

export default function OrderHistoryPage() {
  const { user } = useConfig();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusUpdateNotification, setStatusUpdateNotification] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const userOrders = await getUserOrders(user);
        setOrders(userOrders);
        setFilteredOrders(userOrders);
        setError(null);
      } catch (err) {
        setError('Failed to load order history');
        console.error('Error loading orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    if (user) {
      const subscription = supabase
        .channel('user-orders')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'orders', filter: `user_id=eq.${user.id}` },
          (payload) => {
            setOrders(prev =>
              prev.map(order => order.id === payload.new.id ? { ...order, ...payload.new } : order)
            );
            setStatusUpdateNotification(`Order #${payload.new.id.toString().slice(-6)} status updated to ${payload.new.status}`);
            setTimeout(() => setStatusUpdateNotification(null), 5000);
          }
        )
        .subscribe();
      return () => { subscription.unsubscribe(); };
    }
  }, [user]);

  useEffect(() => {
    let result = orders;
    if (statusFilter !== 'all') {
      if (statusFilter === 'processing') {
        result = result.filter(o => ['pending', 'confirmed', 'in_progress'].includes(o.status));
      } else {
        result = result.filter(o => o.status === statusFilter);
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o =>
        o.id.toString().toLowerCase().includes(q) ||
        (o.config?.productType || '').toLowerCase().includes(q) ||
        (o.shipping_address?.name || o.config?.deliveryDetails?.name || '').toLowerCase().includes(q)
      );
    }
    setFilteredOrders(result);
  }, [orders, statusFilter, searchQuery]);

  const stats = {
    total: orders.length,
    active: orders.filter(o => ['pending', 'confirmed', 'in_progress'].includes(o.status)).length,
    totalSpent: orders.reduce((sum, order) => {
      if (order.total_price) return sum + order.total_price;
      if (order.config?.price) return sum + order.config.price;
      return sum;
    }, 0),
  };

  const canEditOrder = (status: string) => status === 'pending' || status === 'confirmed';
  const handleEditOrder = (order: Order) => setEditingOrder(order);
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

  const borderColor = isDark ? '#48232c' : '#f3e7ea';
  const surfaceColor = isDark ? '#2d161c' : '#ffffff';
  const surface2 = isDark ? '#391c23' : '#fcf8f9';

  const STATUS_FILTERS = [
    { label: 'All', value: 'all' },
    { label: 'Processing', value: 'processing' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  const getStatusChipColor = (status: string): { bg: string; color: string } => {
    switch (status) {
      case 'pending': return { bg: isDark ? 'rgba(251,191,36,0.15)' : 'rgba(251,191,36,0.12)', color: '#d97706' };
      case 'confirmed': return { bg: isDark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.1)', color: '#2563eb' };
      case 'in_progress': return { bg: isDark ? 'rgba(168,85,247,0.15)' : 'rgba(168,85,247,0.1)', color: '#7c3aed' };
      case 'completed': return { bg: isDark ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.1)', color: '#16a34a' };
      case 'cancelled': return { bg: isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.1)', color: '#dc2626' };
      default: return { bg: isDark ? 'rgba(156,163,175,0.15)' : 'rgba(156,163,175,0.1)', color: '#6b7280' };
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={48} sx={{ mb: 3, color: 'primary.main' }} />
          <Typography variant="h6" fontWeight={600} color="text.primary">Loading your orders…</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Just a moment</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center', maxWidth: 400, px: 3 }}>
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
          <Button variant="contained" startIcon={<Refresh />} onClick={() => window.location.reload()} sx={{ borderRadius: '0.75rem', fontWeight: 700, px: 4 }}>
            Try Again
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 8 }}>
      <Helmet>
        <title>Order History | Frosted Crusts</title>
        <meta name="description" content="View and track all your past cake orders from Frosted Crusts." />
      </Helmet>
      <Container maxWidth="lg" sx={{ pt: 5 }}>

        {/* Status Update Toast */}
        {statusUpdateNotification && (
          <Alert severity="info" onClose={() => setStatusUpdateNotification(null)} sx={{ mb: 3, borderRadius: 2, border: `1px solid ${borderColor}` }}>
            {statusUpdateNotification}
          </Alert>
        )}

        {/* Page Header */}
        <Box sx={{ mb: 5 }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
            <History sx={{ color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ letterSpacing: '-0.02em' }}>
              Order History
            </Typography>
          </Stack>
          <Typography variant="body1" color="text.secondary">
            Track and manage all your Frosted Crusts orders in one place.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 5 }}>
          {/* Total Orders */}
          <Box
            sx={{
              bgcolor: surfaceColor,
              border: `1px solid ${borderColor}`,
              borderRadius: '1rem',
              p: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(27,13,17,0.06)',
            }}
          >
            <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: isDark ? '#391c23' : '#fdf2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShoppingBag sx={{ color: 'primary.main', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ letterSpacing: '-0.02em', lineHeight: 1 }}>
                {stats.total}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>Total Orders</Typography>
            </Box>
          </Box>

          {/* Active Orders */}
          <Box
            sx={{
              bgcolor: surfaceColor,
              border: `1px solid ${borderColor}`,
              borderRadius: '1rem',
              p: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(27,13,17,0.06)',
            }}
          >
            <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: isDark ? 'rgba(251,191,36,0.12)' : 'rgba(251,191,36,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AccessTime sx={{ color: '#d97706', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ letterSpacing: '-0.02em', lineHeight: 1 }}>
                {stats.active}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>Active Orders</Typography>
            </Box>
          </Box>

          {/* Total Spent */}
          <Box
            sx={{
              bgcolor: surfaceColor,
              border: `1px solid ${borderColor}`,
              borderRadius: '1rem',
              p: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              gridColumn: { xs: '1 / -1', md: 'auto' },
              boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(27,13,17,0.06)',
            }}
          >
            <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: isDark ? 'rgba(34,197,94,0.12)' : 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <TrendingUp sx={{ color: '#16a34a', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ letterSpacing: '-0.02em', lineHeight: 1 }}>
                ₦{stats.totalSpent.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>Total Spent</Typography>
            </Box>
          </Box>
        </Box>

        {/* Filter Toolbar */}
        <Box
          sx={{
            bgcolor: surfaceColor,
            border: `1px solid ${borderColor}`,
            borderRadius: '1rem',
            p: 2.5,
            mb: 3,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 2,
          }}
        >
          {/* Search */}
          <TextField
            size="small"
            placeholder="Search orders…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'text.disabled', fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: 220,
              '& .MuiOutlinedInput-root': {
                borderRadius: '0.6rem',
                bgcolor: isDark ? '#391c23' : '#fcf8f9',
                '& fieldset': { borderColor },
              },
            }}
          />

          {/* Status Chips */}
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {STATUS_FILTERS.map(f => (
              <Chip
                key={f.value}
                label={f.label}
                onClick={() => setStatusFilter(f.value)}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  bgcolor: statusFilter === f.value
                    ? 'primary.main'
                    : isDark ? '#391c23' : '#f3e7ea',
                  color: statusFilter === f.value
                    ? '#fff'
                    : 'text.secondary',
                  border: `1px solid ${statusFilter === f.value ? 'transparent' : borderColor}`,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: statusFilter === f.value ? 'primary.dark' : isDark ? '#48232c' : '#f0dde2',
                  },
                }}
              />
            ))}
          </Stack>

          {/* Results count */}
          <Typography variant="caption" color="text.disabled" sx={{ ml: 'auto', whiteSpace: 'nowrap' }}>
            {filteredOrders.length} of {orders.length} orders
          </Typography>
        </Box>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Box
            sx={{
              bgcolor: surfaceColor,
              border: `1px solid ${borderColor}`,
              borderRadius: '1rem',
              p: 8,
              textAlign: 'center',
            }}
          >
            <Receipt sx={{ fontSize: 56, color: isDark ? '#48232c' : '#e5c8ce', mb: 2 }} />
            <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom>
              {statusFilter === 'all' && !searchQuery ? 'No Orders Yet' : 'No Matching Orders'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {statusFilter === 'all' && !searchQuery
                ? "You haven't placed any orders yet. Design your first cake!"
                : 'Try adjusting your filters or search query.'}
            </Typography>
            {(statusFilter !== 'all' || searchQuery) && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => { setStatusFilter('all'); setSearchQuery(''); }}
                sx={{ borderRadius: '0.6rem', fontWeight: 700, borderColor }}
              >
                Clear Filters
              </Button>
            )}
          </Box>
        ) : (
          <Stack spacing={2}>
            {filteredOrders.map((order) => {
              const chipStyle = getStatusChipColor(order.status);
              const orderPrice = order.total_price || order.config?.price || 0;
              const orderLabel = order.items && order.items.length > 0
                ? `${order.items.length} item${order.items.length > 1 ? 's' : ''}`
                : order.config?.productType === 'cake'
                  ? `${order.config.size}" ${order.config.flavor || ''} Cake`
                  : order.config?.productType === 'cookies'
                    ? `Cookies Box of ${order.config.boxSize}`
                    : order.config?.productType === 'muffins'
                      ? `Muffins Box of ${order.config.boxSize}`
                      : 'Order';

              return (
                <Accordion
                  key={order.id}
                  disableGutters
                  elevation={0}
                  sx={{
                    bgcolor: surfaceColor,
                    border: `1px solid ${borderColor}`,
                    borderRadius: '1rem !important',
                    overflow: 'hidden',
                    '&:before': { display: 'none' },
                    transition: 'box-shadow 0.2s',
                    '&:hover': {
                      boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.3)' : '0 8px 30px rgba(27,13,17,0.08)',
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore sx={{ color: 'text.secondary' }} />}
                    sx={{
                      px: 3,
                      py: 2,
                      '& .MuiAccordionSummary-content': {
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mr: 1,
                      },
                    }}
                  >
                    {/* Left: emoji + order info */}
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: 1, minWidth: 0 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '0.75rem',
                          bgcolor: isDark ? '#391c23' : '#fdf2f5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem',
                          flexShrink: 0,
                        }}
                      >
                        🎂
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle1" fontWeight={700} color="text.primary" noWrap>
                          {orderLabel}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                          {' · '}
                          <span style={{ fontFamily: 'monospace' }}>#{order.id.toString().slice(-6).toUpperCase()}</span>
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Right: price + status */}
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ flexShrink: 0 }}>
                      <Typography variant="subtitle1" fontWeight={800} color="primary.main">
                        ₦{orderPrice.toLocaleString()}
                      </Typography>
                      <Chip
                        label={formatStatus(order.status)}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          bgcolor: chipStyle.bg,
                          color: chipStyle.color,
                          border: 'none',
                        }}
                      />
                    </Stack>
                  </AccordionSummary>

                  <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                    <Divider sx={{ borderColor, mb: 2.5 }} />

                    {/* Cancellation Info */}
                    {order.status === 'cancelled' && order.cancelled_at && (
                      <Box sx={{ mb: 3, p: 2.5, border: `1px solid`, borderColor: 'error.main', bgcolor: isDark ? 'rgba(239,68,68,0.06)' : 'rgba(239,68,68,0.04)', borderRadius: '0.75rem' }}>
                        <Typography variant="subtitle2" fontWeight={700} color="error.main" gutterBottom>
                          Order Cancelled
                        </Typography>
                        <Stack spacing={0.5}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>When:</strong> {new Date(order.cancelled_at).toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>By:</strong> {order.cancelled_by_role === 'admin' ? 'Admin' : 'Customer'}
                          </Typography>
                          {order.cancellation_reason && (
                            <Typography variant="body2" color="text.secondary">
                              <strong>Reason:</strong> {order.cancellation_reason}
                            </Typography>
                          )}
                        </Stack>
                      </Box>
                    )}

                    {/* Action Buttons */}
                    <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
                      <CancelOrderButton order={order} isAdmin={false} onSuccess={handleEditSuccess} />
                      {canEditOrder(order.status) && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Edit sx={{ fontSize: '16px !important' }} />}
                          onClick={() => handleEditOrder(order)}
                          sx={{ borderRadius: '0.6rem', fontWeight: 700, borderColor, color: 'text.secondary', '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }}
                        >
                          Edit Order
                        </Button>
                      )}
                    </Stack>

                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                      {/* Product Details */}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" fontWeight={700} color="text.primary" sx={{ mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.72rem' }}>
                          {order.items && order.items.length > 0 ? 'Order Items' : 'Product Details'}
                        </Typography>

                        {order.items && order.items.length > 0 ? (
                          <Stack spacing={2}>
                            {order.items.map((item: any, index: number) => (
                              <ItemDetailCard key={index} item={item} surface2={surface2} borderColor={borderColor} isDark={isDark} />
                            ))}
                          </Stack>
                        ) : (
                          /* Legacy single-config order */
                          <LegacyItemCard config={order.config} surface2={surface2} borderColor={borderColor} isDark={isDark} />
                        )}
                      </Box>

                      {/* Delivery Details */}
                      {((order.items && order.shipping_address) || order.config?.deliveryDetails?.name) && (
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" fontWeight={700} color="text.primary" sx={{ mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.72rem' }}>
                            Delivery Details
                          </Typography>
                          <Box sx={{ p: 2, bgcolor: surface2, border: `1px solid ${borderColor}`, borderRadius: '0.75rem' }}>
                            <Stack spacing={1.5}>
                              {order.shipping_address ? (
                                <>
                                  <Box sx={{ display: 'flex', gap: 3 }}>
                                    <Box>
                                      <Typography variant="caption" color="text.disabled" fontWeight={600} sx={{ textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.08em' }}>Name</Typography>
                                      <Typography variant="body2" fontWeight={600} color="text.primary">{order.shipping_address.name}</Typography>
                                    </Box>
                                    <Box>
                                      <Typography variant="caption" color="text.disabled" fontWeight={600} sx={{ textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.08em' }}>Phone</Typography>
                                      <Typography variant="body2" fontWeight={600} color="text.primary">{order.shipping_address.phone}</Typography>
                                    </Box>
                                  </Box>
                                  <Box>
                                    <Typography variant="caption" color="text.disabled" fontWeight={600} sx={{ textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.08em' }}>Address</Typography>
                                    <Typography variant="body2" fontWeight={600} color="text.primary">{order.shipping_address.address}</Typography>
                                  </Box>
                                  <Box>
                                    <Typography variant="caption" color="text.disabled" fontWeight={600} sx={{ textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.08em' }}>State</Typography>
                                    <Typography variant="body2" fontWeight={600} color="text.primary">{order.shipping_address.state}</Typography>
                                  </Box>
                                </>
                              ) : order.config?.deliveryDetails?.name && (
                                <>
                                  <Box sx={{ display: 'flex', gap: 3 }}>
                                    <Box>
                                      <Typography variant="caption" color="text.disabled" fontWeight={600} sx={{ textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.08em' }}>Name</Typography>
                                      <Typography variant="body2" fontWeight={600} color="text.primary">{order.config.deliveryDetails.name}</Typography>
                                    </Box>
                                    <Box>
                                      <Typography variant="caption" color="text.disabled" fontWeight={600} sx={{ textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.08em' }}>Phone</Typography>
                                      <Typography variant="body2" fontWeight={600} color="text.primary">{order.config.deliveryDetails.phone}</Typography>
                                    </Box>
                                  </Box>
                                  <Box>
                                    <Typography variant="caption" color="text.disabled" fontWeight={600} sx={{ textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.08em' }}>Address</Typography>
                                    <Typography variant="body2" fontWeight={600} color="text.primary">{order.config.deliveryDetails.address}</Typography>
                                  </Box>
                                  <Box>
                                    <Typography variant="caption" color="text.disabled" fontWeight={600} sx={{ textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.08em' }}>State</Typography>
                                    <Typography variant="body2" fontWeight={600} color="text.primary">{order.config.deliveryDetails.state}</Typography>
                                  </Box>
                                </>
                              )}
                            </Stack>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Stack>
        )}

        {/* Pagination hint */}
        {filteredOrders.length > 0 && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="caption" color="text.disabled">
              Showing {filteredOrders.length} of {orders.length} order{orders.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
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

/* ─── Item detail card (cart-based orders) ─────────────────────── */

function ItemDetailCard({ item, surface2, borderColor, isDark }: {
  item: any; surface2: string; borderColor: string; isDark: boolean;
}) {
  const type: string = item.productType || 'item';
  const c = item.customization || {};
  const qty: number = item.quantity || 1;
  const unit: number = item.unitPrice || 0;
  const emoji = type === 'cake' ? '🎂' : type === 'cookies' ? '🍪' : '🧁';

  // flavors: prefer new per-layer array, fall back to singular field
  const flavors: string[] = c.flavors?.filter(Boolean) ||
    (c.flavor ? [c.flavor] : []);

  return (
    <Box sx={{ p: 2.5, bgcolor: surface2, border: `1px solid ${borderColor}`, borderRadius: '0.75rem' }}>
      {/* Header row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        <Box sx={{ width: 36, height: 36, borderRadius: '0.5rem', bgcolor: isDark ? '#391c23' : '#fdf2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
          {emoji}
        </Box>
        <Typography variant="subtitle2" fontWeight={800} color="text.primary" sx={{ textTransform: 'capitalize', flex: 1 }}>
          {type.charAt(0).toUpperCase() + type.slice(1)} <span style={{ fontWeight: 400, opacity: 0.6 }}>(Qty: {qty})</span>
        </Typography>
        <Typography variant="subtitle2" fontWeight={700} color="primary.main" sx={{ flexShrink: 0 }}>
          ₦{unit.toLocaleString()} × {qty} = ₦{(unit * qty).toLocaleString()}
        </Typography>
      </Box>

      <DetailRows type={type} c={c} flavors={flavors} borderColor={borderColor} isDark={isDark} />
    </Box>
  );
}

/* ─── Legacy config card (old single-config orders) ────────────── */

function LegacyItemCard({ config, surface2, borderColor, isDark }: {
  config: any; surface2: string; borderColor: string; isDark: boolean;
}) {
  const type: string = config.productType || 'item';
  const emoji = type === 'cake' ? '🎂' : type === 'cookies' ? '🍪' : '🧁';
  const flavors: string[] = config.flavors?.filter(Boolean) ||
    (config.flavor ? [config.flavor] : []);

  return (
    <Box sx={{ p: 2.5, bgcolor: surface2, border: `1px solid ${borderColor}`, borderRadius: '0.75rem' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        <Box sx={{ width: 36, height: 36, borderRadius: '0.5rem', bgcolor: isDark ? '#391c23' : '#fdf2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
          {emoji}
        </Box>
        <Typography variant="subtitle2" fontWeight={800} color="text.primary" sx={{ textTransform: 'capitalize' }}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Typography>
      </Box>
      <DetailRows type={type} c={config} flavors={flavors} borderColor={borderColor} isDark={isDark} />
    </Box>
  );
}

/* ─── Shared row renderer ───────────────────────────────────────── */

function DetailRows({ type, c, flavors, borderColor, isDark }: {
  type: string; c: any; flavors: string[]; borderColor: string; isDark: boolean;
}) {
  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <Box sx={{ display: 'flex', gap: 1, py: 0.35, borderBottom: `1px solid ${isDark ? 'rgba(72,35,44,0.5)' : 'rgba(243,231,234,0.7)'}`, '&:last-child': { borderBottom: 'none' } }}>
      <Typography variant="caption" color="text.disabled" fontWeight={600} sx={{ minWidth: 120, flexShrink: 0 }}>{label}</Typography>
      <Typography variant="caption" color="text.primary" fontWeight={500} sx={{ textTransform: 'capitalize' }}>{value}</Typography>
    </Box>
  );

  if (type === 'cake') {
    const size    = c.size    || c.customization?.size;
    const shape   = c.shape   || c.customization?.shape;
    const layers  = c.layers  || c.customization?.layers;
    const filling = c.filling || c.customization?.filling;
    const addons  = c.addons  || c.customization?.addons || [];
    const text    = c.text    || c.customization?.text;

    return (
      <Box>
        {(size || shape || layers) && (
          <Row label="Size / Shape / Layers" value={[size && `${size}"`, shape, layers && `${layers} layer${layers > 1 ? 's' : ''}`].filter(Boolean).join(' • ')} />
        )}
        {flavors.length === 1 && <Row label="Flavour" value={flavors[0]} />}
        {flavors.length > 1 && flavors.map((f, i) => (
          <Row key={i} label={`Layer ${i + 1} flavour`} value={f || '—'} />
        ))}
        {filling && <Row label="Filling" value={filling} />}
        {addons.length > 0 && <Row label="Add-ons" value={addons.join(', ')} />}
        {text && <Row label="Writing" value={`"${text}"`} />}
      </Box>
    );
  }

  if (type === 'cookies' || type === 'muffins') {
    const boxSize    = c.boxSize    || c.customization?.boxSize;
    const boxFlavors = c.boxFlavors || c.customization?.boxFlavors || [];
    return (
      <Box>
        {boxSize && <Row label="Box size" value={`Box of ${boxSize}`} />}
        {boxFlavors.length > 0 && <Row label="Flavours" value={boxFlavors.join(', ')} />}
      </Box>
    );
  }

  return null;
}
