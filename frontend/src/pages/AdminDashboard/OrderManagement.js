import React, { useState, useEffect } from "react";
import {
  FaListAlt,
  FaPlusCircle,
  FaFilter,
  FaSearch,
  FaFileInvoice,
  FaUndo,
  FaRegEdit,
} from "react-icons/fa"; // Import icons

import OrderList from "./AdminComponent/orderManagement/OrderList";
import OrderFilter from "./AdminComponent/orderManagement/OrderFilter";
import OrderDetailAdmin from "./AdminComponent/orderManagement/OrderDetailAdmin";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeSection, setActiveSection] = useState("orders");

  useEffect(() => {
    const getOrders = async () => {
      const data = await fetchOrders();
      setOrders(data);
      setFilteredOrders(data);
      setLoading(false);
    };

    getOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("access");
    try {
      const response = await fetch("http://localhost:8000/orders/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  };

  const handleFilterChange = (filter) => {
    let updatedOrders = [...orders];

    // Filter by order ID
    if (filter.orderId) {
      updatedOrders = updatedOrders.filter(
        (order) => order.id.toString() === filter.orderId
      );
    }

    // Filter by status
    if (filter.status) {
      updatedOrders = updatedOrders.filter(
        (order) => order.status === filter.status
      );
    }

    // Filter by user email
    if (filter.email) {
      updatedOrders = updatedOrders.filter((order) =>
        order.user?.email?.includes(filter.email)
      );
    }

    // Filter by user address
    if (filter.address) {
      updatedOrders = updatedOrders.filter(
        (order) =>
          order.address?.kebele?.includes(filter.address) ||
          order.address?.city?.includes(filter.address) ||
          order.address?.region?.includes(filter.address) ||
          order.address?.full_name?.includes(filter.address) ||
          order.address?.phone_number?.includes(filter.address) ||
          order.address?.postal_code?.includes(filter.address)
      );
    }

    setFilteredOrders(updatedOrders);
  };

  const handleActiveSection = (section) => {
    setSelectedOrder(null);
    setActiveSection(section);
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setActiveSection("details");
  };

  const handleCloseDetail = () => {
    setSelectedOrder(null);
    setActiveSection("orders");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen">
      {/* Horizontal Navigation */}
      <nav className="flex justify-between items-center p-4 bg-white shadow-md rounded-lg mb-4">
        <h2 className="text-lg font-semibold">Order Management</h2>
        <ul className="flex space-x-4">
          <li>
            <button
              onClick={() => handleActiveSection("orders")}
              className="flex items-center text-gray-700 hover:text-green-600 transition-colors duration-200"
            >
              <FaListAlt className="mr-2" />
              View Orders
            </button>
          </li>
          <li>
            <button
              onClick={() => handleActiveSection("create")}
              className="flex items-center text-gray-700 hover:text-green-600 transition-colors duration-200"
            >
              <FaPlusCircle className="mr-2" />
              Create Order
            </button>
          </li>
          <li>
            <button
              onClick={() => handleActiveSection("filter")}
              className="flex items-center text-gray-700 hover:text-yellow-600 transition-colors duration-200"
            >
              <FaFilter className="mr-2" />
              Filter Orders
            </button>
          </li>

          <li>
            <button
              onClick={() => handleActiveSection("invoices")}
              className="flex items-center text-gray-700 hover:text-purple-600 transition-colors duration-200"
            >
              <FaFileInvoice className="mr-2" />
              Print Invoices
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        {activeSection === "orders" && !selectedOrder && (
          <OrderList orders={orders} onSelectOrder={handleSelectOrder} />
        )}
        {activeSection === "details" && selectedOrder && (
          <OrderDetailAdmin order={selectedOrder} onClose={handleCloseDetail} />
        )}
        {activeSection === "filter" && !selectedOrder && (
          <OrderFilter
            filteredOrder={filteredOrders}
            onFilterChange={handleFilterChange}
            onSelectOrder={handleSelectOrder}
          />
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
