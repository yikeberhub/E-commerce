import React, { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  FiUser,
  FiBarChart2,
  FiShoppingBag,
  FiMapPin,
  FiSettings,
} from "react-icons/fi";

import { useAuth } from "../../../contexts/AuthContext";
import { useBreadcrumb } from "../../../contexts/BreadCrumbContext";
import Breadcrumb from "../../../components/BreadCrumb";
import AccountIcon from "../../../assets/icons/user.svg";

const navItems = [
  { to: "profile", label: "Profile", icon: FiUser },
  { to: "order-chart", label: "Order Chart", icon: FiBarChart2 },
  { to: "orders", label: "Orders", icon: FiShoppingBag },
  { to: "address", label: "My Address", icon: FiMapPin },
  { to: "account-detail", label: "Account Detail", icon: FiSettings },
];

function UserDashboard() {
  const { user } = useAuth();
  const { addBreadcrumb, clearBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    clearBreadcrumbs();
    addBreadcrumb({ label: "Home", path: "/" });
    addBreadcrumb({ label: "Dashboard", path: "/user-dashboard" });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="bg-white rounded-xl shadow-card px-4 py-3 mb-4">
        <Breadcrumb />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-xl border border-slate-100 shadow-card p-4 flex flex-col items-center text-center mb-4">
            <img
              src={user?.profile_image || AccountIcon}
              alt="profile"
              className="w-16 h-16 rounded-full object-cover border-2 border-slate-100"
            />
            <p className="font-semibold text-slate-800 mt-3 truncate w-full">
              {user?.username}
            </p>
            <p className="text-xs text-slate-500 truncate w-full">
              {user?.email}
            </p>
          </div>

          <nav className="bg-white rounded-xl border border-slate-100 shadow-card p-2 flex flex-col gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 text-sm font-medium px-3 py-2.5 rounded-lg transition ${
                    isActive
                      ? "bg-primary-600 text-white"
                      : "text-slate-600 hover:bg-slate-50 hover:text-primary-600"
                  }`
                }
              >
                <Icon className="text-base shrink-0" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
