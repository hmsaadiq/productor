// FRONTEND LANDING PAGE COMPONENT: This file defines the HomePage component for the React frontend.
// It serves as the landing page, introducing the app and providing navigation to the configurator and QR code scanner.
//
// Design Patterns: Uses the React Component pattern, presentational component pattern, and modal/dialog pattern for QR code.
// Data Structures: Uses React state (useState) for modal control.
// Security: No direct security features; only displays static and navigational content.

// Import React and useState for component logic and state management.
import React, { useState } from 'react';
// Import useNavigate from React Router for programmatic navigation.
import { useNavigate } from 'react-router-dom';
// Import MUI components for enhanced homepage UI
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Chip,
  Paper,
} from '@mui/material';
import {
  Cake,
  QrCodeScanner,
  Palette,
  TextFields,
  Add,
  ArrowForward,
} from '@mui/icons-material';
// Import QRCodeModal for displaying/scanning QR codes.
import QRCodeModal from '../components/QRCodeModal';

// HomePage component displays the landing UI and navigation options - Updated: Enhanced with MUI design.
export default function HomePage() {
  // Get navigate function for routing.
  const navigate = useNavigate();
  // Local state to control QR code modal visibility.
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Hero Section - Updated: Enhanced with MUI Typography and layout */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 3,
              background: 'linear-gradient(45deg, #ef3966, #ff6b9d)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
            }}
          >
            Customize Your Perfect Cake
          </Typography>
          
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto', mb: 4, fontWeight: 400 }}
          >
            Design your dream cake with our easy-to-use configurator. Choose size, flavor, layers, and more!
          </Typography>

          {/* Action Buttons - Updated: Enhanced with MUI Button styling */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            sx={{ mb: 2 }}
          >
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/customize')}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              Start Customizing Your Order
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              startIcon={<QrCodeScanner />}
              onClick={() => setIsQRModalOpen(true)}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              Scan QR Code
            </Button>
          </Stack>

          {/* Trust Indicators - New: Added trust badges */}
          <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 3 }}>
            <Chip label="Secure Payments" size="small" variant="outlined" />
            <Chip label="Fresh Ingredients" size="small" variant="outlined" />
            <Chip label="Same Day Delivery" size="small" variant="outlined" />
          </Stack>
        </Box>

        {/* Features Section - Updated: Enhanced with MUI Cards and icons */}
        <Box sx={{ mt: 10 }}>
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            sx={{ mb: 6, fontWeight: 700 }}
          >
            Why Choose Productor1?
          </Typography>
          
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 4,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Cake sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    Multiple Sizes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose from various sizes including our special Bento cakes for intimate celebrations
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <TextFields sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    Custom Text
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add your personal message to make it special and memorable for any occasion
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Add sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    Premium Add-ons
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enhance your cake with fresh fruits, premium fillings, and decorative elements
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>

        {/* Call to Action Section - New: Added secondary CTA */}
        <Paper
          elevation={1}
          sx={{
            mt: 10,
            p: 6,
            textAlign: 'center',
            borderRadius: 4,
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Ready to Create Something Amazing?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Join thousands of satisfied customers who trust us with their special moments
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/customize')}
            sx={{
              px: 5,
              py: 1.5,
              borderRadius: 3,
              textTransform: 'none',
              fontSize: '1.1rem',
            }}
          >
            Get Started Now
          </Button>
        </Paper>
      </Container>

      {/* QR code modal for scanning (mode="scan") */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        mode="scan"
      />
    </Box>
  );
} 