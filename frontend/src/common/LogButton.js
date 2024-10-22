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

  return (
    <>
      {user ? (
        <button onClick={handleLogout} className="text-gray_light">
          Logout
        </button>
      ) : (
        <Link to="/login">
          <div className="text-gray_light">Login</div>
        </Link>
      )}
    </>
  );
};

export default LogButton;
