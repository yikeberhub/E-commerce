import React, { useEffect, useMemo, useState } from "react";
import { FiUsers, FiMail, FiPhone } from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";
import { RowSkeleton } from "../../../common/Skeleton";
import EmptyState from "../../../common/EmptyState";

const API_URL = process.env.REACT_APP_API_URL;

function VendorCustomerManagement() {
  const { authTokens } = useAuth();
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/orders/`, {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });
        if (!response.ok) throw new Error("Failed to load customers.");
        setOrders(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const customers = useMemo(() => {
    if (!orders) return [];
    const byId = new Map();

    for (const order of orders) {
      if (!order.user) continue;
      const existing = byId.get(order.user.id);
      const spent = Number(order.total_price) || 0;

      if (existing) {
        existing.orderCount += 1;
        existing.totalSpent += spent;
        if (new Date(order.created_at) > new Date(existing.lastOrderAt)) {
          existing.lastOrderAt = order.created_at;
        }
      } else {
        byId.set(order.user.id, {
          ...order.user,
          orderCount: 1,
          totalSpent: spent,
          lastOrderAt: order.created_at,
        });
      }
    }

    return Array.from(byId.values()).sort(
      (a, b) => new Date(b.lastOrderAt) - new Date(a.lastOrderAt)
    );
  }, [orders]);

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
      <h1 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <FiUsers className="text-primary-500" /> Customers
      </h1>

      {loading ? (
        <RowSkeleton count={4} />
      ) : error ? (
        <div className="text-red-500 text-sm">{error}</div>
      ) : !customers.length ? (
        <EmptyState
          title="No customers yet"
          description="Customers who order your products will show up here."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 border border-slate-100 rounded-xl p-3"
            >
              <img
                src={customer.profile_image}
                alt={customer.username}
                className="w-11 h-11 rounded-full object-cover shrink-0 bg-slate-50"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 truncate">
                  {customer.first_name || customer.last_name
                    ? `${customer.first_name} ${customer.last_name}`.trim()
                    : customer.username}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs text-slate-500 mt-0.5">
                  <span className="flex items-center gap-1">
                    <FiMail className="text-slate-400" /> {customer.email}
                  </span>
                  {customer.phone_number && (
                    <span className="flex items-center gap-1">
                      <FiPhone className="text-slate-400" /> {customer.phone_number}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6 sm:shrink-0 text-sm">
                <div className="text-right">
                  <p className="text-xs text-slate-400">Orders</p>
                  <p className="font-semibold text-slate-800">
                    {customer.orderCount}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Total Spent</p>
                  <p className="font-semibold text-slate-800">
                    {customer.totalSpent.toLocaleString()} ETB
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VendorCustomerManagement;
