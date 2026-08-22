import React, { useEffect, useState } from "react";
import { FiMessageSquare, FiStar, FiCornerDownRight } from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";
import { inputClass } from "../../../common/formStyles";
import { RowSkeleton } from "../../../common/Skeleton";
import EmptyState from "../../../common/EmptyState";

const API_URL = process.env.REACT_APP_API_URL;

function ReplyForm({ review, onReplied }) {
  const { authTokens } = useAuth();
  const [reply, setReply] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setSaving(true);
      const response = await fetch(`${API_URL}/products/reviews/${review.id}/reply/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vendor_reply: reply }),
      });
      if (!response.ok) throw new Error("Failed to send reply.");
      const data = await response.json();
      onReplied(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2">
      {error && <p className="text-xs text-red-500">{error}</p>}
      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        required
        placeholder="Write a reply..."
        className={`${inputClass} min-h-[60px] text-sm`}
      />
      <button
        type="submit"
        disabled={saving}
        className="self-start bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition"
      >
        {saving ? "Sending..." : "Send Reply"}
      </button>
    </form>
  );
}

function VendorFeedback() {
  const { authTokens } = useAuth();
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [replyingId, setReplyingId] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API_URL}/products/reviews/mine/`, {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });
        if (!response.ok) throw new Error("Failed to load feedback.");
        setReviews(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleReplied = (updated) => {
    setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setReplyingId(null);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
      <h1 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <FiMessageSquare className="text-primary-500" /> Feedback
      </h1>

      {loading ? (
        <RowSkeleton count={4} />
      ) : error ? (
        <div className="text-red-500 text-sm">{error}</div>
      ) : !reviews?.length ? (
        <EmptyState
          title="No reviews yet"
          description="Reviews left on your products will show up here."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border border-slate-100 rounded-xl p-3.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={review.user?.profile_image}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover shrink-0 bg-slate-50"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {review.user?.username}
                    </p>
                    <p className="text-xs text-primary-600 truncate">
                      {review.product_title}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar
                      key={i}
                      className={i < review.rating ? "fill-current" : "text-slate-200"}
                    />
                  ))}
                </div>
              </div>

              <p className="text-sm text-slate-600 mt-2">{review.comment}</p>
              <p className="text-[11px] text-slate-400 mt-1">
                {new Date(review.created_at).toLocaleDateString()}
              </p>

              {review.vendor_reply ? (
                <div className="flex gap-2 mt-3 pl-3 border-l-2 border-primary-100">
                  <FiCornerDownRight className="text-primary-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-primary-600">
                      Your reply
                    </p>
                    <p className="text-sm text-slate-600">{review.vendor_reply}</p>
                  </div>
                </div>
              ) : replyingId === review.id ? (
                <ReplyForm review={review} onReplied={handleReplied} />
              ) : (
                <button
                  type="button"
                  onClick={() => setReplyingId(review.id)}
                  className="text-xs font-medium text-primary-600 hover:text-primary-700 mt-2"
                >
                  Reply
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VendorFeedback;
