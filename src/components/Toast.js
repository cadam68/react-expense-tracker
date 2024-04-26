import React, { useEffect } from "react";
import styles from "./ToastContainer.module.css";

const Toast = ({ toast, removeToast }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 4000); // Dismiss toast
    return () => clearTimeout(timer);
  }, [toast, removeToast]);

  return (
    <div className={`${styles.toast} ${styles[`toast-${toast.type}`]}`} onClick={() => removeToast(toast.id)}>
      <h4>{toast.title}</h4>
      <p>{toast.message}</p>
    </div>
  );
};

export default Toast;
