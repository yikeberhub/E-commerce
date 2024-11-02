import { React, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  FaUser,
  FaChartLine,
  FaShoppingCart,
  FaShippingFast,
  FaAddressCard,
} from "react-icons/fa";

import { useAuth } from "../../../contexts/AuthContext";
import { useBreadcrumb } from "../../../contexts/BreadCrumbContext";
import Breadcrumb from "../../../components/BreadCrumb";

function UserDashboard() {
  const { user, loading } = useAuth();
  const { addBreadcrumb, clearBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    clearBreadcrumbs();
    addBreadcrumb({ label: "Home", path: "/" });
    addBreadcrumb({ label: "Dashboard", path: "/dashboard" });
  }, []);
  console.log("user", user);

  if (loading) return <div className="w-44 h-14 bg-green-500">loading...</div>;

  return (
    <div className="text-gray bg-white min-h-screen">
      <div className="mx-6 my-2 py-2 flex flex-row">
        <Breadcrumb />
      </div>
      <hr className="border-gray-300 my-2" />

      <div className="grid grid-cols-6 mx-auto">
        <div className="col-span-6 sm:col-span-2 mx-auto py-2">
          <ul className="px-2 py-1 shadow-md shadow-gray-400 z-20 align-middle items-center mx-10 mt-2">
            <Link to={`profile/`}>
              <li className="w-64 bg-green-600 py-2 mr-5 text-white text-sm font-semibold text-start ps-2 rounded-md">
                <h2>
                  <FaUser className="inline mr-2" /> Profile
                </h2>
              </li>
            </Link>
            <Link to={`order-chart/`}>
              <li className="flex items-center w-64 py-2 my-2 border border-gray-300 text-gray-600 text-sm font-semibold text-start ps-2 pr-5 rounded-md">
                <FaChartLine className="w-4 h-4 inline mr-2" />
                <h2>Order Chart</h2>
              </li>
            </Link>
            <Link to={`orders/`}>
              <li className="flex items-center w-64 py-2 my-2 border border-gray-300 text-gray-600 text-sm font-semibold text-start ps-2 pr-5 rounded-md">
                <FaShoppingCart className="w-4 h-4 inline mr-2" />
                <h2>Orders</h2>
              </li>
            </Link>
            {/* <Link to={`track`}>
              <li className="flex items-center w-64 py-2 my-2 border border-gray-300 text-gray-600 text-sm font-semibold text-start ps-2 pr-5 rounded-md">
                <FaShippingFast className="w-4 h-4 inline mr-2" />
                <h2>Track your Order</h2>
              </li>
            </Link> */}
            <Link to={`address/`}>
              <li className="flex items-center w-64 py-2 my-2 border border-gray-300 text-gray-600 text-sm font-semibold text-start ps-2 pr-5 rounded-md">
                <FaAddressCard className="w-4 h-4 inline mr-2" />
                <h2>My Address</h2>
              </li>
            </Link>
            <Link to={`account-detail/`}>
              <li className="flex items-center w-64 py-2 my-2 border border-gray-300 text-gray-600 text-sm font-semibold text-start ps-2 pr-5 rounded-md">
                <FaUser className="w-4 h-4 inline mr-2" />
                <h2>Account Detail</h2>
              </li>
            </Link>
          </ul>
        </div>

        <div className="sm:col-span-4 py-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
