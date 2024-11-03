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
import VendorManagement from "../pages/AdminDashboard/AdminComponent/vendorManagement/VendorManagement";
import EditVendor from "../pages/AdminDashboard/AdminComponent/vendorManagement/EditVendor";
import AddVendor from "../pages/AdminDashboard/AdminComponent/vendorManagement/AddVendor";
import VendorList from "../pages/AdminDashboard/AdminComponent/vendorManagement/VendorList";
import VendorDetail from "../pages/AdminDashboard/AdminComponent/vendorManagement/VendorDetail";
import VendorReview from "../pages/AdminDashboard/AdminComponent/vendorManagement/VendorOverview";
import VendorOverview from "../pages/AdminDashboard/AdminComponent/vendorManagement/VendorOverview";

const SuperAdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />}>
        <Route index element={<OverviewPanel />} />
        <Route path="order-management" element={<OrderManagement />} />
        <Route path="product-management" element={<ProductManagement />} />
        <Route path="vendor-management" element={<VendorManagement />}>
          <Route index element={<VendorOverview />} />
          <Route path="vendors" element={<VendorList />} />
          <Route path="vendors/:status/" element={<VendorList />} />
          <Route path="add-vendor" element={<AddVendor />} />
          <Route path="edit-vendor/:id" element={<EditVendor />} />
          <Route path="vendors/detail/:id" element={<VendorDetail />} />
        </Route>
        <Route path="customer-management">
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
