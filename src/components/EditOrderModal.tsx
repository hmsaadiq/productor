import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import { supabase } from '../utils/supabase';

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  onSuccess: () => void;
}

export default function EditOrderModal({ isOpen, onClose, order, onSuccess }: EditOrderModalProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({
    name: order?.shipping_address?.name || '',
    address: order?.shipping_address?.address || '',
    phone: order?.shipping_address?.phone || '',
    state: order?.shipping_address?.state || '',
  });
  const [items, setItems] = useState(order?.items || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...items];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updatedItems[index] = {
        ...updatedItems[index],
        [parent]: {
          ...updatedItems[index][parent],
          [child]: value
        }
      };
    } else {
      updatedItems[index] = { ...updatedItems[index], [field]: value };
    }
    setItems(updatedItems);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error: updateError } = await supabase
        .from('orders')
        .update({
          shipping_address: shippingAddress,
          items: items,
          status: 'pending',
        })
        .eq('id', order.id);

      if (updateError) throw updateError;

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Order #{order?.id}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            Editing this order will reset its status to "Pending" for admin review. You can only edit text/messages - not sizes, flavors, or quantities.
          </Alert>

          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 3 }}>
            <Tab label="Delivery Address" />
            <Tab label="Product Details" />
          </Tabs>

          {activeTab === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Full Name"
                value={shippingAddress.name}
                onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                fullWidth
              />
              <TextField
                label="Phone Number"
                value={shippingAddress.phone}
                onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                fullWidth
              />
              <TextField
                label="Delivery Address"
                value={shippingAddress.address}
                onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                fullWidth
                multiline
                rows={3}
              />
              <TextField
                label="State"
                value={shippingAddress.state}
                onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                fullWidth
              />
            </Box>
          )}

          {activeTab === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {items.map((item: any, index: number) => (
                <Box key={index} sx={{ p: 2, border: 1, borderColor: 'grey.300', borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, textTransform: 'capitalize' }}>
                    {item.productType} (Item {index + 1})
                  </Typography>
                  
                  <Alert severity="warning" sx={{ mb: 2, fontSize: '0.875rem' }}>
                    Size: {item.customization.size || item.customization.boxSize} • Flavor: {item.customization.flavor || item.customization.boxFlavors?.join(', ')} • Quantity: {item.quantity}
                    <br />
                    <strong>These cannot be changed</strong>
                  </Alert>

                  {item.productType === 'cake' && (
                    <TextField
                      label="Custom Text/Message on Cake"
                      value={item.customization.text || ''}
                      onChange={(e) => handleItemChange(index, 'customization.text', e.target.value)}
                      fullWidth
                      inputProps={{ maxLength: 40 }}
                      helperText={`${40 - (item.customization.text?.length || 0)} characters remaining`}
                    />
                  )}

                  {!item.productType || item.productType === 'cake' ? null : (
                    <Typography variant="body2" color="text.secondary">
                      No editable fields for this product type
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}