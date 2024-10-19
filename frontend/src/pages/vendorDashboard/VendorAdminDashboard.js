import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../AdminDashboard/AdminComponent/AdminNavbar";
import AdminSidebar from "../AdminDashboard/AdminComponent/AdminSideBar";

function VendorDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100 py-2">
      {/* <!-- Sidebar --> */}
      <AdminSidebar type="vendor" />

      {/* <!-- Main Content --> */}
      <main className="flex-1 py-2 px-6">
        <header className="bg-white shadow-md p-4 rounded-lg mb-6">
          <AdminNavbar type="vendor" />
        </header>
        <Outlet />
      </main>
    </div>
  );
}

export default VendorDashboard;
