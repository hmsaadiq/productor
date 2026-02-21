// FRONTEND AUTHENTICATION MODAL COMPONENT: This file defines the LoginModal component for user authentication in the React frontend.
// It provides a modal dialog for users to sign in with Google using Supabase Auth.
//
// Design Patterns: Uses the Modal/Dialog pattern (via MUI Dialog), Context pattern for user state, and custom hook pattern for context access.
// Data Structures: Uses React state (useState), props, and context objects.
// Security: Handles authentication securely via Supabase Auth, and disables UI during loading to prevent duplicate requests.

// Import React and useState for component logic and state management.
import React, { useState } from 'react';
// Import MUI components for enhanced modal UI
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Close,
  Google,
  Lock,
} from '@mui/icons-material';
// Import signInWithGoogle utility to handle Google sign-in via Supabase Auth.
import { signInWithGoogle } from '../utils/supabase';
// Import useConfig hook to update user state in context after sign-in.
import { useConfig } from '../context/ConfigContext';

// Define the props for the LoginModal component.
interface LoginModalProps {
  isOpen: boolean; // Whether the modal is open.
  onClose: () => void; // Function to close the modal.
}

// LoginModal component displays a modal for Google sign-in - Updated: Enhanced with MUI Dialog and improved UX.
export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  // Get setUser function from context to update user state after sign-in.
  const { setUser } = useConfig();
  // Local state for error messages.
  const [error, setError] = useState<string | null>(null);
  // Local state for loading indicator.
  const [isLoading, setIsLoading] = useState(false);

  // Handle Google sign-in button click.
  const handleGoogleSignIn = async () => {
    try {
      setError(null); // Clear previous errors.
      setIsLoading(true); // Show loading indicator.
      const user = await signInWithGoogle(); // Sign in with Google via Supabase Auth.
      
      // Add delay to allow OAuth redirect to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser(user); // Update user state in context.
      onClose(); // Close the modal on success.
    } catch (error) {
      console.error('Error signing in with Google:', error); // Log error.
      
      // Wait before showing error (OAuth redirect might be in progress)
      await new Promise(resolve => setTimeout(resolve, 500));
      setError('Failed to sign in with Google. Please try again.'); // Show error message.
    } finally {
      setIsLoading(false); // Hide loading indicator.
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        }
      }}
    >
      {/* Header Section - Updated: Enhanced with icon and close button */}
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Lock sx={{ color: 'primary.main' }} />
          <Typography variant="h6" component="span">
            Sign in to continue
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: 'grey.500' }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* Welcome Message - New: Added welcoming content */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Welcome to Productor1
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to save your orders, track history, and enjoy a personalized experience.
          </Typography>
        </Box>

        {/* Error Alert - Updated: Enhanced with MUI Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Google Sign-in Button - Updated: Enhanced with MUI styling and loading state */}
        <Button
          fullWidth
          variant="outlined"
          size="large"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          startIcon={
            isLoading ? (
              <CircularProgress size={20} />
            ) : (
              <Google sx={{ color: '#4285f4' }} />
            )
          }
          sx={{
            py: 1.5,
            borderRadius: 2,
            borderColor: 'grey.300',
            color: 'text.primary',
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'grey.50',
            },
            '&:disabled': {
              opacity: 0.7,
            }
          }}
        >
          {isLoading ? 'Signing in...' : 'Continue with Google'}
        </Button>

        {/* Security Notice - New: Added security information */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="caption" color="text.secondary">
            Your data is secure and protected. We use Google's secure authentication system.
          </Typography>
        </Box>
      </DialogContent>

      {/* Footer Actions - Updated: Enhanced with MUI DialogActions */}
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          color="inherit"
          sx={{ 
            textTransform: 'none',
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'grey.100',
            }
          }}
        >
          Maybe later
        </Button>
      </DialogActions>
    </Dialog>
  );
}