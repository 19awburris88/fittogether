import { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, TextField, Typography, ToggleButton, ToggleButtonGroup
} from "@mui/material";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { ds } from "../lib/dataSource";

export default function LogModal({ open, onClose, type = "water" /* or 'workout' */ }) {
  const [qty, setQty] = useState(type === "water" ? 1 : 1); // water = glasses, workout = sessions
  const [minutes, setMinutes] = useState(20); // per workout session
  const [who, setWho] = useState("austin"); // austin | partner

  const isWater = type === "water";

  const quickAdd = (val) => setQty(val);

  const submit = async () => {
    // Keep mock simple: call the underlying method qty times
    if (isWater) {
      for (let i = 0; i < qty; i++) { /* eslint-disable no-await-in-loop */
        await ds.addWater(who);
      }
    } else {
      for (let i = 0; i < qty; i++) {
        await ds.logWorkout(who, minutes);
      }
    }
    onClose?.(true);
  };

  return (
    <Dialog open={open} onClose={() => onClose?.(false)} fullWidth maxWidth="xs">
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {isWater ? <LocalDrinkIcon color="primary" /> : <FitnessCenterIcon color="secondary" />}
        {isWater ? "Log Water" : "Log Workout"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
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

          {isWater ? (
            <>
              <Typography variant="subtitle2">Glasses to log</Typography>
              <Stack direction="row" spacing={1}>
                {[1, 2, 3].map(n => (
                  <Button key={n} variant={qty === n ? "contained" : "outlined"} onClick={() => quickAdd(n)}>{`+${n}`}</Button>
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
                  <Button key={n} variant={qty === n ? "contained" : "outlined"} onClick={() => quickAdd(n)}>{`+${n}`}</Button>
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
        <Button onClick={() => onClose?.(false)}>Cancel</Button>
        <Button variant="contained" onClick={submit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
