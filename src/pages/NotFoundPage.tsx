import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Stack, useTheme } from '@mui/material';
import { Home, CakeOutlined } from '@mui/icons-material';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

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
        <title>Page Not Found — Frosted Crusts</title>
      </Helmet>

      <CakeOutlined sx={{ fontSize: 72, color: 'primary.main', mb: 2, opacity: 0.7 }} />

      <Typography variant="h1" sx={{ fontSize: { xs: '5rem', md: '8rem' }, fontWeight: 800, color: isDark ? '#f3e7ea' : '#1b0d11', lineHeight: 1 }}>
        404
      </Typography>

      <Typography variant="h5" sx={{ mt: 1, mb: 1, fontWeight: 600 }}>
        Page not found
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 360 }}>
        Looks like this page got eaten. Let's get you back to something sweet.
      </Typography>

      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          startIcon={<Home />}
          onClick={() => navigate('/')}
          sx={{ borderRadius: 2 }}
        >
          Go home
        </Button>
        <Button
          variant="outlined"
          startIcon={<CakeOutlined />}
          onClick={() => navigate('/customize')}
          sx={{ borderRadius: 2 }}
        >
          Design a cake
        </Button>
      </Stack>
    </Box>
  );
}
