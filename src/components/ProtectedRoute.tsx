// FRONTEND ROUTE PROTECTION COMPONENT: This file defines a component for protecting routes that require authentication in the React frontend.
// It ensures that only authenticated users can access certain pages (e.g., order history).
//
// Design Patterns: Uses the Higher-Order Component (HOC) pattern for route protection, and the React Context pattern for user state.
// Data Structures: Uses React components, context objects, and conditional rendering.
// Security: Implements client-side authorization by checking user authentication state before rendering protected content.

// Import React for component creation.
import React from 'react';
// Import Navigate from React Router to redirect unauthenticated users.
import { Navigate } from 'react-router-dom';
// Import the useConfig hook to access global user state from context.
import { useConfig } from '../context/ConfigContext';

// Define the props for the ProtectedRoute component.
interface ProtectedRouteProps {
  children: React.ReactNode; // The child components to render if user is authenticated.
}

// ProtectedRoute checks if the user is authenticated before rendering children.
// If not authenticated, it redirects to the home page.
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Get the current user from context.
  const { user } = useConfig();

  // If user is not authenticated, redirect to home page ("/").
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If user is authenticated, render the protected children.
  return <>{children}</>;
} 