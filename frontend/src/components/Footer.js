import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import logo from "../assets/icons/logo.svg";

const SHOP_LINKS = [
  { label: "Home", to: "/" },
  { label: "All Products", to: "/products" },
  { label: "Categories", to: "/categories" },
  { label: "Vendors", to: "/vendors" },
];

const COMPANY_LINKS = [
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
];

const FooterColumn = ({ title, children }) => (
  <div>
    <h3 className="font-semibold text-sm uppercase tracking-wide text-slate-400 mb-4">
      {title}
    </h3>
    {children}
  </div>
);

const Footer = () => {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-3">
            <img src={logo} alt="logo" className="w-8 h-8" />
            <span className="text-xl font-semibold text-white">ጣና ገበያ</span>
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed">
            A multi-vendor marketplace connecting local shops with shoppers
            across Ethiopia.
          </p>
        </div>

        <FooterColumn title="Shop">
          <ul className="space-y-2 text-sm">
            {SHOP_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-primary-400 transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterColumn>

        <FooterColumn title="Company">
          <ul className="space-y-2 text-sm">
            {COMPANY_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-primary-400 transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterColumn>

        <FooterColumn title="Contact">
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-primary-400 shrink-0" />
              <a href="mailto:yikeber50@gmail.com" className="hover:text-primary-400 transition-colors">
                yikeber50@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-primary-400 shrink-0" />
              <a href="tel:+251946472687" className="hover:text-primary-400 transition-colors">
                +251 94 647 2687
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-primary-400 shrink-0" />
              <span>Bahir Dar, Ethiopia</span>
            </li>
          </ul>
        </FooterColumn>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-5 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} ጣና ገበያ. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
