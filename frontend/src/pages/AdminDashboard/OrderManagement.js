import React, { useState, useEffect } from "react";
import {
  FaListAlt,
  FaPlusCircle,
  FaFilter,
  FaSearch,
  FaFileInvoice,
  FaClipboardCheck,
  FaRegEdit,
  FaUndo,
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
      console.log("email", filter.email);
      updatedOrders = updatedOrders.filter((order) =>
        order.user?.email?.includes(filter.email)
      );
    }

    // Filter by user email
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
    <div className="flex bg-gray-500">
      {/* Sidebar Navigation */}
      <nav className="w-64  h-screen p-4">
        <h2 className="text-lg font-semibold mb-4">Order Actions</h2>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => handleActiveSection("orders")}
              className="flex items-center w-full text-left py-2 px-4 rounded hover:bg-green-400"
            >
              {" "}
              <FaListAlt className="mr-2" />
              <span>View Orders</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => handleActiveSection("create")}
              className="flex items-center w-full text-left py-2 px-4 rounded hover:bg-green-400"
            >
              <FaPlusCircle className="mr-2" /> Create Order
            </button>
          </li>
          <li>
            <button
              onClick={() => handleActiveSection("filter")}
              className="flex items-center w-full text-left py-2 px-4 rounded hover:bg-yellow-400"
            >
              <FaFilter className="mr-2" /> Filter Orders
            </button>
          </li>
          <li>
            <button
              onClick={() => handleActiveSection("search")}
              className="flex items-center w-full text-left py-2 px-4 rounded hover:bg-orange-400"
            >
              <FaSearch className="mr-2" /> Search Orders
            </button>
          </li>
          <li>
            <button
              onClick={() => handleActiveSection("invoices")}
              className="flex items-center w-full text-left py-2 px-4 rounded hover:bg-purple-400"
            >
              <FaFileInvoice className="mr-2" /> Print Invoices
            </button>
          </li>
          <li>
            <button
              onClick={() => handleActiveSection("manageReturns")}
              className="flex items-center w-full text-left py-2 px-4 rounded hover:bg-red-400"
            >
              <FaUndo className="mr-2" /> Manage Returns
            </button>
          </li>
          <li>
            <button
              onClick={() => handleActiveSection("edit")}
              className="flex items-center w-full text-left py-2 px-4 rounded hover:bg-teal-400"
            >
              <FaRegEdit className="mr-2" /> Edit Order
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Order Management</h1>
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
