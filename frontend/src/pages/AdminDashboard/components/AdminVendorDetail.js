import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiStar,
  FiCheckCircle,
  FiXCircle,
  FiPauseCircle,
  FiPlayCircle,
  FiTrash2,
  FiBox,
  FiShoppingBag,
  FiCreditCard,
  FiDollarSign,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";
import { RowSkeleton } from "../../../common/Skeleton";
import EmptyState from "../../../common/EmptyState";

const API_URL = process.env.REACT_APP_API_URL;

function vendorStatus(vendor) {
  if (vendor.account_status === "suspended") return "suspended";
  if (!vendor.is_active) return "pending";
  return "active";
}

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-600",
  active: "bg-emerald-50 text-emerald-600",
  suspended: "bg-red-50 text-red-600",
};

const STATUS_LABELS = {
  pending: "Pending Approval",
  active: "Active",
  suspended: "Suspended",
};

const TABS = [
  { key: "products", label: "Products", icon: FiBox },
  { key: "orders", label: "Orders", icon: FiShoppingBag },
  { key: "reviews", label: "Reviews", icon: FiStar },
  { key: "payments", label: "Payments", icon: FiCreditCard },
];

function AdminVendorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authTokens } = useAuth();

  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [tab, setTab] = useState("products");

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        const [vendorRes, productsRes, ordersRes, reviewsRes, paymentsRes] = await Promise.all([
          fetch(`${API_URL}/vendors/${id}/`, { headers: { Authorization: `Bearer ${authTokens.access}` } }),
          fetch(`${API_URL}/vendors/${id}/products/`, { headers: { Authorization: `Bearer ${authTokens.access}` } }),
          fetch(`${API_URL}/vendors/${id}/orders/`, { headers: { Authorization: `Bearer ${authTokens.access}` } }),
          fetch(`${API_URL}/products/reviews/mine/?vendor=${id}`, { headers: { Authorization: `Bearer ${authTokens.access}` } }),
          fetch(`${API_URL}/payments/mine/`, { headers: { Authorization: `Bearer ${authTokens.access}` } }),
        ]);
        if (!vendorRes.ok) throw new Error("Failed to load vendor.");
        setVendor(await vendorRes.json());
        if (productsRes.ok) setProducts((await productsRes.json()).products || []);
        if (ordersRes.ok) setOrders((await ordersRes.json()).orders || []);
        if (reviewsRes.ok) setReviews(await reviewsRes.json());
        if (paymentsRes.ok) {
          const allPayments = await paymentsRes.json();
          setPayments(allPayments.filter((p) => p.vendor_id === Number(id)));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const updateVendor = async (payload) => {
    setActionError("");
    setUpdating(true);
    try {
      const response = await fetch(`${API_URL}/vendors/${id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.detail || "Failed to update vendor.");
      setVendor((prev) => ({ ...prev, ...data }));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const deleteVendor = async () => {
    setActionError("");
    setUpdating(true);
    try {
      const response = await fetch(`${API_URL}/vendors/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      if (!response.ok) throw new Error("Failed to delete vendor.");
      navigate("/admin-dashboard/vendors");
    } catch (err) {
      setActionError(err.message);
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

  if (error || !vendor) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5 text-red-500 text-sm">
        {error || "Vendor not found."}
      </div>
    );
  }

  const status = vendorStatus(vendor);

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => navigate("/admin-dashboard/vendors")}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary-600 transition w-fit"
      >
        <FiArrowLeft className="text-sm" /> Back to Vendors
      </button>

      {actionError && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{actionError}</p>
      )}

      <div className="bg-white rounded-xl border border-slate-100 shadow-card overflow-hidden">
        <div className="h-28 bg-slate-100">
          <img src={vendor.banner_image} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 -mt-12">
            <img
              src={vendor.logo}
              alt={vendor.title}
              className="w-20 h-20 rounded-2xl object-cover border-4 border-white bg-slate-50 shrink-0"
            />
            <div className="flex-1 min-w-0 sm:mt-8">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-slate-900">{vendor.title}</h1>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[status]}`}>
                  {STATUS_LABELS[status]}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600 mt-1">
                <span className="flex items-center gap-1.5"><FiMail className="text-slate-400" /> {vendor.email}</span>
                {vendor.phone_number && (
                  <span className="flex items-center gap-1.5"><FiPhone className="text-slate-400" /> {vendor.phone_number}</span>
                )}
                <span className="flex items-center gap-1"><FiStar className="text-amber-400" /> {vendor.authentic_rating}</span>
                {vendor.balance !== undefined && (
                  <span className="flex items-center gap-1.5"><FiDollarSign className="text-slate-400" /> {vendor.balance} ETB balance</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 sm:mt-8">
              {status === "pending" && (
                <>
                  <button type="button" disabled={updating} onClick={() => updateVendor({ is_active: true, account_status: "active" })} className="flex items-center gap-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 rounded-lg py-2 px-3 transition">
                    <FiCheckCircle className="text-sm" /> Approve
                  </button>
                  <button type="button" disabled={updating} onClick={() => updateVendor({ is_active: false, account_status: "inactive" })} className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 rounded-lg py-2 px-3 transition">
                    <FiXCircle className="text-sm" /> Reject
                  </button>
                </>
              )}
              {status === "active" && (
                <button type="button" disabled={updating} onClick={() => updateVendor({ is_active: false, account_status: "suspended" })} className="flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700 border border-amber-200 hover:border-amber-300 rounded-lg py-2 px-3 transition">
                  <FiPauseCircle className="text-sm" /> Suspend
                </button>
              )}
              {status === "suspended" && (
                <button type="button" disabled={updating} onClick={() => updateVendor({ is_active: true, account_status: "active" })} className="flex items-center gap-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 rounded-lg py-2 px-3 transition">
                  <FiPlayCircle className="text-sm" /> Reactivate
                </button>
              )}
              {confirmDelete ? (
                <div className="flex items-center gap-1.5">
                  <button type="button" onClick={() => setConfirmDelete(false)} className="text-xs font-medium text-slate-500 hover:text-slate-700 px-2 py-1.5">
                    Cancel
                  </button>
                  <button type="button" disabled={updating} onClick={deleteVendor} className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 px-2.5 py-1.5 rounded-lg transition">
                    Confirm
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => setConfirmDelete(true)} className="flex items-center justify-center w-9 h-9 rounded-lg text-red-500 hover:bg-red-50 transition shrink-0" aria-label="Delete vendor">
                  <FiTrash2 className="text-sm" />
                </button>
              )}
            </div>
          </div>
          {vendor.description && <p className="text-sm text-slate-500 mt-3">{vendor.description}</p>}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-2 flex items-center gap-1 w-fit">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg transition ${
              tab === key ? "bg-primary-600 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Icon className="text-sm" /> {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
        {tab === "products" && (
          products.length ? (
            <div className="flex flex-col gap-2">
              {products.map((p) => (
                <div key={p.id} className="flex items-center gap-3 bg-slate-50 rounded-lg px-3 py-2">
                  <img src={p.image} alt={p.title} className="w-9 h-9 rounded-lg object-cover bg-white shrink-0" />
                  <span className="flex-1 text-sm font-medium text-slate-800 truncate">{p.title}</span>
                  <span className="text-xs text-slate-400 capitalize">{p.product_status?.replace(/_/g, " ")}</span>
                  <span className="text-sm text-slate-700">{p.price} ETB</span>
                </div>
              ))}
            </div>
          ) : <EmptyState title="No products yet" description="This vendor hasn't listed any products." />
        )}

        {tab === "orders" && (
          orders.length ? (
            <div className="flex flex-col gap-2">
              {orders.map((o) => (
                <Link key={o.id} to={`/admin-dashboard/orders/${o.id}`} className="flex items-center justify-between text-sm bg-slate-50 hover:bg-slate-100 rounded-lg px-3 py-2 transition">
                  <span className="font-medium text-slate-800">#{o.id}</span>
                  <span className="text-xs text-slate-400 capitalize">{o.status?.replace(/_/g, " ")}</span>
                  <span className="text-slate-700">{o.total_price} ETB</span>
                </Link>
              ))}
            </div>
          ) : <EmptyState title="No orders yet" description="Orders placed with this vendor will show up here." />
        )}

        {tab === "reviews" && (
          reviews.length ? (
            <div className="flex flex-col gap-2">
              {reviews.map((r) => (
                <div key={r.id} className="text-sm bg-slate-50 rounded-lg px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-800">{r.user?.username}</span>
                    <span className="text-amber-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                  </div>
                  {r.comment && <p className="text-slate-600 mt-1">{r.comment}</p>}
                </div>
              ))}
            </div>
          ) : <EmptyState title="No reviews yet" description="Reviews left on this vendor's products will show up here." />
        )}

        {tab === "payments" && (
          payments.length ? (
            <div className="flex flex-col gap-2">
              {payments.map((p) => (
                <Link key={p.id} to={`/admin-dashboard/payments/${p.id}`} className="flex items-center justify-between text-sm bg-slate-50 hover:bg-slate-100 rounded-lg px-3 py-2 transition">
                  <span className="font-medium text-slate-800">#{p.order_id}</span>
                  <span className="text-xs text-slate-400 capitalize">{p.payment_status}</span>
                  <span className="text-slate-700">{p.amount} {p.currency?.toUpperCase()}</span>
                </Link>
              ))}
            </div>
          ) : <EmptyState title="No payments yet" description="Payments for this vendor's orders will show up here." />
        )}
      </div>
    </div>
  );
}

export default AdminVendorDetail;
