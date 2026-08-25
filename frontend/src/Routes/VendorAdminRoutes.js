import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import VendorAdminDashboard from "../pages/vendorDashboard/VendorAdminDashboard";
import VendorCustomerManagement from "../pages/vendorDashboard/components/VendorCustomerManagement";
import VendorOrderManagement from "../pages/vendorDashboard/components/VendorOrderManagement";
import VendorProductManagement from "../pages/vendorDashboard/components/VendorProductManagement";
import VendorFeedback from "../pages/vendorDashboard/components/VendorFeedback";
import VendorChat from "../pages/vendorDashboard/components/VendorChat";
import VendorPayments from "../pages/vendorDashboard/components/VendorPayments";
import VendorStatistics from "../pages/vendorDashboard/components/VendorStatistics";
import VendorPromotions from "../pages/vendorDashboard/components/VendorPromotions";
import VendorProfile from "../pages/vendorDashboard/components/VendorProfile";
import ProtectedRoute from "./ProtectedRoute";

const VendorRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<ProtectedRoute element={<VendorAdminDashboard />} role="vendor" />}
      >
        <Route index element={<Navigate to="statistics" replace />} />
        <Route path="statistics" element={<VendorStatistics />} />
        <Route path="products" element={<VendorProductManagement />} />
        <Route path="orders" element={<VendorOrderManagement />} />
        <Route path="customers" element={<VendorCustomerManagement />} />
        <Route path="feedback" element={<VendorFeedback />} />
        <Route path="chats" element={<VendorChat />} />
        <Route path="payments" element={<VendorPayments />} />
        <Route path="promotions" element={<VendorPromotions />} />
        <Route path="profile" element={<VendorProfile />} />
      </Route>
    </Routes>
  );
};

export default VendorRoutes;
