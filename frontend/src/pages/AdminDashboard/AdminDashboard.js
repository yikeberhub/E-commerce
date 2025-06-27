import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminComponent/AdminNavbar";
import AdminSidebar from "./AdminComponent/AdminSideBar";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen bg-white text-black relative">
      <div
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:translate-x-0 transition-transform duration-300 ease-in-out z-20`}
      >
        <AdminSidebar type="admin" closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-4">
        <header className=" flex justify-between mx-auto items-center lg:px-6 bg-white border-b-2 border-gray-200 z-10">
          <button
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            onClick={toggleSidebar}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
          <AdminNavbar type="admin" />
        </header>

        {/* Content */}
        <main className="p-4 lg:p-2 w-full lg:ml-0 transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
