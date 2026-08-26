import React, { useEffect, useState } from "react";
import { FiTag, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";
import { inputClass, selectClass } from "../../../common/formStyles";
import { RowSkeleton } from "../../../common/Skeleton";
import EmptyState from "../../../common/EmptyState";
import AdminModal from "./AdminModal";

const API_URL = process.env.REACT_APP_API_URL;

const toLocalInput = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

const blankForm = {
  product_id: "",
  title: "",
  description: "",
  start_date: toLocalInput(new Date().toISOString()),
  end_date: "",
  active: true,
  banner_image: null,
  banner_image_url: "",
};

function AdminPromotions() {
  const { authTokens } = useAuth();
  const [promotions, setPromotions] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(blankForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const isEdit = Boolean(editing);
  const selectedProduct = products.find(
    (p) => String(p.id) === String(formData.product_id)
  );
  const bannerPreview = formData.banner_image
    ? URL.createObjectURL(formData.banner_image)
    : formData.banner_image_url;

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/promotions/`);
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
    fetch(`${API_URL}/products/`)
      .then((r) => r.json())
      .then((d) => setProducts(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormData(blankForm);
    setFormError("");
    setFormOpen(true);
  };

  const openEdit = (promotion) => {
    setEditing(promotion);
    setFormData({
      product_id: promotion.product?.id || "",
      title: promotion.title,
      description: promotion.description || "",
      start_date: toLocalInput(promotion.start_date),
      end_date: toLocalInput(promotion.end_date),
      active: promotion.active,
      banner_image: null,
      banner_image_url: promotion.banner_image || "",
    });
    setFormError("");
    setFormOpen(true);
  };

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      const body = new FormData();
      body.append("title", formData.title);
      body.append("description", formData.description);
      body.append("start_date", new Date(formData.start_date).toISOString());
      body.append("end_date", new Date(formData.end_date).toISOString());
      body.append("active", formData.active);
      if (!isEdit) body.append("product_id", formData.product_id);
      if (formData.banner_image) body.append("banner_image", formData.banner_image);

      const url = isEdit
        ? `${API_URL}/promotions/${editing.id}/`
        : `${API_URL}/promotions/`;
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${authTokens.access}` },
        body,
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        const firstError =
          errData && Object.values(errData).flat().filter(Boolean)[0];
        throw new Error(firstError || "Failed to save promotion.");
      }
      setFormOpen(false);
      fetchPromotions();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
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
      setDeletingId(null);
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
          title={!products.length ? "No products available yet" : undefined}
          className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          <FiPlus className="text-xs" /> New Promotion
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-3">{error}</p>
      )}

      {loading ? (
        <RowSkeleton count={3} />
      ) : !promotions?.length ? (
        <EmptyState
          title="No promotions yet"
          description="Feature any vendor's product on the homepage promo banner."
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
                  src={promotion.banner_image || promotion.product?.image}
                  alt=""
                  className="w-14 h-14 rounded-lg object-cover shrink-0 bg-slate-50"
                />
                <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
                  <div className="col-span-2 sm:col-span-1 min-w-0">
                    <p className="text-xs text-slate-400">Title</p>
                    <p className="font-medium text-slate-800 truncate">{promotion.title}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">Product</p>
                    <p className="font-medium text-slate-800 truncate">
                      {promotion.product?.title}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">Vendor</p>
                    <p className="font-medium text-slate-800 truncate">
                      {promotion.product?.vendor?.title || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Sale Price</p>
                    <p className="font-medium text-slate-800">
                      {promotion.product?.price !== undefined
                        ? (
                            Number(promotion.product.price) *
                            (1 - (Number(promotion.discount_percentage) || 0) / 100)
                          ).toFixed(2)
                        : "—"}{" "}
                      ETB
                      <span className="text-xs text-slate-400 ml-1">
                        (-{promotion.discount_percentage}%)
                      </span>
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
                        disabled={deletingId === promotion.id}
                        onClick={() => handleDelete(promotion.id)}
                        className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 px-3 py-1.5 rounded-lg transition"
                      >
                        {deletingId === promotion.id ? "Deleting..." : "Yes, delete"}
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
        <AdminModal
          title={isEdit ? "Edit Promotion" : "New Promotion"}
          onClose={() => setFormOpen(false)}
          widthClass="max-w-lg"
        >
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {formError && (
              <p className="text-red-500 text-xs bg-red-50 rounded-lg px-3 py-2">
                {formError}
              </p>
            )}

            {!isEdit && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Product
                </label>
                <select
                  name="product_id"
                  value={formData.product_id}
                  onChange={handleFieldChange}
                  required
                  className={selectClass}
                >
                  <option value="">Select a product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} {p.vendor?.title ? `— ${p.vendor.title}` : ""}
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
                value={formData.title}
                onChange={handleFieldChange}
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
                value={formData.description}
                onChange={handleFieldChange}
                className={`${inputClass} min-h-[70px]`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Banner image (optional)
              </label>
              {bannerPreview && (
                <img
                  src={bannerPreview}
                  alt=""
                  className="w-full h-28 object-cover rounded-lg mb-2 border border-slate-100"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    banner_image: e.target.files[0] || null,
                  }))
                }
                className="text-xs text-slate-500 w-full"
              />
              <p className="text-xs text-slate-400 mt-1">
                A wide image shown on the homepage promo banner. Falls back to the
                product's own photo if not set.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Discount
              </label>
              {!selectedProduct ? (
                <p className="text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2">
                  Select a product to see its discount.
                </p>
              ) : selectedProduct.discount_percentage > 0 ? (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                  <span className="text-sm font-semibold text-emerald-700">
                    {Number(selectedProduct.discount_percentage).toFixed(0)}% off
                  </span>
                  <span className="text-xs text-emerald-600">
                    {Number(selectedProduct.price).toLocaleString()} ETB (was{" "}
                    {Number(selectedProduct.old_price).toLocaleString()} ETB)
                  </span>
                </div>
              ) : (
                <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                  This product has no discount — its price and old price are the same.
                  Set a higher old price on the product to give this promotion a
                  discount.
                </p>
              )}
              <p className="text-xs text-slate-400 mt-1">
                A promotion's discount always matches the product's own price vs. old
                price — it's not set separately.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Start
                </label>
                <input
                  type="datetime-local"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleFieldChange}
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
                  value={formData.end_date}
                  onChange={handleFieldChange}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleFieldChange}
                className="h-4 w-4 rounded border-slate-300 accent-primary-600"
              />
              Active
            </label>

            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
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
        </AdminModal>
      )}
    </div>
  );
}

export default AdminPromotions;
