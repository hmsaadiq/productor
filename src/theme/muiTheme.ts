import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#ef3966',
      dark: '#d62f56',
      light: '#f25a7a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9a794c',
      dark: '#7a5f3a',
      light: '#b8956b',
    },
    background: {
      default: '#f8f6f6',
      paper: '#ffffff',
    },
    text: {
      primary: '#1b0d11',
      secondary: '#9a794c',
    },
    grey: {
      50: '#fcf8f9',
      100: '#f3e7ea',
      200: '#e5d0d6',
      300: '#d4b3bc',
      400: '#b8956b',
      500: '#9a794c',
      600: '#7a5f3a',
      700: '#5d4629',
      800: '#42301a',
      900: '#2a1e0f',
    },
  },
  typography: {
    fontFamily: '"Epilogue", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1.3,
      letterSpacing: '-0.015em',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.875rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          fontSize: '0.875rem',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 20px -2px rgba(239, 57, 102, 0.3)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px -2px rgba(27, 13, 17, 0.05)',
          border: '1px solid rgba(243, 231, 234, 0.5)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 40px -6px rgba(27, 13, 17, 0.1)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#fcf8f9',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#ef3966',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#ef3966',
              borderWidth: 2,
            },
          },
        },
      },
    },
  },
});