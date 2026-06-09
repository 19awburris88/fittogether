import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box, Card, CardContent, TextField, Button, Typography, Stack, Alert, Divider,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { loginUser } from "../lib/store";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      loginUser(email.trim(), password);
      window.location.href = "/app";
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 400 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <FavoriteIcon sx={{ color: "#FB7185", fontSize: 22 }} />
              <Typography
                variant="h5"
                fontWeight={800}
                sx={{
                  background: "linear-gradient(135deg, #10B981, #34D399)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                FitTogether
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              Sign in to your account
            </Typography>
          </Stack>

          <form onSubmit={submit}>
            <Stack spacing={2}>
              {error && <Alert severity="error" sx={{ py: 0.5 }}>{error}</Alert>}
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                autoFocus
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />
              <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}>
                {loading ? "Signing in…" : "Sign In"}
              </Button>
            </Stack>
          </form>

          <Divider sx={{ my: 2.5 }} />

          <Typography variant="body2" align="center" sx={{ color: "#64748B" }}>
            Don't have an account?{" "}
            <RouterLink
              to="/register"
              style={{ color: "#10B981", fontWeight: 600, textDecoration: "none" }}
            >
              Sign up
            </RouterLink>
          </Typography>

          <Typography variant="body2" align="center" sx={{ color: "#334155", mt: 1.5, fontSize: "0.75rem" }}>
            <RouterLink to="/" style={{ color: "#475569", textDecoration: "none" }}>
              ← Back to home
            </RouterLink>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
