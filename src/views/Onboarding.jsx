import { useState } from "react";
import { v4 as uuid } from "uuid";
import {
  Box, Button, Card, CardContent, Chip, Container, Grid, Stack,
  TextField, Typography, LinearProgress, Tabs, Tab, CircularProgress,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PeopleIcon from "@mui/icons-material/People";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getOnboarding, setOnboarding } from "../lib/store";
import { ds } from "../lib/dataSource";

const EMERALD = "#10B981";
const CORAL = "#FB7185";

const GOALS = [
  { key: "lose_weight",    label: "Lose Weight",     icon: <DirectionsRunIcon />,  color: CORAL,   bg: "rgba(251,113,133,0.1)",  border: "rgba(251,113,133,0.25)" },
  { key: "build_strength", label: "Build Strength",  icon: <FitnessCenterIcon />,  color: EMERALD, bg: "rgba(16,185,129,0.1)",   border: "rgba(16,185,129,0.25)" },
  { key: "consistency",    label: "Stay Consistent", icon: <CheckCircleIcon />,    color: "#38BDF8", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.25)" },
  { key: "hydrate",        label: "Hydration",       icon: <LocalDrinkIcon />,     color: EMERALD, bg: "rgba(16,185,129,0.1)",   border: "rgba(16,185,129,0.25)" },
  { key: "sleep",          label: "Better Sleep",    icon: <NightsStayIcon />,     color: "#A78BFA", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.25)" },
];

const STEP_LABELS = ["Welcome", "About You", "Invite Partner", "All Set!"];

function StepDots({ current, total }) {
  return (
    <Stack direction="row" spacing={0.75} justifyContent="center" sx={{ mb: 4 }}>
      {Array(total).fill(0).map((_, i) => (
        <Box
          key={i}
          sx={{
            height: 4,
            width: i === current ? 24 : 8,
            borderRadius: 99,
            bgcolor: i === current ? EMERALD : i < current ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.1)",
            transition: "all 0.3s ease",
          }}
        />
      ))}
    </Stack>
  );
}

