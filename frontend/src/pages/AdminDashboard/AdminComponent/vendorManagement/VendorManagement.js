import { React } from "react";
import { NavLink, Outlet, useParams, useLocation } from "react-router-dom";
import { useVendor } from "../../../../contexts/VendorContext";
import VendorList from "./VendorList";
import VendorDetail from "./VendorDetail";
import { FaChartPie, FaList, FaPlusCircle, FaUsersCog } from "react-icons/fa"; // Import the icons

const VendorManagementNav = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  return (
    <nav className="w-full bg-gray-50 p-6 shadow-md">
      <ul className="flex flex-row w-full items-center space-x-4">
        <li>
          <NavLink
            to=""
            className={`flex items-center px-4 py-2 rounded text-gray-700 text-lg ${
              isActive("") ? "bg-blue-500 text-white" : ""
            }`}
          >
            <FaChartPie className="mr-2" /> {/* Chart Pie icon */}
            Overview
          </NavLink>
        </li>
        <li>
          <NavLink
            to="vendors/active"
            className={`flex items-center px-4 py-2 rounded text-gray-700 text-lg ${
              isActive("/vendors/active") ? "bg-blue-500 text-white" : ""
            }`}
          >
            <FaUsersCog className="mr-2" /> {/* Users Cog icon */}
            Active Vendors
          </NavLink>
        </li>
        <li>
          <NavLink
            to="vendors"
            className={`flex items-center px-4 py-2 rounded text-gray-700 text-lg ${
              isActive("/vendors") &&
              !isActive("/vendors/active") &&
              !isActive("/vendors/inactive")
                ? "bg-blue-500 text-white"
                : ""
            }`}
          >
            <FaList className="mr-2" /> {/* List icon */}
            All Vendors
          </NavLink>
        </li>
        <li>
          <NavLink
            to="vendors/inactive"
            className={`flex items-center px-4 py-2 rounded text-gray-700 text-lg ${
              isActive("vendors/inactive") ? "bg-blue-500 text-white" : ""
            }`}
          >
            <FaUsersCog className="mr-2" />
            Inactive Vendors
          </NavLink>
        </li>
        <li>
          <NavLink
            to="add-vendor"
            className={`flex items-center px-4 py-2 rounded text-gray-700 text-lg ${
              isActive("add-vendor") ? "bg-blue-500 text-white" : ""
            }`}
          >
            <FaPlusCircle className="mr-2" /> {/* Plus icon */}
            Add New Vendor
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

const VendorManagement = () => {
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Vendor Management</h2>
      <VendorManagementNav />
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
};

export default VendorManagement;
