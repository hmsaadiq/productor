// FRONTEND PRICE SUMMARY COMPONENT: This file defines the PriceSummary component for the React frontend.
// It displays a summary of the current cake configuration and the total price.
//
// Design Patterns: Uses the React Component pattern, Context pattern for global state, and presentational component pattern.
// Data Structures: Uses context objects, arrays for add-ons, and formatting utilities.
// Security: No direct security features; only displays data from context.

// Import React for component creation.
import React from 'react';
// Import MUI components for enhanced price summary UI
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
  LocalShipping,
  AttachMoney,
} from '@mui/icons-material';
// Import useConfig hook to access current cake configuration from context.
import { useConfig } from '../context/ConfigContext';
// Import the dynamic product preview renderer.
import ProductPreview from './ProductPreview';

// PriceSummary component displays the current cake configuration and price - Updated: Enhanced with MUI styling and better organization.
export default function PriceSummary() {
  // Get current config from context.
  const { config } = useConfig();

  // Helper function to format price as NGN currency.
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      currencyDisplay: 'narrowSymbol',
    }).format(price);
  };

  // Get product icon based on type
  const getProductIcon = () => {
    switch (config.productType) {
      case 'cake':
        return <Cake sx={{ color: 'primary.main' }} />;
      case 'cookies':
      case 'muffins':
        return <Cookie sx={{ color: 'primary.main' }} />;
      default:
        return <Receipt sx={{ color: 'primary.main' }} />;
    }
  };

  // Render the summary UI - Updated: Enhanced with MUI components and improved layout.
  return (
    <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      {/* Header Section - New: Added visual header with icon */}
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
            Order Summary
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ p: 3 }}>
        {/* Product Information - Updated: Enhanced with visual elements */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            {getProductIcon()}
            <Typography variant="subtitle1" fontWeight="bold">
              Product Details
            </Typography>
          </Box>

          <List dense sx={{ py: 0 }}>
            <ListItem sx={{ px: 0, py: 0.5 }}>
              <ListItemText 
                primary="Product Type"
                secondary={
                  <Chip 
                    label={config.productType?.charAt(0).toUpperCase() + config.productType?.slice(1) || 'Not selected'}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                }
              />
            </ListItem>

            {/* Cake Options - Updated: Enhanced with better formatting */}
            {config.productType === 'cake' && (
              <>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemText 
                    primary="Shape & Size"
                    secondary={`${config.shape ? config.shape.charAt(0).toUpperCase() + config.shape.slice(1) : 'Not selected'} • ${config.size || 'Not selected'}"`}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemText 
                    primary="Layers & Flavor"
                    secondary={`${config.layers || 1} layer${config.layers !== 1 ? 's' : ''} • ${config.flavor ? config.flavor.charAt(0).toUpperCase() + config.flavor.slice(1) : 'Not selected'}`}
                  />
                </ListItem>
                
                {/* Add-ons - Updated: Enhanced with chips */}
                {config.addons && config.addons.length > 0 && (
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemText 
                      primary="Add-ons"
                      secondary={
                        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                          {config.addons.map(addon => (
                            <Chip 
                              key={addon}
                              label={addon.charAt(0).toUpperCase() + addon.slice(1)}
                              size="small"
                              variant="outlined"
                              color="secondary"
                            />
                          ))}
                        </Stack>
                      }
                    />
                  </ListItem>
                )}

                {/* Custom Text - Updated: Enhanced display */}
                {config.text && (
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemText 
                      primary="Custom Text"
                      secondary={
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontStyle: 'italic',
                            color: 'primary.main',
                            fontWeight: 500
                          }}
                        >
                          "{config.text}"
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
              </>
            )}

            {/* Cookies/Muffins Options - Updated: Enhanced formatting */}
            {(config.productType === 'cookies' || config.productType === 'muffins') && (
              <>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemText 
                    primary="Box Size"
                    secondary={config.boxSize ? `Box of ${config.boxSize}` : 'Not selected'}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemText 
                    primary="Flavors"
                    secondary={
                      config.boxFlavors && config.boxFlavors.length > 0 ? (
                        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                          {config.boxFlavors.map(flavor => (
                            <Chip 
                              key={flavor}
                              label={flavor.charAt(0).toUpperCase() + flavor.slice(1)}
                              size="small"
                              variant="outlined"
                              color="secondary"
                            />
                          ))}
                        </Stack>
                      ) : 'No flavors selected'
                    }
                  />
                </ListItem>
              </>
            )}
          </List>
        </Box>

        {/* Delivery Details - Updated: Enhanced with shipping icon */}
        {config.deliveryDetails && config.deliveryDetails.name && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LocalShipping sx={{ color: 'primary.main' }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Delivery Details
                </Typography>
              </Box>

              <List dense sx={{ py: 0 }}>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemText 
                    primary="Recipient"
                    secondary={config.deliveryDetails.name}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemText 
                    primary="Address"
                    secondary={config.deliveryDetails.address}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemText 
                    primary="Contact"
                    secondary={`${config.deliveryDetails.phone} • ${config.deliveryDetails.state}`}
                  />
                </ListItem>
              </List>
            </Box>
          </>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Total Price - Updated: Enhanced with prominent styling */}
        <Box sx={{ 
          p: 2, 
          backgroundColor: 'primary.main',
          borderRadius: 2,
          color: 'primary.contrastText',
          textAlign: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
            <AttachMoney />
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Total Amount
            </Typography>
          </Box>
          <Typography variant="h4" fontWeight="bold">
            {formatPrice(config.price)}
          </Typography>
        </Box>

        {/* Product Preview - Dynamic SVG renderer */}
        <ProductPreview />
      </CardContent>
    </Paper>
  );
}