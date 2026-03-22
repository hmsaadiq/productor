// FRONTEND ROOT COMPONENT: This file defines the main App component for the React frontend.
// It sets up global context, routing, and layout for the application.
//
// Design Patterns: Uses the React Context pattern (via ConfigProvider), Component Composition, and React Router for SPA navigation.
// Data Structures: Uses React state (useState), context objects, and component trees.
// Security: Routing is protected for certain pages (see ProtectedRoute), and authentication is handled via context.

// Import React and useState for component logic and state management.
import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
// Import React Router for client-side routing (SPA navigation).
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// Import MUI ThemeProvider and CssBaseline for Material-UI theming
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createAppTheme } from './theme/muiTheme';
// Import the ConfigProvider, which supplies global app state (user, config) via React Context.
import { ConfigProvider } from './context/ConfigContext';
// Import the CartProvider for shopping cart functionality
import { CartProvider } from './context/CartContext';
// Import the Header component, which displays the top navigation bar.
import Header from './components/Header';
// Import page components for different routes.
import HomePage from './pages/HomePage';
import ConfiguratorPage from './pages/ConfiguratorPage';
import ConfirmationPage from './pages/ConfirmationPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import CartPage from './pages/CartPage';
// Import ProtectedRoute, which restricts access to authenticated users.
import ProtectedRoute from './components/ProtectedRoute';
// Import AdminRoute for admin-only pages
import AdminRoute from './components/AdminRoute';
// Import LoginModal, a modal dialog for user authentication.
import LoginModal from './components/LoginModal';
// Import DeliveryDetailsPage (to be created)
import DeliveryDetailsPage from './pages/DeliveryDetailsPage';
// Import AdminDashboard
import AdminDashboard from './pages/AdminDashboard';
// Import Footer
import Footer from './components/Footer';
import ProfilePage from './pages/ProfilePage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import { HelmetProvider } from 'react-helmet-async';

// Footer wrapper — hides footer on pages where it should not appear.
function ConditionalFooter() {
  const location = useLocation();
  const hideOn = ['/customize', '/admin'];
  if (hideOn.includes(location.pathname)) return null;
  return <Footer />;
}

// The main App component sets up context, routing, and layout for the entire frontend.
function App() {
  // Local state to control the visibility of the login modal.
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // Theme mode state — persisted in localStorage
  const [mode, setMode] = useState<'light' | 'dark'>(
    () => (localStorage.getItem('themeMode') as 'light' | 'dark') || 'light'
  );

  const toggleMode = () => {
    setMode(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', next);
      return next;
    });
  };

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    // Wrap the app in MUI ThemeProvider for consistent styling
    <HelmetProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Wrap the app in ConfigProvider to supply global state (user, config) to all components. */}
      <ConfigProvider>
        <CartProvider>
        {/* Set up the React Router for SPA navigation. */}
        <Router>
        {/* Main app container with background styling. */}
        <Box sx={{ minHeight: '100vh', paddingTop: { xs: '66px', md: '80px' } }}>
          {/* Header is always visible and contains navigation and sign-in/out controls. */}
          <Header onSignInClick={() => setIsLoginModalOpen(true)} mode={mode} onToggleMode={toggleMode} />
          {/* Define the main routes for the app. */}
          <Routes>
            {/* Home page route ("/") */}
            <Route path="/" element={<HomePage />} />
            {/* Cake configurator page ("/customize") */}
            <Route path="/customize" element={<ConfiguratorPage />} />
            {/* Shopping cart page ("/cart") */}
            <Route path="/cart" element={<CartPage />} />
            {/* Delivery details page ("/delivery") - new step before confirmation/payment */}
            <Route path="/delivery" element={<DeliveryDetailsPage />} />
            {/* Order confirmation page ("/confirmation") */}
            <Route path="/confirmation" element={<ConfirmationPage />} />
            {/* Order history page ("/history") is protected and requires authentication. */}
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <OrderHistoryPage />
                </ProtectedRoute>
              }
            />
            {/* Profile page ("/profile") is protected and requires authentication. */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            {/* Password reset page ("/reset-password") — accessed via email link */}
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            {/* Admin dashboard page ("/admin") is protected and requires admin access. */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
          </Routes>
          {/* Login modal is shown when user needs to authenticate. */}
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
          />
          <ConditionalFooter />
          <SpeedInsights />
          <Analytics />
        </Box>
        </Router>
        </CartProvider>
      </ConfigProvider>
    </ThemeProvider>
    </HelmetProvider>
  );
}

// Export the App component as the default export for use in index.tsx.
export default App; 