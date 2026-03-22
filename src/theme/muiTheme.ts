import { createTheme, PaletteMode } from '@mui/material';

export function createAppTheme(mode: PaletteMode) {
  const isLight = mode === 'light';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isLight ? '#ef3966' : '#f0607f',
        dark: isLight ? '#d62f56' : '#d94d6e',
        light: isLight ? '#f25a7a' : '#f5879c',
        contrastText: '#ffffff',
      },
      secondary: {
        main: isLight ? '#9a794c' : '#d4a96a',
        dark: '#7a5f3a',
        light: isLight ? '#b8956b' : '#e0c090',
      },
      background: {
        default: isLight ? '#f8f6f6' : '#221015',
        paper: isLight ? '#ffffff' : '#2d161c',
      },
      text: {
        primary: isLight ? '#1b0d11' : '#f5f0f1',
        secondary: isLight ? '#9a794c' : 'rgba(245,240,241,0.65)',
      },
      grey: isLight
        ? {
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
          }
        : {
            50: '#2a1e0f',
            100: '#42301a',
            200: '#5d4629',
            300: '#7a5f3a',
            400: '#9a794c',
            500: '#b8956b',
            600: '#d4b3bc',
            700: '#e5d0d6',
            800: '#f3e7ea',
            900: '#fcf8f9',
          },
      divider: isLight ? '#f3e7ea' : '#48232c',
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
            backgroundColor: isLight ? undefined : '#2d161c',
            boxShadow: isLight
              ? '0 4px 20px -2px rgba(27, 13, 17, 0.05)'
              : '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
            border: isLight
              ? '1px solid #f3e7ea'
              : '1px solid #48232c',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: isLight
                ? '0 12px 40px -6px rgba(27, 13, 17, 0.1)'
                : '0 12px 40px -6px rgba(0, 0, 0, 0.4)',
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
              backgroundColor: isLight ? '#fcf8f9' : '#391c23',
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
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });
}

// Default export for backwards compatibility during migration
export const muiTheme = createAppTheme('light');
