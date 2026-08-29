import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Categories from "../pages/Categories";
import Cart from "../pages/Cart";
import Vendors from "../pages/Vendors";
import VendorDetail from "../pages/VendorDetail";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";
import Checkout from "../pages/Checkout";
import SearchProduct from "../pages/SearchProduct";
import AboutUs from "../pages/AboutUs";
import ContactUs from "../pages/ContactUs";
import Wishlist from "../pages/Wishlist";
import PageNotFound from "../pages/PageNotFound";
import PaymentDetail from "../pages/dashbord/userDashboard/order/PaymentDetail";
import ProductCategory from "../pages/ProductCategory";

// Admins and vendors land on their own dashboard by default (including on
// a hard refresh of "/") rather than the public storefront — they can still
// get to the storefront deliberately via the "View Public Site" button in
// their dashboard.
const RoleAwareHome = () => {
  const { user } = useAuth();
  const location = useLocation();
  const viewingPublicSite = location.state?.fromDashboard;
  if (!viewingPublicSite && user?.role === "admin") return <Navigate to="/admin-dashboard" replace />;
  if (!viewingPublicSite && user?.role === "vendor") return <Navigate to="/vendor-dashboard" replace />;
  return <Home />;
};

const PageRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RoleAwareHome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/categories/:id" element={<ProductCategory />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/vendors" element={<Vendors />} />
      <Route path="/vendors/:id" element={<VendorDetail />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/checkout/summary" element={<Checkout />} />
      <Route path="/payment/confirm" element={<PaymentDetail />} />
      <Route path="/search-product" element={<SearchProduct />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default PageRoutes;
