import { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, TextField, Typography, ToggleButton, ToggleButtonGroup
} from "@mui/material";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { ds } from "../lib/dataSource";

const useMock = import.meta.env.VITE_USE_MOCK !== "false";

export default function LogModal({ open, onClose, type = "water" }) {
  const [qty, setQty] = useState(1);
  const [minutes, setMinutes] = useState(20);
  const [who, setWho] = useState("austin");

  const isWater = type === "water";

  const submit = async () => {
    let coinsEarned = 0;
    if (isWater) {
      if (useMock) {
        for (let i = 0; i < qty; i++) await ds.addWater(who);
      } else {
        const res = await ds.addWater({ userId: who, glasses: qty });
        coinsEarned = res?.coinsEarned ?? 0;
      }
    } else {
      if (useMock) {
        for (let i = 0; i < qty; i++) await ds.logWorkout(who, minutes);
      } else {
        const res = await ds.logWorkout({ name: "Workout", type: "other", duration: minutes });
        coinsEarned = res?.coinsEarned ?? 0;
      }
    }
    onClose?.({ saved: true, coinsEarned });
  };

  return (
    <Dialog open={open} onClose={() => onClose?.({ saved: false })} fullWidth maxWidth="xs">
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {isWater ? <LocalDrinkIcon color="primary" /> : <FitnessCenterIcon color="secondary" />}
        {isWater ? "Log Water" : "Log Workout"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          {useMock && (
            <Stack spacing={1}>
              <Typography variant="subtitle2">Who</Typography>
              <ToggleButtonGroup
                exclusive
                value={who}
                onChange={(_, v) => v && setWho(v)}
                fullWidth
              >
                <ToggleButton value="austin">Austin</ToggleButton>
                <ToggleButton value="partner">Partner</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          )}

          {isWater ? (
            <>
              <Typography variant="subtitle2">Glasses to log</Typography>
              <Stack direction="row" spacing={1}>
                {[1, 2, 3].map(n => (
                  <Button key={n} variant={qty === n ? "contained" : "outlined"} onClick={() => setQty(n)}>{`+${n}`}</Button>
                ))}
              </Stack>
              <TextField
                type="number"
                label="Custom"
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                inputProps={{ min: 1 }}
              />
            </>
          ) : (
            <>
              <Typography variant="subtitle2">Workouts to log</Typography>
              <Stack direction="row" spacing={1}>
                {[1, 2].map(n => (
                  <Button key={n} variant={qty === n ? "contained" : "outlined"} onClick={() => setQty(n)}>{`+${n}`}</Button>
                ))}
              </Stack>
              <TextField
                type="number"
                label="Minutes per workout"
                value={minutes}
                onChange={(e) => setMinutes(Math.max(5, Number(e.target.value)))}
                inputProps={{ min: 5, step: 5 }}
              />
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => onClose?.({ saved: false })}>Cancel</Button>
        <Button variant="contained" onClick={submit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
