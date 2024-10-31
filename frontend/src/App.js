// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";
// import ProductCategory from "./pages/ProductCategories";
import Checkout from "./pages/Checkout";
import SearchProduct from "./pages/SearchProduct";
import Cart from "./pages/Cart";
import AboutUs from "./pages/AboutUs";
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
import Footer from "./components/Footer"; // Assuming you have a Footer component

import OverviewPanel from "./pages/AdminDashboard/OverviewPanel";
import OrderManagement from "./pages/AdminDashboard/OrderManagement";
import ProductManagement from "./pages/AdminDashboard/ProductManagement";
import CustomerManagement from "./pages/AdminDashboard/CustomerManagement";
import FinancialOverview from "./pages/AdminDashboard/FinancialOverview";
import SupportResources from "./pages/AdminDashboard/SupportResources";

import VendorAdminDashboard from "./pages/vendorDashboard/VendorAdminDashboard";

import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import UserList from "./pages/AdminDashboard/AdminComponent/UserList";
import EditUser from "./pages/AdminDashboard/AdminComponent/EditUser";
import AddUser from "./pages/AdminDashboard/AdminComponent/AddUser";
import UserDetail from "./pages/AdminDashboard/AdminComponent/UserDetail";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProductProvider } from "./contexts/ProductContext";
import { BreadcrumbProvider } from "./contexts/BreadCrumbContext";
import { CartProvider } from "./contexts/cartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import PaymentDetail from "./pages/dashbord/userDashboard/order/PaymentDetail";

import NavigationWrapper from "./utilities/NavigationWrapper";
import Categories from "./pages/Categories";
import ProductCategory from "./pages/ProductCategory";

import Vendors from "./pages/Vendors";
import VendorDetail from "./pages/VendorDetail";
import { VendorProvider } from "./contexts/VendorContext";
import OrderChart from "./pages/dashbord/userDashboard/order/OrderChart";

function App() {
  return (
    <Router>
      <AuthProvider>
        <VendorProvider>
          <ProductProvider>
            <CartProvider>
              <WishlistProvider>
                <NavigationWrapper />
                <BreadcrumbProvider>
                  <main className="">
                    <Routes>
                      <Route path="" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<SignUp />} />
                      <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                      />
                      <Route path="/categories" element={<Categories />} />
                      <Route
                        path="/categories/:id"
                        element={<ProductCategory />}
                      />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/cart/:id/checkout" element={<Checkout />} />

                      <Route path="/dashboard/" element={<UserDashboard />}>
                        <Route index element={<UserProfile />} />
                        <Route path="profile" element={<UserProfile />} />
                        <Route path="orders" element={<Orders />} />
                        <Route path="order-chart" element={<OrderChart />} />
                        <Route path="address" element={<Address />} />
                        <Route
                          path="account-detail"
                          element={<AccountDetail />}
                        />
                        <Route path="orders/:id" element={<OrderDetail />} />
                      </Route>
                      <Route
                        path="/admin-dashboard/"
                        element={<AdminDashboard />}
                      >
                        <Route index element={<OverviewPanel />} />
                        <Route
                          path="order-management"
                          element={<OrderManagement />}
                        />
                        <Route
                          path="product-management"
                          element={<ProductManagement />}
                        />

                        <Route
                          path="customer-management/"
                          element={<CustomerManagement />}
                        >
                          <Route index element={<UserList />} />{" "}
                          {/* Default route under customer management */}
                          <Route path="add-user" element={<AddUser />} />
                          <Route path="edit-user/:id" element={<EditUser />} />
                          <Route
                            path="user-detail/:id"
                            element={<UserDetail />}
                          />
                        </Route>

                        <Route
                          path="financial-overview"
                          element={<FinancialOverview />}
                        />
                        <Route
                          path="support-resources"
                          element={<SupportResources />}
                        />
                      </Route>

                      <Route
                        path="/vendor-dashboard/"
                        element={<VendorAdminDashboard />}
                      >
                        <Route index element={<OverviewPanel />} />
                        <Route
                          path="order-management"
                          element={<OrderManagement />}
                        />
                        <Route
                          path="product-management"
                          element={<ProductManagement />}
                        />
                        <Route
                          path="customer-management"
                          element={<CustomerManagement />}
                        />
                        <Route
                          path="financial-overview"
                          element={<FinancialOverview />}
                        />
                        <Route
                          path="support-resources"
                          element={<SupportResources />}
                        />
                      </Route>

                      <Route
                        path="/payment/confirm"
                        element={<PaymentDetail />}
                      />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/vendors" element={<Vendors />} />
                      <Route path="/vendors/:id" element={<VendorDetail />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/checkout/:orderId" element={<Checkout />} />
                      <Route
                        path="/search-product"
                        element={<SearchProduct />}
                      />
                      <Route path="/about" element={<AboutUs />} />
                      <Route path="/contact" element={<ContactUs />} />
                      <Route path="*" element={<PageNotFound />} />
                    </Routes>
                  </main>
                </BreadcrumbProvider>
                <Footer />
              </WishlistProvider>
            </CartProvider>
          </ProductProvider>
        </VendorProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
