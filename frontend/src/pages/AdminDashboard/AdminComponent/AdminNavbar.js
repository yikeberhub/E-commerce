import React from "react";

import AdminLogo from "../../../assets/icons/shopLogo/shop_logo.jpg";

const AdminNavbar = ({ type }) => {
  return (
    <div className="flex justify-between items-center bg-white p-4 text-black shadow">
      <input
        type="text"
        placeholder="Search..."
        className="p-2 rounded border border-gray-400 w-1/3  focus:outline-none"
      />

      <div className="flex items-center space-x-4">
        <div title="Notifications" className="cursor-pointer">
          🔔
        </div>
        <div title="Messages" className="cursor-pointer">
          ✉️
        </div>
        <div title="Admin Profile" className="flex items-center cursor-pointer">
          <img
            src={AdminLogo}
            alt="Admin"
            className="rounded-full w-8 h-8 mr-2"
          />
          <span>Yike</span>
          <span className="ml-1">▼</span> {/* Down arrow */}
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
