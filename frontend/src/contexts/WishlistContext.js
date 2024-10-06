import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WishlistContext = createContext();

// Provider component
export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [newWishlistItem, setNewWishlistItem] = useState({
    product_id: "",
    quantity: 1,
  });

  const [addedToWishlist, setAddedToWishlist] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchWishlist();
  }, []);

  const checkItemInWishlist = (product_id) => {
    let result = { isAdded: false, item: null };
    if (wishlist?.items?.length) {
      wishlist.items.map((item) => {
        if (item.product.id === product_id) {
          result["item"] = item;
          result["isAdded"] = true;
          return false;
        } else {
          return result;
        }
      });
    } else {
      return result;
    }
    return result;
  };

  const fetchWishlist = async () => {
    try {
      const response = await fetch("http://localhost:8000/wishlist/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        setMessage("please Login first!");
        navigate("/");
        throw new Error("failed to fetch wishlist");
      }
      const data = await response.json();
      setWishlist(data);
      setMessage("");
    } catch (err) {
      setError(err.errors);
    } finally {
      setLoading(false);
    }
  };

  const addWishlistItem = async (itemId, quantity) => {
    try {
      const response = await fetch("http://localhost:8000/wishlist/add/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_id: itemId, quantity }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        setMessage("Please login first!");
        navigate("/");
        throw new Error("Failed to add item to Wishlist.", errorResponse);
      }
      const data = await response.json();
      console.log("data:", data);
      setMessage("");
      fetchWishlist();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateWishlistItem = async (itemId, newQunatity) => {
    try {
      const response = await fetch(
        `http://localhost:8000/wishlist/update/${itemId}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: newQunatity }),
        }
      );
      if (!response.ok) {
        throw new Error("failed to update wishlist item.");
      }
      fetchWishlist();
    } catch (err) {
      setError(err.message);
    }
  };

  const removeWishlistItem = async (itemId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/wishlist/remove/${itemId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        const data = await response.json();
        fetchWishlist();
      }
    } catch (err) {
      setError(err.error);
    }
  };

  const clearWishlist = async () => {
    try {
      const response = await fetch("http://localhost:8000/wishlist/clear/", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      fetchWishlist();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        error,
        message,
        loading,
        newWishlistItem,
        addedToWishlist,
        setAddedToWishlist,
        checkItemInWishlist,
        setMessage,
        setNewWishlistItem,
        fetchWishlist,
        addWishlistItem,
        updateWishlistItem,
        removeWishlistItem,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use auth context
export const useWishlist = () => useContext(WishlistContext);
