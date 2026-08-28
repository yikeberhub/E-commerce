import React, { useEffect, useState } from "react";
import { FiTag, FiGrid, FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";
import { inputClass, selectClass } from "../../../common/formStyles";
import { RowSkeleton } from "../../../common/Skeleton";
import EmptyState from "../../../common/EmptyState";

const API_URL = process.env.REACT_APP_API_URL;

function CategoriesSection() {
  const { authTokens } = useAuth();
  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [newParentId, setNewParentId] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editParentId, setEditParentId] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products/categories/`);
      if (!response.ok) throw new Error("Failed to load categories.");
      setCategories(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const topLevelCategories = categories?.filter((c) => !c.parent) || [];
  const hasChildren = (id) => categories?.some((c) => c.parent === id);

  const createCategory = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("title", newTitle.trim());
      if (newImage) formData.append("image", newImage);
      if (newParentId) formData.append("parent", newParentId);
      const response = await fetch(`${API_URL}/products/categories/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${authTokens.access}` },
        body: formData,
      });
      const created = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          created ? Object.values(created).flat().join(" ") : "Failed to create category."
        );
      }
      setCategories((prev) => [...prev, created]);
      setNewTitle("");
      setNewImage(null);
      setNewParentId("");
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const startSubcategory = (parentId) => {
    setNewParentId(String(parentId));
    setNewTitle("");
    document.getElementById("new-category-title")?.focus();
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim()) return;
    setBusyId(id);
    try {
      const response = await fetch(`${API_URL}/products/categories/${id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle.trim(),
          parent: editParentId || null,
        }),
      });
      const updated = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          updated ? Object.values(updated).flat().join(" ") : "Failed to update category."
        );
      }
      setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const deleteCategory = async (id) => {
    setBusyId(id);
    try {
      const response = await fetch(`${API_URL}/products/categories/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      if (!response.ok) throw new Error("Failed to delete category.");
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
      <h1 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <FiGrid className="text-primary-500" /> Categories
      </h1>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-3">{error}</p>
      )}

      <form onSubmit={createCategory} className="flex flex-wrap items-center gap-2 mb-4">
        <input
          id="new-category-title"
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New category name"
          className={`${inputClass} flex-1 min-w-[160px]`}
        />
        <select
          value={newParentId}
          onChange={(e) => setNewParentId(e.target.value)}
          className={`${selectClass} min-w-[160px]`}
        >
          <option value="">— Top-level category —</option>
          {topLevelCategories.map((top) => (
            <option key={top.id} value={top.id}>
              Subcategory of {top.title}
            </option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewImage(e.target.files[0])}
          className="text-xs text-slate-500 max-w-[160px]"
        />
        <button
          type="submit"
          disabled={creating || !newTitle.trim()}
          className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          <FiPlus className="text-sm" /> {creating ? "Adding..." : "Add"}
        </button>
      </form>

      {loading ? (
        <RowSkeleton count={3} />
      ) : !categories?.length ? (
        <EmptyState title="No categories yet" description="Categories help organize the storefront." />
      ) : (
        <div className="flex flex-col gap-4">
          {topLevelCategories.map((top) => (
            <div key={top.id} className="flex flex-col gap-2">
              <CategoryRow
                category={top}
                isEditing={editingId === top.id}
                isConfirmingDelete={confirmDeleteId === top.id}
                isBusy={busyId === top.id}
                editTitle={editTitle}
                setEditTitle={setEditTitle}
                editParentId={editParentId}
                setEditParentId={setEditParentId}
                topLevelCategories={topLevelCategories}
                lockParent={hasChildren(top.id)}
                onStartEdit={() => {
                  setEditingId(top.id);
                  setEditTitle(top.title);
                  setEditParentId(top.parent ? String(top.parent) : "");
                }}
                onCancelEdit={() => setEditingId(null)}
                onSaveEdit={() => saveEdit(top.id)}
                onStartDelete={() => setConfirmDeleteId(top.id)}
                onCancelDelete={() => setConfirmDeleteId(null)}
                onConfirmDelete={() => deleteCategory(top.id)}
                extraAction={
                  <button
                    type="button"
                    onClick={() => startSubcategory(top.id)}
                    className="text-xs font-medium text-primary-600 hover:text-primary-700 px-2 py-1.5 shrink-0"
                  >
                    + Subcategory
                  </button>
                }
              />
              <div className="flex flex-col gap-2 pl-8">
                {categories
                  .filter((c) => c.parent === top.id)
                  .map((sub) => (
                    <CategoryRow
                      key={sub.id}
                      category={sub}
                      isEditing={editingId === sub.id}
                      isConfirmingDelete={confirmDeleteId === sub.id}
                      isBusy={busyId === sub.id}
                      editTitle={editTitle}
                      setEditTitle={setEditTitle}
                      editParentId={editParentId}
                      setEditParentId={setEditParentId}
                      topLevelCategories={topLevelCategories}
                      lockParent={false}
                      onStartEdit={() => {
                        setEditingId(sub.id);
                        setEditTitle(sub.title);
                        setEditParentId(sub.parent ? String(sub.parent) : "");
                      }}
                      onCancelEdit={() => setEditingId(null)}
                      onSaveEdit={() => saveEdit(sub.id)}
                      onStartDelete={() => setConfirmDeleteId(sub.id)}
                      onCancelDelete={() => setConfirmDeleteId(null)}
                      onConfirmDelete={() => deleteCategory(sub.id)}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryRow({
  category,
  isEditing,
  isConfirmingDelete,
  isBusy,
  editTitle,
  setEditTitle,
  editParentId,
  setEditParentId,
  topLevelCategories,
  lockParent,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onStartDelete,
  onCancelDelete,
  onConfirmDelete,
  extraAction,
}) {
  return (
    <div className="flex items-center gap-3 border border-slate-100 rounded-xl p-2.5">
      <img
        src={category.image}
        alt={category.title}
        className="w-10 h-10 rounded-lg object-cover shrink-0 bg-slate-50"
      />
      {isEditing ? (
        <div className="flex-1 flex flex-col sm:flex-row gap-2 min-w-0">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className={`${inputClass} flex-1`}
            autoFocus
          />
          <select
            value={editParentId}
            onChange={(e) => setEditParentId(e.target.value)}
            disabled={lockParent}
            title={lockParent ? "This category already has subcategories of its own." : undefined}
            className={`${selectClass} sm:max-w-[220px]`}
          >
            <option value="">— Top-level category —</option>
            {topLevelCategories
              .filter((top) => top.id !== category.id)
              .map((top) => (
                <option key={top.id} value={top.id}>
                  Subcategory of {top.title}
                </option>
              ))}
          </select>
        </div>
      ) : (
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-800 truncate">{category.title}</p>
          <p className="text-xs text-slate-400">{category.num_of_products} products</p>
        </div>
      )}

      <div className="flex items-center gap-1 shrink-0">
        {isEditing ? (
          <>
            <button
              type="button"
              disabled={isBusy}
              onClick={onSaveEdit}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-primary-600 hover:bg-primary-50 transition"
            >
              <FiCheck className="text-sm" />
            </button>
            <button
              type="button"
              onClick={onCancelEdit}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-50 transition"
            >
              <FiX className="text-sm" />
            </button>
          </>
        ) : isConfirmingDelete ? (
          <>
            <button
              type="button"
              onClick={onCancelDelete}
              className="text-xs font-medium text-slate-500 hover:text-slate-700 px-2 py-1.5"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isBusy}
              onClick={onConfirmDelete}
              className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 px-2.5 py-1.5 rounded-lg transition"
            >
              Confirm
            </button>
          </>
        ) : (
          <>
            {extraAction}
            <button
              type="button"
              onClick={onStartEdit}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-primary-600 transition"
            >
              <FiEdit2 className="text-sm" />
            </button>
            <button
              type="button"
              onClick={onStartDelete}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 transition"
            >
              <FiTrash2 className="text-sm" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function TagsSection() {
  const { authTokens } = useAuth();
  const [tags, setTags] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products/tags/`);
      if (!response.ok) throw new Error("Failed to load tags.");
      setTags(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const createTag = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/products/tags/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName.trim() }),
      });
      if (!response.ok) throw new Error("Failed to create tag.");
      const created = await response.json();
      setTags((prev) => [...prev, created]);
      setNewName("");
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const saveTagEdit = async (id) => {
    if (!editName.trim()) return;
    setBusyId(id);
    try {
      const response = await fetch(`${API_URL}/products/tags/${id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editName.trim() }),
      });
      if (!response.ok) throw new Error("Failed to update tag.");
      const updated = await response.json();
      setTags((prev) => prev.map((t) => (t.id === id ? updated : t)));
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const deleteTag = async (id) => {
    setBusyId(id);
    try {
      const response = await fetch(`${API_URL}/products/tags/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      if (!response.ok) throw new Error("Failed to delete tag.");
      setTags((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
      <h1 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <FiTag className="text-primary-500" /> Tags
      </h1>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-3">{error}</p>
      )}

      <form onSubmit={createTag} className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New tag name"
          className={`${inputClass} flex-1`}
        />
        <button
          type="submit"
          disabled={creating || !newName.trim()}
          className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          <FiPlus className="text-sm" /> {creating ? "Adding..." : "Add"}
        </button>
      </form>

      {loading ? (
        <RowSkeleton count={3} />
      ) : !tags?.length ? (
        <EmptyState title="No tags yet" description="Tags help customers filter products." />
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) =>
            editingId === tag.id ? (
              <span
                key={tag.id}
                className="flex items-center gap-1 bg-slate-50 border border-primary-200 rounded-full pl-1 pr-1.5 py-1"
              >
                <input
                  type="text"
                  value={editName}
                  autoFocus
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveTagEdit(tag.id)}
                  className="w-24 bg-white border border-slate-200 rounded-full px-2.5 py-0.5 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-400"
                />
                <button
                  type="button"
                  disabled={busyId === tag.id}
                  onClick={() => saveTagEdit(tag.id)}
                  className="flex items-center justify-center w-5 h-5 rounded-full text-primary-600 hover:bg-primary-50 transition"
                >
                  <FiCheck className="text-xs" />
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="flex items-center justify-center w-5 h-5 rounded-full text-slate-400 hover:bg-slate-100 transition"
                >
                  <FiX className="text-xs" />
                </button>
              </span>
            ) : (
              <span
                key={tag.id}
                className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-full pl-3 pr-1.5 py-1 text-sm text-slate-700"
              >
                {tag.name}
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(tag.id);
                    setEditName(tag.name);
                  }}
                  className="flex items-center justify-center w-5 h-5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-primary-600 transition"
                >
                  <FiEdit2 className="text-[10px]" />
                </button>
                <button
                  type="button"
                  disabled={busyId === tag.id}
                  onClick={() => deleteTag(tag.id)}
                  className="flex items-center justify-center w-5 h-5 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                >
                  <FiX className="text-xs" />
                </button>
              </span>
            )
          )}
        </div>
      )}
    </div>
  );
}

function AdminCategories() {
  return (
    <div className="flex flex-col gap-4">
      <CategoriesSection />
      <TagsSection />
    </div>
  );
}

export default AdminCategories;
