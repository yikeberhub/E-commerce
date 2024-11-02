// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProductProvider } from "./contexts/ProductContext";
import { CartProvider } from "./contexts/cartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { VendorProvider } from "./contexts/VendorContext";
import NavigationWrapper from "./utilities/NavigationWrapper";
import { BreadcrumbProvider } from "./contexts/BreadCrumbContext";
import Footer from "./components/Footer";
import UserDashboardRoutes from "./Routes/UserDashboardRoutes";
import VendorAdminRoutes from "./Routes/VendorAdminRoutes";
import SuperAdminRoutes from "./Routes/SuperAdminRoutes";
import PageRoutes from "./Routes/PageRoutes";

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
                  <Routes>
                    <Route path="/*" element={<PageRoutes />} />
                    <Route
                      path="/user-dashboard/*"
                      element={<UserDashboardRoutes />}
                    />
                    <Route
                      path="/vendor-dashboard/*"
                      element={<VendorAdminRoutes />}
                    />
                    <Route
                      path="/admin-dashboard/*"
                      element={<SuperAdminRoutes />}
                    />
                  </Routes>
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
