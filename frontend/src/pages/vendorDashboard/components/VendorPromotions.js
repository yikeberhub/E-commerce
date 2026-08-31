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
  price: "",
  old_price: "",
  discount_percentage: "",
  start_date: toLocalInput(new Date().toISOString()),
  end_date: "",
  active: true,
  banner_image: null,
  banner_image_url: "",
};

function PromotionForm({ initial, products, onCancel, onSaved }) {
  const { authTokens } = useAuth();
  const [data, setData] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEdit = Boolean(initial.id);
  const selectedProduct = products.find((p) => String(p.id) === String(data.product_id));
  const bannerPreview = data.banner_image
    ? URL.createObjectURL(data.banner_image)
    : data.banner_image_url;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Keeps price / old price / discount % in sync — whichever field is
  // edited, the other two are recalculated from it.
  const handlePriceField = (field, value) => {
    setData((prev) => {
      const next = { ...prev, [field]: value };
      const price = parseFloat(field === "price" ? value : prev.price);
      const oldPrice = parseFloat(field === "old_price" ? value : prev.old_price);
      const discount = parseFloat(
        field === "discount_percentage" ? value : prev.discount_percentage
      );

      if (
        field === "discount_percentage" &&
        !Number.isNaN(discount) &&
        !Number.isNaN(price) &&
        discount < 100
      ) {
        next.old_price = (price / (1 - discount / 100)).toFixed(2);
      } else if (
        (field === "price" || field === "old_price") &&
        !Number.isNaN(price) &&
        !Number.isNaN(oldPrice) &&
        oldPrice > 0
      ) {
        next.discount_percentage = Math.max(0, ((oldPrice - price) / oldPrice) * 100).toFixed(2);
      }
      return next;
    });
  };

  // Selecting a product (create mode only — it's fixed once a promotion
  // exists) seeds the price fields from that product's current values so
  // there's something sensible to edit instead of blank inputs.
  useEffect(() => {
    if (isEdit || !selectedProduct) return;
    setData((prev) => ({
      ...prev,
      price: selectedProduct.price,
      old_price: selectedProduct.old_price,
      discount_percentage: selectedProduct.discount_percentage || "",
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.product_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setSaving(true);

      const targetProductId = isEdit ? initial.product_id : data.product_id;
      if (targetProductId && data.price !== "" && data.old_price !== "") {
        const priceForm = new FormData();
        priceForm.append("price", data.price);
        priceForm.append("old_price", data.old_price);
        const priceResponse = await fetch(`${API_URL}/products/${targetProductId}/`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${authTokens.access}` },
          body: priceForm,
        });
        if (!priceResponse.ok) {
          throw new Error("Failed to update the product's price.");
        }
      }

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("start_date", new Date(data.start_date).toISOString());
      formData.append("end_date", new Date(data.end_date).toISOString());
      formData.append("active", data.active);
      if (!isEdit) formData.append("product_id", data.product_id);
      if (data.banner_image) formData.append("banner_image", data.banner_image);

      const url = isEdit
        ? `${API_URL}/promotions/${initial.id}/`
        : `${API_URL}/promotions/`;
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${authTokens.access}` },
        body: formData,
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
                setData((prev) => ({ ...prev, banner_image: e.target.files[0] || null }))
              }
              className="text-xs text-slate-500 w-full"
            />
            <p className="text-xs text-slate-400 mt-1">
              A wide image shown on the homepage promo banner. Falls back to the product's
              own photo if not set.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Discount
            </label>
            {!selectedProduct ? (
              <p className="text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2">
                Select a product to set its discount.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Price</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={data.price}
                      onChange={(e) => handlePriceField("price", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Old Price</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={data.old_price}
                      onChange={(e) => handlePriceField("old_price", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Discount %</label>
                    <input
                      type="number"
                      min="0"
                      max="99"
                      step="0.01"
                      value={data.discount_percentage}
                      onChange={(e) => handlePriceField("discount_percentage", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
                {Number(data.discount_percentage) > 0 && (
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 mt-2">
                    <span className="text-sm font-semibold text-emerald-700">
                      {Number(data.discount_percentage).toFixed(0)}% off
                    </span>
                    <span className="text-xs text-emerald-600">
                      {Number(data.price).toLocaleString()} ETB (was{" "}
                      {Number(data.old_price).toLocaleString()} ETB)
                    </span>
                  </div>
                )}
              </>
            )}
            <p className="text-xs text-slate-400 mt-1">
              Updating the price here updates the product itself — it applies everywhere
              it's shown, not just this promotion.
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

  const fetchProducts = async () => {
    if (!vendor) return;
    try {
      const response = await fetch(`${API_URL}/vendors/${vendor.id}/products/`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch {
      // dropdown just stays empty/stale
    }
  };

  useEffect(() => {
    fetchPromotions();
    fetchProducts();
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
      price: promotion.product?.price ?? "",
      old_price: promotion.product?.old_price ?? "",
      discount_percentage: promotion.product?.discount_percentage || "",
      start_date: toLocalInput(promotion.start_date),
      end_date: toLocalInput(promotion.end_date),
      active: promotion.active,
      banner_image: null,
      banner_image_url: promotion.banner_image || "",
    });
    setFormOpen(true);
  };

  const handleSaved = () => {
    setFormOpen(false);
    setEditingPromotion(null);
    fetchPromotions();
    fetchProducts();
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
                  src={promotion.banner_image || promotion.product?.image}
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
