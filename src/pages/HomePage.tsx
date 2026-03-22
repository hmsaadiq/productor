import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Stack, Chip, useTheme,
} from '@mui/material';
import {
  ArrowForward, QrCodeScanner, Schedule, Lock, Palette,
  Handshake, BakeryDining,
} from '@mui/icons-material';
import QRCodeModal from '../components/QRCodeModal';
import { useConfig } from '../context/ConfigContext';
import { supabase } from '../utils/supabase';
import { IMAGES } from '../constants/images';

const FEATURED = [
  { name: 'Chocolate Dream', sub: '8" · 1 Layer · Chocolate', price: '₦18,000', img: IMAGES.featured1 },
  { name: 'Red Velvet Heart', sub: '8" · 1 Layer · Red Velvet', price: '₦18,000', img: IMAGES.featured2 },
  { name: 'Biscoff Delight', sub: '8" · 2 Layers · Biscoff', price: '₦33,000', img: IMAGES.featured3 },
  { name: 'Bento Box', sub: 'Bento · 1 Layer · Vanilla', price: '₦9,500', img: IMAGES.featured4 },
];

const CATEGORIES = [
  { label: 'Classic Cakes', sub: '6", 8", 10" & 12" Rounds', img: IMAGES.categoryClassic },
  { label: 'Celebration Cakes', sub: 'Birthdays, Weddings & Events', img: IMAGES.categoryCelebration },
  { label: 'Bento Cakes', sub: 'Intimate & Personalised', img: IMAGES.categoryBento },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useConfig();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
        if (data?.is_admin) navigate('/admin');
      }
    };
    checkAdmin();
  }, [user, navigate]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Helmet>
        <title>Custom Birthday Cakes Abuja | Frosted Crusts</title>
        <meta name="description" content="Order handcrafted custom cakes in Abuja. Chocolate, red velvet, biscoff and more. 48hr delivery." />
      </Helmet>

      {/* ── Hero ── */}
      <Box sx={{ px: { xs: 1.5, md: 4 }, py: { xs: 1.5, md: 3 } }}>
        <Box
          sx={{
            position: 'relative',
            minHeight: { xs: 400, md: 560 },
            borderRadius: '2rem',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3) 0%, rgba(34,16,21,0.75) 100%), url(${IMAGES.hero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        >
          {/* Frosted glass card */}
          <Box
            sx={{
              maxWidth: 640,
              mx: 'auto',
              px: { xs: 2.5, md: 5 },
              py: { xs: 3, md: 5 },
              borderRadius: '1.25rem',
              bgcolor: 'rgba(34,16,21,0.4)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="overline"
              sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.15em', mb: 1, display: 'block' }}
            >
              Premium &amp; Handcrafted
            </Typography>
            <Typography
              component="h1"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2rem', sm: '2.75rem', md: '3.25rem' },
                lineHeight: 1.15,
                color: '#fff',
                mb: 2,
                letterSpacing: '-0.02em',
              }}
            >
              Baked with Passion,<br />Served with Love.
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: { xs: '1rem', md: '1.125rem' }, mb: 4, fontWeight: 300 }}>
              Design your dream cake with real flavours, real prices — made fresh to your order.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/customize')}
                sx={{
                  px: 4, py: 1.5, borderRadius: '0.75rem', fontWeight: 700, fontSize: '1rem',
                  boxShadow: '0 0 20px rgba(239,57,102,0.4)',
                  '&:hover': { boxShadow: '0 0 30px rgba(239,57,102,0.6)' },
                }}
              >
                Design Your Cake
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<QrCodeScanner />}
                onClick={() => setIsQRModalOpen(true)}
                sx={{
                  px: 4, py: 1.5, borderRadius: '0.75rem', fontWeight: 700, fontSize: '1rem',
                  borderColor: 'rgba(255,255,255,0.3)', color: '#fff',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': { borderColor: 'rgba(255,255,255,0.6)', bgcolor: 'rgba(255,255,255,0.2)' },
                }}
              >
                Scan QR Code
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* ── Categories ── */}
      <Box sx={{ px: { xs: 1.5, md: 4 }, py: { xs: 3, md: 5 }, maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
          {CATEGORIES.map(cat => (
            <Box
              key={cat.label}
              onClick={() => navigate('/customize')}
              sx={{
                position: 'relative',
                height: 260,
                borderRadius: '1.25rem',
                overflow: 'hidden',
                cursor: 'pointer',
                bgcolor: isDark ? '#2d161c' : '#f3e7ea',
                '&:hover .cat-img': { transform: 'scale(1.1)' },
                '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.3s' },
                transition: 'transform 0.3s',
                boxShadow: isDark
                  ? '0 4px 20px rgba(0,0,0,0.4)'
                  : '0 4px 20px rgba(27,13,17,0.08)',
              }}
            >
              <Box
                className="cat-img"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `linear-gradient(to top, rgba(34,16,21,0.92), transparent 60%), url(${cat.img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'transform 0.7s ease',
                }}
              />
              <Box sx={{ position: 'absolute', bottom: 0, left: 0, p: 3 }}>
                <Typography variant="h5" fontWeight={700} color="#fff">{cat.label}</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', mt: 0.5, opacity: 0, transition: 'opacity 0.3s', '.MuiBox-root:hover &': { opacity: 1 } }}>
                  {cat.sub}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Featured Designs Carousel ── */}
      <Box sx={{ py: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ px: { xs: 1.5, md: 4 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2, md: 3 } }}>
          <Typography variant="h5" fontWeight={700} color="text.primary">
            Featured Designs
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'primary.main', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.5 }}
            onClick={() => navigate('/customize')}
          >
            View All <ArrowForward sx={{ fontSize: 16 }} />
          </Typography>
        </Box>

        {/* Horizontal scroll */}
        <Box
          sx={{
            display: 'flex',
            gap: 2.5,
            overflowX: 'auto',
            px: { xs: 1.5, md: 4 },
            pb: 2,
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {FEATURED.map(item => (
            <Box
              key={item.name}
              sx={{
                width: 260,
                flexShrink: 0,
                borderRadius: '1rem',
                bgcolor: isDark ? '#2d161c' : '#fff',
                border: `1px solid ${isDark ? '#48232c' : '#f3e7ea'}`,
                boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(27,13,17,0.05)',
                overflow: 'hidden',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: isDark ? '0 12px 40px rgba(0,0,0,0.5)' : '0 12px 40px rgba(27,13,17,0.12)',
                },
                cursor: 'pointer',
              }}
              onClick={() => navigate('/customize')}
            >
              {/* Image */}
              <Box
                sx={{
                  position: 'relative',
                  aspectRatio: '4/5',
                  overflow: 'hidden',
                  bgcolor: isDark ? '#391c23' : '#fcf8f9',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${item.img})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    transition: 'transform 0.5s',
                    '&:hover': { transform: 'scale(1.05)' },
                  }}
                />
              </Box>
              {/* Info */}
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                  <Typography variant="subtitle1" fontWeight={700} color="text.primary">{item.name}</Typography>
                  <Typography variant="subtitle1" fontWeight={700} color="primary.main">{item.price}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">{item.sub}</Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  size="small"
                  onClick={e => { e.stopPropagation(); navigate('/customize'); }}
                  sx={{
                    mt: 1.5, borderRadius: '0.6rem', fontWeight: 700,
                    borderColor: isDark ? '#48232c' : '#f3e7ea',
                    color: 'text.primary',
                    '&:hover': { bgcolor: 'primary.main', borderColor: 'primary.main', color: '#fff' },
                    transition: 'all 0.2s',
                  }}
                >
                  Customise This
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Our Craft ── */}
      <Box sx={{ bgcolor: isDark ? '#1e0f13' : '#1b0d11', py: { xs: 5, md: 12 }, px: { xs: 2.5, md: 6 }, mt: { xs: 2, md: 4 } }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 8, alignItems: 'center' }}>
          {/* Text side */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.15em' }}>
              Behind Every Order
            </Typography>
            <Typography
              variant="h3"
              sx={{ color: '#fff', fontWeight: 700, mt: 1, mb: 2, lineHeight: 1.2, fontSize: { xs: '2rem', md: '2.5rem' } }}
            >
              Made to Order,<br />Made with Love.
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, mb: 4, maxWidth: 480 }}>
              Every Frosted Crusts cake is baked fresh for your occasion — not pulled from a shelf.
              We ask for 48 hours so we can give your cake the time and care it deserves.
            </Typography>
            <Stack spacing={3}>
              {[
                { icon: <Handshake />, title: 'Handmade', desc: 'Every cake crafted by hand, just for you' },
                { icon: <Schedule />, title: 'Order 48hrs Ahead', desc: 'Fresh-baked, never pre-made or frozen' },
                { icon: <Palette />, title: 'Custom Flavours', desc: '10 flavours + premium fillings & toppings' },
              ].map(f => (
                <Stack key={f.title} direction="row" spacing={2} alignItems="flex-start">
                  <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#391c23', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main', flexShrink: 0 }}>
                    {f.icon}
                  </Box>
                  <Box>
                    <Typography fontWeight={700} color="#fff">{f.title}</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.55)' }}>{f.desc}</Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/customize')}
              sx={{ mt: 5, px: 4, py: 1.5, borderRadius: '0.75rem', fontWeight: 700 }}
            >
              Start Your Order
            </Button>
          </Box>

          {/* Staggered image grid */}
          <Box sx={{ flex: 1, display: { xs: 'none', lg: 'grid' }, gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box sx={{ pt: 6 }}>
              <Box sx={{ aspectRatio: '3/4', borderRadius: '1.25rem', overflow: 'hidden', backgroundImage: `url(${IMAGES.craft1})`, backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }} />
            </Box>
            <Box>
              <Box sx={{ aspectRatio: '3/4', borderRadius: '1.25rem', overflow: 'hidden', backgroundImage: `url(${IMAGES.craft2})`, backgroundSize: 'cover', backgroundPosition: 'center', mb: 2, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }} />
              <Box sx={{ aspectRatio: '1/1', borderRadius: '1.25rem', overflow: 'hidden', backgroundImage: `url(${IMAGES.craft3})`, backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }} />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Trust badges ── */}
      <Box sx={{ py: 5, px: { xs: 2, md: 4 }, bgcolor: 'background.default' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center">
          {[
            { icon: <Lock sx={{ fontSize: 16 }} />, label: 'Secure Payments' },
            { icon: <Schedule sx={{ fontSize: 16 }} />, label: '48hr Advance Notice' },
            { icon: <BakeryDining sx={{ fontSize: 16 }} />, label: 'Custom Designs' },
          ].map(({ icon, label }) => (
            <Chip
              key={label}
              icon={icon}
              label={label}
              variant="outlined"
              sx={{
                borderColor: isDark ? '#48232c' : '#f3e7ea',
                color: 'text.secondary',
                fontWeight: 500,
                px: 1,
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* QR Modal */}
      <QRCodeModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} mode="scan" />
    </Box>
  );
}
