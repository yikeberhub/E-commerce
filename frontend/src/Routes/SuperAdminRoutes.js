import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";
import AdminStatistics from "../pages/AdminDashboard/components/AdminStatistics";
import AdminAnalytics from "../pages/AdminDashboard/components/AdminAnalytics";
import AdminVendorManagement from "../pages/AdminDashboard/components/AdminVendorManagement";
import AdminVendorDetail from "../pages/AdminDashboard/components/AdminVendorDetail";
import AdminUserManagement from "../pages/AdminDashboard/components/AdminUserManagement";
import AdminUserDetail from "../pages/AdminDashboard/components/AdminUserDetail";
import AdminProductManagement from "../pages/AdminDashboard/components/AdminProductManagement";
import AdminOrderManagement from "../pages/AdminDashboard/components/AdminOrderManagement";
import AdminOrderDetail from "../pages/AdminDashboard/components/AdminOrderDetail";
import AdminPayments from "../pages/AdminDashboard/components/AdminPayments";
import AdminPaymentDetail from "../pages/AdminDashboard/components/AdminPaymentDetail";
import AdminPayouts from "../pages/AdminDashboard/components/AdminPayouts";
import AdminCategories from "../pages/AdminDashboard/components/AdminCategories";
import AdminPromotions from "../pages/AdminDashboard/components/AdminPromotions";
import AdminReviews from "../pages/AdminDashboard/components/AdminReviews";
import AdminContact from "../pages/AdminDashboard/components/AdminContact";
import AdminSettings from "../pages/AdminDashboard/components/AdminSettings";
import ProtectedRoute from "./ProtectedRoute";

const SuperAdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<ProtectedRoute element={<AdminDashboard />} role="admin" />}
      >
        <Route index element={<Navigate to="statistics" replace />} />
        <Route path="statistics" element={<AdminStatistics />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="vendors" element={<AdminVendorManagement />} />
        <Route path="vendors/:id" element={<AdminVendorDetail />} />
        <Route path="users" element={<AdminUserManagement />} />
        <Route path="users/:id" element={<AdminUserDetail />} />
        <Route path="products" element={<AdminProductManagement />} />
        <Route path="orders" element={<AdminOrderManagement />} />
        <Route path="orders/:id" element={<AdminOrderDetail />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="payments/:id" element={<AdminPaymentDetail />} />
        <Route path="payouts" element={<AdminPayouts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="promotions" element={<AdminPromotions />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="contact" element={<AdminContact />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
};

export default SuperAdminRoutes;
