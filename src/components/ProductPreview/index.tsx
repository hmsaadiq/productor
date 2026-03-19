// ProductPreview container: delegates to product-specific SVG renderers.
// Accepts an optional config prop; falls back to useConfig() context.

import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useConfig } from '../../context/ConfigContext';
import CakePreview from './CakePreview';
import CookiesPreview from './CookiesPreview';
import MuffinsPreview from './MuffinsPreview';

interface ProductPreviewProps {
  config?: {
    productType: 'cake' | 'cookies' | 'muffins';
    size?: string;
    layers?: number;
    flavor?: string;
    addons?: string[];
    text?: string;
    shape?: 'circle' | 'heart';
    boxSize?: 4 | 6 | 12;
    boxFlavors?: string[];
  };
}

export default function ProductPreview({ config: configProp }: ProductPreviewProps) {
  const { config: contextConfig } = useConfig();
  const config = configProp || contextConfig;

  const renderPreview = () => {
    switch (config.productType) {
      case 'cake':
        return <CakePreview config={config} />;
      case 'cookies':
        return <CookiesPreview config={config} />;
      case 'muffins':
        return <MuffinsPreview config={config} />;
      default:
        return null;
    }
  };

  // Build label text
  const label = config.productType === 'cake'
    ? `${config.size || 'Custom'}" ${config.flavor || 'Cake'}`
    : config.productType === 'cookies'
    ? `${config.boxSize || 'Custom'} Cookies`
    : config.productType === 'muffins'
    ? `${config.boxSize || 'Custom'} Muffins`
    : 'Your Order';

  return (
    <Card variant="outlined" sx={{ mt: 3, backgroundColor: 'grey.50' }}>
      <CardContent sx={{ textAlign: 'center', py: 3 }}>
        <Box sx={{ width: 200, height: 200, mx: 'auto', mb: 2 }}>
          {renderPreview()}
        </Box>
        <Typography variant="body2" color="text.secondary" fontWeight="medium">
          {label}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
          Live Preview
        </Typography>
      </CardContent>
    </Card>
  );
}
