import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Alert } from '@mui/material';
import { cancelOrder } from '../utils/orderService';
import { Order } from '../types/order';

interface CancelOrderButtonProps {
  order: Order;
  isAdmin: boolean;
  onSuccess: () => void;
}

export const CancelOrderButton: React.FC<CancelOrderButtonProps> = ({ order, isAdmin, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const shouldShow = () => {
    if (order.status === 'cancelled') return false;
    if (isAdmin) return ['pending', 'confirmed', 'in_progress'].includes(order.status);
    return ['pending', 'confirmed'].includes(order.status);
  };

  const handleCancel = async () => {
    setLoading(true);
    setError('');

    const result = await cancelOrder(order.id, reason);

    setLoading(false);

    if (result.success) {
      setOpen(false);
      setReason('');
      onSuccess();
    } else {
      setError(result.error || 'Failed to cancel order');
    }
  };

  if (!shouldShow()) return null;

  return (
    <>
      <Button
        variant="outlined"
        color="error"
        size="small"
        onClick={() => setOpen(true)}
        sx={{
          px: 1.25,
          py: 0.25,
          minWidth: 'auto',
          lineHeight: 1.2,
          fontSize: '0.75rem',
        }}
      >
        Cancel Order
      </Button>

      <Dialog open={open} onClose={() => !loading && setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cancel Order #{order.id}</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to cancel this order? This action cannot be undone.
          </Alert>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reason for cancellation (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={loading}
            inputProps={{ maxLength: 500 }}
            helperText={`${reason.length}/500 characters`}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={loading}>
            Keep Order
          </Button>
          <Button
            onClick={handleCancel}
            color="error"
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={16} />}
          >
            {loading ? 'Cancelling...' : 'Yes, Cancel Order'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
