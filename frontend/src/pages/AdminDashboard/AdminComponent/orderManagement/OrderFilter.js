import React, { useState } from "react";
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
        className="mb-4 p-4 bg-gray-700 rounded shadow-md flex flex-wrap justify-between items-center space-x-2"
      >
        <h3 className="text-lg font-semibold mb-3 w-full">Filter Orders</h3>
        <input
          type="text"
          placeholder="Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="border text-gray-500 border-gray-300 rounded p-2 text-sm w-32 focus:ring focus:ring-blue-400"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-600 text-gray-500 rounded p-2 text-sm w-32 focus:ring focus:ring-blue-400"
        >
          <option value="">Status</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded p-2 text-sm w-32 focus:ring focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border border-gray-300 rounded p-2 text-sm w-32 focus:ring focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded p-2 text-sm transition duration-200 hover:bg-blue-600 w-32"
        >
          Apply Filters
        </button>
      </form>
      <OrderList orders={filteredOrder} onSelectOrder={onSelectOrder} />
    </div>
  );
};

export default OrderFilter;
