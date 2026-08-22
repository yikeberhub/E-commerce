import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FiCreditCard, FiDollarSign } from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";
import { RowSkeleton } from "../../../common/Skeleton";
import EmptyState from "../../../common/EmptyState";

const API_URL = process.env.REACT_APP_API_URL;

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-600",
  completed: "bg-emerald-50 text-emerald-600",
  failed: "bg-red-50 text-red-600",
  refunded: "bg-slate-100 text-slate-500",
};

function VendorPayments() {
  const { vendor } = useOutletContext();
  const { authTokens } = useAuth();
  const [payments, setPayments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(`${API_URL}/payments/mine/`, {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });
        if (!response.ok) throw new Error("Failed to load payments.");
        setPayments(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
        <p className="text-xs text-slate-400">Available Balance</p>
        <p className="text-2xl font-bold text-slate-900 flex items-center gap-2 mt-1">
          <FiDollarSign className="text-primary-500" />
          {vendor?.balance != null ? `${Number(vendor.balance).toLocaleString()} ETB` : "—"}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
        <h1 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <FiCreditCard className="text-primary-500" /> Payments
        </h1>

        {loading ? (
          <RowSkeleton count={4} />
        ) : error ? (
          <div className="text-red-500 text-sm">{error}</div>
        ) : !payments?.length ? (
          <EmptyState
            title="No payments yet"
            description="Payments for your orders will show up here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                  <th className="py-2 pr-3 font-medium">Order</th>
                  <th className="py-2 pr-3 font-medium">Customer</th>
                  <th className="py-2 pr-3 font-medium">Method</th>
                  <th className="py-2 pr-3 font-medium">Amount</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                  <th className="py-2 pr-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-slate-50 last:border-b-0">
                    <td className="py-2.5 pr-3 font-medium text-slate-800">
                      #{payment.order_id}
                    </td>
                    <td className="py-2.5 pr-3 text-slate-600">{payment.customer}</td>
                    <td className="py-2.5 pr-3 text-slate-600 capitalize">
                      {payment.payment_method}
                    </td>
                    <td className="py-2.5 pr-3 font-medium text-slate-800">
                      {payment.amount} {payment.currency?.toUpperCase()}
                    </td>
                    <td className="py-2.5 pr-3">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                          STATUS_STYLES[payment.payment_status] || "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {payment.payment_status}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 text-slate-500">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default VendorPayments;
