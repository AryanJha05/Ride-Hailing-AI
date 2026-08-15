import { createTheme } from '@mui/material/styles';
import { VELOUR_TOKENS } from './palette';

// Module augmentation for custom MUI palette keys
declare module '@mui/material/styles' {
  interface Palette {
    data: { main: string };
    ai: { main: string };
    luxury: { main: string };
  }
  interface PaletteOptions {
    data?: { main: string };
    ai?: { main: string };
    luxury?: { main: string };
  }
}

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: VELOUR_TOKENS.bgBase,
      paper: VELOUR_TOKENS.bgSurface1,
    },
    primary: {
      main: VELOUR_TOKENS.accentPrimary,
      light: VELOUR_TOKENS.accentPrimaryHover,
      dark: VELOUR_TOKENS.accentPrimaryDark,
      contrastText: '#FFFFFF',
    },
    text: {
      primary: VELOUR_TOKENS.textPrimary,
      secondary: VELOUR_TOKENS.textSecondary,
    },
    data: {
      main: VELOUR_TOKENS.accentTeal,
    },
    ai: {
      main: VELOUR_TOKENS.accentLavender,
    },
    luxury: {
      main: VELOUR_TOKENS.accentGold,
    },
    divider: VELOUR_TOKENS.borderSubtle,
  },
  typography: {
    fontFamily: VELOUR_TOKENS.fontUi,
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    subtitle1: {
      color: VELOUR_TOKENS.textSecondary,
    },
    subtitle2: {
      color: VELOUR_TOKENS.textSecondary,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        body {
          background-color: ${VELOUR_TOKENS.bgBase};
          color: ${VELOUR_TOKENS.textPrimary};
          font-family: ${VELOUR_TOKENS.fontUi};
          overflow-x: hidden;
        }
        .mono-num {
          font-family: ${VELOUR_TOKENS.fontMono} !important;
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px ${VELOUR_TOKENS.bgSurface2} inset !important;
          -webkit-text-fill-color: #FFFFFF !important;
          caret-color: #FFFFFF !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `,
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: VELOUR_TOKENS.bgSurface1,
          backgroundImage: 'none',
          border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: VELOUR_TOKENS.bgSurface1,
          border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
          borderRadius: 12,
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 150ms ease-out',
          '&:hover': {
            boxShadow: `0 0 16px ${VELOUR_TOKENS.accentPrimaryDim}`,
          },
        },
        containedPrimary: {
          backgroundColor: VELOUR_TOKENS.accentPrimary,
          '&:hover': {
            backgroundColor: VELOUR_TOKENS.accentPrimaryHover,
          },
        },
        outlinedPrimary: {
          borderColor: VELOUR_TOKENS.accentPrimary,
          color: VELOUR_TOKENS.accentLavender,
          '&:hover': {
            borderColor: VELOUR_TOKENS.accentPrimaryHover,
            backgroundColor: VELOUR_TOKENS.accentPrimaryDim,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 500,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          '&.Mui-checked': {
            color: VELOUR_TOKENS.accentTeal,
            '& + .MuiSwitch-track': {
              backgroundColor: VELOUR_TOKENS.accentTeal,
              opacity: 0.6,
            },
          },
        },
      },
    },
  },
});
