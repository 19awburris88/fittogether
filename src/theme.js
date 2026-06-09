import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0F172A",
      paper: "#1E293B",
    },
    primary:   { main: "#10B981", dark: "#059669", light: "#34D399", contrastText: "#fff" },
    secondary: { main: "#FB7185", dark: "#F43F5E", light: "#FDA4AF", contrastText: "#fff" },
    warning:   { main: "#F59E0B", dark: "#D97706", light: "#FCD34D" },
    info:      { main: "#38BDF8" },
    text: {
      primary: "#F8FAFC",
      secondary: "#94A3B8",
    },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
    h1: { fontWeight: 800, letterSpacing: "-0.03em" },
    h2: { fontWeight: 800, letterSpacing: "-0.025em" },
    h3: { fontWeight: 700, letterSpacing: "-0.02em" },
    h4: { fontWeight: 700, letterSpacing: "-0.01em" },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, letterSpacing: "0.01em" },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backgroundImage: "none",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
          background: "#1E293B",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.9375rem",
          letterSpacing: "0.01em",
          padding: "10px 24px",
          transition: "all 0.2s ease",
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
          boxShadow: "0 4px 20px rgba(16,185,129,0.35)",
          "&:hover": {
            background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
            boxShadow: "0 6px 28px rgba(16,185,129,0.5)",
            transform: "translateY(-1px)",
          },
          "&:active": { transform: "translateY(0)" },
        },
        containedSecondary: {
          background: "linear-gradient(135deg, #FB7185 0%, #F43F5E 100%)",
          boxShadow: "0 4px 20px rgba(251,113,133,0.35)",
          "&:hover": {
            background: "linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)",
            boxShadow: "0 6px 28px rgba(251,113,133,0.5)",
            transform: "translateY(-1px)",
          },
        },
        outlinedPrimary: {
          borderColor: "#10B981",
          color: "#10B981",
          "&:hover": {
            backgroundColor: "rgba(16,185,129,0.08)",
            borderColor: "#34D399",
            transform: "translateY(-1px)",
          },
        },
        text: {
          "&:hover": { transform: "translateY(-1px)" },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 99,
          height: 8,
          backgroundColor: "rgba(255,255,255,0.06)",
        },
        bar: { borderRadius: 99 },
        barColorPrimary: {
          background: "linear-gradient(90deg, #10B981, #34D399)",
        },
        barColorSecondary: {
          background: "linear-gradient(90deg, #FB7185, #FDA4AF)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
          fontSize: "0.8125rem",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: "rgba(15, 23, 42, 0.88)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          background: "rgba(15, 23, 42, 0.97)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          height: 72,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: "#475569",
          minWidth: 60,
          "&.Mui-selected": { color: "#10B981" },
        },
        label: {
          "&.Mui-selected": { fontSize: "0.75rem", fontWeight: 600 },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
            "&:hover fieldset": { borderColor: "rgba(255,255,255,0.24)" },
            "&.Mui-focused fieldset": { borderColor: "#10B981" },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: "rgba(255,255,255,0.07)" },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: "#1E293B",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 20,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        track: { backgroundColor: "#334155" },
      },
    },
  },
});
