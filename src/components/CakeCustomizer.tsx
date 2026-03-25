import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Chip,
  Button,
  Alert,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Add,
  Remove,
  TextFields,
  CheckCircle,
} from '@mui/icons-material';
import { useConfig } from '../context/ConfigContext';
import { calculatePrice } from '../utils/priceCalculator';

/* ─── Constants ─────────────────────────────────────────── */

const SIZES = [
  { value: '6',     label: '6"',   sub: 'Intimate' },
  { value: '8',     label: '8"',   sub: 'Classic'  },
  { value: '10',    label: '10"',  sub: 'Party'    },
  { value: '12',    label: '12"',  sub: 'Grand'    },
  { value: 'Bento', label: 'Bento',sub: 'Mini'     },
];

const SHAPES = [
  { value: 'circle', emoji: '⭕', label: 'Circle' },
  { value: 'heart',  emoji: '❤️', label: 'Heart'  },
];

const FLAVORS: { name: string; color: string; upcharge?: string }[] = [
  { name: 'vanilla',            color: '#f5e6ca' },
  { name: 'chocolate',          color: '#5d4037' },
  { name: 'red velvet',         color: '#b71c1c' },
  { name: 'biscoff',            color: '#c8a27e', upcharge: '+₦5k' },
  { name: 'carrot',             color: '#e65100', upcharge: '+₦2k' },
  { name: 'lemon',              color: '#fdd835', upcharge: '+₦2k' },
  { name: 'coconut',            color: '#e0e0e0', upcharge: '+₦2k' },
  { name: 'mocha',              color: '#6d4c41', upcharge: '+₦2k' },
  { name: 'confetti',           color: '#e040fb', upcharge: '+₦3k' },
  { name: 'lemon and blueberry',color: '#7b1fa2', upcharge: '+₦5k' },
];

const FILLING_OPTIONS = [
  'caramel', 'lemon curd', 'fresh strawberries', 'fresh blueberries',
  'nutella', 'strawberry puree', 'dulce de leche',
  'cream cheese', 'biscoff filling',
];

const FILLING_UPCHARGE_LABEL: Record<string, string> = {
  'cream cheese': '+₦3k',
  'biscoff filling': '+₦3k',
};

const ADDONS: { name: string; price: string }[] = [
  { name: 'butterflies',           price: '+₦2,000' },
  { name: 'light glitter',         price: '+₦2,000' },
  { name: 'heavy glitter',         price: '+₦5,000' },
  { name: 'light pearl detailing', price: '+₦2,500' },
  { name: 'heavy pearl detailing', price: '+₦5,000' },
  { name: 'other ornaments',       price: 'varies'  },
];

const PRODUCT_TYPES = [
  { value: 'cake',    emoji: '🎂', label: 'Cake'    },
  { value: 'cookies', emoji: '🍪', label: 'Cookies' },
  { value: 'muffins', emoji: '🧁', label: 'Muffins' },
] as const;

const BOX_SIZES = [
  { value: 4,  label: 'Box of 4',  price: '₦12,000' },
  { value: 6,  label: 'Box of 6',  price: '₦18,000' },
  { value: 12, label: 'Box of 12', price: '₦32,000' }, // 2 free with box of 12
] as const;

const COOKIE_MUFFIN_FLAVORS = ['chocolate chip', 'red velvet', 'vanilla', 'oatmeal', 'peanut butter'];

const CAKE_PRICE_MATRIX: Record<string, Record<number, string>> = {
  '6':     { 1: '₦14k', 2: '₦22k', 3: '₦30k' }, //each extra layer costs 8k naira
  '8':     { 1: '₦18k', 2: '₦28k', 3: '₦38k' }, //each extra layer costs 10k naira
  '10':    { 1: '₦22k', 2: '₦36k', 3: '₦52k' }, //each extra layer costs 14k naira
  '12':    { 1: '₦28k', 2: '₦48k', 3: '₦68k' }, //each extra layer costs 20k naira
  'Bento': { 1: '₦9.5k' }, //bento is single layer only, costs 9.5k naira
};

/* ─── Component ──────────────────────────────────────────── */

