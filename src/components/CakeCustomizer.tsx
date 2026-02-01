// FRONTEND CAKE CUSTOMIZATION COMPONENT: This file defines the CakeCustomizer component for the React frontend.
// It provides the UI for users to select cake size, layers, flavor, add-ons, and custom text.
//
// Design Patterns: Uses the React Component pattern, Context pattern for global state, and controlled component pattern for form inputs.
// Data Structures: Uses arrays for options, React state/context, and objects for configuration.
// Security: Limits input length for text, disables invalid options, and uses controlled components to prevent unsafe input.

// Import React and useEffect for component logic and side effects.
import React, { useEffect } from 'react';
// Import MUI components for enhanced UI
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
  CardContent,
} from '@mui/material';
import {
  Cake,
  Cookie,
  Layers,
  Palette,
  TextFields,
} from '@mui/icons-material';
// Import useConfig hook to access and update global cake configuration state.
import { useConfig } from '../context/ConfigContext';
// Import calculatePrice utility to compute the price based on configuration.
import { calculatePrice } from '../utils/priceCalculator';

// Define available cake sizes as an array of strings.
const SIZES = ['8', '10', '12', 'Bento'];
// Define available cake flavors as an array of strings.
const FLAVORS = ['vanilla', 'chocolate', 'strawberry', 'red velvet'];
// Define available add-ons as an array of strings.
const ADDONS = ['fruit', 'text', 'filling'];
// Define available product types
const PRODUCT_TYPES = ['cake', 'cookies', 'muffins'] as const;
// Define available shapes for cakes
const SHAPES = ['circle', 'heart'] as const;
// Define available box sizes for cookies/muffins
const BOX_SIZES = [4, 6, 12] as const;
// Define available flavors for cookies/muffins
const COOKIE_MUFFIN_FLAVORS = ['chocolate chip', 'red velvet', 'vanilla', 'oatmeal', 'peanut butter'];

