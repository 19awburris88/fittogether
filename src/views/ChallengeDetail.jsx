import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Card, CardContent, Typography, Stack, Chip, LinearProgress, Grid, Button
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ds } from "../lib/dataSource";
import LogModal from "../ui/LogModal";
import { useToast } from "../ui/Toast";


const typeColor = (t) => (t === "collab" ? "primary" : "secondary");

export default function ChallengeDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const qc = useQueryClient();
  const { data: challenges = [] } = useQuery({ queryKey: ["challenges"], queryFn: ds.getChallenges });
  const challenge = useMemo(() => challenges.find((c) => c.id === id), [challenges, id]);
  const { push } = useToast();

  const [logType, setLogType] = useState(null); // 'water' or 'workout'

  if (!challenge) {
    return (
      <Card>
        <CardContent>
          <Button startIcon={<ArrowBackIcon/>} onClick={() => nav(-1)}>Back</Button>
          <Typography variant="h6" sx={{ mt: 2 }}>Challenge not found.</Typography>
        </CardContent>
      </Card>
    );
  }

  const aPct = Math.min(100, (challenge.progress.austin / challenge.progress.target) * 100);
  const pPct = Math.min(100, (challenge.progress.partner / challenge.progress.target) * 100);

  const closeModal = (didSave) => {
    setLogType(null);
    if (didSave) {
      qc.invalidateQueries({ queryKey: ["challenges"] });
      qc.invalidateQueries({ queryKey: ["dash"] });
      push("Progress logged!", "success");
    }
  };

  const isWater = challenge.id === "water"; // matches mock ids
  const isWorkout = challenge.id === "sync";

  return (
    <>
      <Card>
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => nav(-1)}>Back</Button>
            <Typography variant="h5" fontWeight={800}>{challenge.title}</Typography>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip size="small" color={typeColor(challenge.type)} label={challenge.type === "collab" ? "Collaborative" : "Head-to-Head"} />
            <Chip size="small" color="warning" icon={<EmojiEventsIcon />} label={`+${challenge.reward} coins`} />
          </Stack>

          <Typography sx={{ opacity: 0.9, mb: 3 }}>{challenge.desc}</Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Austin: {challenge.progress.austin}/{challenge.progress.target}</Typography>
              <LinearProgress variant="determinate" value={aPct} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Partner: {challenge.progress.partner}/{challenge.progress.target}</Typography>
              <LinearProgress variant="determinate" value={pPct} />
            </Grid>
          </Grid>

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            {isWater && (
              <Button variant="contained" startIcon={<LocalDrinkIcon />} onClick={() => setLogType("water")}>
                Log Water
              </Button>
            )}
            {isWorkout && (
              <Button variant="outlined" startIcon={<FitnessCenterIcon />} onClick={() => setLogType("workout")}>
                Log Workout
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>

      <LogModal open={Boolean(logType)} type={logType || "water"} onClose={closeModal} />
    </>
  );
}
