import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SummaryApi from "../common";

// Create CartContext
const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newItem, setNewItem] = useState({ product_id: "", quantity: 1 });

  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchCart();
  }, []);

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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addCartItem = async (itemId, quantity) => {
    try {
      const response = await fetch("http://localhost:8000/cart/add/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_id: itemId, quantity }),
      });

      if (!response.ok) {
        const errorResponse = await response.json(); // Get JSON error response
        console.error("Error adding item to cart:", errorResponse);
        throw new Error("Failed to add item to cart.");
      }
      fetchCart();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateCartItem = async (itemId, newQunatity) => {
    console.log("update item is called", itemId, newQunatity);
    try {
      const response = await fetch(
        `http://localhost:8000/cart/update/${itemId}/`,
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
    }
  };

  const removeCartItem = async (itemId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/cart/remove/${itemId}/`,
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
        fetchCart();
      }
    } catch (err) {
      setError(err.error);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch("http://localhost:8000/cart/clear/", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      fetchCart();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        error,
        loading,
        newItem,
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

// Custom hook to use auth context
export const useCart = () => useContext(CartContext);
