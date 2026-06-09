/* eslint-disable react-refresh/only-export-components */
import ReactDOM from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { theme } from "./theme";
import "./index.css";
import "./styles.css";

import Landing       from "./pages/Landing";
import Login         from "./pages/Login";
import Register      from "./pages/Register";
import AppShell      from "./ui/AppShell";
import { ToastProvider } from "./ui/Toast";

import Dashboard    from "./views/Dashboard";
import WorkoutLog   from "./views/WorkoutLog";
import Challenges   from "./views/Challenges";
import ChallengeDetail from "./views/ChallengeDetail";
import Rewards      from "./views/Rewards";
import Progress     from "./views/Progress";
import Profile      from "./views/Profile";
import Settings     from "./views/Settings";
import Onboarding   from "./views/Onboarding";

import { getSession, getOnboarding } from "./lib/store";

const qc = new QueryClient();

function OnboardingGuard() {
  if (!getSession()) return <Navigate to="/login" replace />;
  return <Onboarding onFinish={() => (window.location.href = "/app")} />;
}

function GuardedApp() {
  if (!getSession()) return <Navigate to="/login" replace />;
  if (!getOnboarding().finished) return <Navigate to="/onboarding" replace />;

  return (
    <AppShell>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="workouts" element={<WorkoutLog />} />
        <Route path="challenges" element={<Challenges />} />
        <Route path="challenges/:id" element={<ChallengeDetail />} />
        <Route path="rewards" element={<Rewards />} />
        <Route path="progress" element={<Progress />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
    </AppShell>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <ToastProvider>
          <Routes>
            <Route path="/"            element={<Landing />} />
            <Route path="/login"       element={<Login />} />
            <Route path="/register"    element={<Register />} />
            <Route path="/onboarding"  element={<OnboardingGuard />} />
            <Route path="/app/*"       element={<GuardedApp />} />
            <Route path="*"            element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ThemeProvider>
);
