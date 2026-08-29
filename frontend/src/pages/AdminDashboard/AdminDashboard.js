import React, { useState } from "react";
import { NavLink, Link, Outlet } from "react-router-dom";
import {
  FiBarChart2,
  FiTrendingUp,
  FiBriefcase,
  FiUsers,
  FiBox,
  FiShoppingBag,
  FiCreditCard,
  FiSend,
  FiTag,
  FiZap,
  FiShield,
  FiStar,
  FiMail,
  FiSettings,
  FiExternalLink,
  FiMenu,
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import NotificationBell from "../../common/NotificationBell";
import Drawer from "../../common/Drawer";

const navItems = [
  { to: "statistics", label: "Overview", icon: FiBarChart2 },
  { to: "analytics", label: "Analytics", icon: FiTrendingUp },
  { to: "vendors", label: "Vendors", icon: FiBriefcase },
  { to: "users", label: "Users", icon: FiUsers },
  { to: "products", label: "Products", icon: FiBox },
  { to: "orders", label: "Orders", icon: FiShoppingBag },
  { to: "payments", label: "Payments", icon: FiCreditCard },
  { to: "payouts", label: "Payouts", icon: FiSend },
  { to: "categories", label: "Categories", icon: FiTag },
  { to: "promotions", label: "Promotions", icon: FiZap },
  { to: "reviews", label: "Reviews", icon: FiStar },
  { to: "contact", label: "Contact Us", icon: FiMail },
  { to: "settings", label: "Settings", icon: FiSettings },
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const profileCard = (
    <div className="bg-white rounded-xl border border-slate-100 shadow-card p-4 flex flex-col items-center text-center mb-4">
      <img
        src={user?.profile_image}
        alt={user?.username || "admin"}
        className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 bg-slate-50"
      />
      <p className="font-semibold text-slate-800 mt-3 truncate w-full">
        {user?.username || "Admin"}
      </p>
      <span className="text-[11px] font-medium text-primary-600 bg-primary-50 rounded-full px-2 py-0.5 mt-2 flex items-center gap-1">
        <FiShield className="text-xs" /> Platform Admin
      </span>
    </div>
  );

  const renderNavLinks = (onLinkClick) => (
    <nav className="bg-white rounded-xl border border-slate-100 shadow-card p-2 flex flex-col gap-1">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onLinkClick}
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
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="lg:hidden text-slate-600 text-xl p-1 shrink-0"
            aria-label="Open menu"
          >
            <FiMenu />
          </button>
          <h1 className="text-lg font-bold text-slate-900">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/"
            state={{ fromDashboard: true }}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary-600 transition"
          >
            <FiExternalLink className="text-sm" /> View Public Site
          </Link>
          <NotificationBell />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="hidden lg:block lg:w-64 shrink-0">
          {profileCard}
          {renderNavLinks()}
        </aside>

        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>

      <Drawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title="Admin Dashboard"
        position="left"
      >
        {profileCard}
        {renderNavLinks(() => setMenuOpen(false))}
      </Drawer>
    </div>
  );
};

export default AdminDashboard;
