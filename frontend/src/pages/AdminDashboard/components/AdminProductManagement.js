import React, { useEffect, useMemo, useState } from "react";
import { FiBox, FiSearch, FiTrash2, FiStar, FiPlus, FiTruck } from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";
import { selectClass, inputClass } from "../../../common/formStyles";
import { RowSkeleton } from "../../../common/Skeleton";
import EmptyState from "../../../common/EmptyState";
import AdminModal from "./AdminModal";

const API_URL = process.env.REACT_APP_API_URL;

const STATUS_STYLES = {
  draft: "bg-slate-100 text-slate-500",
  in_review: "bg-amber-50 text-amber-600",
  published: "bg-emerald-50 text-emerald-600",
  disabled: "bg-slate-100 text-slate-500",
  rejected: "bg-red-50 text-red-600",
};

const STATUS_OPTIONS = ["draft", "in_review", "published", "disabled", "rejected"];

function AdminProductManagement() {
  const { authTokens } = useAuth();
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: "",
    vendor: "",
    category: "",
    price: "",
    old_price: "",
    discount_percentage: "",
    stock_quantity: "",
    description: "",
    free_delivery: false,
    image: null,
    galleryImages: [],
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const blankNewProduct = {
    title: "",
    vendor: "",
    category: "",
    price: "",
    old_price: "",
    discount_percentage: "",
    stock_quantity: "",
    description: "",
    free_delivery: false,
    image: null,
    galleryImages: [],
  };

  // Keeps price / old price / discount % in sync — whichever field the
  // admin edits, the other two are recalculated from it.
  const handlePriceField = (field, value) => {
    setNewProduct((p) => {
      const next = { ...p, [field]: value };
      const price = parseFloat(field === "price" ? value : p.price);
      const oldPrice = parseFloat(field === "old_price" ? value : p.old_price);
      const discount = parseFloat(field === "discount_percentage" ? value : p.discount_percentage);

      if (field === "discount_percentage" && !Number.isNaN(discount) && !Number.isNaN(price) && discount < 100) {
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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products/`);
      if (!response.ok) throw new Error("Failed to load products.");
      const data = await response.json();
      setProducts(data.sort((a, b) => b.id - a.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddProduct = async () => {
    setShowAddProduct(true);
    setCreateError("");
    try {
      const [vendorsRes, categoriesRes] = await Promise.all([
        fetch(`${API_URL}/vendors/`, { headers: { Authorization: `Bearer ${authTokens.access}` } }),
        fetch(`${API_URL}/products/categories/`),
      ]);
      if (vendorsRes.ok) setVendors(await vendorsRes.json());
      if (categoriesRes.ok) setCategories(await categoriesRes.json());
    } catch {
      // dropdowns will just be empty; the form still validates required vendor
    }
  };

  const createProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.vendor) {
      setCreateError("Select a vendor for this product.");
      return;
    }
    setCreating(true);
    setCreateError("");
    try {
      const formData = new FormData();
      formData.append("title", newProduct.title);
      formData.append("vendor", newProduct.vendor);
      if (newProduct.category) formData.append("category", newProduct.category);
      formData.append("price", newProduct.price);
      formData.append("old_price", newProduct.old_price || newProduct.price);
      formData.append("stock_quantity", newProduct.stock_quantity || 0);
      if (newProduct.description) formData.append("description", newProduct.description);
      formData.append("free_delivery", newProduct.free_delivery);
      if (newProduct.image) formData.append("image", newProduct.image);

      const response = await fetch(`${API_URL}/products/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${authTokens.access}` },
        body: formData,
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          data ? Object.values(data).flat().join(" ") : "Failed to create product."
        );
      }

      if (newProduct.galleryImages.length && data?.id) {
        const galleryForm = new FormData();
        newProduct.galleryImages.forEach((file) => galleryForm.append("image", file));
        await fetch(`${API_URL}/products/${data.id}/images/`, {
          method: "POST",
          headers: { Authorization: `Bearer ${authTokens.access}` },
          body: galleryForm,
        });
      }

      await fetchProducts();
      setShowAddProduct(false);
      setNewProduct(blankNewProduct);
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const updateProduct = async (productId, payload) => {
    setActionError("");
    setUpdatingId(productId);
    try {
      const response = await fetch(`${API_URL}/products/${productId}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error("Failed to update product.");
      setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, ...data } : p)));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteProduct = async (productId) => {
    setActionError("");
    setUpdatingId(productId);
    try {
      const response = await fetch(`${API_URL}/products/${productId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      if (!response.ok) throw new Error("Failed to delete product.");
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setConfirmDeleteId(null);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    const term = search.trim().toLowerCase();
    return products.filter((p) => {
      if (statusFilter !== "all" && p.product_status !== statusFilter) return false;
      if (!term) return true;
      return (
        p.title?.toLowerCase().includes(term) ||
        p.vendor?.title?.toLowerCase().includes(term)
      );
    });
  }, [products, statusFilter, search]);

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FiBox className="text-primary-500" /> Products
        </h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className={`${inputClass} pl-8 w-48`}
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={openAddProduct}
            className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-3.5 py-2 rounded-lg transition shrink-0"
          >
            <FiPlus className="text-sm" /> Add Product
          </button>
        </div>
      </div>

      {showAddProduct && (
        <AdminModal title="Add Product" onClose={() => setShowAddProduct(false)} widthClass="max-w-lg">
          <form onSubmit={createProduct} className="flex flex-col gap-3">
            {createError && (
              <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{createError}</p>
            )}
            <div>
              <label className="text-xs font-medium text-slate-500">Title</label>
              <input
                type="text"
                required
                value={newProduct.title}
                onChange={(e) => setNewProduct((p) => ({ ...p, title: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Vendor</label>
              <select
                required
                value={newProduct.vendor}
                onChange={(e) => setNewProduct((p) => ({ ...p, vendor: e.target.value }))}
                className={`${selectClass} w-full`}
              >
                <option value="">Select a vendor...</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Category</label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct((p) => ({ ...p, category: e.target.value }))}
                className={`${selectClass} w-full`}
              >
                <option value="">Uncategorized</option>
                {categories
                  .filter((top) => !top.parent)
                  .map((top) => (
                    <optgroup key={top.id} label={top.title}>
                      {categories
                        .filter((c) => c.parent === top.id)
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                    </optgroup>
                  ))}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-500">Price</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={newProduct.price}
                  onChange={(e) => handlePriceField("price", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">Old price (optional)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newProduct.old_price}
                  onChange={(e) => handlePriceField("old_price", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">Discount %</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="99"
                  value={newProduct.discount_percentage}
                  onChange={(e) => handlePriceField("discount_percentage", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <p className="text-xs text-slate-400 -mt-2">
              Set an old price to auto-calculate the discount %, or set a discount % to auto-calculate the old price.
            </p>
            <div>
              <label className="text-xs font-medium text-slate-500">Stock quantity</label>
              <input
                type="number"
                min="0"
                value={newProduct.stock_quantity}
                onChange={(e) => setNewProduct((p) => ({ ...p, stock_quantity: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Description (optional)</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))}
                rows={2}
                className={inputClass}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={newProduct.free_delivery}
                onChange={(e) =>
                  setNewProduct((p) => ({ ...p, free_delivery: e.target.checked }))
                }
                className="h-4 w-4 rounded border-slate-300 accent-primary-600"
              />
              Free delivery
            </label>
            <div>
              <label className="text-xs font-medium text-slate-500">Main image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewProduct((p) => ({ ...p, image: e.target.files[0] }))}
                className="text-xs text-slate-500 w-full"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">
                Gallery images (optional — shown in addition to the main image)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setNewProduct((p) => ({ ...p, galleryImages: Array.from(e.target.files) }))}
                className="text-xs text-slate-500 w-full"
              />
              {newProduct.galleryImages.length > 0 && (
                <p className="text-xs text-slate-400 mt-1">
                  {newProduct.galleryImages.length} image{newProduct.galleryImages.length > 1 ? "s" : ""} selected
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={creating}
              className="mt-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-lg transition"
            >
              {creating ? "Creating..." : "Create Product"}
            </button>
          </form>
        </AdminModal>
      )}

      {actionError && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-3">{actionError}</p>
      )}

      {loading ? (
        <RowSkeleton count={5} />
      ) : error ? (
        <div className="text-red-500 text-sm">{error}</div>
      ) : !filteredProducts.length ? (
        <EmptyState title="No products found" description="Products listed by vendors will show up here." />
      ) : (
        <div className="flex flex-col gap-3">
          {filteredProducts.map((product) => {
            const isUpdating = updatingId === product.id;

            return (
              <div
                key={product.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 border border-slate-100 rounded-xl p-3"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-11 h-11 rounded-lg object-cover shrink-0 bg-slate-50"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-slate-800 truncate">{product.title}</p>
                    {product.featured && (
                      <span className="text-[11px] font-medium text-primary-600 bg-primary-50 rounded-full px-2 py-0.5 flex items-center gap-1">
                        <FiStar className="text-[10px]" /> Featured
                      </span>
                    )}
                    {product.free_delivery && (
                      <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 rounded-full px-2 py-0.5 flex items-center gap-1">
                        <FiTruck className="text-[10px]" /> Free delivery
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs text-slate-500 mt-0.5">
                    <span>{product.vendor?.title || "No vendor"}</span>
                    <span>{product.category?.title || "Uncategorized"}</span>
                    <span>{product.price} ETB</span>
                    <span>Stock: {product.stock_quantity}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:shrink-0">
                  <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={product.featured}
                      disabled={isUpdating}
                      onChange={(e) => updateProduct(product.id, { featured: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 accent-primary-600 cursor-pointer"
                    />
                    Featured
                  </label>

                  <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={product.free_delivery}
                      disabled={isUpdating}
                      onChange={(e) => updateProduct(product.id, { free_delivery: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 accent-primary-600 cursor-pointer"
                    />
                    Free delivery
                  </label>

                  <select
                    value={product.product_status}
                    disabled={isUpdating}
                    onChange={(e) => updateProduct(product.id, { product_status: e.target.value })}
                    className={`${selectClass} ${STATUS_STYLES[product.product_status] || ""} border-0 font-medium disabled:opacity-60`}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>

                  {confirmDeleteId === product.id ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="text-xs font-medium text-slate-500 hover:text-slate-700 px-2 py-1.5"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => deleteProduct(product.id)}
                        className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 px-2.5 py-1.5 rounded-lg transition"
                      >
                        {isUpdating ? "Deleting..." : "Confirm"}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(product.id)}
                      className="flex items-center justify-center w-9 h-9 rounded-lg text-red-500 hover:bg-red-50 transition shrink-0"
                      aria-label="Delete product"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminProductManagement;
