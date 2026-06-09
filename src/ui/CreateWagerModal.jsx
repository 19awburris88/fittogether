import { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Stack, Button, ToggleButton, ToggleButtonGroup, Typography
} from "@mui/material";

export default function CreateWagerModal({ open, onClose, onCreate }) {
  const [title, setTitle] = useState("12k Steps x 7 Days");
  const [type, setType] = useState("both_meet"); // (future: head_to_head)
  const [perDayTarget, setPerDayTarget] = useState(12000);
  const [days, setDays] = useState(7);
  const [austinReward, setAustinReward] = useState("Next date paid by partner");
  const [partnerReward, setPartnerReward] = useState("New walking shoes");

  const save = async () => {
    await onCreate?.({
      title,
      type,
      perDayTarget,
      days,
      stakes: { austin: austinReward, partner: partnerReward }
    });
    onClose?.();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>New Side Bet</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField label="Title" value={title} onChange={e=>setTitle(e.target.value)} />
          <Stack>
            <Typography variant="subtitle2" sx={{ mb: .5 }}>Type</Typography>
            <ToggleButtonGroup exclusive value={type} onChange={(_,v)=>v && setType(v)}>
              <ToggleButton value="both_meet">Both must meet goal</ToggleButton>
              {/* <ToggleButton value="head_to_head">Head to head</ToggleButton> */}
            </ToggleButtonGroup>
          </Stack>
          <TextField type="number" label="Steps per day" value={perDayTarget} onChange={e=>setPerDayTarget(Number(e.target.value)||0)} />
          <TextField type="number" label="Days" value={days} onChange={e=>setDays(Number(e.target.value)||0)} />
          <Typography variant="subtitle2">Stakes (Tangible Rewards)</Typography>
          <TextField label="If Austin wins..." value={austinReward} onChange={e=>setAustinReward(e.target.value)} />
          <TextField label="If Partner wins..." value={partnerReward} onChange={e=>setPartnerReward(e.target.value)} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={save}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}
