// VendorRoutes.js
import React from "react";
import { Routes, Route } from "react-router-dom";

import VendorProductManagement from "./components/VendorProductManagement";
import VendorOrderManagement from "./components/VendorOrderManagement";
import VendorCustomerManagement from "./components/VendorCustomerManagement";
const VendorRoutes = () => {
  return (
    <Route>
      <Route path="products" element={<VendorProductManagement />} index />
      <Route path="orders" element={<VendorOrderManagement />} />
      <Route path="customers" element={<VendorCustomerManagement />} />
    </Route>
  );
};

export default VendorRoutes;
