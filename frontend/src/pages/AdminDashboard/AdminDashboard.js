import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminComponent/AdminNavbar";
import AdminSidebar from "./AdminComponent/AdminSideBar";
const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 py-2">
      <AdminSidebar type="admin" />
      <main className="flex-1 py-2 px-6">
        <header className="bg-white shadow-md p-4 rounded-lg mb-6">
          <AdminNavbar type="admin" />
        </header>

        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
