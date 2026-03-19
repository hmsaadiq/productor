// FRONTEND CAKE CUSTOMIZATION COMPONENT: This file defines the CakeCustomizer component for the React frontend.
// It provides the UI for users to select cake size, layers, flavor, add-ons, and custom text.
//
// Design Patterns: Uses the React Component pattern, Context pattern for global state, and controlled component pattern for form inputs.
// Data Structures: Uses arrays for options, React state/context, and objects for configuration.
// Security: Limits input length for text, disables invalid options, and uses controlled components to prevent unsafe input.

import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Chip,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Alert,
  Slider,
  Card,
} from '@mui/material';
import {
  Cake,
  Cookie,
  Layers,
  Palette,
  TextFields,
} from '@mui/icons-material';
import { useConfig } from '../context/ConfigContext';
import { calculatePrice } from '../utils/priceCalculator';

const SIZES = ['6', '8', '10', '12', 'Bento'];
const FLAVORS = [
  'vanilla', 'chocolate', 'red velvet',
  'biscoff', 'carrot', 'lemon', 'coconut',
  'mocha', 'confetti', 'lemon and blueberry',
];
const FILLING_OPTIONS = [
  'caramel', 'lemon curd', 'fresh strawberries', 'fresh blueberries',
  'nutella', 'strawberry puree', 'dulce de leche',
  'cream cheese', 'biscoff filling',
];
const ADDONS = [
  'butterflies', 'light glitter', 'heavy glitter',
  'light pearl detailing', 'heavy pearl detailing', 'other ornaments',
];
const PRODUCT_TYPES = ['cake', 'cookies', 'muffins'] as const;
const SHAPES = ['circle', 'heart'] as const;
const BOX_SIZES = [4, 6, 12] as const;
const COOKIE_MUFFIN_FLAVORS = ['chocolate chip', 'red velvet', 'vanilla', 'oatmeal', 'peanut butter'];

const ADDON_PRICE_LABELS: Record<string, string> = {
  butterflies: '+₦2,000',
  'light glitter': '+₦2,000',
  'heavy glitter': '+₦5,000',
  'light pearl detailing': '+₦2,500',
  'heavy pearl detailing': '+₦5,000',
  'other ornaments': 'price varies',
};

