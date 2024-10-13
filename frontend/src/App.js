// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";
import ProductCategory from "./pages/ProductCategory";
import Checkout from "./pages/Checkout";
import SearchProduct from "./pages/SearchProduct";
import Cart from "./pages/Cart";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import PageNotFound from "./pages/PageNotFound";
import Wishlist from "./pages/Wishlist";
import UserDashboard from "./pages/dashbord/userDashboard/UserDashboard";
import OrderDetail from "./pages/dashbord/userDashboard/order/OrderDetail";
import UserProfile from "./pages/dashbord/userDashboard/UserProfile";
import Address from "./pages/dashbord/userDashboard/address/Address";
import AccountDetail from "./pages/dashbord/userDashboard/AccountDetail";
import Orders from "./pages/dashbord/userDashboard/order/Orders";
import PaymentConfirmation from "./pages/dashbord/userDashboard/order/PaymentDetail";
import Navigation from "./components/Navigation"; // Assuming you have a Navigation component
import Footer from "./components/Footer"; // Assuming you have a Footer component

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProductProvider } from "./contexts/ProductContext";
import { CartProvider } from "./contexts/cartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import PaymentDetail from "./pages/dashbord/userDashboard/order/PaymentDetail";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <WishlistProvider>
              <Navigation />
              <main>
                <Routes>
                  <Route path="" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route
                    path="/product-category"
                    element={<ProductCategory />}
                  />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/cart/:id/checkout" element={<Checkout />} />

                  <Route path="/dashboard/" element={<UserDashboard />}>
                    <Route index element={<UserProfile />} />
                    <Route path="profile" element={<UserProfile />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="address" element={<Address />} />
                    <Route path="account-detail" element={<AccountDetail />} />
                    <Route path="orders/:id" element={<OrderDetail />} />
                  </Route>
                  <Route
                    path="/admin-dashboard/"
                    element={<AdminDashboard />}
                  ></Route>

                  <Route path="/payment/confirm" element={<PaymentDetail />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/checkout/:orderId" element={<Checkout />} />
                  <Route path="/search-product" element={<SearchProduct />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact-us" element={<ContactUs />} />
                  <Route path="*" element={<PageNotFound />} />
                </Routes>
              </main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
