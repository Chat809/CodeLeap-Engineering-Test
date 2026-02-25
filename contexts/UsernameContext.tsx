"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const USERNAME_KEY = "codeleap-username";

interface UsernameContextValue {
  username: string | null;
  setUsername: (name: string | null) => void;
  isReady: boolean;
}

const UsernameContext = createContext<UsernameContextValue | null>(null);

export function UsernameProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsernameState] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(USERNAME_KEY);
    if (stored) setUsernameState(stored);
    setIsReady(true);
  }, []);

  const setUsername = useCallback((name: string | null) => {
    if (name === null) {
      if (typeof window !== "undefined") localStorage.removeItem(USERNAME_KEY);
      setUsernameState(null);
    } else {
      if (typeof window !== "undefined") localStorage.setItem(USERNAME_KEY, name);
      setUsernameState(name);
    }
  }, []);

  const value = useMemo(
    () => ({ username, setUsername, isReady }),
    [username, setUsername, isReady]
  );

  return (
    <UsernameContext.Provider value={value}>
      {children}
    </UsernameContext.Provider>
  );
}

export function useUsername() {
  const ctx = useContext(UsernameContext);
  if (!ctx) throw new Error("useUsername must be used within UsernameProvider");
  return ctx;
}
