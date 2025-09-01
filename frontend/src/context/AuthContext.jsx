import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Try refresh on mount
  useEffect(() => {
    (async () => {
      try {
        await api.post("/auth/refresh");
        const me = await api.get("/auth/me");
        setUser(me.data.user);
      } catch {
        setUser(null);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  async function register(email, password) {
    const res = await api.post("/auth/register", { email, password });
    setUser(res.data.user);
  }

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    setUser(res.data.user);
  }

  async function logout() {
    await api.post("/auth/logout");
    setUser(null);
  }

  return (
    <AuthCtx.Provider value={{ user, ready, register, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}