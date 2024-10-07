import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import OrderComponent from "./OrderComponent";

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
    <div>
      <div className="flex flex-row justify-between mr-6 items-center">
        <h2 className="text-2xl font-bold mb-4">
          Order Details for Order ID: {order.id}{" "}
        </h2>
        <Link to={`/checkout/${order.id}/`}>
          <button className="bg-green-600 text-white hover:bg-purple-600 rounded-md py-2 px-2">
            Go to checkout
          </button>
        </Link>
      </div>

      <OrderComponent order={order} calculateTotal={calculateTotal} />
    </div>
  );
};

export default OrderDetail;
