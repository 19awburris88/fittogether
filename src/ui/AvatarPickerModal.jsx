import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Paper } from "@mui/material";

const EMOJIS = ["🟦","🟣","🟢","🟧","🔴","🟨","🟫","🖤","🤍","💙","💜","💚","🧡","❤️","💛","🤎"];

export default function AvatarPickerModal({ open, onClose, onPick }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Choose an avatar</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={1.5}>
          {EMOJIS.map(e => (
            <Grid item xs={3} key={e}>
              <Paper onClick={()=>onPick?.(e)} sx={{ p:2, textAlign:"center", fontSize:28, cursor:"pointer", ":active":{ opacity:.9 } }}>
                {e}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
