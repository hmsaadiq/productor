// FRONTEND ROUTE PROTECTION COMPONENT: This file defines a component for protecting routes that require authentication in the React frontend.
// It ensures that only authenticated users can access certain pages (e.g., order history).
//
// Design Patterns: Uses the Higher-Order Component (HOC) pattern for route protection, and the React Context pattern for user state.
// Data Structures: Uses React components, context objects, and conditional rendering.
// Security: Implements client-side authorization by checking user authentication state before rendering protected content.

// Import React for component creation.
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AccessDeniedPage from '../pages/AccessDeniedPage';
// Import MUI components for enhanced loading and error states
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Alert,
  Button,
} from '@mui/material';
import { Lock, Login } from '@mui/icons-material';
// Import the useConfig hook to access global user state from context.
import { useConfig } from '../context/ConfigContext';

// Define the props for the ProtectedRoute component.
interface ProtectedRouteProps {
  children: React.ReactNode; // The child components to render if user is authenticated.
  showLoginPrompt?: boolean; // Whether to show login prompt instead of redirecting
}

// ProtectedRoute checks if the user is authenticated before rendering children - Updated: Enhanced with MUI loading states.
export default function ProtectedRoute({ children, showLoginPrompt = false }: ProtectedRouteProps) {
  // Get the current user from context.
  const { user } = useConfig();
  const [isLoading, setIsLoading] = useState(true);

  // Add loading delay to check authentication state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Show loading state while checking authentication - New: Added loading UI
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 2,
        }}
      >
        <CircularProgress size={40} thickness={4} />
        <Typography variant="body2" color="text.secondary">
          Checking authentication...
        </Typography>
      </Box>
    );
  }

  // If user is not authenticated, show login prompt or redirect - Updated: Enhanced with MUI components
  if (!user) {
    if (showLoginPrompt) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
            p: 3,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              maxWidth: 400,
              borderRadius: 3,
            }}
          >
            <Lock sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            
            <Typography variant="h5" gutterBottom>
              Authentication Required
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Please sign in to access this page and manage your orders.
            </Typography>

            <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
              You'll need to sign in with Google to continue.
            </Alert>

            <Button
              variant="contained"
              startIcon={<Login />}
              onClick={() => window.location.href = '/'}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
              }}
            >
              Go to Sign In
            </Button>
          </Paper>
        </Box>
      );
    }

    return <AccessDeniedPage reason="unauthenticated" />;
  }

  // If user is authenticated, render the protected children.
  return <>{children}</>;
} 