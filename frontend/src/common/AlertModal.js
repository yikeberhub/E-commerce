import React, { useEffect } from "react";

function AlertModal({ message, type = "success", isVisible, onClose }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Close after 3 seconds
      return () => clearTimeout(timer); // Clear timeout on unmount
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const alertStyles = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
    info: "bg-blue-100 border-blue-400 text-blue-700",
  };

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded border ${alertStyles[type]} shadow-lg`}
    >
      <span className="font-medium">{message}</span>
    </div>
  );
}

export default AlertModal;
