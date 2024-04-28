import React, { useEffect } from "react";
import styles from "./ToastContainer.module.css";

const ToastItem = ({ toast, removeToast }) => {
  return (
    <div className={`${styles.toast} ${styles[`toast-${toast.type}`]}`} onClick={() => removeToast(toast.id)}>
      <h4>{toast.title}</h4>
      <p>{toast.text}</p>
    </div>
  );
};

export default ToastItem;
