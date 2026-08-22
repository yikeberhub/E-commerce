import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiStar, FiMessageSquare } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import { inputClass } from "../common/formStyles";
import AccountIcon from "../assets/icons/user.svg";

const API_URL = process.env.REACT_APP_API_URL;

const StarPicker = ({ value, onChange }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((num) => (
      <button
        type="button"
        key={num}
        onClick={() => onChange(num)}
        aria-label={`${num} star${num > 1 ? "s" : ""}`}
        className="text-xl transition"
      >
        <FiStar
          className={
            num <= value
              ? "fill-current text-amber-400"
              : "text-slate-300 hover:text-amber-300"
          }
        />
      </button>
    ))}
  </div>
);

const ReviewSection = () => {
  const { id } = useParams();
  const { user, authTokens } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/products/${id}/reviews/`);
      if (!response.ok) throw new Error("Failed to fetch reviews");
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user || !rating) return;

    const reviewData = {
      comment: newReview,
      rating,
      product: id,
    };

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products/${id}/reviews/add/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify(reviewData),
      });
      if (!response.ok) throw new Error("Failed to submit review");

      const newReviewData = await response.json();
      setReviews((prevReviews) => [newReviewData, ...prevReviews]);
      setNewReview("");
      setRating(0);
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5 mt-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <FiMessageSquare className="text-primary-500" /> Reviews
      </h2>

      <div className="flex flex-col gap-4 mb-6">
        {reviews.length ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="flex gap-3 pb-4 border-b border-slate-100 last:border-b-0 last:pb-0"
            >
              <img
                src={review.user?.profile_image || AccountIcon}
                alt=""
                className="h-9 w-9 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800">
                  {review.user?.first_name || review.user?.username || "Anonymous"}
                </p>
                <div className="flex items-center gap-0.5 text-amber-400 my-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar
                      key={i}
                      className={
                        i < review.rating ? "fill-current" : "text-slate-200"
                      }
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-600">{review.comment}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">
            No reviews yet. Be the first to review this product!
          </p>
        )}
      </div>

      <div className="border-t border-slate-100 pt-4">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">
          Add a Review
        </h3>

        {!user ? (
          <p className="text-sm text-slate-500">
            Please log in to write a review.
          </p>
        ) : (
          <form onSubmit={handleReviewSubmit} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Your Rating
              </label>
              <StarPicker value={rating} onChange={setRating} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Your Review
              </label>
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                required
                placeholder="Write your review here"
                className={`${inputClass} min-h-[90px]`}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !rating}
              className="self-start bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-lg transition"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
