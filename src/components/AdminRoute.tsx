import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { useConfig } from '../context/ConfigContext';
import { supabase } from '../utils/supabase';
import AccessDeniedPage from '../pages/AccessDeniedPage';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user } = useConfig();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(data?.is_admin || false);
      }
      setLoading(false);
    };

    checkAdmin();
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!user) {
    return <AccessDeniedPage reason="unauthenticated" />;
  }

  if (!isAdmin) {
    return <AccessDeniedPage reason="unauthorized" />;
  }

  return <>{children}</>;
}