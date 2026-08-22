import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const API_URL = process.env.REACT_APP_API_URL;

const WishlistContext = createContext();

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
  const { authTokens } = useAuth();

  const token = authTokens?.access;

  useEffect(() => {
    if (!token) {
      setWishlist([]);
      setLoading(false);
      return;
    }
    fetchWishlist();
  }, [token]);

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
      const response = await fetch(`${API_URL}/wishlist/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
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
      const response = await fetch(`${API_URL}/wishlist/add/`, {
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
      setMessage("");
      fetchWishlist();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateWishlistItem = async (itemId, newQunatity) => {
    try {
      const response = await fetch(
        `${API_URL}/wishlist/update/${itemId}/`,
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
    } finally {
      setLoading(false);
    }
  };

  const removeWishlistItem = async (itemId) => {
    try {
      const response = await fetch(
        `${API_URL}/wishlist/remove/${itemId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        fetchWishlist();
      }
    } catch (err) {
      setError(err.error);
    } finally {
      setLoading(false);
    }
  };

  const clearWishlist = async () => {
    try {
      const response = await fetch(`${API_URL}/wishlist/clear/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        fetchWishlist();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading("false");
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

export const useWishlist = () => useContext(WishlistContext);
