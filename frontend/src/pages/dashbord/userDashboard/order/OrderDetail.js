import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiXCircle } from "react-icons/fi";
import OrderComponent from "./OrderComponent";
import { RowSkeleton } from "../../../../common/Skeleton";
import EmptyState from "../../../../common/EmptyState";
import { useAuth } from "../../../../contexts/AuthContext";

const API_URL = process.env.REACT_APP_API_URL;

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-600",
  payment_processing: "bg-amber-50 text-amber-600",
  payment_failed: "bg-red-50 text-red-600",
  processing: "bg-primary-50 text-primary-600",
  shipped: "bg-primary-50 text-primary-600",
  delivered: "bg-emerald-50 text-emerald-600",
  completed: "bg-emerald-50 text-emerald-600",
  canceled: "bg-slate-100 text-slate-500",
  returned: "bg-slate-100 text-slate-500",
  refunded: "bg-slate-100 text-slate-500",
};

const CANCELABLE_STATUSES = new Set(["pending", "payment_processing", "processing"]);

const OrderDetail = () => {
  const { id } = useParams();
  const { authTokens } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/orders/${id}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
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

  const handleCancelOrder = async () => {
    setCancelError("");
    setCanceling(true);
    try {
      const response = await fetch(`${API_URL}/orders/cancel/${order.id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.detail || "Failed to cancel order.");
      }
      setOrder((prev) => ({ ...prev, status: "canceled" }));
      setConfirmingCancel(false);
    } catch (err) {
      setCancelError(err.message);
    } finally {
      setCanceling(false);
    }
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
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-900">
            Order #{order.id}
          </h2>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
              STATUS_STYLES[order.status] || "bg-slate-100 text-slate-500"
            }`}
          >
            {order.status?.replace(/_/g, " ")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {CANCELABLE_STATUSES.has(order.status) && (
            <button
              type="button"
              onClick={() => setConfirmingCancel(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 rounded-lg py-2 px-4 transition"
            >
              <FiXCircle className="text-sm" /> Cancel Order
            </button>
          )}
          {order.payment && (
            <button
              className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg py-2 px-4 transition"
              onClick={handleNavigate}
            >
              Go to checkout
            </button>
          )}
        </div>
      </div>

      {cancelError && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-4">
          {cancelError}
        </p>
      )}

      {confirmingCancel && (
        <div className="flex items-center justify-between gap-3 bg-red-50 rounded-lg px-3 py-2.5 mb-4">
          <p className="text-sm text-red-600">
            Cancel this order? This can't be undone.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setConfirmingCancel(false)}
              className="text-sm font-medium text-slate-500 hover:text-slate-700 px-2 py-1"
            >
              Keep order
            </button>
            <button
              type="button"
              disabled={canceling}
              onClick={handleCancelOrder}
              className="text-sm font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 px-3 py-1.5 rounded-lg transition"
            >
              {canceling ? "Canceling..." : "Yes, cancel"}
            </button>
          </div>
        </div>
      )}

      <OrderComponent order={order} />
    </div>
  );
};

export default OrderDetail;
