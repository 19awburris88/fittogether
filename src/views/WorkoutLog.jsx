import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ds } from "../lib/dataSource";
import {
  Stack, Card, CardContent, Typography, Button, Box, Chip, Skeleton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Select, InputLabel, FormControl,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import Page from "../ui/Page";
import { useToast } from "../ui/Toast";
import dayjs from "dayjs";

const TYPES = [
  { value: "strength",    label: "Strength",    color: "#10B981", icon: "💪" },
  { value: "cardio",      label: "Cardio",      color: "#FB7185", icon: "🏃" },
  { value: "flexibility", label: "Flexibility", color: "#A78BFA", icon: "🧘" },
  { value: "other",       label: "Other",       color: "#F59E0B", icon: "⚡" },
];

function getType(value) {
  return TYPES.find((t) => t.value === value) || TYPES[3];
}

const EMPTY_FORM = { name: "", type: "strength", duration: "30", notes: "" };

export default function WorkoutLog() {
  const qc = useQueryClient();
  const { push } = useToast();
  const { data, isLoading } = useQuery({
    queryKey: ["workoutLog"],
    queryFn: ds.getWorkoutLog,
  });

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const close = () => { setOpen(false); setForm(EMPTY_FORM); };

  const save = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    await ds.addWorkoutEntry({ name: form.name.trim(), type: form.type, duration: Number(form.duration) || 30, notes: form.notes });
    qc.invalidateQueries({ queryKey: ["workoutLog"] });
    qc.invalidateQueries({ queryKey: ["dash"] });
    qc.invalidateQueries({ queryKey: ["activity"] });
    push("Workout logged!", "success");
    setSaving(false);
    close();
  };

  const grouped = (data || []).reduce((acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = [];
    acc[entry.date].push(entry);
    return acc;
  }, {});
  const dateKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <Page>
      <Stack spacing={2.5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight={800}>Workout Log</Typography>
          <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            Add
          </Button>
        </Stack>

        {isLoading && [1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rounded" height={72} sx={{ borderRadius: 2 }} />
        ))}

        {!isLoading && dateKeys.length === 0 && (
          <Card>
            <CardContent sx={{ textAlign: "center", py: 5 }}>
              <FitnessCenterIcon sx={{ fontSize: 40, color: "#334155", mb: 1 }} />
              <Typography variant="body2" sx={{ color: "#64748B" }}>
                No workouts yet — log your first one!
              </Typography>
            </CardContent>
          </Card>
        )}

        {dateKeys.map((date) => (
          <Box key={date}>
            <Typography
              variant="caption"
              sx={{
                color: "#64748B", fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.07em", mb: 1, display: "block",
              }}
            >
              {dayjs(date).format("ddd, MMM D")}
            </Typography>
            <Stack spacing={1}>
              {grouped[date].map((entry) => {
                const t = getType(entry.type);
                return (
                  <Card key={entry.id} sx={{ border: `1px solid ${t.color}22` }}>
                    <CardContent sx={{ py: 1.75, px: 2, "&:last-child": { pb: 1.75 } }}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box sx={{ fontSize: 22, flexShrink: 0 }}>{t.icon}</Box>
                        <Stack sx={{ flex: 1, minWidth: 0 }}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="subtitle2" fontWeight={700} noWrap>
                              {entry.name}
                            </Typography>
                            {entry.userId !== "austin" && (
                              <Chip
                                size="small"
                                label="Partner"
                                sx={{ height: 18, fontSize: "0.6rem", bgcolor: "rgba(251,113,133,0.12)", color: "#FB7185" }}
                              />
                            )}
                          </Stack>
                          {entry.notes ? (
                            <Typography variant="caption" sx={{ color: "#64748B" }} noWrap>
                              {entry.notes}
                            </Typography>
                          ) : null}
                        </Stack>
                        <Stack alignItems="flex-end" spacing={0.25} flexShrink={0}>
                          <Chip
                            size="small"
                            label={t.label}
                            sx={{ height: 20, fontSize: "0.65rem", bgcolor: `${t.color}15`, color: t.color, fontWeight: 700 }}
                          />
                          <Typography variant="caption" sx={{ color: "#64748B" }}>
                            {entry.duration} min
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          </Box>
        ))}
      </Stack>

      <Dialog open={open} onClose={close} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>Log Workout</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <TextField
              label="Workout name"
              placeholder="e.g. Morning Run, Upper Body…"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
              fullWidth
              autoFocus
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select label="Type" value={form.type} onChange={(e) => set("type", e.target.value)}>
                {TYPES.map((t) => (
                  <MenuItem key={t.value} value={t.value}>
                    {t.icon} {t.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Duration (minutes)"
              type="number"
              value={form.duration}
              onChange={(e) => set("duration", e.target.value)}
              inputProps={{ min: 1, max: 300 }}
              fullWidth
            />
            <TextField
              label="Notes (optional)"
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              multiline
              rows={2}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={close}>Cancel</Button>
          <Button variant="contained" onClick={save} disabled={!form.name.trim() || saving}>
            {saving ? "Saving…" : "Log Workout"}
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
