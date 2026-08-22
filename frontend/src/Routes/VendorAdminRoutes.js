import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import VendorAdminDashboard from "../pages/vendorDashboard/VendorAdminDashboard";
import VendorCustomerManagement from "../pages/vendorDashboard/components/VendorCustomerManagement";
import VendorOrderManagement from "../pages/vendorDashboard/components/VendorOrderManagement";
import VendorProductManagement from "../pages/vendorDashboard/components/VendorProductManagement";
import ProtectedRoute from "./ProtectedRoute";

const VendorRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<ProtectedRoute element={<VendorAdminDashboard />} role="vendor" />}
      >
        <Route index element={<Navigate to="products" replace />} />
        <Route path="products" element={<VendorProductManagement />} />
        <Route path="orders" element={<VendorOrderManagement />} />
        <Route path="customers" element={<VendorCustomerManagement />} />
      </Route>
    </Routes>
  );
};

export default VendorRoutes;
