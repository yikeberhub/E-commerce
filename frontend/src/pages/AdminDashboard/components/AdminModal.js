import React from "react";
import { FiX } from "react-icons/fi";

function AdminModal({ title, onClose, children, widthClass = "max-w-md" }) {
  return (
    <div
      className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-xl shadow-xl w-full ${widthClass} max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition"
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export default AdminModal;
