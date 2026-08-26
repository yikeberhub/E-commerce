import React, { useEffect, useMemo, useState } from "react";
import { FiStar, FiTrash2, FiSearch } from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";
import { inputClass, selectClass } from "../../../common/formStyles";
import { RowSkeleton } from "../../../common/Skeleton";
import EmptyState from "../../../common/EmptyState";
import Pagination from "./Pagination";

const API_URL = process.env.REACT_APP_API_URL;
const PAGE_SIZE = 12;

function Stars({ rating }) {
  return (
    <span className="flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <FiStar key={i} className={i < rating ? "fill-current" : "text-slate-200"} />
      ))}
    </span>
  );
}

function AdminReviews() {
  const { authTokens } = useAuth();
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [busyId, setBusyId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [page, setPage] = useState(1);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products/reviews/admin/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      if (!response.ok) throw new Error("Failed to load reviews.");
      setReviews(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const deleteReview = async (id) => {
    setBusyId(id);
    try {
      const response = await fetch(`${API_URL}/products/reviews/admin/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      if (!response.ok) throw new Error("Failed to delete review.");
      setReviews((prev) => prev.filter((r) => r.id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const filteredReviews = useMemo(() => {
    if (!reviews) return [];
    const term = search.trim().toLowerCase();
    return reviews.filter((r) => {
      if (ratingFilter !== "all" && String(r.rating) !== ratingFilter) return false;
      if (!term) return true;
      return (
        r.product_title?.toLowerCase().includes(term) ||
        r.user?.username?.toLowerCase().includes(term) ||
        r.comment?.toLowerCase().includes(term)
      );
    });
  }, [reviews, search, ratingFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, ratingFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredReviews.length / PAGE_SIZE));
  const pagedReviews = filteredReviews.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FiStar className="text-primary-500" /> Reviews
        </h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reviews..."
              className={`${inputClass} pl-8 w-48`}
            />
          </div>
          <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className={selectClass}>
            <option value="all">All ratings</option>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} star{r > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-3">{error}</p>
      )}

      {loading ? (
        <RowSkeleton count={5} />
      ) : !filteredReviews.length ? (
        <EmptyState title="No reviews found" description="Reviews left by customers will show up here." />
      ) : (
        <div className="flex flex-col gap-3">
          {pagedReviews.map((review) => (
            <div key={review.id} className="border border-slate-100 rounded-xl p-3">
              <div className="flex items-start gap-3">
                <img
                  src={review.user?.profile_image}
                  alt={review.user?.username}
                  className="w-9 h-9 rounded-full object-cover shrink-0 bg-slate-50"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-slate-800">{review.user?.username}</p>
                    <Stars rating={review.rating} />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    on <span className="text-slate-600">{review.product_title}</span> ·{" "}
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                  {review.comment && (
                    <p className="text-sm text-slate-700 mt-1.5">{review.comment}</p>
                  )}
                  {review.vendor_reply && (
                    <div className="bg-slate-50 rounded-lg p-2.5 mt-2 text-sm text-slate-600">
                      <p className="text-xs font-medium text-slate-400 mb-0.5">Vendor reply</p>
                      {review.vendor_reply}
                    </div>
                  )}
                </div>

                {confirmDeleteId === review.id ? (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="text-xs font-medium text-slate-500 hover:text-slate-700 px-2 py-1.5"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={busyId === review.id}
                      onClick={() => deleteReview(review.id)}
                      className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 px-2.5 py-1.5 rounded-lg transition"
                    >
                      {busyId === review.id ? "Deleting..." : "Confirm"}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(review.id)}
                    className="flex items-center justify-center w-9 h-9 rounded-lg text-red-500 hover:bg-red-50 transition shrink-0"
                    aria-label="Delete review"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                )}
              </div>
            </div>
          ))}
          <Pagination page={page} pageCount={pageCount} onChange={setPage} />
        </div>
      )}
    </div>
  );
}

export default AdminReviews;