export default function CakeCustomizer() {
  const { config, setConfig } = useConfig();
  const [activeStep, setActiveStep] = React.useState(0);

  useEffect(() => {
    const newPrice = calculatePrice(config);
    if (newPrice !== config.price) {
      setConfig({ ...config, price: newPrice });
    }
  }, [config.size, config.layers, config.flavors, config.filling, config.addons, config.boxSize, config.boxFlavors, config.productType, config.price, setConfig]);

  const handleNext = () => setActiveStep(s => s + 1);
  const handleBack = () => setActiveStep(s => s - 1);

  const getSteps = () => {
    if (config.productType === 'cake') {
      return ['Product Type', 'Shape & Size', 'Layers & Flavor', 'Add-ons & Text'];
    }
    return ['Product Type', 'Box Size', 'Flavors'];
  };
  const steps = getSteps();

  const handleSizeChange = (size: string) => {
    if (size === 'Bento' && (config.layers || 1) > 1) {
      setConfig({ ...config, size, layers: 1, flavors: (config.flavors || []).slice(0, 1) });
    } else {
      setConfig({ ...config, size });
    }
  };

  // When layers change, trim or pad flavors array accordingly
  const handleLayersChange = (newLayers: number) => {
    if (config.size === 'Bento' && newLayers > 1) return;
    const trimmed = (config.flavors || []).slice(0, newLayers);
    setConfig({ ...config, layers: newLayers, flavors: trimmed, filling: newLayers < 2 ? undefined : config.filling });
  };

  const handleFlavorChange = (layerIndex: number, flavor: string) => {
    const newFlavors = [...(config.flavors || [])];
    newFlavors[layerIndex] = flavor;
    setConfig({ ...config, flavors: newFlavors });
  };

  const handleAddonChange = (addon: string) => {
    const currentAddons = config.addons || [];
    const newAddons = currentAddons.includes(addon)
      ? currentAddons.filter(a => a !== addon)
      : [...currentAddons, addon];
    setConfig({ ...config, addons: newAddons });
  };

  const handleTextChange = (text: string) => {
    if (text.length <= 40) setConfig({ ...config, text });
  };

  const handleProductTypeChange = (type: 'cake' | 'cookies' | 'muffins') => {
    if (type === 'cake') {
      setConfig({
        ...config,
        productType: type,
        size: '',
        layers: 1,
        flavors: [],
        filling: undefined,
        addons: [],
        text: '',
        shape: 'circle',
        boxSize: undefined,
        boxFlavors: [],
        price: 0,
      });
    } else {
      setConfig({
        ...config,
        productType: type,
        size: undefined,
        layers: undefined,
        flavors: [],
        filling: undefined,
        addons: [],
        text: '',
        shape: undefined,
        boxSize: undefined,
        boxFlavors: [],
        price: 0,
      });
    }
  };

  const handleShapeChange = (shape: 'circle' | 'heart') => {
    setConfig({ ...config, shape });
  };

  const handleBoxSizeChange = (boxSize: 4 | 6 | 12) => {
    setConfig({ ...config, boxSize, boxFlavors: [] });
  };

  const handleBoxFlavorChange = (flavor: string) => {
    const current = config.boxFlavors || [];
    if (current.includes(flavor)) {
      setConfig({ ...config, boxFlavors: current.filter(f => f !== flavor) });
    } else if (current.length < 2) {
      setConfig({ ...config, boxFlavors: [...current, flavor] });
    }
  };

  const layers = config.layers || 1;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, md: 3 } }}>
      <Paper elevation={2} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Cake sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Customize Your Order
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create your perfect cake, cookies, or muffins
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                {/* Product Type Step */}
                {index === 0 && (
                  <Card variant="outlined" sx={{ p: 3, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>Choose Product Type</Typography>
                    <ToggleButtonGroup
                      value={config.productType}
                      exclusive
                      fullWidth
                      onChange={(_, value) => value && handleProductTypeChange(value)}
                      sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}
                    >
                      {PRODUCT_TYPES.map(type => (
                        <ToggleButton
                          key={type}
                          value={type}
                          sx={{
                            flex: 1, minWidth: 0,
                            py: { xs: 1.2, md: 1.5 },
                            fontSize: { xs: '0.85rem', md: '1rem' },
                            borderRadius: 2,
                            '&.Mui-selected': {
                              backgroundColor: 'primary.main',
                              color: 'primary.contrastText',
                              '&:hover': { backgroundColor: 'primary.dark' },
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            {type === 'cake' ? <Cake /> : <Cookie />}
                            <Typography variant="body2">
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </Typography>
                          </Box>
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </Card>
                )}

                {/* Cake Shape & Size Step */}
                {index === 1 && config.productType === 'cake' && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Card variant="outlined" sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Shape</Typography>
                      <ToggleButtonGroup
                        value={config.shape}
                        exclusive
                        onChange={(_, value) => value && handleShapeChange(value)}
                        sx={{ display: 'flex', gap: 1 }}
                      >
                        {SHAPES.map(shape => (
                          <ToggleButton
                            key={shape}
                            value={shape}
                            sx={{
                              flex: 1, py: 2, borderRadius: 2,
                              '&.Mui-selected': { backgroundColor: 'primary.main', color: 'primary.contrastText' },
                            }}
                          >
                            {shape.charAt(0).toUpperCase() + shape.slice(1)}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                    </Card>

                    <Card variant="outlined" sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Size</Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {SIZES.map(size => (
                          <Chip
                            key={size}
                            label={size === 'Bento' ? 'Bento' : `${size}"`}
                            onClick={() => handleSizeChange(size)}
                            color={config.size === size ? 'primary' : 'default'}
                            variant={config.size === size ? 'filled' : 'outlined'}
                            sx={{ minWidth: 60, py: 2 }}
                          />
                        ))}
                      </Box>
                    </Card>
                  </Box>
                )}

                {/* Cake Layers & Flavor Step */}
                {index === 2 && config.productType === 'cake' && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Card variant="outlined" sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        <Layers sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Layers
                      </Typography>
                      <Box sx={{ px: 2 }}>
                        <Slider
                          value={layers}
                          onChange={(_, value) => handleLayersChange(value as number)}
                          min={1}
                          max={config.size === 'Bento' ? 1 : 3}
                          step={1}
                          marks
                          valueLabelDisplay="auto"
                          disabled={config.size === 'Bento'}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {layers} Layer{layers > 1 ? 's' : ''}
                        </Typography>
                        {config.size === 'Bento' && (
                          <Alert severity="info" sx={{ mt: 2 }}>
                            Bento cakes are only available in single layer
                          </Alert>
                        )}
                      </Box>
                    </Card>

                    {/* Per-layer flavor selection */}
                    {Array.from({ length: layers }).map((_, i) => (
                      <Card key={i} variant="outlined" sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                          <Palette sx={{ mr: 1, verticalAlign: 'middle' }} />
                          Layer {i + 1} Flavor
                          {i > 0 && (config.flavors?.[i] === config.flavors?.[0]) && (
                            <Chip label="same as layer 1" size="small" sx={{ ml: 1 }} />
                          )}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {FLAVORS.map(flavor => {
                            const upcharge = flavor === 'biscoff' ? '+₦5,000'
                              : flavor === 'confetti' ? '+₦3,000'
                              : flavor === 'lemon and blueberry' ? '+₦5,000'
                              : ['carrot','lemon','coconut','mocha'].includes(flavor) ? '+₦2,000'
                              : null;
                            return (
                              <Button
                                key={flavor}
                                variant={config.flavors?.[i] === flavor ? 'contained' : 'outlined'}
                                onClick={() => handleFlavorChange(i, flavor)}
                                sx={{ borderRadius: 2, textTransform: 'capitalize', fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                              >
                                {flavor}
                                {upcharge && (
                                  <Typography component="span" variant="caption" sx={{ ml: 0.5, opacity: 0.8 }}>
                                    {upcharge}
                                  </Typography>
                                )}
                              </Button>
                            );
                          })}
                        </Box>
                      </Card>
                    ))}

                    {/* Filling selector for 2+ layers */}
                    {layers >= 2 && (
                      <Card variant="outlined" sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                          Filling{' '}
                          <Chip
                            label={layers === 2 ? '+₦3,000 base' : '+₦5,000 base'}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {FILLING_OPTIONS.map(f => {
                            const extra = f === 'cream cheese' || f === 'biscoff filling' ? ' (+₦3,000)' : '';
                            return (
                              <Button
                                key={f}
                                variant={config.filling === f ? 'contained' : 'outlined'}
                                onClick={() => setConfig({ ...config, filling: config.filling === f ? undefined : f })}
                                sx={{ borderRadius: 2, textTransform: 'capitalize', fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                              >
                                {f}{extra}
                              </Button>
                            );
                          })}
                        </Box>
                      </Card>
                    )}
                  </Box>
                )}

                {/* Cake Add-ons & Text Step */}
                {index === 3 && config.productType === 'cake' && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Card variant="outlined" sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Add-ons</Typography>
                      <FormGroup>
                        {ADDONS.map(addon => (
                          <FormControlLabel
                            key={addon}
                            control={
                              <Checkbox
                                checked={config.addons?.includes(addon) || false}
                                onChange={() => handleAddonChange(addon)}
                                color="primary"
                              />
                            }
                            label={
                              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <span style={{ textTransform: 'capitalize' }}>{addon}</span>
                                <Chip label={ADDON_PRICE_LABELS[addon]} size="small" variant="outlined" />
                              </Box>
                            }
                          />
                        ))}
                      </FormGroup>
                    </Card>

                    <Card variant="outlined" sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        <TextFields sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Writing on Cake
                      </Typography>
                      <TextField
                        fullWidth
                        value={config.text || ''}
                        onChange={(e) => handleTextChange(e.target.value)}
                        placeholder="Enter text (max 40 characters)"
                        inputProps={{ maxLength: 40 }}
                        helperText={`${40 - (config.text ? config.text.length : 0)} characters remaining`}
                        variant="outlined"
                      />
                    </Card>
                  </Box>
                )}

                {/* Cookies/Muffins Box Size Step */}
                {index === 1 && (config.productType === 'cookies' || config.productType === 'muffins') && (
                  <Card variant="outlined" sx={{ p: 3, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>Box Size</Typography>
                    <ToggleButtonGroup
                      value={config.boxSize}
                      exclusive
                      onChange={(_, value) => value && handleBoxSizeChange(value)}
                      sx={{ display: 'flex', gap: 1 }}
                    >
                      {BOX_SIZES.map(size => (
                        <ToggleButton
                          key={size}
                          value={size}
                          sx={{
                            flex: 1, py: 2, borderRadius: 2,
                            '&.Mui-selected': { backgroundColor: 'primary.main', color: 'primary.contrastText' },
                          }}
                        >
                          Box of {size}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </Card>
                )}

                {/* Cookies/Muffins Flavors Step */}
                {index === 2 && (config.productType === 'cookies' || config.productType === 'muffins') && (
                  <Card variant="outlined" sx={{ p: 3, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>Flavors (Choose up to 2)</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      {COOKIE_MUFFIN_FLAVORS.map(flavor => (
                        <Button
                          key={flavor}
                          variant={config.boxFlavors?.includes(flavor) ? 'contained' : 'outlined'}
                          onClick={() => handleBoxFlavorChange(flavor)}
                          disabled={config.boxFlavors && config.boxFlavors.length >= 2 && !config.boxFlavors.includes(flavor)}
                          sx={{ borderRadius: 2, flex: '1 1 45%', fontSize: { xs: '0.8rem', md: '0.95rem' } }}
                        >
                          {flavor.charAt(0).toUpperCase() + flavor.slice(1)}
                        </Button>
                      ))}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      {2 - (config.boxFlavors ? config.boxFlavors.length : 0)} flavor(s) remaining
                    </Typography>
                  </Card>
                )}

                {/* Navigation */}
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={activeStep === steps.length - 1}
                  >
                    Next
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>
    </Box>
  );
}
