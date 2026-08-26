import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiUser, FiBriefcase, FiShoppingBag, FiHash, FiRotateCcw } from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";
import { selectClass } from "../../../common/formStyles";
import { RowSkeleton } from "../../../common/Skeleton";

const API_URL = process.env.REACT_APP_API_URL;

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-600",
  completed: "bg-emerald-50 text-emerald-600",
  failed: "bg-red-50 text-red-600",
  refunded: "bg-slate-100 text-slate-500",
};

const ALL_PAYMENT_STATUSES = ["pending", "completed", "failed", "refunded"];

function AdminPaymentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authTokens } = useAuth();

  const [payment, setPayment] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [confirmRefund, setConfirmRefund] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        const paymentRes = await fetch(`${API_URL}/payments/${id}/`, {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });
        if (!paymentRes.ok) throw new Error("Failed to load payment.");
        const paymentData = await paymentRes.json();
        setPayment(paymentData);

        if (paymentData.order_id) {
          const orderRes = await fetch(`${API_URL}/orders/${paymentData.order_id}/`, {
            headers: { Authorization: `Bearer ${authTokens.access}` },
          });
          if (orderRes.ok) setOrder(await orderRes.json());
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const updateStatus = async (newStatus) => {
    setActionError("");
    setUpdating(true);
    try {
      const response = await fetch(`${API_URL}/payments/${id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payment_status: newStatus }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.detail || "Failed to update payment status.");
      setPayment(data);
      setConfirmRefund(false);
      if (newStatus === "refunded") {
        setOrder((prev) => (prev ? { ...prev, status: "refunded" } : prev));
      }
    } catch (err) {
      setActionError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
        <RowSkeleton count={4} />
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5 text-red-500 text-sm">
        {error || "Payment not found."}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => navigate("/admin-dashboard/payments")}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary-600 transition w-fit"
      >
        <FiArrowLeft className="text-sm" /> Back to Payments
      </button>

      {actionError && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{actionError}</p>
      )}

      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Payment #{payment.id}</h1>
            <p className="text-sm text-slate-500">{new Date(payment.created_at).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[payment.payment_status] || "bg-slate-100 text-slate-500"}`}>
              {payment.payment_status}
            </span>

            {payment.payment_status !== "refunded" &&
              (confirmRefund ? (
                <div className="flex items-center gap-2 bg-red-50 rounded-lg px-3 py-2">
                  <span className="text-sm text-red-600">Mark as refunded?</span>
                  <button type="button" onClick={() => setConfirmRefund(false)} className="text-sm font-medium text-slate-500 hover:text-slate-700 px-2 py-1">
                    Keep
                  </button>
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => updateStatus("refunded")}
                    className="text-sm font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 px-3 py-1.5 rounded-lg transition"
                  >
                    Yes, refund
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmRefund(true)}
                  className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 rounded-lg py-2 px-4 transition"
                >
                  <FiRotateCcw className="text-sm" /> Mark Refunded
                </button>
              ))}

            <select
              value={payment.payment_status}
              disabled={updating}
              onChange={(e) =>
                e.target.value === "refunded" ? setConfirmRefund(true) : updateStatus(e.target.value)
              }
              className={`${selectClass} disabled:opacity-60`}
            >
              {ALL_PAYMENT_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Status changes here are a manual reconciliation override — they update local records only and don't call the payment gateway.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-400">Amount</p>
            <p className="text-sm font-semibold text-slate-800">{payment.amount} {payment.currency?.toUpperCase()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Method</p>
            <p className="text-sm font-semibold text-slate-800 capitalize">{payment.payment_method}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Gateway</p>
            <p className="text-sm font-semibold text-slate-800">{payment.payment_gateway || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 flex items-center gap-1"><FiHash className="text-[10px]" /> Transaction ID</p>
            <p className="text-sm font-semibold text-slate-800 truncate">{payment.transaction_id}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to={`/admin-dashboard/orders/${payment.order_id}`} className="bg-white rounded-xl border border-slate-100 shadow-card p-4 hover:border-primary-200 transition">
          <h2 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
            <FiShoppingBag className="text-primary-500" /> Order
          </h2>
          <p className="text-sm font-medium text-slate-800">#{payment.order_id}</p>
          {order && <p className="text-xs text-slate-500 capitalize">{order.status?.replace(/_/g, " ")} · {order.total_price} ETB</p>}
        </Link>

        {payment.customer_id && (
          <Link to={`/admin-dashboard/users/${payment.customer_id}`} className="bg-white rounded-xl border border-slate-100 shadow-card p-4 hover:border-primary-200 transition">
            <h2 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
              <FiUser className="text-primary-500" /> Customer
            </h2>
            <p className="text-sm font-medium text-slate-800">{payment.customer}</p>
          </Link>
        )}

        {payment.vendor_id && (
          <Link to={`/admin-dashboard/vendors/${payment.vendor_id}`} className="bg-white rounded-xl border border-slate-100 shadow-card p-4 hover:border-primary-200 transition">
            <h2 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
              <FiBriefcase className="text-primary-500" /> Vendor
            </h2>
            <p className="text-sm font-medium text-slate-800">{payment.vendor}</p>
          </Link>
        )}
      </div>

      {order?.items?.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">Order Items</h2>
          <div className="flex flex-col gap-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 bg-slate-50 rounded-lg p-2.5">
                <img src={item.product?.image} alt={item.product?.title} className="w-10 h-10 rounded-md object-cover shrink-0 bg-white" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800 truncate">{item.product?.title}</p>
                  <p className="text-xs text-slate-500">{item.product?.price} ETB × {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPaymentDetail;
