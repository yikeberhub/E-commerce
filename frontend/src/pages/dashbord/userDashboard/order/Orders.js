import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiXCircle } from "react-icons/fi";
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

function Orders() {
  const { authTokens } = useAuth();
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);
  const [cancelError, setCancelError] = useState("");

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/orders/`, {
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
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    setCancelError("");
    setCancelingId(orderId);
    try {
      const response = await fetch(`${API_URL}/orders/cancel/${orderId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.detail || "Failed to cancel order.");
      }
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "canceled" } : o))
      );
      setConfirmingId(null);
    } catch (err) {
      setCancelError(err.message);
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-4 sm:p-5">
      <h1 className="text-xl font-bold text-slate-900 mb-4">Your Orders</h1>

      {cancelError && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-3">
          {cancelError}
        </p>
      )}

      {loading ? (
        <RowSkeleton count={4} />
      ) : error ? (
        <div className="text-red-500 text-sm">{error}</div>
      ) : !orders?.length ? (
        <EmptyState
          title="No orders yet"
          description="Orders you place will show up here."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col gap-3 border border-slate-100 rounded-xl p-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-slate-400">Order</p>
                    <p className="font-medium text-slate-800">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Vendor</p>
                    <p className="font-medium text-slate-800 truncate">
                      {order.vendor?.title || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Date</p>
                    <p className="font-medium text-slate-800">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Total</p>
                    <p className="font-medium text-slate-800">
                      {order.total_price} ETB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:shrink-0">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                      STATUS_STYLES[order.status] || "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {order.status?.replace(/_/g, " ")}
                  </span>
                  {CANCELABLE_STATUSES.has(order.status) && (
                    <button
                      type="button"
                      onClick={() => setConfirmingId(order.id)}
                      className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-lg transition"
                    >
                      <FiXCircle className="text-xs" /> Cancel
                    </button>
                  )}
                  <Link
                    to={`${order.id}`}
                    className="text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 px-3 py-1.5 rounded-lg transition"
                  >
                    View
                  </Link>
                </div>
              </div>

              {confirmingId === order.id && (
                <div className="flex items-center justify-between gap-3 bg-red-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-red-600">
                    Cancel order #{order.id}? This can't be undone.
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setConfirmingId(null)}
                      className="text-xs font-medium text-slate-500 hover:text-slate-700 px-2 py-1"
                    >
                      Keep order
                    </button>
                    <button
                      type="button"
                      disabled={cancelingId === order.id}
                      onClick={() => handleCancelOrder(order.id)}
                      className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 px-3 py-1.5 rounded-lg transition"
                    >
                      {cancelingId === order.id ? "Canceling..." : "Yes, cancel"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
