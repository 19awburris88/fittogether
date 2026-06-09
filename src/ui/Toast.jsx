import { useState, createContext, useContext, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";

const ToastCtx = createContext({ push: () => {} });
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [severity, setSeverity] = useState("success");

  const push = useCallback((message, sev = "success") => {
    setMsg(message);
    setSeverity(sev);
    setOpen(true);
  }, []);

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <Snackbar open={open} autoHideDuration={2200} onClose={() => setOpen(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={() => setOpen(false)} severity={severity} variant="filled" sx={{ width: "100%" }}>
          {msg}
        </Alert>
      </Snackbar>
    </ToastCtx.Provider>
  );
}
