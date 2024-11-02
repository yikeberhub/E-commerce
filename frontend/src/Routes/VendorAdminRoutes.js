import React from "react";
import { Routes, Route } from "react-router-dom";
import VendorAdminDashboard from "../pages/vendorDashboard/VendorAdminDashboard";
import VendorCustomerManagement from "../pages/vendorDashboard/components/VendorCustomerManagement";
import VendorOrderManagement from "../pages/vendorDashboard/components/VendorOrderManagement";
import VendorProductManagement from "../pages/vendorDashboard/components/VendorProductManagement";

const VendorRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<VendorAdminDashboard />} />
      <Route path="customers" element={<VendorCustomerManagement />} />
      <Route path="orders" element={<VendorOrderManagement />} />
      <Route path="products" element={<VendorProductManagement />} />
    </Routes>
  );
};

export default VendorRoutes;
