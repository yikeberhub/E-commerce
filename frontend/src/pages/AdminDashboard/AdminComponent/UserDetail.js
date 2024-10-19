// UserDetail.js

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaUser,
  FaClipboardList,
  FaMoneyBillWave,
  FaHistory,
} from "react-icons/fa"; // Importing icons

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedView, setSelectedView] = useState("profile"); // Default view

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/admin_api/super-admin-dashboard/users/${id}/`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  if (loading)
    return <p className="text-center text-lg">Loading user details...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  // Function to render the selected view's content
  const renderDetails = () => {
    switch (selectedView) {
      case "profile":
        return (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
            <h2 className="text-2xl font-semibold mb-4">User Profile</h2>
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone Number:</strong> {user.phone_number}
            </p>
            <p>
              <strong>Address:</strong> {user.address || "No address available"}
            </p>
          </div>
        );
      case "orders":
        return (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
            <h2 className="text-2xl font-semibold mb-4">Orders</h2>
            {user.orders && user.orders.length > 0 ? (
              <ul className="list-disc list-inside">
                {user.orders.map((order) => (
                  <li key={order.id}>
                    <strong>Order ID:</strong> {order.id},{" "}
                    <strong>Total:</strong> ${order.total},{" "}
                    <strong>Status:</strong> {order.status}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No orders found for this user.</p>
            )}
          </div>
        );
      case "transactions":
        return (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
            <h2 className="text-2xl font-semibold mb-4">Transactions</h2>
            {user.transactions && user.transactions.length > 0 ? (
              <ul className="list-disc list-inside">
                {user.transactions.map((transaction) => (
                  <li key={transaction.id}>
                    <strong>Transaction ID:</strong> {transaction.id},{" "}
                    <strong>Amount:</strong> ${transaction.amount},{" "}
                    <strong>Date:</strong>{" "}
                    {new Date(transaction.transaction_date).toLocaleString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                No transactions found for this user.
              </p>
            )}
          </div>
        );
      case "activities":
        return (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
            <h2 className="text-2xl font-semibold mb-4">Recent Activities</h2>
            {user.activities && user.activities.length > 0 ? (
              <ul className="list-disc list-inside">
                {user.activities.map((activity, index) => (
                  <li key={index}>
                    {activity.description} on{" "}
                    {new Date(activity.date).toLocaleString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                No recent activities found for this user.
              </p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="container mx-auto p-6 flex"
      style={{
        background:
          "linear-gradient(to right, rgb(255,0, 100), rgb(20, 128, 255))", // Hot to cold gradient
        minHeight: "100vh", // Ensures the gradient covers the full height
      }}
    >
      <div className="w-1/3 border-r pr-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          User Actions
        </h1>
        <ul className="list-none">
          <li
            onClick={() => setSelectedView("profile")}
            className="cursor-pointer flex items-center hover:bg-gray-200 p-2 rounded transition text-white"
          >
            <FaUser className="mr-2 text-xl" /> Profile
          </li>
          <li
            onClick={() => setSelectedView("orders")}
            className="cursor-pointer flex items-center hover:bg-gray-200 p-2 rounded transition text-white"
          >
            <FaClipboardList className="mr-2 text-xl" /> Orders
          </li>
          <li
            onClick={() => setSelectedView("transactions")}
            className="cursor-pointer flex items-center hover:bg-gray-200 p-2 rounded transition text-white"
          >
            <FaMoneyBillWave className="mr-2 text-xl" /> Transactions
          </li>
          <li
            onClick={() => setSelectedView("activities")}
            className="cursor-pointer flex items-center hover:bg-gray-200 p-2 rounded transition text-white"
          >
            <FaHistory className="mr-2 text-xl" /> Activities
          </li>
        </ul>
      </div>

      <div className="w-2/3 pl-4">{renderDetails()}</div>
    </div>
  );
};

export default UserDetail;
