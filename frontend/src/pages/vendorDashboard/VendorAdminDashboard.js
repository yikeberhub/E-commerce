import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FiBox, FiShoppingBag, FiUsers } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";

const API_URL = process.env.REACT_APP_API_URL;

const navItems = [
  { to: "products", label: "Products", icon: FiBox },
  { to: "orders", label: "Orders", icon: FiShoppingBag },
  { to: "customers", label: "Customers", icon: FiUsers },
];

const VendorAdminDashboard = () => {
  const { authTokens } = useAuth();
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    const fetchVendor = async () => {
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
    };
    fetchVendor();
  }, [authTokens?.access]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
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
                Pending approval
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
          <Outlet context={{ vendor }} />
        </div>
      </div>
    </div>
  );
};

export default VendorAdminDashboard;
