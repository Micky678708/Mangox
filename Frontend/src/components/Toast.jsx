import React, { createContext, useContext, useMemo, useState } from "react";

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);

  const push = (msg, type = "info") => {
    const id = Math.random().toString(16).slice(2);
    setItems((p) => [...p, { id, msg, type }]);
    setTimeout(() => {
      setItems((p) => p.filter((x) => x.id !== id));
    }, 2600);
  };

  const value = useMemo(() => ({ push }), []);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <ToastHost items={items} />
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

function ToastHost({ items }) {
  return (
    <div className="toastHost">
      {items.map((t) => (
        <div key={t.id} className={`toastItem toast-${t.type}`}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
