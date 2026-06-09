import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ds } from "../lib/dataSource";
import {
  Card, CardContent, Typography, Chip, LinearProgress, Stack,
  Skeleton, Fab, Button, Box, Divider,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AddIcon from "@mui/icons-material/Add";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useNavigate } from "react-router-dom";
import CreateChallengeModal from "../ui/CreateChallengeModal";
import CreateWagerModal from "../ui/CreateWagerModal";
import { useToast } from "../ui/Toast";
import Page from "../ui/Page";

const EMERALD = "#10B981";
const CORAL = "#FB7185";
const GOLD = "#F59E0B";

function WagerDayGrid({ label, progress, color }) {
  return (
    <Box>
      <Typography variant="caption" sx={{ color: "#475569", fontWeight: 600, mb: 0.75, display: "block" }}>
        {label}
      </Typography>
      <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
        {progress.map((ok, i) => (
          <Box
            key={i}
            sx={{
              width: 28, height: 28,
              borderRadius: 1.5,
              bgcolor: ok ? `${color}20` : "rgba(255,255,255,0.04)",
              border: `1px solid ${ok ? `${color}40` : "rgba(255,255,255,0.07)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
          >
            {ok
              ? <CheckCircleIcon sx={{ fontSize: 14, color }} />
              : <Typography sx={{ fontSize: 9, color: "#334155", fontWeight: 600 }}>D{i + 1}</Typography>
            }
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

export default function Challenges() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const { push } = useToast();

  const { data: challenges } = useQuery({ queryKey: ["challenges"], queryFn: ds.getChallenges });
  const { data: wagers } = useQuery({ queryKey: ["wagers"], queryFn: ds.getWagers });

  const [openChallenge, setOpenChallenge] = useState(false);
  const [openWager, setOpenWager] = useState(false);

  const onCreateChallenge = async (payload) => {
    await ds.createChallenge(payload);
    qc.invalidateQueries({ queryKey: ["challenges"] });
    push("Challenge created!", "success");
  };

  const onCreateWager = async (payload) => {
    await ds.createWager(payload);
    qc.invalidateQueries({ queryKey: ["wagers"] });
    push("Side bet created!", "success");
  };

  if (!challenges || !wagers) {
    return (
      <Stack spacing={2.5}>
        <Skeleton variant="rounded" height={160} sx={{ borderRadius: 3 }} />
        <Skeleton variant="rounded" height={130} sx={{ borderRadius: 3 }} />
        <Skeleton variant="rounded" height={130} sx={{ borderRadius: 3 }} />
      </Stack>
    );
  }

  const activeWager = wagers[0];
  const wagerStatusColor = activeWager?.status === "ongoing"
    ? "#38BDF8"
    : activeWager?.status.includes("won") ? GOLD : "#64748B";

  return (
    <Page>
      <Stack spacing={2.5}>

        {/* Section header */}
        <Box>
          <Typography variant="h5" fontWeight={800}>Challenges</Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            Compete and collaborate with your partner
          </Typography>
        </Box>

        {/* Active Side Bet */}
        {activeWager && (
          <Card
            sx={{
              borderLeft: `3px solid #38BDF8`,
              background: "linear-gradient(135deg, rgba(56,189,248,0.08), rgba(56,189,248,0.02))",
              border: "1px solid rgba(56,189,248,0.2)",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Box
                    sx={{
                      width: 40, height: 40,
                      bgcolor: "rgba(56,189,248,0.1)",
                      border: "1px solid rgba(56,189,248,0.25)",
                      borderRadius: 2,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <DirectionsWalkIcon sx={{ color: "#38BDF8", fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                      Side Bet
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748B" }}>
                      {activeWager.title}
                    </Typography>
                  </Box>
                </Stack>
                <Chip
                  size="small"
                  label={activeWager.status === "ongoing" ? "🔵 Active" : `✅ ${activeWager.status.replace("_", " ")}`}
                  sx={{
                    bgcolor: `${wagerStatusColor}15`,
                    color: wagerStatusColor,
                    border: `1px solid ${wagerStatusColor}30`,
                    fontWeight: 600,
                  }}
                />
              </Stack>

              <Typography variant="body2" sx={{ color: "#64748B", mb: 2 }}>
                🎯 Goal: {activeWager.perDayTarget?.toLocaleString()} steps/day × {activeWager.days} days
              </Typography>

              <Stack spacing={1.25} sx={{ mb: 2 }}>
                <WagerDayGrid
                  label="Austin"
                  progress={activeWager.progress.austin}
                  color={EMERALD}
                />
                <WagerDayGrid
                  label="Partner"
                  progress={activeWager.progress.partner}
                  color={CORAL}
                />
              </Stack>

              <Divider sx={{ mb: 2 }} />

              <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.75} sx={{ mb: 2 }}>
                <Chip
                  size="small"
                  label={`🏆 Austin wins: ${activeWager.stakes.if_austin_wins}`}
                  sx={{ bgcolor: "rgba(16,185,129,0.08)", color: "#94A3B8", border: "1px solid rgba(255,255,255,0.07)" }}
                />
                <Chip
                  size="small"
                  label={`💜 Partner wins: ${activeWager.stakes.if_partner_wins}`}
                  sx={{ bgcolor: "rgba(251,113,133,0.08)", color: "#94A3B8", border: "1px solid rgba(255,255,255,0.07)" }}
                />
              </Stack>

              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={async () => {
                    const todayIdx = (new Date().getDay() % activeWager.days) | 0;
                    await ds.markStepsForDay("austin", todayIdx, activeWager.perDayTarget);
                    qc.invalidateQueries({ queryKey: ["wagers"] });
                    push("Austin met today's step goal! 🎉", "success");
                  }}
                  fullWidth
                  sx={{ fontSize: 13 }}
                >
                  ✅ Austin hit goal
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={async () => {
                    const todayIdx = (new Date().getDay() % activeWager.days) | 0;
                    await ds.markStepsForDay("partner", todayIdx, activeWager.perDayTarget);
                    qc.invalidateQueries({ queryKey: ["wagers"] });
                    push("Partner met today's step goal! 🎉", "success");
                  }}
                  fullWidth
                  sx={{ fontSize: 13 }}
                >
                  ✅ Partner hit goal
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Challenges list */}
        <Typography variant="overline" sx={{ color: "#475569", fontWeight: 700, letterSpacing: "0.1em" }}>
          Active Challenges
        </Typography>

        {challenges.map((ch) => {
          const isCollab = ch.type === "collab";
          const accentColor = isCollab ? EMERALD : CORAL;
          const aPct = Math.min(100, (ch.progress.austin / ch.progress.target) * 100);
          const pPct = Math.min(100, (ch.progress.partner / ch.progress.target) * 100);

          return (
            <Card
              key={ch.id}
              onClick={() => nav(`/app/challenges/${ch.id}`)}
              sx={{
                cursor: "pointer",
                borderLeft: `3px solid ${accentColor}`,
                background: `linear-gradient(135deg, ${accentColor}08, ${accentColor}02)`,
                border: `1px solid ${accentColor}25`,
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 12px 40px rgba(0,0,0,0.3), 0 0 0 1px ${accentColor}30`,
                },
                "&:active": { transform: "translateY(0)" },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ pr: 1, lineHeight: 1.3 }}>
                    {ch.title}
                  </Typography>
                  <Stack direction="row" spacing={0.75} flexShrink={0}>
                    <Chip
                      size="small"
                      label={isCollab ? "🤝 Collab" : "⚔️ H2H"}
                      sx={{
                        bgcolor: `${accentColor}15`,
                        color: accentColor,
                        border: `1px solid ${accentColor}30`,
                        fontWeight: 700,
                        height: 22,
                      }}
                    />
                    <Chip
                      size="small"
                      icon={<EmojiEventsIcon style={{ fontSize: 12, color: GOLD }} />}
                      label={`+${ch.reward}`}
                      sx={{ bgcolor: "rgba(245,158,11,0.1)", color: GOLD, border: "1px solid rgba(245,158,11,0.2)", height: 22 }}
                    />
                  </Stack>
                </Stack>

                <Typography variant="body2" sx={{ color: "#64748B", mb: 2 }} noWrap>
                  {ch.desc}
                </Typography>

                <Stack spacing={1.5}>
                  {[
                    { name: "Austin", val: ch.progress.austin, pct: aPct },
                    { name: "Partner", val: ch.progress.partner, pct: pPct },
                  ].map((p, i) => (
                    <Box key={p.name}>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.6 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>{p.name}</Typography>
                        <Typography variant="caption" sx={{ color: "#475569" }}>
                          {p.val}/{ch.progress.target}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={p.pct}
                        color={i === 0 ? "primary" : "secondary"}
                        sx={{ height: 6 }}
                      />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          );
        })}

        <Box sx={{ height: 80 }} />
      </Stack>

      {/* FABs */}
      <Fab
        color="primary"
        onClick={() => setOpenChallenge(true)}
        sx={{ position: "fixed", bottom: 88, right: 16, boxShadow: "0 8px 24px rgba(16,185,129,0.4)" }}
        aria-label="add challenge"
      >
        <AddIcon />
      </Fab>

      <Fab
        color="secondary"
        onClick={() => setOpenWager(true)}
        sx={{ position: "fixed", bottom: 160, right: 16, boxShadow: "0 8px 24px rgba(251,113,133,0.4)" }}
        aria-label="add side bet"
      >
        <DirectionsWalkIcon />
      </Fab>

      <CreateChallengeModal
        open={openChallenge}
        onClose={() => setOpenChallenge(false)}
        onCreate={onCreateChallenge}
      />
      <CreateWagerModal
        open={openWager}
        onClose={() => setOpenWager(false)}
        onCreate={onCreateWager}
      />
    </Page>
  );
}
