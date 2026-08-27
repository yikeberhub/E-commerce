import React, { useEffect, useState, useCallback } from "react";
import { NavLink, Link, Outlet } from "react-router-dom";
import {
  FiBarChart2,
  FiBox,
  FiShoppingBag,
  FiUsers,
  FiMessageSquare,
  FiMessageCircle,
  FiCreditCard,
  FiSettings,
  FiTag,
  FiExternalLink,
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import NotificationBell from "../../common/NotificationBell";

const API_URL = process.env.REACT_APP_API_URL;

const navItems = [
  { to: "statistics", label: "Statistics", icon: FiBarChart2 },
  { to: "products", label: "Products", icon: FiBox },
  { to: "orders", label: "Orders", icon: FiShoppingBag },
  { to: "customers", label: "Customers", icon: FiUsers },
  { to: "feedback", label: "Feedback", icon: FiMessageSquare },
  { to: "chats", label: "Chats", icon: FiMessageCircle },
  { to: "payments", label: "Payments", icon: FiCreditCard },
  { to: "promotions", label: "Promotions", icon: FiTag },
  { to: "profile", label: "Shop Settings", icon: FiSettings },
];

const VendorAdminDashboard = () => {
  const { authTokens } = useAuth();
  const [vendor, setVendor] = useState(null);

  const fetchVendor = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/vendors/me/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      if (response.ok) {
        setVendor(await response.json());
      }
    } catch (error) {
      console.error("Failed to fetch vendor profile:", error);
    }
  }, [authTokens?.access]);

  useEffect(() => {
    fetchVendor();
  }, [fetchVendor]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-slate-900">Vendor Dashboard</h1>
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary-600 transition"
          >
            <FiExternalLink className="text-sm" /> View Public Site
          </Link>
          <NotificationBell />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-xl border border-slate-100 shadow-card p-4 flex flex-col items-center text-center mb-4">
            <img
              src={vendor?.logo}
              alt={vendor?.title || "vendor"}
              className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 bg-slate-50"
            />
            <p className="font-semibold text-slate-800 mt-3 truncate w-full">
              {vendor?.title || "Vendor Dashboard"}
            </p>
            {vendor && !vendor.is_active && (
              <span className="text-[11px] font-medium text-amber-600 bg-amber-50 rounded-full px-2 py-0.5 mt-2">
                {vendor.subscription_status === "expired" ? "Subscription expired" : "Pending approval"}
              </span>
            )}
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
          <Outlet context={{ vendor, refetchVendor: fetchVendor }} />
        </div>
      </div>
    </div>
  );
};

export default VendorAdminDashboard;
