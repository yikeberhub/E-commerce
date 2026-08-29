// FooterWrapper.js
import React from "react";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";

const FooterWrapper = () => {
  const location = useLocation();
  const isAdminDashboard = location.pathname.startsWith("/admin-dashboard");
  const isVendorDashboard = location.pathname.startsWith("/vendor-dashboard");

  return !isAdminDashboard && !isVendorDashboard ? <Footer /> : null;
};

export default FooterWrapper;
