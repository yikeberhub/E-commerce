import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBox,
  FaUsers,
  FaDollarSign,
  FaHeadset,
  FaChartLine,
} from "react-icons/fa";

const AdminSidebar = ({ type }) => {
  return (
    <aside className="w-64 bg-white shadow-md p-6">
      {type === "admin" && (
        <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
      )}
      {type === "vendor" && (
        <h2 className="text-xl font-bold mb-6">Vendor Dashboard</h2>
      )}
      <ul>
        <li className="mb-4">
          <NavLink
            to="/admin-dashboard/"
            className={({ isActive }) =>
              `flex items-center text-gray-800 ${
                isActive ? "text-blue-500 font-bold" : "hover:text-blue-500"
              }`
            }
            end
          >
            <FaTachometerAlt className="mr-3" />
            Overview
          </NavLink>
        </li>
        <li className="mb-4">
          <NavLink
            to="order-management"
            className={({ isActive }) =>
              `flex items-center text-gray-800 ${
                isActive ? "text-blue-500 font-bold" : "hover:text-blue-500"
              }`
            }
          >
            <FaBox className="mr-3" />
            Order Management
          </NavLink>
        </li>
        <li className="mb-4">
          <NavLink
            to="product-management"
            className={({ isActive }) =>
              `flex items-center text-gray-800 ${
                isActive ? "text-blue-500 font-bold" : "hover:text-blue-500"
              }`
            }
          >
            <FaChartLine className="mr-3" />
            Product Management
          </NavLink>
        </li>
        <li className="mb-4">
          <NavLink
            to="customer-management"
            className={({ isActive }) =>
              `flex items-center text-gray-800 ${
                isActive ? "text-blue-500 font-bold" : "hover:text-blue-500"
              }`
            }
          >
            <FaUsers className="mr-3" />
            Customer Management
          </NavLink>
        </li>
        <li className="mb-4">
          <NavLink
            to="financial-overview"
            className={({ isActive }) =>
              `flex items-center text-gray-800 ${
                isActive ? "text-blue-500 font-bold" : "hover:text-blue-500"
              }`
            }
          >
            <FaDollarSign className="mr-3" />
            Financial Overview
          </NavLink>
        </li>
        <li className="mb-4">
          <NavLink
            to="support-resources"
            className={({ isActive }) =>
              `flex items-center text-gray-800 ${
                isActive ? "text-blue-500 font-bold" : "hover:text-blue-500"
              }`
            }
          >
            <FaHeadset className="mr-3" />
            Support
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default AdminSidebar;