export default function CakeCustomizer() {
  const { config, setConfig } = useConfig();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [activeStep, setActiveStep] = React.useState(0);

  const borderColor   = isDark ? '#48232c' : '#f3e7ea';
  const surface2      = isDark ? '#391c23' : '#fcf8f9';
  const surfaceActive = isDark ? 'rgba(239,57,102,0.12)' : 'rgba(239,57,102,0.07)';

  /* Re-calc price whenever config changes */
  useEffect(() => {
    const newPrice = calculatePrice(config);
    if (newPrice !== config.price) {
      setConfig({ ...config, price: newPrice });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.size, config.layers, config.flavors, config.filling, config.addons,
      config.boxSize, config.boxFlavors, config.productType]);

  const layers = config.layers || 1;

  /* ── Handlers ─────────────────────────────────────────── */

  const handleProductTypeChange = (type: 'cake' | 'cookies' | 'muffins') => {
    if (type === 'cake') {
      setConfig({ ...config, productType: type, size: '', layers: 1, flavors: [], filling: undefined, addons: [], text: '', shape: 'circle', boxSize: undefined, boxFlavors: [], price: 0 });
    } else {
      setConfig({ ...config, productType: type, size: undefined, layers: undefined, flavors: [], filling: undefined, addons: [], text: '', shape: undefined, boxSize: undefined, boxFlavors: [], price: 0 });
    }
    setActiveStep(1);
  };

  const handleSizeChange = (size: string) => {
    if (size === 'Bento' && layers > 1) {
      setConfig({ ...config, size, layers: 1, flavors: (config.flavors || []).slice(0, 1) });
    } else {
      setConfig({ ...config, size });
    }
  };

  const handleLayersChange = (newLayers: number) => {
    if (config.size === 'Bento' && newLayers > 1) return;
    const trimmed = (config.flavors || []).slice(0, newLayers);
    // auto-fill subsequent layers from layer 1
    const filled = Array.from({ length: newLayers }, (_, i) => trimmed[i] ?? trimmed[0] ?? '');
    setConfig({ ...config, layers: newLayers, flavors: filled, filling: newLayers < 2 ? undefined : config.filling });
  };

  const handleFlavorChange = (layerIndex: number, flavor: string) => {
    const newFlavors = [...(config.flavors || [])];
    newFlavors[layerIndex] = flavor;
    setConfig({ ...config, flavors: newFlavors });
  };

  const handleAddonChange = (addon: string) => {
    const current = config.addons || [];
    setConfig({ ...config, addons: current.includes(addon) ? current.filter(a => a !== addon) : [...current, addon] });
  };

  const handleBoxFlavorChange = (flavor: string) => {
    const current = config.boxFlavors || [];
    if (current.includes(flavor)) {
      setConfig({ ...config, boxFlavors: current.filter(f => f !== flavor) });
    } else if (current.length < 2) {
      setConfig({ ...config, boxFlavors: [...current, flavor] });
    }
  };

  /* ── Section label ─────────────────────────────────────── */

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <Typography
      variant="overline"
      sx={{ color: 'text.disabled', fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.65rem', display: 'block', mb: 1.5 }}
    >
      {children}
    </Typography>
  );

  /* ── Render ────────────────────────────────────────────── */

  return (
    <Box sx={{ p: { xs: 1.75, md: 3 } }}>

      {/* ── Step 0: Product Type ─────────────────────── */}
      <Section label="What are you ordering?">
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
          {PRODUCT_TYPES.map(pt => {
            const selected = config.productType === pt.value;
            return (
              <Box
                key={pt.value}
                onClick={() => handleProductTypeChange(pt.value)}
                sx={{
                  border: `2px solid ${selected ? 'primary.main' : borderColor}`,
                  borderColor: selected ? 'primary.main' : borderColor,
                  borderRadius: '0.75rem',
                  p: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  bgcolor: selected ? surfaceActive : surface2,
                  transition: 'all 0.2s',
                  '&:hover': { borderColor: 'primary.main', bgcolor: surfaceActive },
                }}
              >
                <Typography sx={{ fontSize: '1.75rem', lineHeight: 1, mb: 0.5 }}>{pt.emoji}</Typography>
                <Typography variant="caption" fontWeight={700} color={selected ? 'primary.main' : 'text.secondary'}>
                  {pt.label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Section>

      {/* ── CAKE FLOW ─────────────────────────────────── */}

      {config.productType === 'cake' && (
        <>
          {/* Shape */}
          <Section label="Shape">
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              {SHAPES.map(s => {
                const selected = config.shape === s.value;
                return (
                  <Box
                    key={s.value}
                    onClick={() => setConfig({ ...config, shape: s.value as 'circle' | 'heart' })}
                    sx={{
                      border: `2px solid`,
                      borderColor: selected ? 'primary.main' : borderColor,
                      borderRadius: '0.75rem',
                      p: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      bgcolor: selected ? surfaceActive : surface2,
                      transition: 'all 0.2s',
                      '&:hover': { borderColor: 'primary.main', bgcolor: surfaceActive },
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      justifyContent: 'center',
                    }}
                  >
                    <Typography sx={{ fontSize: '1.4rem' }}>{s.emoji}</Typography>
                    <Typography variant="body2" fontWeight={700} color={selected ? 'primary.main' : 'text.primary'}>
                      {s.label}
                    </Typography>
                    {selected && <CheckCircle sx={{ fontSize: 16, color: 'primary.main' }} />}
                  </Box>
                );
              })}
            </Box>
          </Section>

          {/* Size */}
          <Section label="Size">
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
              {SIZES.map(sz => {
                const selected = config.size === sz.value;
                const price1 = CAKE_PRICE_MATRIX[sz.value]?.[1] || '';
                return (
                  <Box
                    key={sz.value}
                    onClick={() => handleSizeChange(sz.value)}
                    sx={{
                      border: `2px solid`,
                      borderColor: selected ? 'primary.main' : borderColor,
                      borderRadius: '0.75rem',
                      p: 1.5,
                      textAlign: 'center',
                      cursor: 'pointer',
                      bgcolor: selected ? surfaceActive : surface2,
                      transition: 'all 0.2s',
                      '&:hover': { borderColor: 'primary.main', bgcolor: surfaceActive },
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={800} color={selected ? 'primary.main' : 'text.primary'}>
                      {sz.label}
                    </Typography>
                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>
                      {sz.sub}
                    </Typography>
                    <Typography variant="caption" fontWeight={700} color={selected ? 'primary.main' : 'text.secondary'}>
                      from {price1}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Section>

          {/* Layers */}
          <Section label="Layers">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                onClick={() => handleLayersChange(Math.max(1, layers - 1))}
                disabled={layers <= 1}
                sx={{
                  width: 40, height: 40,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '0.5rem',
                  color: 'text.primary',
                  '&:hover': { bgcolor: surfaceActive, borderColor: 'primary.main' },
                  '&.Mui-disabled': { opacity: 0.3 },
                }}
              >
                <Remove sx={{ fontSize: 18 }} />
              </IconButton>

              <Box sx={{ flex: 1, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={900} color="primary.main" sx={{ lineHeight: 1 }}>
                  {layers}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {layers === 1 ? 'Single layer' : `${layers} layers`}
                  {layers >= 2 && <span style={{ color: '#ef3966', marginLeft: 6 }}>· filling required</span>}
                </Typography>
              </Box>

              <IconButton
                onClick={() => handleLayersChange(Math.min(config.size === 'Bento' ? 1 : 3, layers + 1))}
                disabled={layers >= (config.size === 'Bento' ? 1 : 3)}
                sx={{
                  width: 40, height: 40,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '0.5rem',
                  color: 'text.primary',
                  '&:hover': { bgcolor: surfaceActive, borderColor: 'primary.main' },
                  '&.Mui-disabled': { opacity: 0.3 },
                }}
              >
                <Add sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
            {config.size === 'Bento' && (
              <Alert severity="info" sx={{ mt: 1.5, borderRadius: '0.6rem', fontSize: '0.8rem', py: 0.5 }}>
                Bento cakes are single layer only
              </Alert>
            )}
            {/* Price hint */}
            {config.size && (
              <Box sx={{ mt: 1.5, display: 'flex', gap: 1 }}>
                {[1, 2, 3].map(l => {
                  if (config.size === 'Bento' && l > 1) return null;
                  const p = CAKE_PRICE_MATRIX[config.size!]?.[l];
                  if (!p) return null;
                  return (
                    <Chip
                      key={l}
                      label={`${l}L · ${p}`}
                      size="small"
                      sx={{
                        bgcolor: layers === l ? 'primary.main' : surface2,
                        color: layers === l ? '#fff' : 'text.secondary',
                        border: `1px solid ${layers === l ? 'transparent' : borderColor}`,
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleLayersChange(l)}
                    />
                  );
                })}
              </Box>
            )}
          </Section>

          {/* Per-layer flavors */}
          {Array.from({ length: layers }).map((_, i) => (
            <Section key={i} label={layers > 1 ? `Layer ${i + 1} flavour` : 'Flavour'}>
              {i > 0 && config.flavors?.[0] && !config.flavors?.[i] && (
                <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 1 }}>
                  Auto-filled from layer 1 — tap to change
                </Typography>
              )}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
                {FLAVORS.map(fl => {
                  const selected = config.flavors?.[i] === fl.name;
                  return (
                    <Box
                      key={fl.name}
                      onClick={() => handleFlavorChange(i, fl.name)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        p: 1.25,
                        border: `1.5px solid`,
                        borderColor: selected ? 'primary.main' : borderColor,
                        borderRadius: '0.65rem',
                        cursor: 'pointer',
                        bgcolor: selected ? surfaceActive : surface2,
                        transition: 'all 0.18s',
                        '&:hover': { borderColor: 'primary.main', bgcolor: surfaceActive },
                      }}
                    >
                      {/* Color swatch */}
                      <Box
                        sx={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          bgcolor: fl.color,
                          border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}`,
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="caption"
                        fontWeight={selected ? 700 : 500}
                        color={selected ? 'primary.main' : 'text.primary'}
                        sx={{ textTransform: 'capitalize', flex: 1, lineHeight: 1.2 }}
                      >
                        {fl.name}
                      </Typography>
                      {fl.upcharge && (
                        <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0, fontSize: '0.65rem' }}>
                          {fl.upcharge}
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Section>
          ))}

          {/* Filling — auto-shown for 2+ layers */}
          {layers >= 2 && (
            <Section label={`Filling · base ${layers === 2 ? '+₦3,000' : '+₦5,000'}`}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
                {FILLING_OPTIONS.map(f => {
                  const selected = config.filling === f;
                  const extra = FILLING_UPCHARGE_LABEL[f];
                  return (
                    <Box
                      key={f}
                      onClick={() => setConfig({ ...config, filling: config.filling === f ? undefined : f })}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1,
                        p: 1.25,
                        border: `1.5px solid`,
                        borderColor: selected ? 'primary.main' : borderColor,
                        borderRadius: '0.65rem',
                        cursor: 'pointer',
                        bgcolor: selected ? surfaceActive : surface2,
                        transition: 'all 0.18s',
                        '&:hover': { borderColor: 'primary.main', bgcolor: surfaceActive },
                      }}
                    >
                      <Typography
                        variant="caption"
                        fontWeight={selected ? 700 : 500}
                        color={selected ? 'primary.main' : 'text.primary'}
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {f}
                      </Typography>
                      {extra && (
                        <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem', flexShrink: 0 }}>
                          {extra}
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Section>
          )}

          {/* Add-ons */}
          <Section label="Add-ons (optional)">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              {ADDONS.map(addon => {
                const selected = (config.addons || []).includes(addon.name);
                return (
                  <Box
                    key={addon.name}
                    onClick={() => handleAddonChange(addon.name)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1.5,
                      border: `1.5px solid`,
                      borderColor: selected ? 'primary.main' : borderColor,
                      borderRadius: '0.65rem',
                      cursor: 'pointer',
                      bgcolor: selected ? surfaceActive : 'transparent',
                      transition: 'all 0.18s',
                      '&:hover': { borderColor: 'primary.main', bgcolor: surfaceActive },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 18, height: 18,
                          borderRadius: '4px',
                          border: `2px solid ${selected ? '#ef3966' : isDark ? '#48232c' : '#d1b5bc'}`,
                          bgcolor: selected ? '#ef3966' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'all 0.18s',
                        }}
                      >
                        {selected && <Box component="span" sx={{ color: '#fff', fontSize: 11, lineHeight: 1, fontWeight: 900 }}>✓</Box>}
                      </Box>
                      <Typography
                        variant="body2"
                        fontWeight={selected ? 700 : 500}
                        color={selected ? 'primary.main' : 'text.primary'}
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {addon.name}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.disabled" fontWeight={600}>
                      {addon.price}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Section>

          {/* Text on cake */}
          <Section label="Writing on cake (optional)">
            <TextField
              fullWidth
              size="small"
              value={config.text || ''}
              onChange={e => e.target.value.length <= 40 && setConfig({ ...config, text: e.target.value })}
              placeholder="e.g. Cakes and candles Big dawg! 🎉"
              inputProps={{ maxLength: 40 }}
              helperText={`${40 - (config.text?.length || 0)} characters remaining`}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '0.65rem',
                  bgcolor: surface2,
                  '& fieldset': { borderColor },
                },
              }}
              InputProps={{
                startAdornment: (
                  <TextFields sx={{ color: 'text.disabled', fontSize: 18, mr: 1 }} />
                ),
              }}
            />
          </Section>
        </>
      )}

      {/* ── COOKIES / MUFFINS FLOW ─────────────────────── */}

      {(config.productType === 'cookies' || config.productType === 'muffins') && (
        <>
          {/* Box size */}
          <Section label="Box size">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {BOX_SIZES.map(bs => {
                const selected = config.boxSize === bs.value;
                return (
                  <Box
                    key={bs.value}
                    onClick={() => setConfig({ ...config, boxSize: bs.value, boxFlavors: [] })}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1.75,
                      border: `2px solid`,
                      borderColor: selected ? 'primary.main' : borderColor,
                      borderRadius: '0.75rem',
                      cursor: 'pointer',
                      bgcolor: selected ? surfaceActive : surface2,
                      transition: 'all 0.2s',
                      '&:hover': { borderColor: 'primary.main', bgcolor: surfaceActive },
                    }}
                  >
                    <Typography variant="body1" fontWeight={700} color={selected ? 'primary.main' : 'text.primary'}>
                      {bs.label}
                    </Typography>
                    <Typography variant="body2" fontWeight={700} color={selected ? 'primary.main' : 'text.secondary'}>
                      {bs.price}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Section>

          {/* Flavors */}
          <Section label="Flavours (pick up to 2)">
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
              {COOKIE_MUFFIN_FLAVORS.map(flavor => {
                const selected = (config.boxFlavors || []).includes(flavor);
                const maxed = (config.boxFlavors || []).length >= 2 && !selected;
                return (
                  <Box
                    key={flavor}
                    onClick={() => !maxed && handleBoxFlavorChange(flavor)}
                    sx={{
                      p: 1.25,
                      border: `1.5px solid`,
                      borderColor: selected ? 'primary.main' : borderColor,
                      borderRadius: '0.65rem',
                      cursor: maxed ? 'not-allowed' : 'pointer',
                      bgcolor: selected ? surfaceActive : maxed ? (isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)') : surface2,
                      opacity: maxed ? 0.45 : 1,
                      transition: 'all 0.18s',
                      textAlign: 'center',
                      '&:hover': !maxed ? { borderColor: 'primary.main', bgcolor: surfaceActive } : {},
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight={selected ? 700 : 500}
                      color={selected ? 'primary.main' : 'text.primary'}
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {flavor}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
            <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
              {2 - ((config.boxFlavors || []).length)} flavour{2 - ((config.boxFlavors || []).length) !== 1 ? 's' : ''} remaining
            </Typography>
          </Section>
        </>
      )}
    </Box>
  );
}

/* ─── Section wrapper helper ─────────────────────────────── */

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="overline"
        sx={{ color: 'text.disabled', fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.65rem', display: 'block', mb: 1.5 }}
      >
        {label}
      </Typography>
      {children}
    </Box>
  );
}
