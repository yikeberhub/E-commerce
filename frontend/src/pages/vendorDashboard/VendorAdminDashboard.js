// VendorAdminDashboard.js
import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./VendorDashboard.css";

const VendorAdminDashboard = () => {
  return (
    <div className="vendor-dashboard">
      <nav className="sidebar">
        <h2 className="sidebar-title">Vendor Dashboard</h2>
        <ul className="sidebar-menu">
          <li>
            <Link to="products" className="sidebar-item">
              Manage Products
            </Link>
          </li>
          <li>
            <Link to="orders" className="sidebar-item">
              Manage Orders
            </Link>
          </li>
          <li>
            <Link to="customers" className="sidebar-item">
              Manage Customers
            </Link>
          </li>
        </ul>
      </nav>
      <div className="main-content">
        <h1 className="main-title">Welcome to the Vendor Dashboard</h1>
        <Outlet />
      </div>
    </div>
  );
};

export default VendorAdminDashboard;
