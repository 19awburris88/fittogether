import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Box, Container, Typography, Button, Stack, Grid, Card, CardContent,
  Chip, Avatar, AppBar, Toolbar, IconButton, Drawer, List, ListItemButton,
  LinearProgress, TextField, Divider, Paper,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import StarIcon from "@mui/icons-material/Star";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DoneIcon from "@mui/icons-material/Done";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import SportsMartialArtsIcon from "@mui/icons-material/SportsMartialArts";

// ─── constants ───────────────────────────────────────────────────────────────
const E = "#10B981";
const NAVY = "#0F172A";
const PAPER = "#1E293B";
const CORAL = "#FB7185";
const GOLD = "#F59E0B";

// ─── animation helpers ────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
});

const stagger = {
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, amount: 0.1 },
  variants: { visible: { transition: { staggerChildren: 0.1 } } },
};

const child = {
  variants: {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  },
};

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Nav({ onCTA }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = ["Features", "Challenges", "Community", "Pricing"];

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: scrolled
            ? "rgba(15,23,42,0.92)"
            : "rgba(15,23,42,0.6)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.08)" : "transparent"}`,
          transition: "all 0.3s ease",
          zIndex: 1300,
        }}
      >
        <Toolbar sx={{ maxWidth: 1200, mx: "auto", width: "100%", px: { xs: 2, md: 4 } }}>
          {/* Logo */}
          <Stack direction="row" alignItems="center" spacing={0.75} sx={{ flexGrow: 1 }}>
            <Box
              sx={{
                width: 32, height: 32,
                background: "linear-gradient(135deg, #10B981, #059669)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 16px rgba(16,185,129,0.4)",
              }}
            >
              <FavoriteIcon sx={{ fontSize: 16, color: "#fff" }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                background: "linear-gradient(135deg, #F8FAFC 40%, #10B981)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              FitTogether
            </Typography>
          </Stack>

          {/* Desktop nav links */}
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ display: { xs: "none", md: "flex" }, mr: 3 }}
          >
            {links.map((l) => (
              <Button
                key={l}
                variant="text"
                sx={{ color: "#94A3B8", "&:hover": { color: "#F8FAFC", background: "rgba(255,255,255,0.05)" } }}
              >
                {l}
              </Button>
            ))}
          </Stack>

          {/* CTA */}
          <Button
            variant="contained"
            onClick={onCTA}
            sx={{ display: { xs: "none", sm: "flex" }, fontWeight: 700 }}
          >
            Get Started Free
          </Button>

          {/* Mobile hamburger */}
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{ display: { sm: "none" }, color: "#94A3B8", ml: 1 }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 260,
            background: "#0F172A",
            borderLeft: "1px solid rgba(255,255,255,0.07)",
            pt: 2,
          },
        }}
      >
        <Box sx={{ px: 2, pb: 2, display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: "#64748B" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {links.map((l) => (
            <ListItemButton
              key={l}
              onClick={() => setDrawerOpen(false)}
              sx={{ py: 1.5, color: "#CBD5E1", fontWeight: 500 }}
            >
              {l}
            </ListItemButton>
          ))}
          <Box sx={{ px: 2, pt: 2 }}>
            <Button variant="contained" fullWidth onClick={() => { setDrawerOpen(false); onCTA(); }}>
              Get Started Free
            </Button>
          </Box>
        </List>
      </Drawer>
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onCTA }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        pt: { xs: "72px", md: "80px" },
        pb: { xs: 10, md: 0 },
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        background: `
          radial-gradient(ellipse 900px 700px at 15% 20%, rgba(16,185,129,0.13) 0%, transparent 65%),
          radial-gradient(ellipse 700px 500px at 85% 75%, rgba(251,113,133,0.09) 0%, transparent 60%),
          linear-gradient(180deg, #0B1120 0%, #0F172A 60%, #1E293B 100%)
        `,
      }}
    >
      {/* Decorative grid */}
      <Box
        sx={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          {/* Left — copy */}
          <Grid item xs={12} md={6}>
            <motion.div {...fadeUp(0)}>
              <Chip
                icon={<FavoriteIcon sx={{ fontSize: "14px !important", color: `${CORAL} !important` }} />}
                label="Built for couples. Stronger together."
                sx={{
                  mb: 3,
                  bgcolor: "rgba(251,113,133,0.1)",
                  border: `1px solid rgba(251,113,133,0.25)`,
                  color: "#FDA4AF",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                }}
              />
            </motion.div>

            <motion.div {...fadeUp(0.08)}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "3rem", sm: "3.75rem", md: "4.5rem" },
                  lineHeight: 1.08,
                  mb: 1,
                }}
              >
                Train{" "}
                <Box
                  component="span"
                  sx={{
                    background: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Together.
                </Box>
              </Typography>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "3rem", sm: "3.75rem", md: "4.5rem" },
                  lineHeight: 1.08,
                  mb: 3,
                  color: "#94A3B8",
                }}
              >
                Grow Together.
              </Typography>
            </motion.div>

            <motion.div {...fadeUp(0.16)}>
              <Typography
                variant="h6"
                sx={{ color: "#94A3B8", fontWeight: 400, lineHeight: 1.7, mb: 4, maxWidth: 480 }}
              >
                The only fitness platform built for two. Set shared goals, challenge each other daily, and build stronger bodies — and a stronger relationship.
              </Typography>
            </motion.div>

            <motion.div {...fadeUp(0.24)}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={onCTA}
                  sx={{ fontSize: "1rem", py: 1.5, px: 4 }}
                >
                  Start for Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{ fontSize: "1rem", py: 1.5, px: 4 }}
                  href="#features"
                >
                  See How It Works
                </Button>
              </Stack>
            </motion.div>

            <motion.div {...fadeUp(0.32)}>
              <Stack direction="row" spacing={3} alignItems="center">
                <Stack direction="row" spacing={-0.75}>
                  {["🟦", "🟣", "🟧", "🟩"].map((e, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 32, height: 32, borderRadius: "50%",
                        bgcolor: "#1E293B",
                        border: "2px solid #0F172A",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14,
                      }}
                    >
                      {e}
                    </Box>
                  ))}
                </Stack>
                <Typography variant="body2" sx={{ color: "#64748B" }}>
                  <Box component="span" sx={{ color: "#F8FAFC", fontWeight: 700 }}>10,000+</Box>
                  {" "}couples already training together
                </Typography>
              </Stack>
            </motion.div>
          </Grid>

          {/* Right — app mockup card */}
          <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "block" } }}>
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Box sx={{ position: "relative", ml: 4 }}>
                {/* Glow */}
                <Box
                  sx={{
                    position: "absolute", inset: -40, borderRadius: "50%",
                    background: "radial-gradient(ellipse, rgba(16,185,129,0.18) 0%, transparent 70%)",
                    filter: "blur(20px)",
                    pointerEvents: "none",
                  }}
                />

                {/* App mockup */}
                <Card
                  sx={{
                    background: "rgba(30,41,59,0.9)",
                    backdropFilter: "blur(24px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 4,
                    p: 0,
                    overflow: "hidden",
                    boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(16,185,129,0.12)",
                  }}
                >
                  {/* Top bar */}
                  <Box sx={{ px: 2.5, py: 1.5, background: "rgba(15,23,42,0.8)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 1 }}>
                    <FavoriteIcon sx={{ fontSize: 14, color: CORAL }} />
                    <Typography sx={{ fontSize: 13, fontWeight: 700, background: "linear-gradient(135deg, #F8FAFC, #10B981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                      FitTogether
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2.5 }}>
                    {/* Streak */}
                    <Box
                      sx={{
                        display: "flex", alignItems: "center", gap: 1,
                        background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)",
                        borderRadius: 2, px: 1.5, py: 1, mb: 2,
                      }}
                    >
                      <WhatshotIcon sx={{ color: GOLD, fontSize: 18 }} />
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: GOLD }}>
                        12-day streak together! 🔥
                      </Typography>
                    </Box>

                    {/* Progress section */}
                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", mb: 1.5 }}>
                      Today's Progress
                    </Typography>

                    {[
                      { name: "Austin", val: 8, max: 8, color: E, done: true },
                      { name: "Adrienne", val: 6, max: 8, color: CORAL, done: false },
                    ].map((p) => (
                      <Box key={p.name} sx={{ mb: 1.75 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.75 }}>
                          <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{p.name}</Typography>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Typography sx={{ fontSize: 12, color: "#64748B" }}>
                              <LocalDrinkIcon sx={{ fontSize: 12, mr: 0.25, verticalAlign: "middle" }} />
                              {p.val}/{p.max}
                            </Typography>
                            {p.done && <DoneIcon sx={{ fontSize: 14, color: E }} />}
                          </Stack>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={(p.val / p.max) * 100}
                          color={p.done ? "primary" : "secondary"}
                          sx={{ height: 6, borderRadius: 99 }}
                        />
                      </Box>
                    ))}

                    <Divider sx={{ my: 2 }} />

                    {/* Activity notification */}
                    <Box
                      sx={{
                        display: "flex", alignItems: "flex-start", gap: 1.25,
                        background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)",
                        borderRadius: 2, p: 1.5,
                      }}
                    >
                      <NotificationsActiveIcon sx={{ color: E, fontSize: 16, mt: 0.25, flexShrink: 0 }} />
                      <Typography sx={{ fontSize: 12.5, color: "#CBD5E1", lineHeight: 1.5 }}>
                        <Box component="span" sx={{ fontWeight: 700, color: E }}>Austin</Box> just crushed his workout! Adrienne, you're up next 💪
                      </Typography>
                    </Box>
                  </Box>

                  {/* Action row */}
                  <Box sx={{ px: 2.5, pb: 2.5, display: "flex", gap: 1.25 }}>
                    <Button variant="contained" fullWidth size="small" startIcon={<LocalDrinkIcon />} sx={{ fontSize: 12, py: 0.875 }}>
                      Log Water
                    </Button>
                    <Button variant="outlined" fullWidth size="small" startIcon={<FitnessCenterIcon />} sx={{ fontSize: 12, py: 0.875 }}>
                      Log Workout
                    </Button>
                  </Box>
                </Card>

                {/* Floating badge */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  style={{ position: "absolute", top: -16, right: -16, zIndex: 10 }}
                >
                  <Box
                    sx={{
                      background: "linear-gradient(135deg, #FB7185, #F43F5E)",
                      borderRadius: 2.5,
                      px: 1.75, py: 0.875,
                      boxShadow: "0 8px 24px rgba(251,113,133,0.45)",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>
                      🏆 +150 FitCoins earned!
                    </Typography>
                  </Box>
                </motion.div>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Scroll indicator */}
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4], y: [0, 6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)" }}
      >
        <Box sx={{ width: 24, height: 40, border: "2px solid rgba(255,255,255,0.2)", borderRadius: 12, display: "flex", justifyContent: "center", pt: 1 }}>
          <Box sx={{ width: 3, height: 8, bgcolor: "rgba(255,255,255,0.4)", borderRadius: 99 }} />
        </Box>
      </motion.div>
    </Box>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { value: "10,000+", label: "Active Couples", icon: <PeopleIcon /> },
    { value: "95%",     label: "Stay Consistent", icon: <TrendingUpIcon /> },
    { value: "2M+",     label: "Workouts Logged", icon: <FitnessCenterIcon /> },
    { value: "50+",     label: "Challenges", icon: <EmojiEventsIcon /> },
  ];

  return (
    <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: PAPER, borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <Container maxWidth="lg">
        <motion.div {...stagger}>
          <Grid container spacing={2}>
            {stats.map((s) => (
              <Grid item xs={6} md={3} key={s.label}>
                <motion.div {...child}>
                  <Box sx={{ textAlign: "center", py: { xs: 2, md: 1 } }}>
                    <Box sx={{ color: E, mb: 0.75, "& svg": { fontSize: 28 } }}>{s.icon}</Box>
                    <Typography
                      variant="h3"
                      sx={{
                        fontSize: { xs: "2rem", md: "2.75rem" },
                        fontWeight: 800,
                        background: "linear-gradient(135deg, #F8FAFC, #94A3B8)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        mb: 0.5,
                      }}
                    >
                      {s.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748B", fontWeight: 500 }}>
                      {s.label}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: <PeopleIcon />, color: E, bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)",
    title: "Couple Profiles",
    desc: "Create a shared space with your partner — your goals, progress, and milestones all in one place.",
  },
  {
    icon: <TrendingUpIcon />, color: "#38BDF8", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.2)",
    title: "Shared Goals",
    desc: "Set goals you both care about — weight loss, step counts, water intake — and track them together in real time.",
  },
  {
    icon: <NotificationsActiveIcon />, color: CORAL, bg: "rgba(251,113,133,0.1)", border: "rgba(251,113,133,0.2)",
    title: "Partner Accountability",
    desc: "Get nudges when your partner logs progress. Daily check-ins keep both of you on track and motivated.",
  },
  {
    icon: <EmojiEventsIcon />, color: GOLD, bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)",
    title: "Couple Challenges",
    desc: "Head-to-head duels or collaborative missions — earn FitCoins, badges, and bragging rights together.",
  },
  {
    icon: <PhotoCameraIcon />, color: "#A78BFA", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.2)",
    title: "Progress Tracking",
    desc: "Log weight, measurements, and progress photos. Visual dashboards show how far you've both come.",
  },
  {
    icon: <RestaurantIcon />, color: "#FB923C", bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.2)",
    title: "Date Night Wellness",
    desc: "Turn date night into a healthy adventure — restaurant picks, hikes, cooking challenges, and active experiences.",
  },
];

function Features() {
  return (
    <Box id="features" sx={{ py: { xs: 10, md: 14 }, bgcolor: NAVY }}>
      <Container maxWidth="lg">
        <motion.div {...fadeUp()}>
          <Box sx={{ textAlign: "center", mb: { xs: 6, md: 10 } }}>
            <Chip
              label="Features"
              sx={{ mb: 2, bgcolor: "rgba(16,185,129,0.1)", color: E, border: `1px solid rgba(16,185,129,0.25)`, fontWeight: 600, fontSize: "0.8rem" }}
            />
            <Typography variant="h2" sx={{ fontSize: { xs: "2.25rem", md: "3.25rem" }, mb: 2 }}>
              Everything you need to{" "}
              <Box
                component="span"
                sx={{
                  background: "linear-gradient(135deg, #10B981, #34D399)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                thrive as a team
              </Box>
            </Typography>
            <Typography variant="h6" sx={{ color: "#64748B", fontWeight: 400, maxWidth: 540, mx: "auto" }}>
              Six powerful pillars designed to turn your relationship into your greatest fitness advantage.
            </Typography>
          </Box>
        </motion.div>

        <motion.div {...stagger}>
          <Grid container spacing={3}>
            {FEATURES.map((f) => (
              <Grid item xs={12} sm={6} md={4} key={f.title}>
                <motion.div {...child} whileHover={{ y: -6, transition: { duration: 0.2 } }} style={{ height: "100%" }}>
                  <Card
                    sx={{
                      height: "100%",
                      p: 0.5,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        border: `1px solid ${f.border}`,
                        boxShadow: `0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px ${f.border}`,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          width: 52, height: 52,
                          bgcolor: f.bg,
                          border: `1px solid ${f.border}`,
                          borderRadius: 2.5,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: f.color, mb: 2.5,
                          "& svg": { fontSize: 24 },
                        }}
                      >
                        {f.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        {f.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#64748B", lineHeight: 1.7 }}>
                        {f.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Create Your Couple Profile",
      desc: "Each partner sets up their personal profile and links to your shared couple space. Add your goals, fitness level, and what motivates you.",
      icon: <PeopleIcon sx={{ fontSize: 28 }} />,
    },
    {
      num: "02",
      title: "Set Goals Together",
      desc: "Choose shared targets — weekly workouts, daily steps, hydration — that both partners commit to. See each other's progress in real time.",
      icon: <TrendingUpIcon sx={{ fontSize: 28 }} />,
    },
    {
      num: "03",
      title: "Challenge Each Other Daily",
      desc: "Pick from head-to-head duels or collaborative challenges. Earn FitCoins, maintain streaks, and unlock rewards as a team.",
      icon: <EmojiEventsIcon sx={{ fontSize: 28 }} />,
    },
  ];

  return (
    <Box sx={{ py: { xs: 10, md: 14 }, bgcolor: PAPER }}>
      <Container maxWidth="lg">
        <motion.div {...fadeUp()}>
          <Box sx={{ textAlign: "center", mb: { xs: 6, md: 10 } }}>
            <Chip
              label="How It Works"
              sx={{ mb: 2, bgcolor: "rgba(251,113,133,0.1)", color: "#FDA4AF", border: `1px solid rgba(251,113,133,0.25)`, fontWeight: 600, fontSize: "0.8rem" }}
            />
            <Typography variant="h2" sx={{ fontSize: { xs: "2.25rem", md: "3.25rem" }, mb: 2 }}>
              Simple.{" "}
              <Box
                component="span"
                sx={{
                  background: "linear-gradient(135deg, #FB7185, #F43F5E)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Powerful.
              </Box>{" "}
              Together.
            </Typography>
            <Typography variant="h6" sx={{ color: "#64748B", fontWeight: 400 }}>
              Getting started takes less than 2 minutes.
            </Typography>
          </Box>
        </motion.div>

        <motion.div {...stagger}>
          <Grid container spacing={4} alignItems="stretch">
            {steps.map((s, i) => (
              <Grid item xs={12} md={4} key={s.num}>
                <motion.div {...child} style={{ height: "100%" }}>
                  <Box sx={{ position: "relative", height: "100%", display: "flex", flexDirection: "column" }}>
                    {/* Connector line */}
                    {i < 2 && (
                      <Box
                        sx={{
                          display: { xs: "none", md: "block" },
                          position: "absolute",
                          top: 26,
                          right: -24,
                          width: 48,
                          height: 2,
                          background: "linear-gradient(90deg, rgba(16,185,129,0.4), rgba(16,185,129,0.1))",
                          zIndex: 1,
                        }}
                      />
                    )}

                    <Card sx={{ flex: 1, p: 0.5 }}>
                      <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                          <Box
                            sx={{
                              minWidth: 52, height: 52,
                              background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))",
                              border: "1px solid rgba(16,185,129,0.25)",
                              borderRadius: 2.5,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: E,
                            }}
                          >
                            {s.icon}
                          </Box>
                          <Box>
                            <Typography
                              sx={{
                                fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em",
                                color: E, textTransform: "uppercase", mb: 0.75,
                              }}
                            >
                              Step {s.num}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, lineHeight: 1.3 }}>
                              {s.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#64748B", lineHeight: 1.7 }}>
                              {s.desc}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}

// ─── Challenges Preview ───────────────────────────────────────────────────────
const CHALLENGE_CARDS = [
  {
    emoji: "☀️",
    title: "Summer Shred Together",
    duration: "30 Days",
    couples: "2,847",
    type: "Collaborative",
    typeColor: E,
    typeBg: "rgba(16,185,129,0.1)",
    progress: 68,
    reward: 500,
  },
  {
    emoji: "💧",
    title: "Water Wars",
    duration: "Daily",
    couples: "5,124",
    type: "Head-to-Head",
    typeColor: CORAL,
    typeBg: "rgba(251,113,133,0.1)",
    progress: 45,
    reward: 50,
  },
  {
    emoji: "🚶",
    title: "30-Day Walking Challenge",
    duration: "30 Days",
    couples: "3,891",
    type: "Collaborative",
    typeColor: E,
    typeBg: "rgba(16,185,129,0.1)",
    progress: 82,
    reward: 300,
  },
];

function ChallengesPreview({ onCTA }) {
  return (
    <Box sx={{ py: { xs: 10, md: 14 }, bgcolor: NAVY }}>
      <Container maxWidth="lg">
        <motion.div {...fadeUp()}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            sx={{ mb: { xs: 6, md: 8 } }}
          >
            <Box>
              <Chip
                label="Active Challenges"
                sx={{ mb: 1.5, bgcolor: "rgba(245,158,11,0.1)", color: GOLD, border: `1px solid rgba(245,158,11,0.25)`, fontWeight: 600, fontSize: "0.8rem" }}
              />
              <Typography variant="h2" sx={{ fontSize: { xs: "2.25rem", md: "3.25rem" } }}>
                Ready to{" "}
                <Box
                  component="span"
                  sx={{
                    background: `linear-gradient(135deg, ${GOLD}, #FCD34D)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  compete?
                </Box>
              </Typography>
            </Box>
            <Button
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
              onClick={onCTA}
              sx={{ mt: { xs: 2, sm: 0 }, flexShrink: 0 }}
            >
              View all challenges
            </Button>
          </Stack>
        </motion.div>

        <motion.div {...stagger}>
          <Grid container spacing={3}>
            {CHALLENGE_CARDS.map((c) => (
              <Grid item xs={12} md={4} key={c.title}>
                <motion.div {...child} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                  <Card sx={{ position: "relative", overflow: "visible" }}>
                    <CardContent sx={{ p: 3 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2.5 }}>
                        <Box
                          sx={{
                            width: 52, height: 52,
                            bgcolor: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: 2.5,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 24,
                          }}
                        >
                          {c.emoji}
                        </Box>
                        <Chip
                          size="small"
                          label={c.type}
                          sx={{ bgcolor: c.typeBg, color: c.typeColor, border: `1px solid rgba(255,255,255,0.05)` }}
                        />
                      </Stack>

                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.75 }}>
                        {c.title}
                      </Typography>

                      <Stack direction="row" spacing={2} sx={{ mb: 2.5 }}>
                        <Typography variant="caption" sx={{ color: "#475569" }}>
                          ⏱ {c.duration}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#475569" }}>
                          👥 {c.couples} couples
                        </Typography>
                      </Stack>

                      <Box sx={{ mb: 2 }}>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                          <Typography variant="caption" sx={{ color: "#64748B" }}>Progress</Typography>
                          <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 600 }}>{c.progress}%</Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={c.progress}
                          sx={{
                            "& .MuiLinearProgress-bar": {
                              background: `linear-gradient(90deg, ${c.typeColor}, ${c.typeColor}99)`,
                            },
                          }}
                        />
                      </Box>

                      <Chip
                        size="small"
                        icon={<EmojiEventsIcon style={{ fontSize: 14, color: GOLD }} />}
                        label={`+${c.reward} FitCoins`}
                        sx={{ bgcolor: "rgba(245,158,11,0.1)", color: GOLD, border: "1px solid rgba(245,158,11,0.2)" }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "We lost 47 lbs combined in 4 months. The daily check-ins kept us honest, and the side bets made it actually fun. Our streak is at 94 days.",
    name: "Marcus & Sarah",
    detail: "Lost 47 lbs together",
    avatar: "🟦",
    stars: 5,
  },
  {
    quote: "I've tried every fitness app. None of them kept me going because none of them included Jordan. FitTogether changed everything — we actually show up for each other.",
    name: "Jordan & Alex",
    detail: "94-day streak",
    avatar: "🟣",
    stars: 5,
  },
  {
    quote: "The 'Date Night Wellness' ideas are genius. Instead of dinner and Netflix, we went on a sunset hike. We're healthier AND closer than ever.",
    name: "Emma & Ryan",
    detail: "Active 6 months",
    avatar: "🟧",
    stars: 5,
  },
];

