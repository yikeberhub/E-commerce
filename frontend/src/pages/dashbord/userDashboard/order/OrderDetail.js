import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    const token = localStorage.getItem("access");
    console.log("token", token);

    try {
      const response = await fetch(`http://localhost:8000/orders/${id}/`, {
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
      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!order || !order.items) {
    return <div>No order details available.</div>;
  }

  const calculateTotal = (price, quantity) => price * quantity;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        Order Details for Order ID: {id}
      </h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Image</th>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Price</th>
            <th className="py-2 px-4 border-b">Quantity</th>
            <th className="py-2 px-4 border-b">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">
                <img
                  src={item.product.image}
                  alt={item.title}
                  className="w-20"
                />
              </td>
              <td className="py-2 px-4 border-b">{item.product.title}</td>
              <td className="py-2 px-4 border-b">${item.product.price}</td>
              <td className="py-2 px-4 border-b">{item.quantity}</td>
              <td className="py-2 px-4 border-b">
                ${calculateTotal(item.product.price, item.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderDetail;
