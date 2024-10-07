import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    const token = localStorage.getItem("access");
    console.log("token", token);

    try {
      const response = await fetch(`http://localhost:8000/orders/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!orders) {
    return <div>No order details available.</div>;
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <h1 className="text-start text-xl font-semibold font-sans  py-2 text-gray-600">
          Your Orders
        </h1>
        <table className="min-w-full bg-white border border-gray-200 ">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Order</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Paid Status</th>
              <th className="py-3 px-6 text-left">Total</th>
              <th className="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-200 hover:bg-green-300"
              >
                <td className="py-3 px-6"> {order.id}</td>
                <td className="py-3 px-6">
                  {" "}
                  {new Date(order.created_at).toLocaleString()}
                </td>
                <td className="py-3 px-6"> {order.status}</td>
                <td className="py-3 px-6">
                  {" "}
                  {order.paid ? <span>✅</span> : <span>❌</span>}
                </td>
                <td className="py-3 px-6"> {order.total_price}</td>
                <td className="py-3 px-2 ">
                  {" "}
                  <Link to={`${order.id}`}>
                    <span className="text-white bg-red-500 px-1 py-1 rounded-md">
                      View
                    </span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>{" "}
    </div>
  );
}

export default Orders;
