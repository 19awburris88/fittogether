import {
  AppBar, Toolbar, Typography, Container,
  BottomNavigation, BottomNavigationAction, Paper, IconButton, Box,
} from "@mui/material";
import HomeIcon          from "@mui/icons-material/Home";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import EmojiEventsIcon   from "@mui/icons-material/EmojiEvents";
import TrendingUpIcon    from "@mui/icons-material/TrendingUp";
import PersonIcon        from "@mui/icons-material/Person";
import SettingsIcon      from "@mui/icons-material/Settings";
import FavoriteIcon      from "@mui/icons-material/Favorite";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { usePushNotifications } from "../lib/usePush";

const tabs = ["/app", "/app/workouts", "/app/challenges", "/app/progress", "/app/profile"];
const BN_HEIGHT = 72;

export default function AppShell({ children }) {
  usePushNotifications();
  const nav = useNavigate();
  const loc = useLocation();
  const [value, setValue] = useState(0);

  useEffect(() => {
    const idx = tabs.findIndex(
      (t) => t === loc.pathname || loc.pathname.startsWith(t + "/")
    );
    setValue(Math.max(0, idx));
  }, [loc.pathname]);

  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ minHeight: 56 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexGrow: 1 }}>
            <FavoriteIcon sx={{ color: "#FB7185", fontSize: 20 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                background: "linear-gradient(135deg, #10B981, #34D399)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              FitTogether
            </Typography>
          </Box>
          <Typography
            sx={{
              mr: 1,
              opacity: 0.45,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              display: { xs: "none", sm: "block" },
            }}
          >
            Couples · Gamified
          </Typography>
          {loc.pathname !== "/app/settings" && (
            <IconButton
              edge="end"
              size="small"
              onClick={() => nav("/app/settings")}
              aria-label="settings"
              sx={{ color: "#64748B", "&:hover": { color: "#F8FAFC" } }}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="sm"
        sx={{ py: 2, pb: `${BN_HEIGHT + 20}px`, minHeight: `calc(100vh - 56px)` }}
      >
        {children}
      </Container>

      <Paper
        elevation={0}
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          background: "rgba(15,23,42,0.97)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <BottomNavigation
          value={value}
          onChange={(_, newVal) => nav(tabs[newVal] || "/app")}
          showLabels
          sx={{ height: BN_HEIGHT, background: "transparent" }}
        >
          <BottomNavigationAction label="Home"       icon={<HomeIcon />}          role="tab" aria-label="Home" />
          <BottomNavigationAction label="Log"        icon={<FitnessCenterIcon />} role="tab" aria-label="Log" />
          <BottomNavigationAction label="Challenges" icon={<EmojiEventsIcon />}   role="tab" aria-label="Challenges" />
          <BottomNavigationAction label="Progress"   icon={<TrendingUpIcon />}    role="tab" aria-label="Progress" />
          <BottomNavigationAction label="Profile"    icon={<PersonIcon />}        role="tab" aria-label="Profile" />
        </BottomNavigation>
      </Paper>
    </>
  );
}
