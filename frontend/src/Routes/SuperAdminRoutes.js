import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";
import OverviewPanel from "../pages/AdminDashboard/OverviewPanel";
import OrderManagement from "../pages/AdminDashboard/OrderManagement";
import ProductManagement from "../pages/AdminDashboard/ProductManagement";
import CustomerManagement from "../pages/AdminDashboard/CustomerManagement";
import UserList from "../pages/AdminDashboard/AdminComponent/UserList";
import EditUser from "../pages/AdminDashboard/AdminComponent/EditUser";
import AddUser from "../pages/AdminDashboard/AdminComponent/AddUser";
import UserDetail from "../pages/AdminDashboard/AdminComponent/UserDetail";
import FinancialOverview from "../pages/AdminDashboard/FinancialOverview";
import SupportResources from "../pages/AdminDashboard/SupportResources";

const SuperAdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />}>
        <Route index element={<OverviewPanel />} />
        <Route path="order-management" element={<OrderManagement />} />
        <Route path="product-management" element={<ProductManagement />} />
        <Route path="customer-management/">
          <Route index element={<UserList />} />
          <Route path="add-user" element={<AddUser />} />
          <Route path="edit-user/:id" element={<EditUser />} />
          <Route path="user-detail/:id" element={<UserDetail />} />
        </Route>
        <Route path="financial-overview" element={<FinancialOverview />} />
        <Route path="support-resources" element={<SupportResources />} />
      </Route>
    </Routes>
  );
};

export default SuperAdminRoutes;
