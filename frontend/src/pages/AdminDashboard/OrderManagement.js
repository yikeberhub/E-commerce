// OrderManagement.js
import React from "react";

const OrderManagement = ({ orders }) => {
  return (
    <section className="bg-white shadow-md p-4 rounded-lg mb-6">
      <h2 className="font-semibold text-lg">Order Management</h2>
      <table className="min-w-full mt-2">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Order ID</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Total</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b">
              <td className="p-2">{order.id}</td>
              <td className="p-2">{order.status}</td>
              <td className="p-2">${order.total}</td>
              <td className="p-2">
                <button className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">
                  Ship
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default OrderManagement;
