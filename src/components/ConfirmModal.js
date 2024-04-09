import React from "react";
import ReactDOM from "react-dom";
import styles from "./ConfirmModal.module.css";
import Button from "./Button";

const ConfirmModal = ({ isOpen, content, buttons, handleResponse, className }) => {
  if (!isOpen) return null;

  // Merge custom className with default styles
  const backdropClassName = `${styles.backdrop} ${className?.backdrop || ""}`;
  const modalContentClassName = `${styles.modalContent} ${className?.modalContent || ""}`;
  const buttonsContainerClassName = `${styles.buttonsContainer} ${className?.buttonsContainer || ""}`;

  return ReactDOM.createPortal(
    <div className={backdropClassName}>
      <div className={modalContentClassName}>
        {content}
        {buttons?.length ? (
          <div className={buttonsContainerClassName}>
            {buttons.map((item, i) => (
              <Button key={i} onClick={handleResponse.bind(this, item.value)}>
                {item.label}
              </Button>
            ))}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>,
    document.body,
  );
};

export default ConfirmModal;
