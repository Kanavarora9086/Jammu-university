/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { setAccessToken } from "./api";

const AuthContext = createContext(null);

const LS_KEY = "universityPortal.auth";

export function AuthProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : { accessToken: null, role: null };
    } catch {
      return { accessToken: null, role: null };
    }
  });

  useEffect(() => {
    setAccessToken(state.accessToken);
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo(
    () => ({
      accessToken: state.accessToken,
      role: state.role,
      login: ({ accessToken, role }) => setState({ accessToken, role }),
      logout: () => setState({ accessToken: null, role: null })
    }),
    [state.accessToken, state.role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

