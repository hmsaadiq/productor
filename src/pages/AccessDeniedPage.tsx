import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Stack, useTheme } from '@mui/material';
import { Lock, Home, Login } from '@mui/icons-material';

interface AccessDeniedPageProps {
  reason?: 'unauthenticated' | 'unauthorized';
}

export default function AccessDeniedPage({ reason = 'unauthenticated' }: AccessDeniedPageProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const isUnauth = reason === 'unauthenticated';

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 3,
      }}
    >
      <Helmet>
        <title>{isUnauth ? 'Sign In Required' : 'Access Denied'} — Frosted Crusts</title>
      </Helmet>

      <Lock sx={{ fontSize: 72, color: 'error.main', mb: 2, opacity: 0.7 }} />

      <Typography
        variant="h1"
        sx={{ fontSize: { xs: '5rem', md: '8rem' }, fontWeight: 800, color: isDark ? '#f3e7ea' : '#1b0d11', lineHeight: 1 }}
      >
        {isUnauth ? '401' : '403'}
      </Typography>

      <Typography variant="h5" sx={{ mt: 1, mb: 1, fontWeight: 600 }}>
        {isUnauth ? 'Sign in required' : 'Access denied'}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 360 }}>
        {isUnauth
          ? "You need to be signed in to view this page."
          : "You don't have permission to view this page."}
      </Typography>

      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          startIcon={isUnauth ? <Login /> : <Home />}
          onClick={() => navigate('/')}
          sx={{ borderRadius: 2 }}
        >
          {isUnauth ? 'Go sign in' : 'Go home'}
        </Button>
        <Button
          variant="outlined"
          startIcon={<Home />}
          onClick={() => navigate(-1 as any)}
          sx={{ borderRadius: 2 }}
        >
          Go back
        </Button>
      </Stack>
    </Box>
  );
}
