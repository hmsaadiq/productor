// FRONTEND PRODUCT CARD COMPONENT: This file defines a reusable ProductCard component for displaying products.
// It provides a consistent card layout for showcasing cakes, cookies, and muffins with pricing and actions.
//
// Design Patterns: Uses the React Component pattern and presentational component pattern for reusable UI.
// Data Structures: Uses props for product data and callback functions.
// Security: No direct security features; only displays product information.

import React from 'react';
// Import MUI components for product card UI
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Rating,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';

// Define the props for the ProductCard component
interface ProductCardProps {
  title: string;
  description: string;
  price: number;
  image?: string;
  rating?: number;
  category: 'cake' | 'cookies' | 'muffins';
  isFavorite?: boolean;
  onAddToCart?: () => void;
  onToggleFavorite?: () => void;
  onViewDetails?: () => void;
}

// ProductCard component displays product information in a card format - New: Reusable MUI product card.
export default function ProductCard({
  title,
  description,
  price,
  image,
  rating = 0,
  category,
  isFavorite = false,
  onAddToCart,
  onToggleFavorite,
  onViewDetails,
}: ProductCardProps) {
  // Get category color
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'cake': return 'primary';
      case 'cookies': return 'secondary';
      case 'muffins': return 'success';
      default: return 'default';
    }
  };

  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      {/* Product Image Placeholder */}
      <Box
        sx={{
          height: 200,
          bgcolor: 'grey.100',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {image ? (
          <img
            src={image}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            Product Image
          </Typography>
        )}
        
        {/* Category Chip */}
        <Chip
          label={category.charAt(0).toUpperCase() + category.slice(1)}
          color={getCategoryColor(category) as any}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
          }}
        />
        
        {/* Favorite Button */}
        <Button
          size="small"
          onClick={onToggleFavorite}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            minWidth: 'auto',
            p: 1,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 1)',
            },
          }}
        >
          {isFavorite ? (
            <Favorite sx={{ color: 'error.main' }} />
          ) : (
            <FavoriteBorder sx={{ color: 'grey.600' }} />
          )}
        </Button>
      </Box>

      {/* Product Content */}
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        
        {/* Rating */}
        {rating > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={rating} readOnly size="small" />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({rating})
            </Typography>
          </Box>
        )}
        
        {/* Price */}
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
          {new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            currencyDisplay: 'narrowSymbol'
          }).format(price)}
        </Typography>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ p: 3, pt: 0 }}>
        <Button
          variant="contained"
          startIcon={<ShoppingCart />}
          onClick={onAddToCart}
          sx={{
            flex: 1,
            borderRadius: 2,
            textTransform: 'none',
            py: 1,
          }}
        >
          Add to Cart
        </Button>
        
        <Button
          variant="outlined"
          onClick={onViewDetails}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            py: 1,
            px: 3,
          }}
        >
          Details
        </Button>
      </CardActions>
    </Card>
  );
}