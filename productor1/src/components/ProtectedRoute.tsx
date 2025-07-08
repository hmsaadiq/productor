import React from 'react';
import { Navigate } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useConfig();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
} 