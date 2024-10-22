import React, { useState } from "react";

// OrderList.js
const OrderList = ({ orders, onSelectOrder }) => {
  if (!orders) return <div>There is no Order yet</div>;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-100 border border-gray-500 rounded-md">
        <thead>
          <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Order ID</th>
            <th className="py-3 px-6 text-left">User</th>
            <th className="py-3 px-6 text-left">Total Price</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Details</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6">{order.id}</td>
              <td className="py-3 px-6">{order.user.username}</td>
              <td className="py-3 px-6">${order.total_price}</td>
              <td className="py-3 px-6">{order.status}</td>
              <td className="py-3 px-6">
                <button
                  onClick={() => onSelectOrder(order)}
                  className="text-blue-500 hover:underline"
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
