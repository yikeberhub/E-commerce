import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const POSITION_CLASSES = {
  left: (open) =>
    `top-0 bottom-0 left-0 w-80 max-w-[85vw] rounded-none ${
      open ? "translate-x-0" : "-translate-x-full"
    }`,
  right: (open) =>
    `top-0 bottom-0 right-0 w-80 max-w-[85vw] rounded-none ${
      open ? "translate-x-0" : "translate-x-full"
    }`,
  bottom: (open) =>
    `left-0 right-0 bottom-0 w-full max-h-[85vh] rounded-t-2xl ${
      open ? "translate-y-0" : "translate-y-full"
    }`,
};

const Drawer = ({ open, onClose, title, position = "left", children }) => {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-slate-900/50 z-40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`fixed z-50 bg-white shadow-xl flex flex-col transition-transform duration-300 ease-out ${POSITION_CLASSES[position](open)}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 shrink-0">
          <h2 className="font-semibold text-slate-800">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 transition"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </>
  );
};

export default Drawer;