function Testimonials() {
  return (
    <Box sx={{ py: { xs: 10, md: 14 }, bgcolor: PAPER }}>
      <Container maxWidth="lg">
        <motion.div {...fadeUp()}>
          <Box sx={{ textAlign: "center", mb: { xs: 6, md: 10 } }}>
            <Chip
              label="Real Couples"
              sx={{ mb: 2, bgcolor: "rgba(167,139,250,0.1)", color: "#A78BFA", border: `1px solid rgba(167,139,250,0.25)`, fontWeight: 600, fontSize: "0.8rem" }}
            />
            <Typography variant="h2" sx={{ fontSize: { xs: "2.25rem", md: "3.25rem" }, mb: 2 }}>
              Real results.{" "}
              <Box
                component="span"
                sx={{
                  background: "linear-gradient(135deg, #A78BFA, #818CF8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Real couples.
              </Box>
            </Typography>
            <Typography variant="h6" sx={{ color: "#64748B", fontWeight: 400 }}>
              Don't take our word for it — hear from the couples who are living it.
            </Typography>
          </Box>
        </motion.div>

        <motion.div {...stagger}>
          <Grid container spacing={3}>
            {TESTIMONIALS.map((t) => (
              <Grid item xs={12} md={4} key={t.name}>
                <motion.div {...child} whileHover={{ y: -4, transition: { duration: 0.2 } }} style={{ height: "100%" }}>
                  <Card
                    sx={{
                      height: "100%",
                      p: 0.5,
                      "&:hover": {
                        border: "1px solid rgba(167,139,250,0.3)",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(167,139,250,0.15)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
                      {/* Stars */}
                      <Stack direction="row" spacing={0.25} sx={{ mb: 2 }}>
                        {Array(t.stars).fill(0).map((_, i) => (
                          <StarIcon key={i} sx={{ fontSize: 16, color: GOLD }} />
                        ))}
                      </Stack>

                      <Typography
                        variant="body1"
                        sx={{ color: "#CBD5E1", lineHeight: 1.75, mb: 3, flex: 1, fontStyle: "italic" }}
                      >
                        "{t.quote}"
                      </Typography>

                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 44, height: 44,
                            bgcolor: "rgba(255,255,255,0.05)",
                            border: "2px solid rgba(255,255,255,0.1)",
                            borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 20,
                          }}
                        >
                          {t.avatar}
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{t.name}</Typography>
                          <Typography variant="caption" sx={{ color: E }}>{t.detail}</Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}

// ─── Pricing ─────────────────────────────────────────────────────────────────
function Pricing({ onCTA }) {
  const freeFeatures = [
    "Couple profile & partner link",
    "1 active challenge",
    "Daily water & workout logging",
    "Activity feed",
    "7-day streak tracking",
  ];
  const premiumFeatures = [
    "Everything in Free",
    "Unlimited challenges & side bets",
    "Advanced progress dashboard",
    "Full workout library (100+ workouts)",
    "Date Night Wellness ideas",
    "FitCoins rewards store",
    "AI accountability coach",
    "Priority support",
  ];

  return (
    <Box id="pricing" sx={{ py: { xs: 10, md: 14 }, bgcolor: NAVY }}>
      <Container maxWidth="lg">
        <motion.div {...fadeUp()}>
          <Box sx={{ textAlign: "center", mb: { xs: 6, md: 10 } }}>
            <Chip
              label="Pricing"
              sx={{ mb: 2, bgcolor: "rgba(16,185,129,0.1)", color: E, border: `1px solid rgba(16,185,129,0.25)`, fontWeight: 600, fontSize: "0.8rem" }}
            />
            <Typography variant="h2" sx={{ fontSize: { xs: "2.25rem", md: "3.25rem" }, mb: 2 }}>
              Simple,{" "}
              <Box
                component="span"
                sx={{
                  background: "linear-gradient(135deg, #10B981, #34D399)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                transparent
              </Box>{" "}
              pricing.
            </Typography>
            <Typography variant="h6" sx={{ color: "#64748B", fontWeight: 400 }}>
              Start free. Upgrade when you're ready to go all-in.
            </Typography>
          </Box>
        </motion.div>

        <motion.div {...stagger}>
          <Grid container spacing={3} justifyContent="center">
            {/* Free */}
            <Grid item xs={12} sm={10} md={5}>
              <motion.div {...child} style={{ height: "100%" }}>
                <Card sx={{ height: "100%", p: 0.5 }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="overline" sx={{ color: "#64748B", fontWeight: 700, letterSpacing: "0.12em" }}>
                      Free
                    </Typography>
                    <Typography variant="h2" sx={{ fontSize: "3rem", mt: 1, mb: 0.5 }}>
                      $0
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748B", mb: 3 }}>
                      Forever free. No credit card needed.
                    </Typography>
                    <Button variant="outlined" fullWidth size="large" onClick={onCTA} sx={{ mb: 3 }}>
                      Get Started Free
                    </Button>
                    <Divider sx={{ mb: 3 }} />
                    <Stack spacing={1.5}>
                      {freeFeatures.map((f) => (
                        <Stack key={f} direction="row" spacing={1.5} alignItems="center">
                          <CheckCircleIcon sx={{ color: E, fontSize: 18, flexShrink: 0 }} />
                          <Typography variant="body2" sx={{ color: "#CBD5E1" }}>{f}</Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Premium */}
            <Grid item xs={12} sm={10} md={5}>
              <motion.div {...child} style={{ height: "100%" }}>
                <Card
                  sx={{
                    height: "100%",
                    p: 0.5,
                    position: "relative",
                    border: `1px solid rgba(16,185,129,0.35)`,
                    boxShadow: "0 0 0 1px rgba(16,185,129,0.15), 0 32px 80px rgba(16,185,129,0.12)",
                    overflow: "visible",
                  }}
                >
                  {/* Popular badge */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: -14, left: "50%", transform: "translateX(-50%)",
                      background: "linear-gradient(135deg, #10B981, #059669)",
                      px: 2, py: 0.5, borderRadius: 50,
                      boxShadow: "0 4px 16px rgba(16,185,129,0.4)",
                      zIndex: 1,
                    }}
                  >
                    <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>
                      ⚡ Most Popular
                    </Typography>
                  </Box>

                  <CardContent sx={{ p: 4, pt: 5 }}>
                    <Typography variant="overline" sx={{ color: E, fontWeight: 700, letterSpacing: "0.12em" }}>
                      Premium
                    </Typography>
                    <Stack direction="row" alignItems="baseline" spacing={0.75} sx={{ mt: 1, mb: 0.5 }}>
                      <Typography variant="h2" sx={{ fontSize: "3rem" }}>$12.99</Typography>
                      <Typography variant="body2" sx={{ color: "#64748B" }}>/month</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: "#64748B", mb: 3 }}>
                      Billed monthly. Cancel anytime.
                    </Typography>
                    <Button variant="contained" fullWidth size="large" onClick={onCTA} sx={{ mb: 3 }}>
                      Start 7-Day Free Trial
                    </Button>
                    <Divider sx={{ mb: 3 }} />
                    <Stack spacing={1.5}>
                      {premiumFeatures.map((f) => (
                        <Stack key={f} direction="row" spacing={1.5} alignItems="center">
                          <CheckCircleIcon sx={{ color: E, fontSize: 18, flexShrink: 0 }} />
                          <Typography variant="body2" sx={{ color: "#CBD5E1" }}>{f}</Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────
function FinalCTA({ onCTA }) {
  const [email, setEmail] = useState("");

  return (
    <Box
      sx={{
        py: { xs: 12, md: 16 },
        position: "relative",
        overflow: "hidden",
        background: `
          radial-gradient(ellipse 800px 500px at 50% 100%, rgba(16,185,129,0.18) 0%, transparent 70%),
          linear-gradient(180deg, #1E293B, #0F172A)
        `,
      }}
    >
      <Container maxWidth="md">
        <motion.div {...fadeUp()}>
          <Box sx={{ textAlign: "center" }}>
            <Box
              sx={{
                width: 72, height: 72,
                background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))",
                border: "1px solid rgba(16,185,129,0.3)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                mx: "auto", mb: 3,
              }}
            >
              <FavoriteIcon sx={{ color: E, fontSize: 32 }} />
            </Box>

            <Typography variant="h2" sx={{ fontSize: { xs: "2.25rem", md: "3.5rem" }, mb: 2 }}>
              Start your journey{" "}
              <Box
                component="span"
                sx={{
                  background: "linear-gradient(135deg, #10B981, #34D399)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                together
              </Box>
            </Typography>

            <Typography
              variant="h6"
              sx={{ color: "#64748B", fontWeight: 400, lineHeight: 1.7, mb: 5, maxWidth: 500, mx: "auto" }}
            >
              Join 10,000+ couples who are already building healthier bodies and stronger relationships.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ maxWidth: 480, mx: "auto", mb: 3 }}
            >
              <TextField
                fullWidth
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: 50, bgcolor: "rgba(255,255,255,0.04)" },
                }}
              />
              <Button
                variant="contained"
                size="large"
                onClick={onCTA}
                sx={{ px: 4, whiteSpace: "nowrap", flexShrink: 0 }}
              >
                Get Started Free
              </Button>
            </Stack>

            <Typography variant="caption" sx={{ color: "#334155" }}>
              No credit card required · Free forever · Cancel anytime
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    { label: "Product", links: ["Features", "Challenges", "Workout Library", "Date Night", "Pricing"] },
    { label: "Company", links: ["About", "Blog", "Careers", "Press"] },
    { label: "Support", links: ["Help Center", "Contact Us", "Privacy Policy", "Terms of Service"] },
  ];

  return (
    <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#060D1A", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Brand */}
          <Grid item xs={12} md={4}>
            <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 2 }}>
              <Box
                sx={{
                  width: 32, height: 32,
                  background: "linear-gradient(135deg, #10B981, #059669)",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <FavoriteIcon sx={{ fontSize: 16, color: "#fff" }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #F8FAFC, #10B981)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                FitTogether
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.8, maxWidth: 280 }}>
              Helping couples build stronger bodies and stronger relationships — one workout at a time.
            </Typography>
            <Typography variant="caption" sx={{ color: "#334155", display: "block", mt: 3 }}>
              Made with ❤️ for couples everywhere
            </Typography>
          </Grid>

          {/* Links */}
          {cols.map((col) => (
            <Grid item xs={6} sm={4} md={8 / 3} key={col.label}>
              <Typography
                variant="overline"
                sx={{ color: "#64748B", fontWeight: 700, letterSpacing: "0.1em", mb: 2, display: "block" }}
              >
                {col.label}
              </Typography>
              <Stack spacing={1.25}>
                {col.links.map((l) => (
                  <Typography
                    key={l}
                    variant="body2"
                    sx={{
                      color: "#475569",
                      cursor: "pointer",
                      transition: "color 0.2s",
                      "&:hover": { color: "#F8FAFC" },
                    }}
                  >
                    {l}
                  </Typography>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 6 }} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="caption" sx={{ color: "#334155" }}>
            © 2026 FitTogether. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={2}>
            {["Privacy", "Terms", "Cookies"].map((l) => (
              <Typography key={l} variant="caption" sx={{ color: "#334155", cursor: "pointer", "&:hover": { color: "#94A3B8" } }}>
                {l}
              </Typography>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

// ─── Main Landing ─────────────────────────────────────────────────────────────
export default function Landing() {
  const nav = useNavigate();
  const { finished } = (() => {
    try {
      const raw = localStorage.getItem("ft_onboarding");
      return raw ? JSON.parse(raw) : { finished: false };
    } catch {
      return { finished: false };
    }
  })();

  const handleCTA = () => {
    const session = (() => {
      try { return JSON.parse(localStorage.getItem("ft_session")); } catch { return null; }
    })();
    if (session && finished) return nav("/app");
    if (session) return nav("/onboarding");
    nav("/register");
  };

  return (
    <Box sx={{ bgcolor: NAVY, color: "#F8FAFC", overflowX: "hidden" }}>
      <Nav onCTA={handleCTA} />
      <Hero onCTA={handleCTA} />
      <StatsBar />
      <Features />
      <HowItWorks />
      <ChallengesPreview onCTA={handleCTA} />
      <Testimonials />
      <Pricing onCTA={handleCTA} />
      <FinalCTA onCTA={handleCTA} />
      <Footer />
    </Box>
  );
}
