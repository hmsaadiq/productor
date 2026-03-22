import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, TextField, Button, Select, MenuItem,
  FormControl, InputLabel, Paper, Avatar, Snackbar, Alert, CircularProgress,
  Divider,
} from '@mui/material';
import { Person, Save } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useConfig } from '../context/ConfigContext';
import { supabase } from '../utils/supabase';

const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo',
  'Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa',
  'Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara',
];

export default function ProfilePage() {
  const { user } = useConfig();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const borderColor = isDark ? '#48232c' : '#f3e7ea';

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    default_address: '',
    default_state: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('full_name, phone, default_address, default_state')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setForm({
            full_name: data.full_name || '',
            phone: data.phone || '',
            default_address: data.default_address || '',
            default_state: data.default_state || '',
          });
        }
        setLoading(false);
      });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      full_name: form.full_name,
      phone: form.phone,
      default_address: form.default_address,
      default_state: form.default_state,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) {
      setSnack({ open: true, message: 'Failed to save. Please try again.', severity: 'error' });
    } else {
      setSnack({ open: true, message: 'Profile saved successfully!', severity: 'success' });
    }
  };

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const initials = (form.full_name || user?.email || '?').charAt(0).toUpperCase();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 4, md: 6 } }}>
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            borderRadius: '1.25rem',
            border: `1px solid ${borderColor}`,
            overflow: 'hidden',
          }}
        >
          {/* Account header */}
          <Box
            sx={{
              p: { xs: 3, md: 4 },
              display: 'flex',
              alignItems: 'center',
              gap: 2.5,
              borderBottom: `1px solid ${borderColor}`,
              bgcolor: isDark ? '#2d161c' : '#fcf8f9',
            }}
          >
            <Avatar
              src={avatarUrl}
              sx={{
                width: 64,
                height: 64,
                bgcolor: 'primary.main',
                fontSize: '1.5rem',
                fontWeight: 700,
              }}
            >
              {!avatarUrl && <Person sx={{ fontSize: 32 }} />}
              {!avatarUrl && initials}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {form.full_name || 'Your Profile'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
          </Box>

          {/* Delivery Defaults */}
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3 }}>
              Delivery Defaults
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label="Display Name"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Phone Number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                type="tel"
                placeholder="e.g. 08012345678"
                fullWidth
              />
              <TextField
                label="Default Address"
                name="default_address"
                value={form.default_address}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
                placeholder="Full address including area/landmark"
              />
              <FormControl fullWidth>
                <InputLabel>Default State</InputLabel>
                <Select
                  name="default_state"
                  value={form.default_state}
                  onChange={handleChange as any}
                  label="Default State"
                >
                  {NIGERIAN_STATES.map(s => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Divider sx={{ my: 3, borderColor }} />

            <Button
              variant="contained"
              size="large"
              startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save />}
              onClick={handleSave}
              disabled={saving}
              sx={{ borderRadius: '0.75rem', px: 4, fontWeight: 700 }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.severity} variant="filled" sx={{ borderRadius: '0.75rem' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
