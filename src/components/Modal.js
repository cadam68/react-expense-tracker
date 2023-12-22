import React from "react";
import "./Modal.css";
import Button from "./Button"; // Make sure to create corresponding CSS for styling

const Modal = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
        <div className={"center"}>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
