import React, { useState } from "react";
import { FaSearch, FaEnvelope, FaHome, FaListAlt } from "react-icons/fa"; // Importing icons from react-icons
import OrderList from "./OrderList";

const OrderFilter = ({ onFilterChange, onSelectOrder, filteredOrder }) => {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    onFilterChange({ orderId, status, address });
  };

  return (
    <div>
      <form
        onSubmit={handleFilterSubmit}
        className="mb-4 p-6 bg-white rounded-lg shadow-md flex flex-wrap justify-between items-center space-y-4"
      >
        <h3 className="text-xl font-semibold mb-4 w-full text-center">
          Filter Orders
        </h3>
        <div className="flex flex-row items-baseline space-x-5 w-full">
          <div className="relative ">
            {" "}
            {/* Increased width */}
            <FaSearch className="absolute left-2 top-2 text-gray-500" />
            <input
              type="text"
              placeholder="Order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="border border-green-500 rounded-md p-2 pl-8 text-sm  focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
          </div>
          <div className="relative">
            {" "}
            {/* Increased width */}
            <FaListAlt className="absolute left-2 top-2 text-gray-500" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 text-black rounded-md p-2 pl-8 text-sm  focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            >
              <option value="">Status</option>
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="relative">
            {" "}
            {/* Increased width */}
            <FaEnvelope className="absolute left-2 top-2 text-gray-500" />
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-green-500 rounded-md p-2 pl-8 text-sm  focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
          </div>
          <div className="relative ">
            {" "}
            {/* Increased width */}
            <FaHome className="absolute left-2 top-2 text-gray-500" />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border border-green-500 rounded-md p-2 pl-8 text-sm  focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md p-2 text-sm transition duration-200 hover:bg-blue-600 w-full mt-4"
          >
            Apply Filters
          </button>
        </div>
      </form>
      <OrderList orders={filteredOrder} onSelectOrder={onSelectOrder} />
    </div>
  );
};

export default OrderFilter;
