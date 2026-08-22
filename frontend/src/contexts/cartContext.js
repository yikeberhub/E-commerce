import React, { createContext, useState, useContext, useEffect } from "react";
import SummaryApi from "../common";
import { useAuth } from "./AuthContext";

const API_URL = process.env.REACT_APP_API_URL;

// Create CartContext
const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [newItem, setNewItem] = useState({ product_id: "", quantity: 1 });
  const { authTokens } = useAuth();

  const token = authTokens?.access;

  useEffect(() => {
    if (!token) {
      setCart([]);
      setLoading(false);
      return;
    }
    fetchCart();
  }, [token]);

  const checkItemInCart = (product_id) => {
    let result = { isAdded: false, item: null };
    if (cart?.items?.length) {
      cart.items.map((item) => {
        if (item.product.id === product_id) {
          result["item"] = item;
          result["isAdded"] = true;
          return result;
        } else {
          return result;
        }
      });
    } else {
      return result;
    }
    return result;
  };

  const fetchCart = async () => {
    try {
      const response = await fetch(SummaryApi.fetchCart.url, {
        method: SummaryApi.fetchCart.method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("failed to fetch cart");
      }
      const data = await response.json();
      setCart(data);
      setMessage("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addCartItem = async (itemId, quantity) => {
    try {
      const response = await fetch(`${API_URL}/cart/add/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_id: itemId, quantity }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        setMessage("please login first!");
        console.error("Error adding item to cart:", errorResponse);
        throw new Error("Failed to add item to cart.");
      }
      fetchCart();
      setMessage("");
    } catch (err) {
      setError(err.message);
    }
  };

  const updateCartItem = async (itemId, newQunatity) => {
    try {
      const response = await fetch(
        `${API_URL}/cart/update/${itemId}/`,
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
        throw new Error("failed to update cart item.");
      }
      fetchCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeCartItem = async (itemId) => {
    try {
      const response = await fetch(
        `${API_URL}/cart/remove/${itemId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        fetchCart();
      }
    } catch (err) {
      setError(err.error);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch(`${API_URL}/cart/clear/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response) {
        fetchCart();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        error,
        message,
        loading,
        newItem,
        checkItemInCart,
        setNewItem,
        fetchCart,
        addCartItem,
        updateCartItem,
        removeCartItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
