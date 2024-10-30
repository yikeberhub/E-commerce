import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const CommentForm = ({ vendorId, onClose }) => {
  const { user } = useAuth();

  const [name, setName] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !comment) {
      setError("All fields are required.");
      return;
    }

    console.log("Comment submitted:", { vendorId, name, email, comment });

    setName("");
    setEmail("");
    setComment("");

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-6 w-">
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 border border-gray-300 rounded"
        required
      />
      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border border-gray-300 rounded"
        required
      />
      <textarea
        placeholder="Your Comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="p-2 border border-gray-300 rounded"
        rows="4"
        cols="6"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
      >
        Submit Comment
      </button>
    </form>
  );
};

export default CommentForm;
