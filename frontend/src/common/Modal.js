import React from "react";
import { FaTimes } from "react-icons/fa"; // Import the close icon
import useAuth from "../contexts/AuthContext";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed  inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-200 w-1/3 rounded-lg shadow-lg px-6 py-4 relative">
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-gray-500 font-mono font-light ">
            Write your comment here
          </h3>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition duration-200 "
            aria-label="Close modal"
          >
            <FaTimes className="text-xl text-red-500 text-center" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

export default Modal;
