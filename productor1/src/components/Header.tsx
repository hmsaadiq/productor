// FRONTEND NAVIGATION/HEADER COMPONENT: This file defines the Header component for the React frontend.
// It displays the top navigation bar, handles sign-in/sign-out, and links to key pages.
//
// Design Patterns: Uses the React Component pattern, Context pattern for user state, and conditional rendering for UI changes based on authentication.
// Data Structures: Uses React props, context objects, and event handlers.
// Security: Handles sign-out securely and conditionally renders navigation based on authentication state.

// Import React for component creation.
import React from 'react';
// Import Link from React Router for navigation between pages.
import { Link } from 'react-router-dom';
// Import useConfig hook to access global user state and updater from context.
import { useConfig } from '../context/ConfigContext';
// Import signOut utility to handle user sign-out from Firebase Auth.
import { signOut } from '../utils/firebase';

// Define the props for the Header component.
interface HeaderProps {
  onSignInClick: () => void; // Function to open the sign-in modal when user clicks "Sign In".
}

// Header component displays navigation and authentication controls.
export default function Header({ onSignInClick }: HeaderProps) {
  // Get user state and updater from context.
  const { user, setUser } = useConfig();

  // Handle user sign-out by calling Firebase signOut and updating context.
  const handleSignOut = async () => {
    try {
      await signOut(); // Sign out from Firebase Auth.
      setUser(null); // Clear user state in context.
    } catch (error) {
      console.error('Error signing out:', error); // Log any errors.
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo and home link */}
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">CakeConfig</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Conditionally render navigation based on authentication state */}
            {user ? (
              <>
                {/* Link to order history for authenticated users */}
                <Link to="/history" className="text-gray-700 hover:text-primary-600">
                  Order History
                </Link>
                {/* Sign out button */}
                <button
                  onClick={handleSignOut}
                  className="btn btn-secondary"
                >
                  Sign Out
                </button>
              </>
            ) : (
              // Sign in button for unauthenticated users
              <button onClick={onSignInClick} className="btn btn-primary">
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
} 