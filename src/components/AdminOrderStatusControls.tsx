import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { OrderStatus, getNextStatus, getPreviousStatus, hasNext, hasPrevious, formatStatus, getStatusColor } from '../utils/orderStatusHelpers';

interface AdminOrderStatusControlsProps {
  currentStatus: OrderStatus;
  onStatusChange: (newStatus: OrderStatus) => Promise<void>;
}

export const AdminOrderStatusControls: React.FC<AdminOrderStatusControlsProps> = ({ 
  currentStatus, 
  onStatusChange 
}) => {
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  useEffect(() => {
    setLoading(false);
    setCooldown(false);
  }, [currentStatus]);

  useEffect(() => {
    if (cooldown) {
      const timer = setTimeout(() => setCooldown(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (loading || cooldown) return;
    
    setLoading(true);
    setCooldown(true);
    
    try {
      await onStatusChange(newStatus);
    } finally {
      setLoading(false);
    }
  };

  const nextStatus = getNextStatus(currentStatus);
  const prevStatus = getPreviousStatus(currentStatus);
  const currentStatusColor = getStatusColor(currentStatus);
  const prevStatusColor = prevStatus ? getStatusColor(prevStatus) : null;
  const nextStatusColor = nextStatus ? getStatusColor(nextStatus) : null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton
        size="small"
        disabled={!hasPrevious(currentStatus) || loading || cooldown}
        onClick={() => prevStatus && handleStatusChange(prevStatus)}
        aria-label="Previous status"
        sx={{
          border: 1,
          borderColor: prevStatusColor ? `${prevStatusColor}.main` : 'divider',
          color: prevStatusColor ? `${prevStatusColor}.main` : 'text.disabled',
          p: 0.5
        }}
      >
        <ArrowBack fontSize="small" />
      </IconButton>

      <Typography 
        variant="body2" 
        sx={{ 
          px: 2, 
          py: 0.5, 
          bgcolor: `${currentStatusColor}.main`,
          color: `${currentStatusColor}.contrastText`,
          borderRadius: 1,
          fontWeight: 600,
          minWidth: 140,
          textAlign: 'center'
        }}
      >
        {loading ? <CircularProgress size={16} sx={{ color: 'inherit' }} /> : formatStatus(currentStatus)}
      </Typography>

      <IconButton
        size="small"
        disabled={!hasNext(currentStatus) || loading || cooldown}
        onClick={() => nextStatus && handleStatusChange(nextStatus)}
        aria-label="Next status"
        sx={{
          border: 1,
          borderColor: nextStatusColor ? `${nextStatusColor}.main` : 'divider',
          color: nextStatusColor ? `${nextStatusColor}.main` : 'text.disabled',
          p: 0.5
        }}
      >
        <ArrowForward fontSize="small" />
      </IconButton>
    </Box>
  );
};
