import { createTheme } from "@mui/material/styles";

// shadcn/ui inspired color palette
const colors = {
  background: "hsl(0 0% 100%)",
  foreground: "hsl(240 10% 3.9%)",
  card: "hsl(0 0% 100%)",
  cardForeground: "hsl(240 10% 3.9%)",
  popover: "hsl(0 0% 100%)",
  popoverForeground: "hsl(240 10% 3.9%)",
  primary: "hsl(240 5.9% 10%)",
  primaryForeground: "hsl(0 0% 98%)",
  secondary: "hsl(240 4.8% 95.9%)",
  secondaryForeground: "hsl(240 5.9% 10%)",
  muted: "hsl(240 4.8% 95.9%)",
  mutedForeground: "hsl(240 3.8% 46.1%)",
  accent: "hsl(240 4.8% 95.9%)",
  accentForeground: "hsl(240 5.9% 10%)",
  destructive: "hsl(0 84.2% 60.2%)",
  destructiveForeground: "hsl(0 0% 98%)",
  border: "hsl(240 5.9% 90%)",
  input: "hsl(240 5.9% 90%)",
  ring: "hsl(240 5.9% 10%)",
  radius: "0.5rem",
};

export const shadcnTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: colors.background,
      paper: colors.card,
    },
    text: {
      primary: colors.foreground,
      secondary: colors.mutedForeground,
    },
    primary: {
      main: colors.primary,
      contrastText: colors.primaryForeground,
    },
    secondary: {
      main: colors.secondary,
      contrastText: colors.secondaryForeground,
    },
    error: {
      main: colors.destructive,
      contrastText: colors.destructiveForeground,
    },
    divider: colors.border,
  },
  typography: {
    fontFamily: [
      "ui-sans-serif",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      '"Noto Sans"',
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      '"Noto Color Emoji"',
    ].join(","),
    h1: {
      fontSize: "2.25rem",
      fontWeight: 800,
      lineHeight: 1.2,
      letterSpacing: "-0.025em",
    },
    h2: {
      fontSize: "1.875rem",
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: "-0.025em",
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.8125rem",
      lineHeight: 1.5,
      color: colors.mutedForeground,
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 500,
      textTransform: "none" as const,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFeatureSettings: '"rlig" 1, "calt" 1',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "6px",
          fontWeight: 500,
          textTransform: "none",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        contained: {
          backgroundColor: colors.primary,
          color: colors.primaryForeground,
          "&:hover": {
            backgroundColor: colors.primary,
            opacity: 0.9,
          },
        },
        outlined: {
          borderColor: colors.input,
          color: colors.foreground,
          "&:hover": {
            backgroundColor: colors.accent,
            borderColor: colors.input,
          },
        },
        text: {
          color: colors.foreground,
          "&:hover": {
            backgroundColor: colors.accent,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: "6px",
          color: colors.foreground,
          "&:hover": {
            backgroundColor: colors.accent,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: colors.card,
          backgroundImage: "none",
          boxShadow:
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
          borderRadius: "8px",
          border: `1px solid ${colors.border}`,
        },
        elevation1: {
          boxShadow:
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background,
          color: colors.foreground,
          boxShadow: "none",
          borderBottom: `1px solid ${colors.border}`,
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: colors.primary,
          "& .MuiSlider-thumb": {
            backgroundColor: colors.background,
            border: `2px solid ${colors.primary}`,
            width: 16,
            height: 16,
            "&:hover": {
              boxShadow: `0 0 0 6px ${colors.primary}14`,
            },
            "&:focus, &.Mui-focusVisible": {
              boxShadow: `0 0 0 6px ${colors.primary}14`,
            },
          },
          "& .MuiSlider-track": {
            backgroundColor: colors.primary,
            border: "none",
            height: 2,
          },
          "& .MuiSlider-rail": {
            backgroundColor: colors.muted,
            height: 2,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "6px",
            backgroundColor: colors.background,
            "& fieldset": {
              borderColor: colors.input,
            },
            "&:hover fieldset": {
              borderColor: colors.ring,
            },
            "&.Mui-focused fieldset": {
              borderColor: colors.ring,
              borderWidth: "2px",
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.card,
          borderRadius: "8px",
          border: `1px solid ${colors.border}`,
          boxShadow:
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: colors.border,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: colors.secondary,
          color: colors.secondaryForeground,
          borderRadius: "6px",
          fontSize: "0.75rem",
          fontWeight: 500,
        },
      },
    },
  },
});
