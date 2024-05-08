import { useState, useCallback, useEffect, useRef } from "react";
import ConfirmModal from "./../components/ConfirmModal";

const defaultButtons = [
  { label: "No", value: false },
  { label: "Yes", value: true },
];

const useConfirm = (className) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(null);
  const [buttons, setButtons] = useState(defaultButtons);
  const resolveReject = useRef();

  const requestConfirm = useCallback((jsxContent, buttonsProperties = defaultButtons) => {
    document.activeElement.blur(); // remove the focus from the activeElement
    setContent(jsxContent);
    setIsOpen(true);
    if (buttonsProperties != null) setButtons(buttonsProperties);
    return new Promise((resolve, reject) => {
      resolveReject.current = [resolve, reject];
    });
  }, []);

  const handleResponse = useCallback(
    (value) => {
      if (resolveReject.current?.length > 0) {
        const [resolve] = resolveReject.current;
        resolve(value);
      }
      setIsOpen(false);
    },
    [resolveReject]
  );

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.keyCode === 27) handleResponse(false); // Close modal on ESC key
    };
    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [handleResponse]);

  return {
    requestConfirm,
    ConfirmModalComponent: <ConfirmModal isOpen={isOpen} content={content} buttons={buttons} handleResponse={handleResponse} className={className} />,
    handleResponse,
  };
};

export default useConfirm;
