import { useState } from "react";
import {
  Stack, Card, CardContent, Typography, TextField, Chip, Switch, FormControlLabel,
  MenuItem, Select, InputLabel, FormControl, Divider, Button
} from "@mui/material";
import { getOnboarding, setOnboarding, getSettings, setSettings, resetAllData, clearSession } from "../lib/store";
import ConfirmDialog from "../ui/ConfirmDialog";
import Page from "../ui/Page";
import { useToast } from "../ui/Toast";

const GOAL_OPTIONS = [
  { key:"lose_weight", label:"Lose Weight" },
  { key:"build_strength", label:"Build Strength" },
  { key:"consistency", label:"Stay Consistent" },
  { key:"hydrate", label:"Hydration" },
  { key:"sleep", label:"Better Sleep" },
];

export default function Settings() {
  const { push } = useToast();
  const ob = getOnboarding();
  const s0 = getSettings();

  const [name, setName] = useState(s0.name || "Austin");
  const [partnerName, setPartnerName] = useState(s0.partnerName || "");
  const [goals, setGoals] = useState(ob.goals?.length ? ob.goals : s0.goals || []);
  const [noti, setNoti] = useState(s0.notifications);
  const [units, setUnits] = useState(s0.units);
  const [partnerEmail, setPartnerEmail] = useState(ob.partnerEmail || "");
  const [confirmReset, setConfirmReset] = useState(false);

  const toggleGoal = (k) => {
    setGoals((g) => g.includes(k) ? g.filter(x=>x!==k) : [...g, k]);
  };

  const saveAll = () => {
    setSettings({ name, partnerName, notifications: noti, units, goals });
    setOnboarding({ goals, partnerEmail, finished: true, name });
    push("Settings saved", "success");
  };

  const doReset = () => {
    resetAllData();
    setConfirmReset(false);
    push("Local data cleared", "success");
    location.href = "/register";
  };

  const logout = () => {
    clearSession();
    location.href = "/login";
  };

  return (
    <Page>
      <Stack spacing={2}>
        {/* Account */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>Account</Typography>
            <Stack spacing={1.5}>
              <TextField label="Your name" value={name} onChange={e=>setName(e.target.value)} />
              <TextField label="Partner's name" value={partnerName} onChange={e=>setPartnerName(e.target.value)} placeholder="e.g. Jordan" />
              <TextField label="Partner email (optional)" value={partnerEmail} onChange={e=>setPartnerEmail(e.target.value)} />
            </Stack>
          </CardContent>
        </Card>

        {/* Goals */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>Goals</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {GOAL_OPTIONS.map(g => {
                const on = goals.includes(g.key);
                return (
                  <Chip key={g.key}
                        label={g.label}
                        color={on ? "primary" : "default"}
                        variant={on ? "filled" : "outlined"}
                        onClick={() => toggleGoal(g.key)} />
                );
              })}
            </Stack>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>Notifications</Typography>
            <FormControlLabel
              control={<Switch checked={!!noti.water} onChange={e=>setNoti({...noti, water:e.target.checked})} />}
              label="Remind me to drink water"
            />
            <FormControlLabel
              control={<Switch checked={!!noti.workouts} onChange={e=>setNoti({...noti, workouts:e.target.checked})} />}
              label="Workout reminders"
            />
            <FormControlLabel
              control={<Switch checked={!!noti.streaks} onChange={e=>setNoti({...noti, streaks:e.target.checked})} />}
              label="Streak nudges"
            />
          </CardContent>
        </Card>

        {/* Units */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>Units</Typography>
            <Stack direction="row" spacing={2}>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel id="weight-unit">Weight</InputLabel>
                <Select labelId="weight-unit" label="Weight" value={units.weight} onChange={e=>setUnits({...units, weight:e.target.value})}>
                  <MenuItem value="lb">Pounds (lb)</MenuItem>
                  <MenuItem value="kg">Kilograms (kg)</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel id="dist-unit">Distance</InputLabel>
                <Select labelId="dist-unit" label="Distance" value={units.distance} onChange={e=>setUnits({...units, distance:e.target.value})}>
                  <MenuItem value="mi">Miles (mi)</MenuItem>
                  <MenuItem value="km">Kilometers (km)</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </CardContent>
        </Card>

        {/* Data & Danger zone */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>Data</Typography>
            <Typography variant="body2" sx={{ opacity:.8, mb:1 }}>
              This MVP stores data locally in your browser.
            </Typography>
            <Divider sx={{ my:1.5 }} />
            <Button color="warning" variant="outlined" onClick={()=>setConfirmReset(true)} fullWidth>
              Clear local data & restart onboarding
            </Button>
          </CardContent>
        </Card>

        <Button variant="contained" onClick={saveAll} fullWidth>Save Settings</Button>
        <Button color="error" variant="outlined" onClick={logout} fullWidth>Sign Out</Button>
      </Stack>

      <ConfirmDialog
        open={confirmReset}
        title="Clear local data?"
        content="This will remove your local onboarding and settings and return you to the onboarding flow."
        confirmText="Clear & Restart"
        onCancel={()=>setConfirmReset(false)}
        onConfirm={doReset}
      />
    </Page>
  );
}
