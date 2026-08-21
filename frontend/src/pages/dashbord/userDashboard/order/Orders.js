import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RowSkeleton } from "../../../../common/Skeleton";
import EmptyState from "../../../../common/EmptyState";

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

function Orders() {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    const token = localStorage.getItem("access");

    try {
      const response = await fetch(`${API_URL}/orders/`, {
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

  return (
    <div className="bg-white rounded-xl shadow-card p-4 sm:p-5">
      <h1 className="text-xl font-bold text-slate-900 mb-4">Your Orders</h1>

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
              className="flex flex-col sm:flex-row sm:items-center gap-3 border border-slate-100 rounded-xl p-3"
            >
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
                <Link
                  to={`${order.id}`}
                  className="text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 px-3 py-1.5 rounded-lg transition"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
