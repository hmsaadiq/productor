import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Typography, Button, Stack, Chip, useTheme, Tooltip,
} from '@mui/material';
import {
  QrCode, ShoppingCart, CheckCircle, ThreeDRotation, ZoomIn, NavigateNext,
} from '@mui/icons-material';
import { useConfig } from '../context/ConfigContext';
import { useCart } from '../context/CartContext';
import CakeCustomizer from '../components/CakeCustomizer';
import CakePreview from '../components/ProductPreview/CakePreview';
import LoginModal from '../components/LoginModal';
import QRCodeModal from '../components/QRCodeModal';
import { IMAGES } from '../constants/images';

export default function ConfiguratorPage() {
  const navigate = useNavigate();
  const { config, resetConfig } = useConfig();
  const { addToCart } = useCart();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

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

  const previewImg = config.productType === 'cake' ? IMAGES.featured3 : IMAGES.featured4;
  const isCake = config.productType === 'cake';

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
      {/* ── Left: Preview Panel ── */}
      <Box
        sx={{
          flex: { xs: '0 0 26vh', lg: '0 0 38%' },
          position: 'relative',
          bgcolor: isDark ? '#1a0c0f' : '#fcf8f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Radial gradient */}
        <Box sx={{ position: 'absolute', inset: 0, background: isDark
          ? 'radial-gradient(circle at center, rgba(239,57,102,0.06) 0%, transparent 70%)'
          : 'radial-gradient(circle at center, rgba(239,57,102,0.04) 0%, transparent 70%)' }}
        />

        {/* Floating breadcrumb */}
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

        {/* Preview: dynamic SVG for cake, static image for other products */}
        <Box sx={{ position: 'relative', width: '82%', maxWidth: 340, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isCake ? (
            <Box
              sx={{
                width: '100%',
                filter: isDark
                  ? 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))'
                  : 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))',
              }}
            >
              <CakePreview config={config} />
            </Box>
          ) : (
            <>
              <Box sx={{ position: 'absolute', bottom: '5%', left: '50%', transform: 'translateX(-50%)', width: '60%', height: 30, bgcolor: 'rgba(0,0,0,0.08)', filter: 'blur(16px)', borderRadius: '50%' }} />
              <Box
                component="img"
                src={previewImg}
                alt="Product preview"
                sx={{
                  width: '80%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 16px 24px rgba(0,0,0,0.18))',
                  maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                  transition: 'transform 0.6s ease',
                  '&:hover': { transform: 'scale(1.04)' },
                }}
              />
            </>
          )}
        </Box>

        {/* Floating decorative buttons */}
        <Stack direction="row" spacing={2} sx={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
          {[
            { icon: <ThreeDRotation sx={{ fontSize: 18 }} />, label: 'Rotate' },
            { icon: <ZoomIn sx={{ fontSize: 18 }} />, label: 'Zoom' },
          ].map(btn => (
            <Box
              key={btn.label}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                px: 2, py: 1,
                bgcolor: isDark ? '#2d161c' : '#fff',
                borderRadius: '9999px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                fontSize: '0.8rem', fontWeight: 700,
                color: 'text.primary',
                cursor: 'default',
              }}
            >
              {btn.icon} {btn.label}
            </Box>
          ))}
        </Stack>
      </Box>

      {/* ── Right: Config Panel ── */}
      <Box
        sx={{
          flex: { xs: '1 1 auto', lg: '0 0 62%' },
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
          borderLeft: { lg: `1px solid ${isDark ? '#48232c' : '#f3e7ea'}` },
          boxShadow: { lg: '-20px 0 60px rgba(0,0,0,0.06)' },
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        {/* Panel header */}
        <Box sx={{ px: { xs: 2.5, md: 4 }, pt: { xs: 2, md: 4 }, pb: { xs: 1.5, md: 3 }, borderBottom: `1px solid ${isDark ? '#48232c' : '#f3e7ea'}`, flexShrink: 0 }}>
          <Typography variant="h5" fontWeight={700} color="text.primary" gutterBottom>
            Build Your Masterpiece
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Customise every layer to perfection.
          </Typography>
        </Box>

        {/* Scrollable stepper content */}
        <Box sx={{ flex: 1, overflowY: 'auto', '&::-webkit-scrollbar': { width: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: isDark ? '#48232c' : '#e5d0d6', borderRadius: 3 } }}>
          <CakeCustomizer />
        </Box>

        {/* Sticky bottom bar */}
        <Box
          sx={{
            flexShrink: 0,
            p: { xs: 1.75, md: 3 },
            borderTop: `1px solid ${isDark ? '#48232c' : '#f3e7ea'}`,
            bgcolor: 'background.paper',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.05)',
          }}
        >
          {/* Price + status row */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2.5 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ mb: 0.5, display: 'block' }}>
                Total Estimate
              </Typography>
              <Typography variant="h4" fontWeight={900} color="text.primary" sx={{ letterSpacing: '-0.02em', lineHeight: 1 }}>
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
                <Chip icon={<CheckCircle sx={{ fontSize: '14px !important' }} />} label="Config complete" size="small" color="success" variant="outlined" />
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
              sx={{ flex: 1, py: 1.5, borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 8px 20px rgba(239,57,102,0.25)' }}
            >
              {addingToCart ? 'Adding...' : 'Add to Basket'}
            </Button>
            <Tooltip title="Generate QR Code">
              <Button
                variant="outlined"
                onClick={() => setIsQRModalOpen(true)}
                sx={{ px: 2, py: 1.5, borderRadius: '0.75rem', borderColor: isDark ? '#48232c' : '#f3e7ea', minWidth: 'auto' }}
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

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <QRCodeModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} mode="display" />
    </Box>
  );
}
