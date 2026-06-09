import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ds } from "../lib/dataSource";
import {
  Card, CardContent, Typography, Button, Stack, Chip, Skeleton, Box, Tooltip,
} from "@mui/material";
import EmojiEventsIcon  from "@mui/icons-material/EmojiEvents";
import LockIcon         from "@mui/icons-material/Lock";
import CheckCircleIcon  from "@mui/icons-material/CheckCircle";
import Page from "../ui/Page";
import { useToast } from "../ui/Toast";

const GOLD = "#F59E0B";
const EMERALD = "#10B981";

const REWARD_ICONS = {
  badge1: "🏅",
  skin1: "👟",
  perk1: "🥗",
};

const REWARD_COLORS = {
  badge1: { color: GOLD,    bg: "rgba(245,158,11,0.1)",   border: "rgba(245,158,11,0.2)" },
  skin1:  { color: "#A78BFA", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.2)" },
  perk1:  { color: EMERALD, bg: "rgba(16,185,129,0.1)",   border: "rgba(16,185,129,0.2)" },
};

export default function Rewards() {
  const qc = useQueryClient();
  const { push } = useToast();
  const { data: rewards } = useQuery({ queryKey: ["rewards"], queryFn: ds.getRewards });
  const { data: dash }    = useQuery({ queryKey: ["dash"],    queryFn: ds.getDashboard });
  const [redeeming, setRedeeming] = useState(null);

  const balance = dash?.wallet?.coins ?? 0;

  const handleRedeem = async (r) => {
    setRedeeming(r.id);
    try {
      await ds.redeemReward(r.id);
      qc.invalidateQueries({ queryKey: ["rewards"] });
      qc.invalidateQueries({ queryKey: ["dash"] });
      qc.invalidateQueries({ queryKey: ["activity"] });
      push(`${r.title} unlocked! 🎉`, "success");
    } catch (err) {
      push(err.message, "error");
    } finally {
      setRedeeming(null);
    }
  };

  return (
    <Page>
      <Stack spacing={2.5}>

        {/* Header */}
        <Box>
          <Typography variant="h5" fontWeight={800}>Rewards Store</Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            Spend your FitCoins on real rewards
          </Typography>
        </Box>

        {/* Balance card */}
        <Box
          sx={{
            background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))",
            border: "1px solid rgba(245,158,11,0.3)",
            borderRadius: 3,
            px: 2.5, py: 2,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box sx={{ fontSize: 28 }}>💰</Box>
            <Box>
              <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600, display: "block" }}>
                Your Balance
              </Typography>
              <Typography variant="h4" fontWeight={800} sx={{ color: GOLD, lineHeight: 1 }}>
                {balance.toLocaleString()}
                <Typography component="span" variant="body2" sx={{ color: "#64748B", ml: 0.5 }}>
                  coins
                </Typography>
              </Typography>
            </Box>
          </Stack>
          <Chip
            icon={<EmojiEventsIcon style={{ fontSize: 14, color: GOLD }} />}
            label="FitCoins"
            sx={{ bgcolor: "rgba(245,158,11,0.1)", color: GOLD, border: "1px solid rgba(245,158,11,0.3)", fontWeight: 600 }}
          />
        </Box>

        {/* Rewards list */}
        {!rewards ? (
          <Stack spacing={2}>
            <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
            <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
            <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
          </Stack>
        ) : (
          rewards.map((r) => {
            const canAfford = balance >= r.cost;
            const style = REWARD_COLORS[r.id] || { color: "#64748B", bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)" };
            const icon = REWARD_ICONS[r.id] || "🎁";

            return (
              <Card
                key={r.id}
                sx={{
                  border: canAfford ? `1px solid ${style.border}` : "1px solid rgba(255,255,255,0.06)",
                  background: canAfford
                    ? `linear-gradient(135deg, ${style.bg}, transparent)`
                    : "transparent",
                  transition: "all 0.2s ease",
                  "&:hover": canAfford ? {
                    transform: "translateY(-2px)",
                    boxShadow: `0 12px 40px rgba(0,0,0,0.3), 0 0 0 1px ${style.border}`,
                  } : {},
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 52, height: 52,
                        borderRadius: 2.5,
                        bgcolor: canAfford ? style.bg : "rgba(255,255,255,0.03)",
                        border: `1px solid ${canAfford ? style.border : "rgba(255,255,255,0.06)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 24, flexShrink: 0,
                        filter: canAfford ? "none" : "grayscale(1) opacity(0.4)",
                      }}
                    >
                      {icon}
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ mb: 0.5, color: canAfford ? "#F8FAFC" : "#475569" }}
                      >
                        {r.title}
                      </Typography>
                      <Chip
                        size="small"
                        icon={<EmojiEventsIcon style={{ fontSize: 12, color: canAfford ? GOLD : "#334155" }} />}
                        label={`${r.cost.toLocaleString()} coins`}
                        sx={{
                          bgcolor: canAfford ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.04)",
                          color: canAfford ? GOLD : "#334155",
                          border: canAfford ? "1px solid rgba(245,158,11,0.25)" : "1px solid rgba(255,255,255,0.05)",
                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    <Tooltip title={
                      r.redeemed ? "Already unlocked" :
                      canAfford  ? "Redeem reward" :
                      `Need ${r.cost - balance} more coins`
                    }>
                      <span>
                        <Button
                          variant={r.redeemed ? "outlined" : canAfford ? "contained" : "outlined"}
                          size="small"
                          disabled={!canAfford || r.redeemed || redeeming === r.id}
                          startIcon={
                            r.redeemed ? <CheckCircleIcon sx={{ fontSize: "14px !important", color: "#10B981 !important" }} /> :
                            !canAfford  ? <LockIcon sx={{ fontSize: "14px !important" }} /> :
                            undefined
                          }
                          onClick={() => handleRedeem(r)}
                          sx={{
                            minWidth: 88,
                            ...(r.redeemed ? {
                              color: "#10B981",
                              borderColor: "rgba(16,185,129,0.3)",
                              "&.Mui-disabled": { color: "#10B981", borderColor: "rgba(16,185,129,0.3)" },
                            } : !canAfford ? {
                              color: "#334155",
                              borderColor: "rgba(255,255,255,0.06)",
                              "&.Mui-disabled": { color: "#334155", borderColor: "rgba(255,255,255,0.06)" },
                            } : {}),
                          }}
                        >
                          {r.redeemed ? "Unlocked" : redeeming === r.id ? "…" : canAfford ? "Unlock" : `${r.cost - balance} more`}
                        </Button>
                      </span>
                    </Tooltip>
                  </Stack>
                </CardContent>
              </Card>
            );
          })
        )}

        <Box sx={{ height: 8 }} />
      </Stack>
    </Page>
  );
}
