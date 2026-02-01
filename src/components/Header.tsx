// FRONTEND NAVIGATION/HEADER COMPONENT: This file defines the Header component for the React frontend.
// It displays the top navigation bar, handles sign-in/sign-out, and links to key pages.
//
// Design Patterns: Uses the React Component pattern, Context pattern for user state, and conditional rendering for UI changes based on authentication.
// Data Structures: Uses React props, context objects, and event handlers.
// Security: Handles sign-out securely and conditionally renders navigation based on authentication state.

// Import React for component creation.
import React from 'react';
// Import Link from React Router for navigation between pages.
import { Link, useLocation } from 'react-router-dom';
// Import MUI components
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Box,
  Container,
} from '@mui/material';
import {
  ShoppingBag,
  BakeryDining,
  AccountCircle,
  Menu as MenuIcon,
} from '@mui/icons-material';
// Import useConfig hook to access global user state and updater from context.
import { useConfig } from '../context/ConfigContext';
// Import signOut utility to handle user sign-out from Supabase Auth.
import { signOut } from '../utils/supabase';

// Define the props for the Header component.
interface HeaderProps {
  onSignInClick: () => void; // Function to open the sign-in modal when user clicks "Sign In".
}

// Header component displays navigation and authentication controls.
export default function Header({ onSignInClick }: HeaderProps) {
  // Get user state and updater from context.
  const { user, setUser } = useConfig();
  // Updated: Added location hook for active navigation highlighting and menu state
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // Handle user sign-out by calling Supabase signOut and updating context.
  const handleSignOut = async () => {
    try {
      await signOut(); // Sign out from Supabase Auth.
      setUser(null); // Clear user state in context.
      setAnchorEl(null); // Close menu
    } catch (error) {
      console.error('Error signing out:', error); // Log any errors.
    }
  };

  // Updated: Added menu state management for user dropdown
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Updated: Added menu close handler
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backgroundColor: 'rgba(248, 246, 246, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(243, 231, 234, 0.5)',
        color: 'text.primary'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Logo Section - Updated: Added cake icon while keeping original Productor1 branding */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BakeryDining sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography
              variant="h5"
              component={Link}
              to="/"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                textDecoration: 'none',
                letterSpacing: '-0.015em'
              }}
            >
              Productor1
            </Typography>
          </Box>

          {/* Desktop Navigation - Updated: Kept original navigation structure with MUI styling */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }}>
            <Button
              component={Link}
              to="/"
              color={location.pathname === '/' ? 'primary' : 'inherit'}
              sx={{ fontWeight: 500 }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/customize"
              color={location.pathname === '/customize' ? 'primary' : 'inherit'}
              sx={{ fontWeight: 500 }}
            >
              Customize Cake
            </Button>
            {user && (
              <Button
                component={Link}
                to="/history"
                color={location.pathname === '/history' ? 'primary' : 'inherit'}
                sx={{ fontWeight: 500 }}
              >
                Order History
              </Button>
            )}
          </Box>

          {/* Actions Section - Updated: Enhanced with shopping cart and improved user menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Shopping Cart - New: Added shopping cart with badge for better UX */}
            <IconButton
              size="large"
              sx={{ 
                backgroundColor: 'grey.50',
                '&:hover': { backgroundColor: 'primary.main', color: 'white' }
              }}
            >
              <Badge badgeContent={0} color="primary">
                <ShoppingBag />
              </Badge>
            </IconButton>

            {/* User Authentication - Updated: Enhanced with avatar and dropdown menu */}
            {user ? (
              <>
                <IconButton
                  size="large"
                  onClick={handleMenuOpen}
                  sx={{ ml: 1 }}
                >
                  <Avatar
                    src={user.user_metadata?.avatar_url}
                    sx={{ width: 32, height: 32 }}
                  >
                    {user.email?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleMenuClose} component={Link} to="/history">
                    Order History
                  </MenuItem>
                  <MenuItem onClick={handleSignOut}>
                    Sign Out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                onClick={onSignInClick}
                sx={{
                  ml: 1,
                  borderRadius: 3,
                  px: 3,
                  boxShadow: '0 0 20px rgba(239, 57, 102, 0.2)',
                  '&:hover': {
                    boxShadow: '0 0 30px rgba(239, 57, 102, 0.4)',
                  }
                }}
              >
                Sign In
              </Button>
            )}

            {/* Mobile Menu Button - New: Added for responsive design */}
            <IconButton
              size="large"
              sx={{ display: { xs: 'flex', md: 'none' }, ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
