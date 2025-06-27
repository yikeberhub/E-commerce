import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SummaryApi from "../common";

const ReviewSection = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  console.log("product id is", id);

  // Fetch reviews on component mount or when product id changes
  useEffect(() => {
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/products/${id}/reviews/`
      );
      if (!response.ok) throw new Error("Failed to fetch reviews");
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You need to be logged in to submit a review.");
      return;
    }

    const reviewData = {
      comment: newReview,
      rating,
      //   user: user.id,
      product: id,
    };

    console.log("review data is", reviewData);
    try {
      const token = localStorage.getItem("access");
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/products/${id}/reviews/add/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reviewData),
        }
      );
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
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-4">Reviews</h2>

      {/* Existing Reviews */}
      <div className="space-y-4 mb-4">
        {reviews.length ? (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-300 pb-4">
              <div className="flex flex-row space-x-2">
                <img
                  src={review.user.profile_image}
                  alt="img"
                  className="h-7 w-7 rounded-full"
                />
                <p className="text-lg font-semibold">
                  {review.user.first_name}
                </p>
              </div>
              <p className="text-yellow-500">
                {"⭐".repeat(review.rating)}( {review.rating})
              </p>
              <p className="text-gray-700">{review.comment}</p>
              <small className="text-gray-500">
                {new Date(review.created_at).toLocaleDateString()}
              </small>
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to review this product!</p>
        )}
      </div>

      {/* New Review Form */}
      <div className="border-t border-gray-300 pt-4">
        <h3 className="text-xl font-semibold mb-2">Add a Review</h3>
        <form onSubmit={handleReviewSubmit} className="space-y-3">
          <div>
            <label htmlFor="rating" className="block text-gray-700">
              Rating:
            </label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              required
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select Rating</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {"⭐".repeat(num)}({num})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="review" className="block text-gray-700">
              Review:
            </label>
            <textarea
              id="review"
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              required
              placeholder="Write your review here"
              className="w-full border border-gray-300 rounded-md p-2"
              rows="4"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewSection;
