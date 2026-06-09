import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ds } from "../lib/dataSource";
import {
  Card, CardContent, Typography, LinearProgress, Stack, Button,
  Chip, Box, Skeleton, Divider,
} from "@mui/material";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LogModal from "../ui/LogModal";
import ActivityFeed from "../ui/ActivityFeed";
import { useToast } from "../ui/Toast";
import Page from "../ui/Page";

const EMERALD = "#10B981";
const CORAL = "#FB7185";
const GOLD = "#F59E0B";

function PartnerCard({ name = "Partner", level = 1, lbsLost = 0, avatarEmoji, isPrimary }) {
  const accentColor = isPrimary ? EMERALD : CORAL;
  const gradientBg = isPrimary
    ? "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))"
    : "linear-gradient(135deg, rgba(251,113,133,0.12), rgba(251,113,133,0.04))";

  return (
    <Card
      sx={{
        background: gradientBg,
        border: `1px solid ${isPrimary ? "rgba(16,185,129,0.2)" : "rgba(251,113,133,0.2)"}`,
        transition: "all 0.2s ease",
        "&:hover": { transform: "translateY(-2px)", boxShadow: `0 12px 40px rgba(0,0,0,0.3)` },
      }}
    >
      <CardContent sx={{ py: 2, px: 2.5 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 52, height: 52,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}10)`,
              border: `2px solid ${accentColor}40`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, flexShrink: 0,
            }}
          >
            {avatarEmoji || name?.[0] || "?"}
          </Box>

          <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle1" fontWeight={700} noWrap>
                {name}
              </Typography>
              {isPrimary && (
                <Chip size="small" label="You" sx={{ height: 18, fontSize: "0.65rem", bgcolor: `${accentColor}20`, color: accentColor, fontWeight: 700 }} />
              )}
            </Stack>
            <Stack direction="row" spacing={1}>
              <Chip
                size="small"
                label={`Lv ${level}`}
                sx={{ height: 22, bgcolor: `${accentColor}15`, color: accentColor, fontWeight: 700, border: `1px solid ${accentColor}25` }}
              />
              <Chip
                size="small"
                label={`↓ ${lbsLost} lbs`}
                sx={{ height: 22, bgcolor: "rgba(245,158,11,0.1)", color: GOLD, fontWeight: 600, border: "1px solid rgba(245,158,11,0.2)" }}
              />
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function ProgressSection({ label, icon, name1, val1, name2, val2, max, color = "primary" }) {
  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box sx={{ color: color === "primary" ? EMERALD : CORAL }}>{icon}</Box>
        <Typography variant="subtitle2" fontWeight={700} sx={{ color: "#94A3B8" }}>
          {label}
        </Typography>
      </Stack>

      {[{ name: name1, val: val1 }, { name: name2, val: val2 }].map((p) => (
        <Box key={p.name}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{p.name}</Typography>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              {p.val} / {max}
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={Math.min(100, (p.val / max) * 100)}
            color={color}
            sx={{ height: 7 }}
          />
        </Box>
      ))}
    </Stack>
  );
}

export default function Dashboard() {
  const qc = useQueryClient();
  const { push } = useToast();
  const { data } = useQuery({ queryKey: ["dash"], queryFn: ds.getDashboard });

  const [logType, setLogType] = useState(null);

  const couple = data?.couple;
  const a = couple?.members?.[0] ?? { name: "Austin", level: 1, lbsLost: 0, avatar: null };
  const p = couple?.members?.[1] ?? { name: "Partner", level: 1, lbsLost: 0, avatar: null };
  const streakDays = couple?.streakDays ?? 0;

  const aWater = data?.today?.waterAustin ?? 0;
  const pWater = data?.today?.waterPartner ?? 0;
  const tWater = data?.today?.targetWater ?? 8;

  const aWk = data?.week?.workoutsAustin ?? 0;
  const pWk = data?.week?.workoutsPartner ?? 0;
  const tWk = data?.week?.targetWorkouts ?? 5;

  const coins = data?.wallet?.coins ?? 0;

  const closeModal = ({ saved, coinsEarned } = {}) => {
    setLogType(null);
    if (saved) {
      qc.invalidateQueries({ queryKey: ["dash"] });
      qc.invalidateQueries({ queryKey: ["challenges"] });
      qc.invalidateQueries({ queryKey: ["activity"] });
      if (coinsEarned > 0) {
        push(`💰 +${coinsEarned} FitCoins earned!`, "success");
      } else {
        push("Progress logged!", "success");
      }
    }
  };

  return (
    <Page>
      <Stack spacing={2.5}>

        {/* Streak Banner */}
        {data ? (
          <Box
            sx={{
              background: streakDays >= 7
                ? "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))"
                : "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))",
              border: streakDays >= 7
                ? "1px solid rgba(245,158,11,0.3)"
                : "1px solid rgba(16,185,129,0.25)",
              borderRadius: 3,
              px: 2.5, py: 1.75,
              display: "flex", alignItems: "center", gap: 1.5,
            }}
          >
            <WhatshotIcon sx={{ color: streakDays >= 7 ? GOLD : EMERALD, fontSize: 28 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2 }}>
                {streakDays}-day streak together
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748B" }}>
                {streakDays >= 7 ? "You're on fire! 🔥 Keep it going." : "Build your streak — log something today!"}
              </Typography>
            </Box>
            <Chip
              label={`🔥 ${streakDays}`}
              sx={{
                bgcolor: streakDays >= 7 ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.12)",
                color: streakDays >= 7 ? GOLD : EMERALD,
                fontWeight: 800, fontSize: "1rem",
                height: 36, px: 0.5,
                border: streakDays >= 7 ? "1px solid rgba(245,158,11,0.3)" : "1px solid rgba(16,185,129,0.25)",
              }}
            />
          </Box>
        ) : (
          <Skeleton variant="rounded" height={72} sx={{ borderRadius: 3 }} />
        )}

        {/* Partner Cards */}
        {data ? (
          <>
            <PartnerCard name={a.name} level={a.level} lbsLost={a.lbsLost} avatarEmoji={a.avatar} isPrimary />
            <PartnerCard name={p.name} level={p.level} lbsLost={p.lbsLost} avatarEmoji={p.avatar} />
          </>
        ) : (
          <>
            <Skeleton variant="rounded" height={88} sx={{ borderRadius: 3 }} />
            <Skeleton variant="rounded" height={88} sx={{ borderRadius: 3 }} />
          </>
        )}

        {/* FitCoins wallet */}
        {data && (
          <Box
            sx={{
              background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.04))",
              border: "1px solid rgba(245,158,11,0.2)",
              borderRadius: 3,
              px: 2.5, py: 1.5,
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.25}>
              <Box sx={{ fontSize: 22 }}>💰</Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#64748B", display: "block", fontWeight: 600 }}>
                  FitCoins
                </Typography>
                <Typography variant="h5" fontWeight={800} sx={{ color: GOLD, lineHeight: 1 }}>
                  {coins.toLocaleString()}
                </Typography>
              </Box>
            </Stack>
            <Chip
              icon={<EmojiEventsIcon sx={{ fontSize: "14px !important", color: `${GOLD} !important` }} />}
              label="Redeem"
              size="small"
              sx={{ bgcolor: "rgba(245,158,11,0.1)", color: GOLD, border: "1px solid rgba(245,158,11,0.25)", fontWeight: 600 }}
            />
          </Box>
        )}

        {/* Progress card */}
        <Card>
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5 }}>
              Today's Progress
            </Typography>

            {data ? (
              <Stack spacing={3}>
                <ProgressSection
                  label="Water Challenge"
                  icon={<LocalDrinkIcon fontSize="small" />}
                  name1={a.name}
                  val1={aWater}
                  name2={p.name}
                  val2={pWater}
                  max={tWater}
                  color="primary"
                />

                <Divider />

                <ProgressSection
                  label="Weekly Workouts"
                  icon={<FitnessCenterIcon fontSize="small" />}
                  name1={a.name}
                  val1={aWk}
                  name2={p.name}
                  val2={pWk}
                  max={tWk}
                  color="secondary"
                />
              </Stack>
            ) : (
              <Stack spacing={2}>
                <Skeleton variant="text" width="50%" />
                <Skeleton variant="rounded" height={8} />
                <Skeleton variant="text" width="50%" />
                <Skeleton variant="rounded" height={8} />
              </Stack>
            )}

            <Stack direction="column" spacing={1.5} sx={{ mt: 3 }}>
              <Button
                onClick={() => setLogType("water")}
                variant="contained"
                startIcon={<LocalDrinkIcon />}
                fullWidth
              >
                Log Water
              </Button>
              <Button
                onClick={() => setLogType("workout")}
                variant="outlined"
                startIcon={<FitnessCenterIcon />}
                fullWidth
              >
                Log Workout
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <ActivityFeed />

        <Box sx={{ height: 8 }} />
      </Stack>

      <LogModal open={Boolean(logType)} type={logType || "water"} onClose={closeModal} />
    </Page>
  );
}