function GoalPicker({ goals, setGoals }) {
  return (
    <Grid container spacing={1.25}>
      {GOALS.map((g) => {
        const on = goals.includes(g.key);
        return (
          <Grid item xs={6} sm={4} key={g.key}>
            <Box
              onClick={() => setGoals(on ? goals.filter((k) => k !== g.key) : [...goals, g.key])}
              sx={{
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: 1, py: 2, px: 1,
                border: `1.5px solid ${on ? g.border : "rgba(255,255,255,0.07)"}`,
                borderRadius: 2.5,
                bgcolor: on ? g.bg : "rgba(255,255,255,0.02)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": { borderColor: g.border, bgcolor: g.bg },
              }}
            >
              <Box sx={{ color: on ? g.color : "#475569", "& svg": { fontSize: 24 }, transition: "color 0.2s" }}>
                {g.icon}
              </Box>
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, color: on ? g.color : "#64748B", textAlign: "center", lineHeight: 1.3, transition: "color 0.2s" }}
              >
                {g.label}
              </Typography>
              {on && <CheckCircleIcon sx={{ fontSize: 14, color: g.color, position: "absolute" }} />}
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default function Onboarding({ onFinish }) {
  const existing = getOnboarding();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [goals, setGoals] = useState(existing.goals || []);
  // invite tab state
  const [inviteTab, setInviteTab] = useState(0); // 0=invite, 1=join
  const [inviteCode, setInviteCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState("");

  const next = () => setStep((s) => Math.min(3, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const handleGenerateCode = async () => {
    setInviteLoading(true);
    setInviteError("");
    try {
      const { code } = await ds.invitePartner();
      setInviteCode(code);
    } catch (e) {
      setInviteError(e.message);
    } finally {
      setInviteLoading(false);
    }
  };

  const handleJoinCouple = async () => {
    if (!joinCode.trim()) return;
    setInviteLoading(true);
    setInviteError("");
    try {
      await ds.joinCouple(joinCode.trim().toUpperCase());
      next();
    } catch (e) {
      setInviteError(e.message);
    } finally {
      setInviteLoading(false);
    }
  };

  const finish = () => {
    const userId = existing.userId || uuid();
    const coupleId = existing.coupleId || uuid();
    setOnboarding({ finished: true, userId, coupleId, goals, name });
    onFinish?.();
  };

  const progress = (step / 3) * 100;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `
          radial-gradient(ellipse 700px 500px at 20% 10%, rgba(16,185,129,0.1) 0%, transparent 60%),
          radial-gradient(ellipse 600px 400px at 80% 80%, rgba(251,113,133,0.07) 0%, transparent 60%),
          #0F172A
        `,
        display: "flex",
        alignItems: "center",
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        {/* Logo */}
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.75} sx={{ mb: 4 }}>
          <Box
            sx={{
              width: 36, height: 36,
              background: "linear-gradient(135deg, #10B981, #059669)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 20px rgba(16,185,129,0.4)",
            }}
          >
            <FavoriteIcon sx={{ fontSize: 18, color: "#fff" }} />
          </Box>
          <Typography
            variant="h5"
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

        {/* Progress bar */}
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            mb: 0.75, height: 3, borderRadius: 99,
            "& .MuiLinearProgress-bar": { background: `linear-gradient(90deg, ${EMERALD}, #34D399)` },
          }}
        />

        {/* Step label */}
        <Typography variant="caption" sx={{ color: "#475569", display: "block", textAlign: "right", mb: 4 }}>
          Step {step + 1} of {STEP_LABELS.length} — {STEP_LABELS[step]}
        </Typography>

        <Card sx={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <StepDots current={step} total={4} />

            {/* Step 0 — Welcome */}
            {step === 0 && (
              <Stack spacing={3} alignItems="center" textAlign="center">
                <Box
                  sx={{
                    width: 80, height: 80,
                    background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))",
                    border: "1px solid rgba(16,185,129,0.3)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <FavoriteIcon sx={{ fontSize: 36, color: EMERALD }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={800} sx={{ mb: 1, lineHeight: 1.2 }}>
                    Welcome to FitTogether
                  </Typography>
                  <Typography sx={{ color: "#64748B", lineHeight: 1.7 }}>
                    The gamified fitness platform built for couples. Challenge each other, stay accountable, and level up together — one day at a time.
                  </Typography>
                </Box>
                <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
                  {["🏆 Challenges", "🔥 Streaks", "💰 FitCoins", "👥 Partner Sync"].map((b) => (
                    <Chip
                      key={b}
                      label={b}
                      size="small"
                      sx={{ bgcolor: "rgba(255,255,255,0.05)", color: "#94A3B8", border: "1px solid rgba(255,255,255,0.08)" }}
                    />
                  ))}
                </Stack>
                <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />} onClick={next} fullWidth>
                  Let's Go
                </Button>
              </Stack>
            )}

            {/* Step 1 — About you */}
            {step === 1 && (
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h5" fontWeight={800} sx={{ mb: 0.75 }}>
                    Tell us about you
                  </Typography>
                  <Typography sx={{ color: "#64748B" }}>
                    We'll personalize your FitTogether experience.
                  </Typography>
                </Box>

                <Stack spacing={1}>
                  <Typography variant="subtitle2" sx={{ color: "#94A3B8" }}>Your name</Typography>
                  <TextField
                    placeholder="e.g., Austin"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                  />
                </Stack>

                <Stack spacing={1.5}>
                  <Typography variant="subtitle2" sx={{ color: "#94A3B8" }}>Pick your goals (choose all that apply)</Typography>
                  <GoalPicker goals={goals} setGoals={setGoals} />
                </Stack>

                <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                  <Button startIcon={<ArrowBackIcon />} onClick={back} sx={{ color: "#64748B" }} />
                  <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={next} disabled={!name || goals.length === 0}>
                    Continue
                  </Button>
                </Stack>
              </Stack>
            )}

            {/* Step 2 — Invite partner */}
            {step === 2 && (
              <Stack spacing={3}>
                <Box textAlign="center">
                  <Box
                    sx={{
                      width: 64, height: 64,
                      bgcolor: "rgba(56,189,248,0.1)",
                      border: "1px solid rgba(56,189,248,0.25)",
                      borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      mx: "auto", mb: 2,
                    }}
                  >
                    <PeopleIcon sx={{ fontSize: 28, color: "#38BDF8" }} />
                  </Box>
                  <Typography variant="h5" fontWeight={800} sx={{ mb: 0.75 }}>
                    Connect with your partner
                  </Typography>
                  <Typography sx={{ color: "#64748B", lineHeight: 1.7 }}>
                    Generate a code for your partner to enter, or enter theirs.
                  </Typography>
                </Box>

                <Tabs
                  value={inviteTab}
                  onChange={(_, v) => { setInviteTab(v); setInviteError(""); }}
                  sx={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <Tab label="Invite partner" sx={{ fontSize: "0.8rem" }} />
                  <Tab label="Join a couple" sx={{ fontSize: "0.8rem" }} />
                </Tabs>

                {inviteTab === 0 && (
                  <Stack spacing={2}>
                    {inviteCode ? (
                      <Box
                        sx={{
                          background: "rgba(16,185,129,0.08)",
                          border: "1px solid rgba(16,185,129,0.3)",
                          borderRadius: 2, p: 2, textAlign: "center",
                        }}
                      >
                        <Typography variant="caption" sx={{ color: "#64748B", display: "block", mb: 0.5 }}>
                          Share this code with your partner
                        </Typography>
                        <Typography variant="h4" fontWeight={900} sx={{ color: EMERALD, letterSpacing: 6 }}>
                          {inviteCode}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#475569" }}>
                          Valid for 7 days
                        </Typography>
                      </Box>
                    ) : (
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={handleGenerateCode}
                        disabled={inviteLoading}
                        startIcon={inviteLoading ? <CircularProgress size={16} /> : null}
                      >
                        Generate Invite Code
                      </Button>
                    )}
                  </Stack>
                )}

                {inviteTab === 1 && (
                  <Stack spacing={2}>
                    <TextField
                      placeholder="Enter 6-character code"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      inputProps={{ maxLength: 6, style: { letterSpacing: 4, fontWeight: 700, textTransform: "uppercase" } }}
                      fullWidth
                    />
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleJoinCouple}
                      disabled={joinCode.length < 6 || inviteLoading}
                      startIcon={inviteLoading ? <CircularProgress size={16} /> : null}
                    >
                      Join Couple
                    </Button>
                  </Stack>
                )}

                {inviteError && (
                  <Typography variant="body2" sx={{ color: CORAL, textAlign: "center" }}>
                    {inviteError}
                  </Typography>
                )}

                <Stack direction="row" justifyContent="space-between">
                  <Button startIcon={<ArrowBackIcon />} onClick={back} sx={{ color: "#64748B" }}>
                    Back
                  </Button>
                  <Button onClick={next} variant="outlined" sx={{ color: "#64748B", borderColor: "rgba(255,255,255,0.12)" }}>
                    {inviteCode ? "Continue" : "Skip for now"}
                  </Button>
                </Stack>
              </Stack>
            )}

            {/* Step 3 — Done */}
            {step === 3 && (
              <Stack spacing={3} alignItems="center" textAlign="center">
                <Box
                  sx={{
                    width: 80, height: 80,
                    background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))",
                    border: "1px solid rgba(16,185,129,0.35)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 40, color: EMERALD }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
                    You're all set{name ? `, ${name}` : ""}! 🎉
                  </Typography>
                  <Typography sx={{ color: "#64748B", lineHeight: 1.7 }}>
                    Your couple profile is ready. Start with today's challenges and build your first streak together.
                  </Typography>
                </Box>
                {inviteCode && (
                  <Box
                    sx={{
                      background: "rgba(16,185,129,0.1)",
                      border: "1px solid rgba(16,185,129,0.25)",
                      borderRadius: 2,
                      px: 2, py: 1.25,
                      width: "100%",
                    }}
                  >
                    <Typography variant="body2" sx={{ color: EMERALD }}>
                      🔗 Invite code: <strong style={{ letterSpacing: 3 }}>{inviteCode}</strong>
                    </Typography>
                  </Box>
                )}
                <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
                  {goals.slice(0, 3).map((g) => {
                    const goalData = GOALS.find((gl) => gl.key === g);
                    return goalData ? (
                      <Chip
                        key={g}
                        label={goalData.label}
                        size="small"
                        sx={{ bgcolor: goalData.bg, color: goalData.color, border: `1px solid ${goalData.border}` }}
                      />
                    ) : null;
                  })}
                </Stack>
                <Button size="large" variant="contained" endIcon={<ArrowForwardIcon />} onClick={finish} fullWidth>
                  Go to Dashboard
                </Button>
              </Stack>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

