import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import ForgotPassword from "../pages/ForgotPassword";
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

const PageRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/vendors" element={<Vendors />} />
      <Route path="/vendors/:id" element={<VendorDetail />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/checkout/:orderId" element={<Checkout />} />
      <Route path="/search-product" element={<SearchProduct />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/payment/confirm" element={<PaymentDetail />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default PageRoutes;
