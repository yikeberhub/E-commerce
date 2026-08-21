import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaPhoneAlt } from "react-icons/fa";
import Logo from "./header component/Logo";
import logo from "../assets/icons/logo.svg";
import Search from "./header component/Search";
import RightContent from "./header component/RightContent";
import Drawer from "../common/Drawer";
import { ProductContext } from "../contexts/ProductContext";
import { useAuth } from "../contexts/AuthContext";
import VendorSelect from "./select components/VendorSelect";
import PagesSelect from "./select components/PagesSelect";
import CategoriesSelect from "./select components/CategoriesSelect";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/products" },
  { label: "Categories", to: "/categories" },
  { label: "Vendors", to: "/vendors" },
  { label: "Wishlist", to: "/wishlist" },
  { label: "Contact", to: "/contact" },
  { label: "About Us", to: "/about" },
];

const Navigation = () => {
  const { fetchCategories } = useContext(ProductContext);
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="bg-white shadow-sm sticky top-0 z-30">
      {/* Desktop-only utility bar */}
      <div className="hidden lg:block border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-xs text-slate-500 py-1.5">
          <div className="flex gap-4">
            <Link to="/about" className="hover:text-primary-600 transition">
              About Us
            </Link>
            <Link
              to="/user-dashboard"
              className="hover:text-primary-600 transition"
            >
              My Account
            </Link>
            <Link
              to="/wishlist"
              className="hover:text-primary-600 transition"
            >
              Wishlist
            </Link>
          </div>
          <p className="font-medium text-primary-600">
            Today is 25% off on all products!
          </p>
          <a
            href="tel:+251946472687"
            className="flex items-center gap-1.5 hover:text-primary-600 transition"
          >
            <FaPhoneAlt className="text-[10px]" /> +251 94 647 2687
          </a>
        </div>
      </div>

      {/* Main row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="lg:hidden text-slate-600 text-xl p-1 shrink-0"
          aria-label="Open menu"
        >
          <FaBars />
        </button>

        <Link to="/" className="shrink-0">
          <Logo logo={logo} />
        </Link>

        <div className="hidden sm:block flex-1">
          <Search />
        </div>

        <div className="ml-auto shrink-0">
          <RightContent />
        </div>
      </div>

      {/* Mobile search row */}
      <div className="sm:hidden px-4 pb-3">
        <Search />
      </div>

      {/* Desktop secondary nav */}
      <div className="hidden lg:block border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-6">
          <CategoriesSelect />
          {NAV_LINKS.filter((l) => l.label !== "Wishlist" && l.label !== "About Us").map(
            (link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-slate-600 hover:text-primary-600 transition"
              >
                {link.label}
              </Link>
            )
          )}
          <VendorSelect />
          <PagesSelect />
        </div>
      </div>

      {/* Mobile drawer */}
      <Drawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title="Menu"
        position="left"
      >
        <nav className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600 rounded-lg px-3 py-2.5 transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <hr className="my-4 border-slate-100" />

        {user ? (
          <div className="flex flex-col gap-1">
            <Link
              to="/user-dashboard"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600 rounded-lg px-3 py-2.5 transition"
            >
              My Account
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="text-left text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg px-3 py-2.5 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="block text-center text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-3 py-2.5 transition"
          >
            Login
          </Link>
        )}
      </Drawer>
    </div>
  );
};

export default Navigation;
