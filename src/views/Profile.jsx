import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ds } from "../lib/dataSource";
import {
  Card, CardContent, Typography, Stack, Chip, Box, Grid, Divider,
} from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AvatarPickerModal from "../ui/AvatarPickerModal";
import { useState } from "react";
import { useToast } from "../ui/Toast";
import Page from "../ui/Page";

const EMERALD = "#10B981";
const CORAL = "#FB7185";
const GOLD = "#F59E0B";

function StatBox({ icon, value, label, color }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2.5,
        bgcolor: `${color}10`,
        border: `1px solid ${color}20`,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0.5,
      }}
    >
      <Box sx={{ color, "& svg": { fontSize: 20 } }}>{icon}</Box>
      <Typography variant="h5" fontWeight={800} sx={{ color, lineHeight: 1 }}>
        {value}
      </Typography>
      <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 500 }}>
        {label}
      </Typography>
    </Box>
  );
}

function MemberCard({ m, onChangeAvatar, isPrimary }) {
  const accentColor = isPrimary ? EMERALD : CORAL;

  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${accentColor}12, ${accentColor}04)`,
        border: `1px solid ${accentColor}22`,
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 64, height: 64,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}10)`,
              border: `2px solid ${accentColor}50`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 30, flexShrink: 0,
              cursor: isPrimary ? "pointer" : "default",
            }}
            onClick={isPrimary ? onChangeAvatar : undefined}
          >
            {m?.avatar || "🙂"}
          </Box>

          <Box sx={{ flex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.75 }}>
              <Typography variant="h6" fontWeight={700}>{m?.name}</Typography>
              {isPrimary && (
                <Chip
                  size="small"
                  label="You"
                  sx={{ height: 18, fontSize: "0.65rem", bgcolor: `${accentColor}20`, color: accentColor, fontWeight: 700 }}
                />
              )}
            </Stack>
            <Stack direction="row" spacing={1}>
              <Chip
                size="small"
                label={`Lv ${m?.level}`}
                sx={{ height: 22, bgcolor: `${accentColor}15`, color: accentColor, fontWeight: 700, border: `1px solid ${accentColor}25` }}
              />
              <Chip
                size="small"
                label={`↓ ${m?.lbsLost} lbs`}
                sx={{ height: 22, bgcolor: "rgba(245,158,11,0.1)", color: GOLD, fontWeight: 600, border: "1px solid rgba(245,158,11,0.2)" }}
              />
            </Stack>
            {isPrimary && (
              <Typography
                variant="caption"
                sx={{ color: "#475569", display: "block", mt: 0.75, cursor: "pointer", "&:hover": { color: "#94A3B8" } }}
                onClick={onChangeAvatar}
              >
                Tap avatar to change
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function Profile() {
  const qc = useQueryClient();
  const { push } = useToast();
  const { data } = useQuery({ queryKey: ["dash"], queryFn: ds.getDashboard });
  const me = data?.couple?.members?.[0];
  const partner = data?.couple?.members?.[1];
  const streak = data?.couple?.streakDays ?? 0;
  const coins = data?.wallet?.coins ?? 0;
  const [open, setOpen] = useState(false);

  const pick = async (emoji) => {
    await ds.setAvatar("austin", emoji);
    qc.invalidateQueries({ queryKey: ["dash"] });
    push("Avatar updated!", "success");
    setOpen(false);
  };

  return (
    <Page>
      <Stack spacing={2.5}>

        <Box>
          <Typography variant="h5" fontWeight={800}>Profile</Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            Your couple journey
          </Typography>
        </Box>

        {/* Couple header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(251,113,133,0.05))",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 3,
            px: 2.5, py: 2,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 2,
          }}
        >
          <Box
            sx={{
              width: 44, height: 44, borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.05)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
            }}
          >
            {me?.avatar || "🟦"}
          </Box>
          <FavoriteIcon sx={{ color: CORAL, fontSize: 20 }} />
          <Box
            sx={{
              width: 44, height: 44, borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.05)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
            }}
          >
            {partner?.avatar || "🟣"}
          </Box>
        </Box>

        {/* Stats grid */}
        <Grid container spacing={1.5}>
          <Grid item xs={6}>
            <StatBox icon={<WhatshotIcon />} value={streak} label="Day Streak" color={GOLD} />
          </Grid>
          <Grid item xs={6}>
            <StatBox icon={<EmojiEventsIcon />} value={coins} label="FitCoins" color={GOLD} />
          </Grid>
          <Grid item xs={6}>
            <StatBox icon={<FitnessCenterIcon />} value={data?.week?.workoutsAustin ?? 0} label="My Workouts" color={EMERALD} />
          </Grid>
          <Grid item xs={6}>
            <StatBox icon={<TrendingDownIcon />} value={`${me?.lbsLost ?? 0} lbs`} label="My Lost" color={CORAL} />
          </Grid>
        </Grid>

        <Divider />

        {/* Member cards */}
        <MemberCard m={me} onChangeAvatar={() => setOpen(true)} isPrimary />
        <MemberCard m={partner} />

        {/* Badges */}
        <Card>
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, color: "#94A3B8", letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "0.75rem" }}>
              Achievements
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {(() => {
                const badges = [];
                const workouts = data?.week?.workoutsAustin ?? 0;
                if (streak >= 1)   badges.push({ label: `🔥 ${streak}-Day Streak`,              color: GOLD,    bg: "rgba(245,158,11,0.1)" });
                if (workouts >= 1) badges.push({ label: `💪 ${workouts} Workout${workouts > 1 ? "s" : ""} This Week`, color: EMERALD, bg: "rgba(16,185,129,0.1)" });
                if (coins >= 100)  badges.push({ label: `💰 ${coins.toLocaleString()} FitCoins`, color: GOLD,    bg: "rgba(245,158,11,0.1)" });
                if ((me?.lbsLost ?? 0) > 0) badges.push({ label: `⚖️ ${me.lbsLost} lbs Down`,  color: CORAL,   bg: "rgba(251,113,133,0.1)" });
                badges.push({ label: "❤️ Couple Power", color: CORAL, bg: "rgba(251,113,133,0.1)" });
                return badges.map((b) => (
                  <Chip key={b.label} label={b.label} size="small"
                    sx={{ bgcolor: b.bg, color: b.color, border: `1px solid ${b.color}25`, fontWeight: 600 }}
                  />
                ));
              })()}
            </Stack>
          </CardContent>
        </Card>

        <Box sx={{ height: 8 }} />
      </Stack>

      <AvatarPickerModal open={open} onClose={() => setOpen(false)} onPick={pick} />
    </Page>
  );
}
