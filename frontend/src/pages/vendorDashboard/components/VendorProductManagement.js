import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiPackage,
  FiStar,
} from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";
import { inputClass, selectClass } from "../../../common/formStyles";
import { RowSkeleton } from "../../../common/Skeleton";
import EmptyState from "../../../common/EmptyState";

const API_URL = process.env.REACT_APP_API_URL;

const STATUS_STYLES = {
  draft: "bg-slate-100 text-slate-500",
  in_review: "bg-amber-50 text-amber-600",
  published: "bg-emerald-50 text-emerald-600",
  disabled: "bg-slate-100 text-slate-500",
  rejected: "bg-red-50 text-red-600",
};

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft (not submitted yet)" },
  { value: "in_review", label: "Submit for Review" },
  { value: "disabled", label: "Disabled (paused)" },
];

const emptyForm = {
  title: "",
  description: "",
  category: "",
  tags: [],
  price: "",
  old_price: "",
  specifications: "",
  product_status: "in_review",
  stock_quantity: 0,
  featured: false,
  image: null,
};

function ProductForm({ initial, categories, tags, onCancel, onSaved }) {
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

  const handleTagToggle = (tagId) => {
    setData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter((t) => t !== tagId)
        : [...prev.tags, tagId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description || "");
    if (data.category) formData.append("category", data.category);
    data.tags.forEach((tagId) => formData.append("tags", tagId));
    formData.append("price", data.price);
    formData.append("old_price", data.old_price || data.price);
    formData.append("specifications", data.specifications || "");
    formData.append("product_status", data.product_status);
    formData.append("stock_quantity", data.stock_quantity);
    formData.append("featured", data.featured);
    if (data.image instanceof File) formData.append("image", data.image);

    try {
      setSaving(true);
      const url = isEdit
        ? `${API_URL}/products/${initial.id}/`
        : `${API_URL}/products/`;
      const response = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { Authorization: `Bearer ${authTokens.access}` },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const firstError =
          errorData &&
          Object.values(errorData).flat().filter(Boolean)[0];
        throw new Error(firstError || "Failed to save product.");
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
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-soft max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            {isEdit ? "Edit Product" : "New Product"}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Category
              </label>
              <select
                name="category"
                value={data.category}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Photo {isEdit && "(leave blank to keep current)"}
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) =>
                  setData((prev) => ({ ...prev, image: e.target.files[0] }))
                }
                className={`${inputClass} py-1.5`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={data.description}
              onChange={handleChange}
              className={`${inputClass} min-h-[80px]`}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Price
              </label>
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                value={data.price}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Old Price
              </label>
              <input
                type="number"
                name="old_price"
                min="0"
                step="0.01"
                value={data.old_price}
                onChange={handleChange}
                placeholder="Optional"
                className={inputClass}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Stock
              </label>
              <input
                type="number"
                name="stock_quantity"
                min="0"
                value={data.stock_quantity}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Status
              </label>
              <select
                name="product_status"
                value={data.product_status}
                onChange={handleChange}
                className={selectClass}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Specifications
            </label>
            <textarea
              name="specifications"
              value={data.specifications}
              onChange={handleChange}
              className={`${inputClass} min-h-[60px]`}
            />
          </div>

          {tags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const active = data.tags.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagToggle(tag.id)}
                      className={`text-xs font-medium rounded-full px-3 py-1.5 border transition ${
                        active
                          ? "bg-primary-600 border-primary-600 text-white"
                          : "bg-white border-slate-200 text-slate-600 hover:border-primary-300"
                      }`}
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              name="featured"
              checked={data.featured}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 accent-primary-600"
            />
            Feature this product on the homepage
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
              className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition"
            >
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function VendorProductManagement() {
  const { vendor } = useOutletContext();
  const { authTokens } = useAuth();
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/products/categories/`)
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
    fetch(`${API_URL}/products/tags/`)
      .then((r) => r.json())
      .then(setTags)
      .catch(() => {});
  }, []);

  const fetchProducts = async () => {
    if (!vendor) return;
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/vendors/${vendor.id}/products/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      if (!response.ok) throw new Error("Failed to load products.");
      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [vendor]);

  const openCreate = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct({
      id: product.id,
      title: product.title,
      description: product.description || "",
      category: product.category?.id || "",
      tags: product.tags?.map((t) => t.id) || [],
      price: product.price,
      old_price: product.old_price,
      specifications: product.specifications || "",
      product_status: product.product_status,
      stock_quantity: product.stock_quantity,
      featured: product.featured,
      image: null,
    });
    setFormOpen(true);
  };

  const handleSaved = () => {
    setFormOpen(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const handleDelete = async (productId) => {
    setDeleting(true);
    try {
      const response = await fetch(`${API_URL}/products/${productId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      if (!response.ok) throw new Error("Failed to delete product.");
      setProducts((prev) => prev.filter((p) => p.id !== productId));
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
          <FiPackage className="text-primary-500" /> Products
        </h1>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          <FiPlus className="text-xs" /> Add Product
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-3">
          {error}
        </p>
      )}

      {loading ? (
        <RowSkeleton count={4} />
      ) : !products?.length ? (
        <EmptyState
          title="No products yet"
          description="Add your first product to start selling."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 border border-slate-100 rounded-xl p-3"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-14 h-14 rounded-lg object-cover shrink-0 bg-slate-50"
              />
              <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                <div className="col-span-2 sm:col-span-1 min-w-0">
                  <p className="text-xs text-slate-400">Title</p>
                  <p className="font-medium text-slate-800 truncate flex items-center gap-1">
                    {product.title}
                    {product.featured && (
                      <FiStar className="text-amber-400 fill-current text-xs shrink-0" />
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Category</p>
                  <p className="font-medium text-slate-800 truncate">
                    {product.category?.title || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Price</p>
                  <p className="font-medium text-slate-800">
                    {product.price} ETB
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Stock</p>
                  <p className="font-medium text-slate-800">
                    {product.stock_quantity}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:shrink-0">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                    STATUS_STYLES[product.product_status] ||
                    "bg-slate-100 text-slate-500"
                  }`}
                >
                  {product.product_status?.replace(/_/g, " ")}
                </span>
                <button
                  type="button"
                  onClick={() => openEdit(product)}
                  className="text-slate-400 hover:text-primary-600 transition"
                  aria-label="Edit product"
                >
                  <FiEdit2 className="text-sm" />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDeleteId(product.id)}
                  className="text-slate-400 hover:text-red-500 transition"
                  aria-label="Delete product"
                >
                  <FiTrash2 className="text-sm" />
                </button>
              </div>

              {confirmDeleteId === product.id && (
                <div className="w-full flex items-center justify-between gap-3 bg-red-50 rounded-lg px-3 py-2 sm:col-span-full">
                  <p className="text-xs text-red-600">
                    Delete "{product.title}"? This can't be undone.
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
                      onClick={() => handleDelete(product.id)}
                      className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 px-3 py-1.5 rounded-lg transition"
                    >
                      {deleting ? "Deleting..." : "Yes, delete"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <ProductForm
          initial={editingProduct || emptyForm}
          categories={categories}
          tags={tags}
          onCancel={() => setFormOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

export default VendorProductManagement;
