import React, { useEffect } from "react";
import AdminLogo from "../../../assets/icons/shopLogo/shop_logo.jpg";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminNavbar = ({ type }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return <div>Loading....</div>;
  return (
    <div className="flex justify-start sm:justify-between w-full  lg:w-2/3 md:w-2/4 lg:flex-row lg:justify-between items-center bg-white p-4 text-black  gap-4 lg:gap-0">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search..."
        className="p-2 w-2/3  rounded border border-gray-400 lg:w-full  focus:outline-none"
      />

      {/* Icons and Profile Section */}
      <div className="flex items-center space-x-4">
        {/* Notifications Icon */}
        <div
          title="Notifications"
          className="cursor-pointer text-xl hover:text-gray-600"
        >
          🔔
        </div>

        {/* Messages Icon */}
        <div
          title="Messages"
          className="cursor-pointer text-xl hover:text-gray-600"
        >
          ✉️
        </div>

        {/* Profile Section */}

        <div title="Admin Profile" className="flex items-center cursor-pointer">
          <img
            src={user.profile_image}
            alt="Admin"
            className="rounded-full w-8 h-8 mr-2"
          />
          <span className="hidden sm:inline">{user.first_name}</span>
          <span className="ml-1 hidden sm:inline">▼</span> {/* Down arrow */}
          <p className="mx-2 py-1 ">
            {user ? (
              <span onClick={() => logout()}>Logout</span>
            ) : (
              <link to="/login">
                <span>login</span>
              </link>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
