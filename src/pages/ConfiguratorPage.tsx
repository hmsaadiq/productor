import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Typography, Button, Stack, Chip, useTheme, Tooltip, useMediaQuery,
} from '@mui/material';
import {
  QrCode, ShoppingCart, CheckCircle, NavigateNext,
} from '@mui/icons-material';
import { useConfig } from '../context/ConfigContext';
import { useCart } from '../context/CartContext';
import CakeCustomizer from '../components/CakeCustomizer';
import CakePreview from '../components/ProductPreview/CakePreview';
import CookiesPreview from '../components/ProductPreview/CookiesPreview';
import MuffinsPreview from '../components/ProductPreview/MuffinsPreview';
import QRCodeModal from '../components/QRCodeModal';

function PreviewSVG({ config }: { config: any }) {
  if (config.productType === 'cake') return <CakePreview config={config} />;
  if (config.productType === 'cookies') return <CookiesPreview config={config} />;
  return <MuffinsPreview config={config} />;
}

export default function ConfiguratorPage() {
  const navigate = useNavigate();
  const { config, resetConfig } = useConfig();
  const { addToCart } = useCart();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [bottomBarVisible, setBottomBarVisible] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const borderColor = isDark ? '#48232c' : '#f3e7ea';

  // On mobile: show bottom bar only when user scrolls to the end (sentinel visible).
  // On desktop: always show it.
  useEffect(() => {
    if (isDesktop) {
      setBottomBarVisible(true);
      return;
    }
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setBottomBarVisible(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isDesktop]);

  const canProceed = (() => {
    if (config.productType === 'cake') {
      return config.size && (config.flavors || []).length > 0 && config.shape;
    }
    return config.boxSize && config.boxFlavors && config.boxFlavors.length > 0;
  })();

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await addToCart({ productType: config.productType, customization: config, quantity: 1, unitPrice: config.price });
      resetConfig();
      navigate('/cart');
    } catch {
      alert('Failed to add item to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <Box
      sx={{
        height: { xs: 'calc(100vh - 66px)', md: 'calc(100vh - 80px)' },
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      <Helmet>
        <title>Design Your Cake | Frosted Crusts</title>
        <meta name="description" content="Customise your perfect handcrafted cake — choose size, flavour, filling, and add-ons. Order online with 48hr delivery in Abuja." />
      </Helmet>

      {/* ── Left: Preview Panel — desktop only ── */}
      <Box
        sx={{
          flex: '0 0 38%',
          display: { xs: 'none', lg: 'flex' },
          position: 'relative',
          bgcolor: isDark ? '#1a0c0f' : '#fcf8f9',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', inset: 0, background: isDark
          ? 'radial-gradient(circle at center, rgba(239,57,102,0.06) 0%, transparent 70%)'
          : 'radial-gradient(circle at center, rgba(239,57,102,0.04) 0%, transparent 70%)' }}
        />

        {/* Breadcrumb */}
        <Box
          sx={{
            position: 'absolute', top: 20, left: 20, zIndex: 10,
            bgcolor: isDark ? 'rgba(34,16,21,0.7)' : 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)'}`,
            borderRadius: '0.5rem', px: 2, py: 1,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={0.5}>
            {[
              { label: 'Home', to: '/' },
              { label: 'Custom Cakes' },
              { label: 'Configurator', active: true },
            ].map((crumb, i) => (
              <React.Fragment key={crumb.label}>
                {i > 0 && <NavigateNext sx={{ fontSize: 14, color: 'text.disabled' }} />}
                {crumb.to ? (
                  <Typography variant="caption" component={Link} to={crumb.to} sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                    {crumb.label}
                  </Typography>
                ) : (
                  <Typography variant="caption" sx={{ color: crumb.active ? 'primary.main' : 'text.secondary', fontWeight: crumb.active ? 700 : 400 }}>
                    {crumb.label}
                  </Typography>
                )}
              </React.Fragment>
            ))}
          </Stack>
        </Box>

        <Box
          sx={{
            width: '82%',
            maxWidth: 340,
            filter: isDark
              ? 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))'
              : 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))',
          }}
        >
          <PreviewSVG config={config} />
        </Box>
      </Box>

      {/* ── Right: Config Panel ── */}
      <Box
        sx={{
          flex: { xs: '1 1 auto', lg: '0 0 62%' },
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
          borderLeft: { lg: `1px solid ${borderColor}` },
          boxShadow: { lg: '-20px 0 60px rgba(0,0,0,0.06)' },
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        {/* Panel header — thumbnail on mobile */}
        <Box
          sx={{
            px: { xs: 2, md: 4 },
            pt: { xs: 1.5, md: 4 },
            pb: { xs: 1, md: 3 },
            borderBottom: `1px solid ${borderColor}`,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom sx={{ fontSize: { xs: '1rem', md: '1.5rem' }, mb: 0.5 }}>
              Build Your Masterpiece
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
              Customise every layer to perfection.
            </Typography>
          </Box>

          {/* Live thumbnail — mobile only, always visible in header */}
          <Box
            sx={{
              display: { xs: 'flex', lg: 'none' },
              flexShrink: 0,
              width: 56,
              height: 56,
              bgcolor: isDark ? '#1a0c0f' : '#fcf8f9',
              borderRadius: 2,
              border: `1px solid ${borderColor}`,
              alignItems: 'center',
              justifyContent: 'center',
              p: 0.5,
            }}
          >
            <PreviewSVG config={config} />
          </Box>
        </Box>

        {/* Scrollable config content */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            '&::-webkit-scrollbar': { width: 6 },
            '&::-webkit-scrollbar-thumb': { bgcolor: isDark ? '#48232c' : '#e5d0d6', borderRadius: 3 },
          }}
        >
          <CakeCustomizer />

          {/* Full-size preview at end of scroll — mobile only */}
          <Box
            sx={{
              display: { xs: 'flex', lg: 'none' },
              flexDirection: 'column',
              alignItems: 'center',
              px: 3,
              pt: 4,
              pb: 3,
              bgcolor: isDark ? '#1a0c0f' : '#fcf8f9',
              borderTop: `1px solid ${borderColor}`,
            }}
          >
            <Typography variant="overline" color="text.secondary" sx={{ mb: 2, letterSpacing: '0.1em' }}>
              Your Configuration
            </Typography>
            <Box
              sx={{
                width: 240,
                height: 240,
                filter: isDark
                  ? 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))'
                  : 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))',
              }}
            >
              <PreviewSVG config={config} />
            </Box>
            {canProceed && (
              <Chip
                icon={<CheckCircle sx={{ fontSize: '14px !important' }} />}
                label="Config complete"
                size="small"
                color="success"
                variant="outlined"
                sx={{ mt: 2 }}
              />
            )}
          </Box>

          {/* Sentinel — bottom bar appears when this is visible */}
          <div ref={sentinelRef} style={{ height: 1 }} />
        </Box>

        {/* Bottom bar — always visible on desktop, scroll-triggered on mobile */}
        <Box
          sx={{
            flexShrink: 0,
            px: { xs: 2, md: 3 },
            py: { xs: 1.5, md: 3 },
            borderTop: `1px solid ${borderColor}`,
            bgcolor: 'background.paper',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.05)',
            // Slide in from bottom on mobile
            transform: { xs: bottomBarVisible ? 'translateY(0)' : 'translateY(100%)', lg: 'none' },
            transition: 'transform 0.3s ease',
            // When hidden on mobile it still takes space via transform, use max-height instead
            maxHeight: { xs: bottomBarVisible ? '200px' : '0px', lg: 'none' },
            overflow: 'hidden',
          }}
        >
          {/* Price + status row */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 1.5, md: 2.5 } }}>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ mb: 0.25, display: 'block' }}>
                Total Estimate
              </Typography>
              <Typography fontWeight={900} color="text.primary" sx={{ fontSize: { xs: '1.4rem', md: '2rem' }, letterSpacing: '-0.02em', lineHeight: 1 }}>
                ₦{config.price.toLocaleString()}
              </Typography>
            </Box>
            <Stack alignItems="flex-end" spacing={0.5}>
              <Chip
                label="Ready in 2 days"
                size="small"
                sx={{ bgcolor: isDark ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.1)', color: '#16a34a', fontWeight: 700, fontSize: '0.7rem' }}
              />
              {canProceed && (
                <Chip
                  icon={<CheckCircle sx={{ fontSize: '14px !important' }} />}
                  label="Config complete"
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                />
              )}
            </Stack>
          </Box>

          {/* Action buttons */}
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              disabled={!canProceed || addingToCart}
              sx={{ flex: 1, py: 1.5, minHeight: 44, borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 8px 20px rgba(239,57,102,0.25)' }}
            >
              {addingToCart ? 'Adding...' : 'Add to Basket'}
            </Button>
            <Tooltip title="Generate QR Code">
              <Button
                variant="outlined"
                onClick={() => setIsQRModalOpen(true)}
                sx={{ px: 2, py: 1.5, minHeight: 44, borderRadius: '0.75rem', borderColor: borderColor, minWidth: 'auto' }}
              >
                <QrCode />
              </Button>
            </Tooltip>
          </Stack>

          {!canProceed && (
            <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
              {config.productType === 'cake' ? 'Select size, shape & at least one layer flavour' : 'Select box size and flavours'}
            </Typography>
          )}
        </Box>
      </Box>

      <QRCodeModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} mode="display" />
    </Box>
  );
}