// CakeCustomizer component provides the UI for customizing a cake order.
export default function CakeCustomizer() {
  // Get current config and updater from context.
  const { config, setConfig } = useConfig();
  // Updated: Added stepper state for better UX flow
  const [activeStep, setActiveStep] = React.useState(0);

  // useEffect: Recalculate price whenever relevant config fields change.
  useEffect(() => {
    const newPrice = calculatePrice(config); // Calculate new price.
    if (newPrice !== config.price) {
      setConfig({ ...config, price: newPrice }); // Update config with new price.
    }
  }, [config.size, config.layers, config.flavor, config.addons, config.boxSize, config.boxFlavors, config.productType, config.price, setConfig]);

  // Updated: Enhanced to handle stepper navigation
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Updated: Get stepper steps based on product type
  const getSteps = () => {
    if (config.productType === 'cake') {
      return ['Product Type', 'Shape & Size', 'Layers & Flavor', 'Add-ons & Text'];
    } else {
      return ['Product Type', 'Box Size', 'Flavors'];
    }
  };

  const steps = getSteps();

  // Handle size selection. If switching to Bento, force layers to 1.
  const handleSizeChange = (size: string) => {
    if (size === 'Bento' && (config.layers || 1) > 1) {
      setConfig({ ...config, size, layers: 1 });
    } else {
      setConfig({ ...config, size });
    }
  };

  // Handle layer selection. Prevent multiple layers for Bento size.
  const handleLayersChange = (layers: number) => {
    if (config.size === 'Bento' && layers > 1) {
      return;
    }
    setConfig({ ...config, layers });
  };

  // Handle flavor selection.
  const handleFlavorChange = (flavor: string) => {
    setConfig({ ...config, flavor });
  };

  // Handle add-on selection (toggle in array).
  const handleAddonChange = (addon: string) => {
    const currentAddons = config.addons || [];
    const newAddons = currentAddons.includes(addon)
      ? currentAddons.filter(a => a !== addon)
      : [...currentAddons, addon];
    setConfig({ ...config, addons: newAddons });
  };

  // Handle custom text input, limit to 40 characters.
  const handleTextChange = (text: string) => {
    if (text.length <= 40) {
      setConfig({ ...config, text });
    }
  };

  // Handle product type selection
  const handleProductTypeChange = (type: 'cake' | 'cookies' | 'muffins') => {
    // Reset config fields not relevant to the selected product
    if (type === 'cake') {
      setConfig({
        ...config,
        productType: type,
        size: '',
        layers: 1,
        flavor: '',
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
        flavor: undefined,
        addons: [],
        text: '',
        shape: undefined,
        boxSize: undefined,
        boxFlavors: [],
        price: 0,
      });
    }
  };

  // Add shape selection for cakes
  const handleShapeChange = (shape: 'circle' | 'heart') => {
    setConfig({ ...config, shape });
  };

  // Box size selection for cookies/muffins
  const handleBoxSizeChange = (boxSize: 4 | 6 | 12) => {
    setConfig({ ...config, boxSize, boxFlavors: [] }); // Reset flavors on box size change
  };

  // Box flavor selection for cookies/muffins (max 2 flavors)
  const handleBoxFlavorChange = (flavor: string) => {
    const current = config.boxFlavors || [];
    if (current.includes(flavor)) {
      setConfig({ ...config, boxFlavors: current.filter(f => f !== flavor) });
    } else if (current.length < 2) {
      setConfig({ ...config, boxFlavors: [...current, flavor] });
    }
  };

  // Render the customization UI - Updated: Enhanced with MUI Stepper and improved layout.
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
        {/* Header Section - New: Added visual header with icon */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Cake sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Customize Your Order
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create your perfect cake, cookies, or muffins
          </Typography>
        </Box>

        {/* Stepper - New: Added visual progress indicator */}
        <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                {/* Product Type Step */}
                {index === 0 && (
                  <Card variant="outlined" sx={{ p: 3, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Choose Product Type
                    </Typography>
                    <ToggleButtonGroup
                      value={config.productType}
                      exclusive
                      onChange={(_, value) => value && handleProductTypeChange(value)}
                      sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}
                    >
                      {PRODUCT_TYPES.map(type => (
                        <ToggleButton
                          key={type}
                          value={type}
                          sx={{
                            flex: 1,
                            minWidth: 120,
                            py: 2,
                            borderRadius: 2,
                            '&.Mui-selected': {
                              backgroundColor: 'primary.main',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'primary.dark',
                              }
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            {type === 'cake' && <Cake />}
                            {type === 'cookies' && <Cookie />}
                            {type === 'muffins' && <Cookie />}
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
                    {/* Shape Selection - Updated: Enhanced with visual toggle buttons */}
                    <Card variant="outlined" sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Shape
                      </Typography>
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
                              flex: 1,
                              py: 2,
                              borderRadius: 2,
                              '&.Mui-selected': {
                                backgroundColor: 'primary.main',
                                color: 'white'
                              }
                            }}
                          >
                            {shape.charAt(0).toUpperCase() + shape.slice(1)}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                    </Card>

                    {/* Size Selection - Updated: Enhanced with chips */}
                    <Card variant="outlined" sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Size
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {SIZES.map(size => (
                          <Chip
                            key={size}
                            label={`${size}"`}
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
                    {/* Layers Selection - Updated: Enhanced with slider and visual feedback */}
                    <Card variant="outlined" sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        <Layers sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Layers
                      </Typography>
                      <Box sx={{ px: 2 }}>
                        <Slider
                          value={config.layers || 1}
                          onChange={(_, value) => handleLayersChange(value as number)}
                          min={1}
                          max={config.size === 'Bento' ? 1 : 3}
                          step={1}
                          marks
                          valueLabelDisplay="auto"
                          disabled={config.size === 'Bento'}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {config.layers || 1} Layer{(config.layers || 1) > 1 ? 's' : ''}
                        </Typography>
                        {config.size === 'Bento' && (
                          <Alert severity="info" sx={{ mt: 2 }}>
                            Bento cakes are only available in single layer
                          </Alert>
                        )}
                      </Box>
                    </Card>

                    {/* Flavor Selection - Updated: Enhanced with visual grid */}
                    <Card variant="outlined" sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        <Palette sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Flavor
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {FLAVORS.map(flavor => (
                          <Button
                            key={flavor}
                            fullWidth
                            variant={config.flavor === flavor ? 'contained' : 'outlined'}
                            onClick={() => handleFlavorChange(flavor)}
                            sx={{ py: 1.5, borderRadius: 2, flex: '1 1 45%' }}
                          >
                            {flavor.charAt(0).toUpperCase() + flavor.slice(1)}
                          </Button>
                        ))}
                      </Box>
                    </Card>
                  </Box>
                )}

                {/* Cake Add-ons & Text Step */}
                {index === 3 && config.productType === 'cake' && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Add-ons Selection - Updated: Enhanced with FormGroup */}
                    <Card variant="outlined" sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Add-ons
                      </Typography>
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
                            label={addon.charAt(0).toUpperCase() + addon.slice(1)}
                          />
                        ))}
                      </FormGroup>
                    </Card>

                    {/* Text Input - Updated: Enhanced with TextField */}
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
                    <Typography variant="h6" gutterBottom>
                      Box Size
                    </Typography>
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
                            flex: 1,
                            py: 2,
                            borderRadius: 2,
                            '&.Mui-selected': {
                              backgroundColor: 'primary.main',
                              color: 'white'
                            }
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
                    <Typography variant="h6" gutterBottom>
                      Flavors (Choose up to 2)
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      {COOKIE_MUFFIN_FLAVORS.map(flavor => (
                        <Button
                          key={flavor}
                          variant={config.boxFlavors?.includes(flavor) ? 'contained' : 'outlined'}
                          onClick={() => handleBoxFlavorChange(flavor)}
                          disabled={config.boxFlavors && config.boxFlavors.length >= 2 && !config.boxFlavors.includes(flavor)}
                          sx={{ py: 1.5, borderRadius: 2, flex: '1 1 45%' }}
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

                {/* Navigation Buttons - New: Added stepper navigation */}
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="outlined"
                  >
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