// CustomerManagement.js
import React from "react";
import UserList from "./AdminComponent/UserList";
import { Outlet } from "react-router-dom";
const CustomerManagement = () => {
  return (
    <section className="bg-white shadow-md p-4 rounded-lg mb-6">
      <h2 className="font-semibold text-lg">Customer Management</h2>
      <Outlet />
    </section>
  );
};

export default CustomerManagement;
