import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FiTag, FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";
import { inputClass, selectClass } from "../../../common/formStyles";
import { RowSkeleton } from "../../../common/Skeleton";
import EmptyState from "../../../common/EmptyState";

const API_URL = process.env.REACT_APP_API_URL;

const toLocalInput = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

const emptyForm = {
  product_id: "",
  title: "",
  description: "",
  discount_percentage: "",
  start_date: toLocalInput(new Date().toISOString()),
  end_date: "",
  active: true,
};

function PromotionForm({ initial, products, onCancel, onSaved }) {
  const { authTokens } = useAuth();
  const [data, setData] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEdit = Boolean(initial.id);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setSaving(true);
      const payload = {
        title: data.title,
        description: data.description,
        discount_percentage: data.discount_percentage,
        start_date: new Date(data.start_date).toISOString(),
        end_date: new Date(data.end_date).toISOString(),
        active: data.active,
      };
      if (!isEdit) payload.product_id = data.product_id;

      const url = isEdit
        ? `${API_URL}/promotions/${initial.id}/`
        : `${API_URL}/promotions/`;
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const firstError =
          errorData && Object.values(errorData).flat().filter(Boolean)[0];
        throw new Error(firstError || "Failed to save promotion.");
      }
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-soft max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            {isEdit ? "Edit Promotion" : "New Promotion"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 transition"
            aria-label="Close"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <form className="p-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          {error && (
            <p className="text-red-500 text-xs bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {!isEdit && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Product
              </label>
              <select
                name="product_id"
                value={data.product_id}
                onChange={handleChange}
                required
                className={selectClass}
              >
                <option value="">Select a product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={data.title}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={data.description}
              onChange={handleChange}
              className={`${inputClass} min-h-[70px]`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Discount Percentage
            </label>
            <input
              type="number"
              name="discount_percentage"
              min="0"
              max="100"
              step="0.01"
              value={data.discount_percentage}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Start
              </label>
              <input
                type="datetime-local"
                name="start_date"
                value={data.start_date}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                End
              </label>
              <input
                type="datetime-local"
                name="end_date"
                value={data.end_date}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              name="active"
              checked={data.active}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 accent-primary-600"
            />
            Active
          </label>

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onCancel}
              className="text-slate-500 hover:text-slate-700 text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition"
            >
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Promotion"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function VendorPromotions() {
  const { vendor } = useOutletContext();
  const { authTokens } = useAuth();
  const [promotions, setPromotions] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPromotions = async () => {
    if (!vendor) return;
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/promotions/?vendor=${vendor.id}`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      if (!response.ok) throw new Error("Failed to load promotions.");
      setPromotions(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
    if (vendor) {
      fetch(`${API_URL}/vendors/${vendor.id}/products/`)
        .then((r) => r.json())
        .then((d) => setProducts(d.products || []))
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendor]);

  const openCreate = () => {
    setEditingPromotion(null);
    setFormOpen(true);
  };

  const openEdit = (promotion) => {
    setEditingPromotion({
      id: promotion.id,
      product_id: promotion.product?.id,
      title: promotion.title,
      description: promotion.description || "",
      discount_percentage: promotion.discount_percentage,
      start_date: toLocalInput(promotion.start_date),
      end_date: toLocalInput(promotion.end_date),
      active: promotion.active,
    });
    setFormOpen(true);
  };

  const handleSaved = () => {
    setFormOpen(false);
    setEditingPromotion(null);
    fetchPromotions();
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      const response = await fetch(`${API_URL}/promotions/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      if (!response.ok) throw new Error("Failed to delete promotion.");
      setPromotions((prev) => prev.filter((p) => p.id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FiTag className="text-primary-500" /> Promotions
        </h1>
        <button
          type="button"
          onClick={openCreate}
          disabled={!products.length}
          title={!products.length ? "Add a product first" : undefined}
          className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          <FiPlus className="text-xs" /> New Promotion
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-3">
          {error}
        </p>
      )}

      {loading ? (
        <RowSkeleton count={3} />
      ) : !promotions?.length ? (
        <EmptyState
          title="No promotions yet"
          description="Create a promotion to feature a product on the homepage."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {promotions.map((promotion) => {
            const now = new Date();
            const isLive =
              promotion.active &&
              new Date(promotion.start_date) <= now &&
              now <= new Date(promotion.end_date);
            return (
              <div
                key={promotion.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 border border-slate-100 rounded-xl p-3"
              >
                <img
                  src={promotion.product?.image}
                  alt=""
                  className="w-14 h-14 rounded-lg object-cover shrink-0 bg-slate-50"
                />
                <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                  <div className="col-span-2 sm:col-span-1 min-w-0">
                    <p className="text-xs text-slate-400">Title</p>
                    <p className="font-medium text-slate-800 truncate">
                      {promotion.title}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Product</p>
                    <p className="font-medium text-slate-800 truncate">
                      {promotion.product?.title}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Discount</p>
                    <p className="font-medium text-slate-800">
                      {promotion.discount_percentage}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Ends</p>
                    <p className="font-medium text-slate-800">
                      {new Date(promotion.end_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:shrink-0">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      isLive
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {isLive ? "Live" : promotion.active ? "Scheduled" : "Inactive"}
                  </span>
                  <button
                    type="button"
                    onClick={() => openEdit(promotion)}
                    className="text-slate-400 hover:text-primary-600 transition"
                    aria-label="Edit promotion"
                  >
                    <FiEdit2 className="text-sm" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(promotion.id)}
                    className="text-slate-400 hover:text-red-500 transition"
                    aria-label="Delete promotion"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>

                {confirmDeleteId === promotion.id && (
                  <div className="w-full flex items-center justify-between gap-3 bg-red-50 rounded-lg px-3 py-2 sm:col-span-full">
                    <p className="text-xs text-red-600">
                      Delete "{promotion.title}"? This can't be undone.
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="text-xs font-medium text-slate-500 hover:text-slate-700 px-2 py-1"
                      >
                        Keep
                      </button>
                      <button
                        type="button"
                        disabled={deleting}
                        onClick={() => handleDelete(promotion.id)}
                        className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 px-3 py-1.5 rounded-lg transition"
                      >
                        {deleting ? "Deleting..." : "Yes, delete"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {formOpen && (
        <PromotionForm
          initial={editingPromotion || emptyForm}
          products={products}
          onCancel={() => setFormOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

export default VendorPromotions;
