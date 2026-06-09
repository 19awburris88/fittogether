import { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack, ToggleButton, ToggleButtonGroup, Typography
} from "@mui/material";

export default function CreateChallengeModal({ open, onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("head_to_head"); // or 'collab'
  const [target, setTarget] = useState(8);
  const [reward, setReward] = useState(50);
  const [desc, setDesc] = useState("");

  const canSave = title.trim().length >= 3;

  const submit = async () => {
    await onCreate?.({ title, type, target, reward, desc });
    onClose?.();
    // reset for next use
    setTitle(""); setType("head_to_head"); setTarget(8); setReward(50); setDesc("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>New Challenge</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField label="Title" value={title} onChange={e=>setTitle(e.target.value)} autoFocus />
          <Stack>
            <Typography variant="subtitle2">Type</Typography>
            <ToggleButtonGroup value={type} exclusive onChange={(_,v)=>v&&setType(v)}>
              <ToggleButton value="head_to_head">Head-to-Head</ToggleButton>
              <ToggleButton value="collab">Collaborative</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          <TextField type="number" label="Target" value={target} onChange={e=>setTarget(Number(e.target.value)||0)} />
          <TextField type="number" label="Reward (coins)" value={reward} onChange={e=>setReward(Number(e.target.value)||0)} />
          <TextField label="Description (optional)" value={desc} onChange={e=>setDesc(e.target.value)} multiline rows={2} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit} disabled={!canSave}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}
