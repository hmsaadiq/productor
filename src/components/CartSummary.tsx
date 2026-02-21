import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar,
  CardContent,
  Stack,
} from '@mui/material';
import {
  Receipt,
  Cake,
  Cookie,
  AttachMoney,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';

export default function CartSummary() {
  const { items, totalPrice, totalItems } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      currencyDisplay: 'narrowSymbol',
    }).format(price);
  };

  const getProductIcon = (productType: string) => {
    switch (productType) {
      case 'cake':
        return <Cake sx={{ color: 'primary.main' }} />;
      case 'cookies':
      case 'muffins':
        return <Cookie sx={{ color: 'primary.main' }} />;
      default:
        return <Receipt sx={{ color: 'primary.main' }} />;
    }
  };

  const formatCustomization = (customization: any, productType: string) => {
    const details = [];
    if (productType === 'cake') {
      if (customization.size) details.push(`${customization.size}"`);
      if (customization.shape) details.push(customization.shape);
      if (customization.layers) details.push(`${customization.layers} layer${customization.layers > 1 ? 's' : ''}`);
      if (customization.flavor) details.push(customization.flavor);
      if (customization.text) details.push(`"${customization.text}"`);
    } else {
      if (customization.boxSize) details.push(`Box of ${customization.boxSize}`);
      if (customization.boxFlavors?.length) details.push(customization.boxFlavors.join(', '));
    }
    return details.join(' • ');
  };

  return (
    <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{ 
        p: 3, 
        backgroundColor: 'grey.50',
        borderBottom: '1px solid',
        borderColor: 'grey.200'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ backgroundColor: 'primary.main' }}>
            <Receipt />
          </Avatar>
          <Typography variant="h6" component="h2" fontWeight="bold">
            Order Summary ({totalItems} items)
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ p: 3 }}>
        <List dense sx={{ py: 0 }}>
          {items.map((item, index) => (
            <React.Fragment key={item.id || index}>
              <ListItem sx={{ px: 0, py: 2, alignItems: 'flex-start' }}>
                <Box sx={{ mr: 2, mt: 0.5 }}>
                  {getProductIcon(item.productType)}
                </Box>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {item.productType.charAt(0).toUpperCase() + item.productType.slice(1)}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {formatCustomization(item.customization, item.productType)}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip 
                          label={`Qty: ${item.quantity}`} 
                          size="small" 
                          variant="outlined" 
                        />
                        <Typography variant="caption" color="text.secondary">
                          {formatPrice(item.unitPrice)} each
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
              {index < items.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ 
          p: 2, 
          backgroundColor: 'primary.main',
          borderRadius: 2,
          color: 'white',
          textAlign: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
            <AttachMoney />
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Total Amount
            </Typography>
          </Box>
          <Typography variant="h4" fontWeight="bold">
            {formatPrice(totalPrice)}
          </Typography>
        </Box>
      </CardContent>
    </Paper>
  );
}