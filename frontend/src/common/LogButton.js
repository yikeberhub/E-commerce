import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const LogButton = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return user ? (
    <button
      onClick={handleLogout}
      className="hidden sm:inline text-sm font-medium text-slate-500 hover:text-red-500 transition"
    >
      Logout
    </button>
  ) : (
    <Link
      to="/login"
      className="text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white px-3.5 py-1.5 rounded-full transition"
    >
      Login
    </Link>
  );
};

export default LogButton;
