import React, { createContext, useContext, useMemo, useState } from "react";
import { Log } from "../services/LogService";

const logger = Log("ToastContext");

const ToastContext = createContext({
  toasts: [],
  removeToast: () => {},
  // Toast: { info: () => {}, warn: () => {}, error: () => {} },
});

export function useToast() {
  return useContext(ToastContext);
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const ToastType = Object.freeze({
    INFO: "info",
    WARNING: "warning",
    ERROR: "error",
  });

  const createToast = (text, type, id = crypto.randomUUID()) => {
    return { id, type, text };
  };

  const addToast = (text, type = ToastType.INFO) => {
    if (!text) return;
    const toast = createToast(text, type);
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      logger.debug(`remove toast: ${JSON.stringify(toast)}`);
      removeToast(toast.id);
    }, 3500);
    return toast.id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const Toast = {
    info: (text) => addToast(text, ToastType.INFO),
    warn: (text) => addToast(text, ToastType.WARNING),
    error: (text) => addToast(text, ToastType.ERROR),
  };

  const contextValues = useMemo(() => ({ toasts, Toast, removeToast, addToast }), [toasts]); // value is cached by useMemo
  return <ToastContext.Provider value={contextValues}>{children}</ToastContext.Provider>;
};
