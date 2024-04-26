import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    toast.id = Math.random().toString(36).substr(2, 9); // unique ID for key prop
    setToasts((prev) => [...prev, toast]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const contextValues = useMemo(() => ({ toasts, addToast, removeToast }), [toasts]); // value is cached by useMemo
  return <ToastContext.Provider value={contextValues}>{children}</ToastContext.Provider>;
};
