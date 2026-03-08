import React, { createContext, useContext, useMemo, useState } from "react";

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [musicOn, setMusicOn] = useState(true);

  const value = useMemo(
    () => ({
      musicOn,
      setMusicOn,
      toggleMusic: () => setMusicOn((v) => !v),
    }),
    [musicOn]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}
