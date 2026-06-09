import { useQuery } from "@tanstack/react-query";
import { ds } from "../lib/dataSource";
import { Stack, Card, CardContent, Typography, Box, Skeleton } from "@mui/material";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area,
} from "recharts";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import Page from "../ui/Page";

const EMERALD = "#10B981";
const CORAL   = "#FB7185";
const GOLD    = "#F59E0B";
const PURPLE  = "#A78BFA";

const TOOLTIP_STYLE = {
  background: "#1E293B",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 8,
  color: "#F8FAFC",
  fontSize: 13,
};

function StatCard({ icon, label, value, color }) {
  return (
    <Box
      sx={{
        flex: "1 1 calc(50% - 6px)",
        minWidth: 0,
        background: `linear-gradient(135deg, ${color}12, ${color}04)`,
        border: `1px solid ${color}22`,
        borderRadius: 3,
        p: 2,
      }}
    >
      <Box sx={{ color, mb: 0.5, display: "flex" }}>{icon}</Box>
      <Typography variant="h5" fontWeight={800} sx={{ color, lineHeight: 1.1 }}>
        {value}
      </Typography>
      <Typography variant="caption" sx={{ color: "#64748B" }}>
        {label}
      </Typography>
    </Box>
  );
}

export default function Progress() {
  const { data, isLoading } = useQuery({ queryKey: ["history"], queryFn: ds.getHistory });

  const totalWorkouts = (data?.weeklyWorkouts || []).reduce((s, w) => s + (w.austin || 0), 0);
  const bestStreak    = data ? Math.max(...data.streakHistory) : 0;
  const thisWeek      = data?.weeklyWorkouts?.at(-1)?.austin ?? "—";
  const activeSteps   = (data?.dailySteps || []).filter((d) => d.austin > 0);
  const avgSteps      = activeSteps.length
    ? Math.round(activeSteps.reduce((s, d) => s + d.austin, 0) / activeSteps.length).toLocaleString()
    : "—";

  return (
    <Page>
      <Stack spacing={2.5}>
        <Typography variant="h6" fontWeight={800}>Progress</Typography>

        {/* Stat cards */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
          <StatCard icon={<FitnessCenterIcon fontSize="small" />} label="Total Workouts"   value={totalWorkouts} color={EMERALD} />
          <StatCard icon={<WhatshotIcon fontSize="small" />}      label="Best Streak"      value={`${bestStreak}d`} color={GOLD} />
          <StatCard icon={<TrendingUpIcon fontSize="small" />}    label="This Week"        value={thisWeek}     color={CORAL} />
          <StatCard icon={<DirectionsRunIcon fontSize="small" />} label="Avg Daily Steps"  value={avgSteps}     color={PURPLE} />
        </Box>

        {/* Weekly Workouts */}
        <Card>
          <CardContent>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
              Weekly Workouts
            </Typography>
            {isLoading ? (
              <Skeleton variant="rounded" height={180} />
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={data?.weeklyWorkouts} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="week" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "#64748B" }} />
                  <Bar dataKey="austin"  name="You"     fill={EMERALD} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="partner" name="Partner" fill={CORAL}   radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Daily Steps */}
        <Card>
          <CardContent>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
              Daily Steps — This Week
            </Typography>
            {isLoading ? (
              <Skeleton variant="rounded" height={180} />
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={data?.dailySteps} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gAustin" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={EMERALD} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={EMERALD} stopOpacity={0}   />
                    </linearGradient>
                    <linearGradient id="gPartner" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={CORAL} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CORAL} stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="day" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fill: "#64748B", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(v) => [v.toLocaleString(), ""]}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, color: "#64748B" }} />
                  <Area type="monotone" dataKey="austin"  name="You"     stroke={EMERALD} fill="url(#gAustin)"  strokeWidth={2} />
                  <Area type="monotone" dataKey="partner" name="Partner" stroke={CORAL}   fill="url(#gPartner)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Page>
  );
}
