import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, Button, Box, Typography,
  Alert, CircularProgress, Divider, IconButton, Tab, Tabs,
  TextField, InputAdornment,
} from '@mui/material';
import { Close, Google, Lock, ArrowBack, Visibility, VisibilityOff, MarkEmailRead } from '@mui/icons-material';
import {
  signInWithGoogle, signUpWithEmail, signInWithEmail,
  sendPasswordReset, verifyEmailOtp,
} from '../utils/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type View = 'signin' | 'signup' | 'verify' | 'forgot' | 'forgot-sent';

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [view, setView] = useState<View>('signin');
  const [tab, setTab] = useState(0); // 0 = sign in, 1 = sign up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setView('signin');
    setTab(0);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setOtpCode('');
    setError(null);
    setLoading(false);
    setShowPassword(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleTabChange = (_: React.SyntheticEvent, val: number) => {
    setTab(val);
    setView(val === 0 ? 'signin' : 'signup');
    setError(null);
  };

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setLoading(true);
      await signInWithGoogle();
    } catch {
      setError('Failed to start Google sign-in. Please try again.');
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await signInWithEmail(email, password);
    if (err) {
      setError(err.message === 'Invalid login credentials'
        ? 'Incorrect email or password.'
        : err.message);
      setLoading(false);
    } else {
      handleClose();
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
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
    const { data, error: err } = await signUpWithEmail(email, password);
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    // If identities is empty, the email is already registered
    if (data.user && data.user.identities?.length === 0) {
      setError('An account with this email already exists. Please sign in.');
      return;
    }
    setView('verify');
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await verifyEmailOtp(email, otpCode);
    setLoading(false);
    if (err) {
      setError('Invalid or expired code. Please try again.');
    } else {
      handleClose();
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    await sendPasswordReset(email);
    setLoading(false);
    setView('forgot-sent');
  };

  const fieldSx = { mb: 2 };

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

  const StrengthMeter = ({ value }: { value: string }) => {
    const s = getStrength(value);
    if (!s) return null;
    const reqs = [
      { label: '8+ characters', met: value.length >= 8 },
      { label: 'One uppercase letter', met: /[A-Z]/.test(value) },
      { label: 'One number', met: /[0-9]/.test(value) },
    ];
    return (
      <Box sx={{ mb: 1.5 }}>
        <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
          {[1, 2, 3, 4].map(i => (
            <Box key={i} sx={{ flex: 1, height: 4, borderRadius: 2, bgcolor: i <= s.score ? s.color : 'grey.200', transition: 'background-color 0.3s' }} />
          ))}
        </Box>
        <Typography variant="caption" sx={{ color: s.color, fontWeight: 600, display: 'block', mb: 0.75 }}>{s.label}</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          {reqs.map(r => (
            <Typography key={r.label} variant="caption" sx={{ color: r.met ? '#43a047' : 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {r.met ? '✓' : '✗'} {r.label}
            </Typography>
          ))}
        </Box>
      </Box>
    );
  };

  const GoogleButton = () => (
    <Button
      fullWidth
      variant="outlined"
      size="large"
      onClick={handleGoogleSignIn}
      disabled={loading}
      startIcon={loading ? <CircularProgress size={18} /> : <Google sx={{ color: '#4285f4' }} />}
      sx={{
        py: 1.4, borderRadius: 2, borderColor: 'grey.300',
        color: 'text.primary', textTransform: 'none', fontSize: '0.95rem', fontWeight: 500,
        '&:hover': { borderColor: 'primary.main' },
      }}
    >
      Continue with Google
    </Button>
  );

  const OrDivider = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', my: 2, gap: 1.5 }}>
      <Divider sx={{ flex: 1 }} />
      <Typography variant="caption" color="text.secondary">or</Typography>
      <Divider sx={{ flex: 1 }} />
    </Box>
  );

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {(view === 'forgot' || view === 'verify') && (
            <IconButton size="small" onClick={() => { setView('signin'); setError(null); }} sx={{ mr: 0.5 }}>
              <ArrowBack fontSize="small" />
            </IconButton>
          )}
          <Lock sx={{ color: 'primary.main', fontSize: 20 }} />
          <Typography variant="h6" fontSize="1rem">
            {view === 'forgot' && 'Reset password'}
            {view === 'forgot-sent' && 'Check your email'}
            {view === 'verify' && 'Verify your email'}
            {(view === 'signin' || view === 'signup') && 'Frosted Crusts'}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" sx={{ color: 'grey.500' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, mt: 1 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* ── Sign In / Sign Up tabs ── */}
        {(view === 'signin' || view === 'signup') && (
          <>
            <Tabs value={tab} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 2 }}>
              <Tab label="Sign In" sx={{ textTransform: 'none' }} />
              <Tab label="Sign Up" sx={{ textTransform: 'none' }} />
            </Tabs>

            <GoogleButton />
            <OrDivider />

            {/* Sign In form */}
            {view === 'signin' && (
              <Box component="form" onSubmit={handleSignIn}>
                <TextField
                  label="Email" type="email" fullWidth required
                  value={email} onChange={e => setEmail(e.target.value)}
                  sx={fieldSx} size="small"
                />
                <TextField
                  label="Password" type={showPassword ? 'text' : 'password'}
                  fullWidth required value={password}
                  onChange={e => setPassword(e.target.value)}
                  sx={fieldSx} size="small"
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
                <Button
                  fullWidth variant="contained" type="submit"
                  disabled={loading} sx={{ py: 1.3, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                >
                  {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign In'}
                </Button>
                <Box sx={{ textAlign: 'center', mt: 1.5 }}>
                  <Typography
                    variant="caption" color="primary"
                    sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                    onClick={() => { setView('forgot'); setError(null); }}
                  >
                    Forgot password?
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Sign Up form */}
            {view === 'signup' && (
              <Box component="form" onSubmit={handleSignUp}>
                <TextField
                  label="Email" type="email" fullWidth required
                  value={email} onChange={e => setEmail(e.target.value)}
                  sx={fieldSx} size="small"
                />
                <TextField
                  label="Password" type={showPassword ? 'text' : 'password'}
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
                <StrengthMeter value={password} />
                <TextField
                  label="Confirm Password" type={showPassword ? 'text' : 'password'}
                  fullWidth required value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  sx={fieldSx} size="small"
                />
                <Button
                  fullWidth variant="contained" type="submit"
                  disabled={loading} sx={{ py: 1.3, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                >
                  {loading ? <CircularProgress size={20} color="inherit" /> : 'Create Account'}
                </Button>
              </Box>
            )}
          </>
        )}

        {/* ── Verify email ── */}
        {view === 'verify' && (
          <Box sx={{ textAlign: 'center' }}>
            <MarkEmailRead sx={{ fontSize: 52, color: 'primary.main', mb: 1.5 }} />
            <Typography variant="body1" fontWeight={600} gutterBottom>
              Check your inbox
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
              We sent a 6-digit code to <strong>{email}</strong>. Enter it below to verify your account.
            </Typography>
            <Box component="form" onSubmit={handleVerify}>
              <TextField
                label="Verification code" fullWidth required
                value={otpCode} onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                inputProps={{ inputMode: 'numeric', maxLength: 6 }}
                sx={{ mb: 2 }} size="small"
              />
              <Button
                fullWidth variant="contained" type="submit"
                disabled={loading || otpCode.length < 6}
                sx={{ py: 1.3, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Verify'}
              </Button>
            </Box>
          </Box>
        )}

        {/* ── Forgot password ── */}
        {view === 'forgot' && (
          <Box component="form" onSubmit={handleForgot} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Enter your email and we'll send you a link to reset your password.
            </Typography>
            <TextField
              label="Email" type="email" fullWidth required
              value={email} onChange={e => setEmail(e.target.value)}
              sx={fieldSx} size="small"
            />
            <Button
              fullWidth variant="contained" type="submit"
              disabled={loading} sx={{ py: 1.3, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Send Reset Link'}
            </Button>
          </Box>
        )}

        {/* ── Forgot sent ── */}
        {view === 'forgot-sent' && (
          <Box sx={{ textAlign: 'center', py: 1 }}>
            <MarkEmailRead sx={{ fontSize: 52, color: 'primary.main', mb: 1.5 }} />
            <Typography variant="body1" fontWeight={600} gutterBottom>
              Reset link sent
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
              Check <strong>{email}</strong> for a password reset link. It may take a minute.
            </Typography>
            <Button
              fullWidth variant="outlined"
              onClick={handleClose}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Done
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
