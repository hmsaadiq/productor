// FRONTEND ROOT COMPONENT: This file defines the main App component for the React frontend.
// It sets up global context, routing, and layout for the application.
//
// Design Patterns: Uses the React Context pattern (via ConfigProvider), Component Composition, and React Router for SPA navigation.
// Data Structures: Uses React state (useState), context objects, and component trees.
// Security: Routing is protected for certain pages (see ProtectedRoute), and authentication is handled via context.

// Import React and useState for component logic and state management.
import React, { useState } from 'react';
// Import React Router for client-side routing (SPA navigation).
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Import the ConfigProvider, which supplies global app state (user, config) via React Context.
import { ConfigProvider } from './context/ConfigContext';
// Import the Header component, which displays the top navigation bar.
import Header from './components/Header';
// Import page components for different routes.
import HomePage from './pages/HomePage';
import ConfiguratorPage from './pages/ConfiguratorPage';
import ConfirmationPage from './pages/ConfirmationPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
// Import ProtectedRoute, which restricts access to authenticated users.
import ProtectedRoute from './components/ProtectedRoute';
// Import LoginModal, a modal dialog for user authentication.
import LoginModal from './components/LoginModal';
// Import DeliveryDetailsPage (to be created)
import DeliveryDetailsPage from './pages/DeliveryDetailsPage';

// The main App component sets up context, routing, and layout for the entire frontend.
function App() {
  // Local state to control the visibility of the login modal.
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    // Wrap the app in ConfigProvider to supply global state (user, config) to all components.
    <ConfigProvider>
      {/* Set up the React Router for SPA navigation. */}
      <Router>
        {/* Main app container with background styling. */}
        <div className="min-h-screen bg-gray-50">
          {/* Header is always visible and contains navigation and sign-in/out controls. */}
          <Header onSignInClick={() => setIsLoginModalOpen(true)} />
          {/* Define the main routes for the app. */}
          <Routes>
            {/* Home page route ("/") */}
            <Route path="/" element={<HomePage />} />
            {/* Cake configurator page ("/customize") */}
            <Route path="/customize" element={<ConfiguratorPage />} />
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
          </Routes>
          {/* Login modal is shown when user needs to authenticate. */}
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
          />
        </div>
      </Router>
    </ConfigProvider>
  );
}

// Export the App component as the default export for use in index.tsx.
export default App; 