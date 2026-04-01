import React from 'react';
import { Box, Typography, Stack, IconButton, Divider, useTheme } from '@mui/material';
import { BakeryDining, Instagram, WhatsApp, Email, LocationOn, Phone } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();

  const bgColor = isDark ? '#1a0d10' : '#fcf8f9';
  const borderColor = isDark ? '#48232c' : '#f3e7ea';
  const textMuted = isDark ? 'rgba(245,240,241,0.5)' : '#9a794c';

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: bgColor,
        borderTop: `1px solid ${borderColor}`,
        pt: 8,
        pb: 4,
        px: { xs: 3, md: 6, lg: 10 },
        mt: 'auto',
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: '2fr 1fr 1fr 2fr' }, gap: { xs: 4, md: 6 } }}>
          {/* Brand Column */}
          <Box sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <BakeryDining sx={{ color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h6" fontWeight={700} color="text.primary">
                  Frosted Crusts
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: textMuted, lineHeight: 1.7, maxWidth: 280 }}>
                Crafting memories one cake at a time. Every order is baked fresh with love,
                made to your exact specifications.
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <IconButton
                  size="small"
                  sx={{
                    bgcolor: isDark ? '#391c23' : '#f3e7ea',
                    color: 'text.primary',
                    '&:hover': { bgcolor: 'primary.main', color: '#fff' },
                    transition: 'all 0.2s',
                  }}
                  href="https://www.instagram.com/frostedcrusts" target="_blank" rel="noopener noreferrer"
                >
                  <Instagram fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    bgcolor: isDark ? '#391c23' : '#f3e7ea',
                    color: 'text.primary',
                    '&:hover': { bgcolor: 'primary.main', color: '#fff' },
                    transition: 'all 0.2s',
                  }}
                >
                  <WhatsApp fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    bgcolor: isDark ? '#391c23' : '#f3e7ea',
                    color: 'text.primary',
                    '&:hover': { bgcolor: 'primary.main', color: '#fff' },
                    transition: 'all 0.2s',
                  }}
                >
                  <Email fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
          </Box>

          {/* Quick Links */}
          <Box>
            <Stack spacing={2}>
              <Typography variant="subtitle2" fontWeight={700} color="text.primary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.75rem' }}>
                Shop with us
              </Typography>
              {[
                { label: 'Home', path: '/' },
                { label: 'Design a Cake', path: '/customize' },
                { label: 'Order History', path: '/history' },
                { label: 'Cart', path: '/cart' },
              ].map(({ label, path }) => (
                <Typography
                  key={label}
                  variant="body2"
                  sx={{
                    color: textMuted,
                    cursor: 'pointer',
                    '&:hover': { color: 'primary.main' },
                    transition: 'color 0.2s',
                  }}
                  onClick={() => navigate(path)}
                >
                  {label}
                </Typography>
              ))}
            </Stack>
          </Box>

          {/* Contact */}
          <Box>
            <Stack spacing={2}>
              <Typography variant="subtitle2" fontWeight={700} color="text.primary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.75rem' }}>
                Contact
              </Typography>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <LocationOn sx={{ fontSize: 16, color: 'primary.main', mt: 0.3, flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: textMuted }}>Abuja, Nigeria</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Phone sx={{ fontSize: 16, color: 'primary.main', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: textMuted }}>+234 9133748447</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Email sx={{ fontSize: 16, color: 'primary.main', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: textMuted }}>@frostedcrusts</Typography>
              </Stack>
            </Stack>
          </Box>
        </Box>

          {/* Newsletter
          <Box>
            <Stack spacing={2}>
              <Typography variant="subtitle2" fontWeight={700} color="text.primary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.75rem' }}>
                Stay Fresh
              </Typography>
              <Typography variant="body2" sx={{ color: textMuted }}>
                Subscribe for new designs, seasonal flavours, and special offers.
              </Typography>
              <Stack spacing={1.5}>
                <TextField
                  size="small"
                  placeholder="Your email address"
                  type="email"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: isDark ? '#2d161c' : '#fff',
                      borderRadius: 2,
                      '& fieldset': { borderColor },
                    },
                  }}
                />
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ borderRadius: 2, py: 1.2, fontWeight: 700 }}
                >
                  Subscribe
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Box> */}

        <Divider sx={{ my: 5, borderColor }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" sx={{ color: textMuted }}>
            © 2026 Productor, Trademark. By Saadiq.exe. All rights reserved.
          </Typography>
          
        </Box>
      </Box>
    </Box>
  );
}
