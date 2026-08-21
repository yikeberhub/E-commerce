import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrderComponent from "./OrderComponent";
import { RowSkeleton } from "../../../../common/Skeleton";
import EmptyState from "../../../../common/EmptyState";

const API_URL = process.env.REACT_APP_API_URL;

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    const token = localStorage.getItem("access");

    try {
      const response = await fetch(`${API_URL}/orders/${id}/`, {
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

  const handleNavigate = () => {
    if (!order.payment) return;
    const transactionId = order.payment.transaction_id;
    localStorage.setItem("transaction_ids", transactionId);
    navigate(`/checkout/summary?order_id=${order.id}`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-card p-4 sm:p-5">
        <RowSkeleton count={3} />
      </div>
    );
  }

  if (error || !order || !order.items) {
    return (
      <div className="bg-white rounded-xl shadow-card p-4 sm:p-5">
        <EmptyState title="Order not found" description={error} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-card p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-bold text-slate-900">
          Order #{order.id}
        </h2>
        {order.payment && (
          <button
            className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg py-2 px-4 transition"
            onClick={handleNavigate}
          >
            Go to checkout
          </button>
        )}
      </div>

      <OrderComponent order={order} />
    </div>
  );
};

export default OrderDetail;
