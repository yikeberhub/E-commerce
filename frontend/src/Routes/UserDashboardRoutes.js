import React from "react";
import { Routes, Route } from "react-router-dom";
import UserDashboard from "../pages/dashbord/userDashboard/UserDashboard";
import UserProfile from "../pages/dashbord/userDashboard/UserProfile";
import Orders from "../pages/dashbord/userDashboard/order/Orders";
import OrderDetail from "../pages/dashbord/userDashboard/order/OrderDetail";
import Address from "../pages/dashbord/userDashboard/address/Address";
import AccountDetail from "../pages/dashbord/userDashboard/AccountDetail";
import OrderChart from "../pages/dashbord/userDashboard/order/OrderChart";

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UserDashboard />}>
        <Route index element={<UserProfile />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="orders" element={<Orders />} />
        <Route path="order-chart" element={<OrderChart />} />
        <Route path="address" element={<Address />} />
        <Route path="account-detail" element={<AccountDetail />} />
        <Route path="orders/:id" element={<OrderDetail />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;
