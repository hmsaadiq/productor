import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, TextField, Typography, CircularProgress,
  Alert, Paper, InputAdornment, IconButton,
} from '@mui/material';
import { Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { supabase, updatePassword } from '../utils/supabase';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Supabase exchanges the token from the URL hash automatically.
  // We just wait for a RECOVERY session event.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter.');
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number.');
      return;
    }
    setError(null);
    setLoading(true);
    const { error: err } = await updatePassword(password);
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    }
  };

  const getStrength = (p: string) => {
    if (!p) return null;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const levels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['', '#e53935', '#fb8c00', '#fdd835', '#43a047'];
    return { score, label: levels[score], color: colors[score] };
  };

  const s = getStrength(password);

  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
      <Paper elevation={0} sx={{ maxWidth: 420, width: '100%', p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <Lock sx={{ color: 'primary.main' }} />
          <Typography variant="h6" fontWeight={700}>Set new password</Typography>
        </Box>

        {!ready && !success && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CircularProgress size={32} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Verifying reset link…
            </Typography>
          </Box>
        )}

        {ready && !success && (
          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
            <TextField
              label="New password" type={showPassword ? 'text' : 'password'}
              fullWidth required value={password}
              onChange={e => setPassword(e.target.value)}
              sx={{ mb: 1 }} size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPassword(p => !p)}>
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {s && (
              <Box sx={{ mb: 1.5 }}>
                <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
                  {[1, 2, 3, 4].map(i => (
                    <Box key={i} sx={{ flex: 1, height: 4, borderRadius: 2, bgcolor: i <= s.score ? s.color : 'grey.200', transition: 'background-color 0.3s' }} />
                  ))}
                </Box>
                <Typography variant="caption" sx={{ color: s.color, fontWeight: 600, display: 'block', mb: 0.75 }}>{s.label}</Typography>
                {[
                  { label: '8+ characters', met: password.length >= 8 },
                  { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
                  { label: 'One number', met: /[0-9]/.test(password) },
                ].map(r => (
                  <Typography key={r.label} variant="caption" sx={{ color: r.met ? '#43a047' : 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {r.met ? '✓' : '✗'} {r.label}
                  </Typography>
                ))}
              </Box>
            )}
            <TextField
              label="Confirm password" type={showPassword ? 'text' : 'password'}
              fullWidth required value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              sx={{ mb: 3 }} size="small"
            />
            <Button
              fullWidth variant="contained" type="submit" disabled={loading}
              sx={{ py: 1.3, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Update Password'}
            </Button>
          </Box>
        )}

        {success && (
          <Alert severity="success">
            Password updated. Redirecting you home…
          </Alert>
        )}
      </Paper>
    </Box>
  );
}
