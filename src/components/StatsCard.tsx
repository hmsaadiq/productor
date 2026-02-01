// FRONTEND STATS CARD COMPONENT: This file defines a reusable StatsCard component for displaying statistics.
// It provides a consistent card layout for showcasing metrics, numbers, and trends in dashboards.
//
// Design Patterns: Uses the React Component pattern and presentational component pattern for reusable UI.
// Data Structures: Uses props for statistic data and styling options.
// Security: No direct security features; only displays statistical information.

import React from 'react';
// Import MUI components for stats card UI
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
} from '@mui/icons-material';

// Define the props for the StatsCard component
interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'flat';
  trendValue?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  variant?: 'default' | 'gradient';
}

// StatsCard component displays statistics in a card format - New: Reusable MUI stats card.
export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color = 'primary',
  variant = 'default',
}: StatsCardProps) {
  // Get trend icon and color
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp sx={{ fontSize: 16 }} />;
      case 'down': return <TrendingDown sx={{ fontSize: 16 }} />;
      case 'flat': return <TrendingFlat sx={{ fontSize: 16 }} />;
      default: return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'success';
      case 'down': return 'error';
      case 'flat': return 'warning';
      default: return 'default';
    }
  };

  // Get gradient background
  const getGradientBackground = () => {
    const gradients = {
      primary: 'linear-gradient(135deg, #ef3966 0%, #ff6b9d 100%)',
      secondary: 'linear-gradient(135deg, #9c27b0 0%, #e1bee7 100%)',
      success: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
      warning: 'linear-gradient(135deg, #ff9800 0%, #ffcc02 100%)',
      error: 'linear-gradient(135deg, #f44336 0%, #ef5350 100%)',
      info: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
    };
    return gradients[color];
  };

  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        borderRadius: 3,
        background: variant === 'gradient' ? getGradientBackground() : 'white',
        color: variant === 'gradient' ? 'white' : 'inherit',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header with Icon */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              opacity: variant === 'gradient' ? 0.9 : 0.7,
            }}
          >
            {title}
          </Typography>
          
          {icon && (
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: variant === 'gradient' 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : `${color}.100`,
                color: variant === 'gradient' 
                  ? 'white' 
                  : `${color}.main`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </Box>
          )}
        </Box>

        {/* Main Value */}
        <Typography
          variant="h3"
          component="div"
          sx={{
            fontWeight: 700,
            mb: 1,
            lineHeight: 1.2,
          }}
        >
          {value}
        </Typography>

        {/* Subtitle and Trend */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                opacity: variant === 'gradient' ? 0.9 : 0.7,
              }}
            >
              {subtitle}
            </Typography>
          )}
          
          {trend && trendValue && (
            <Chip
              icon={getTrendIcon() || undefined}
              label={trendValue}
              size="small"
              color={getTrendColor() as any}
              variant={variant === 'gradient' ? 'filled' : 'outlined'}
              sx={{
                fontSize: '0.75rem',
                height: 24,
                bgcolor: variant === 'gradient' ? 'rgba(255, 255, 255, 0.2)' : undefined,
                color: variant === 'gradient' ? 'white' : undefined,
                '& .MuiChip-icon': {
                  color: variant === 'gradient' ? 'white' : undefined,
                },
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}