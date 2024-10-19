// NavigationWrapper.js
import React from "react";
import { useLocation } from "react-router-dom";
import Navigation from "../components/Navigation";
const NavigationWrapper = () => {
  const location = useLocation();
  const isAdminDashboard = location.pathname.startsWith("/admin-dashboard");
  const isVendorDashboard = location.pathname.startsWith("/vendor-dashboard");

  return !isAdminDashboard && !isVendorDashboard ? <Navigation /> : null;
};

export default NavigationWrapper;
