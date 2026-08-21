import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import ProceedCheckout from "../components/ProceedCheckout";
import { useCart } from "../contexts/cartContext";
import { useAuth } from "../contexts/AuthContext";
import { RowSkeleton } from "../common/Skeleton";
import EmptyState from "../common/EmptyState";

const CartLists = () => {
  const { cart, loading, message, fetchCart, clearCart } = useCart();
  const [itemsTotalPrice, setItemsTotalPrice] = useState(0);
  const [shipingPrice, setShipingPrice] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    calculateItemPrice();
  }, [cart]);

  const calculateItemPrice = () => {
    if (cart?.items?.length) {
      const itemsTotalPrice = cart.items.reduce(
        (acc, item) => acc + item.quantity * item.product.price,
        0
      );
      setItemsTotalPrice(itemsTotalPrice);
    } else {
      setItemsTotalPrice(0);
    }
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <EmptyState
          title="Please log in to view your cart"
          description="Sign in to see items you've added to your cart."
          action={
            <Link
              to="/login"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              Log in
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl shadow-card p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Your Cart
              </h1>
              <span className="text-sm text-slate-500">
                {cart?.items?.length
                  ? `${cart.items.length} item${cart.items.length === 1 ? "" : "s"}`
                  : "Empty"}
              </span>
            </div>

            {loading ? (
              <RowSkeleton count={3} />
            ) : !cart?.items?.length ? (
              <EmptyState
                title="Your cart is empty"
                description="Browse products and add something you like."
                action={
                  <Link
                    to="/products"
                    className="inline-block bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                  >
                    Browse products
                  </Link>
                }
              />
            ) : (
              <>
                <div className="flex flex-col gap-3">
                  {cart.items.map((cartItem) => (
                    <CartItem
                      cartItem={cartItem}
                      calculateItemPrice={calculateItemPrice}
                      key={cartItem.product.id}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-100">
                  <Link
                    to="/"
                    className="text-sm font-medium text-slate-600 hover:text-primary-600 transition"
                  >
                    ← Continue shopping
                  </Link>
                  <button
                    className="text-sm font-medium text-red-500 hover:text-red-600 transition"
                    onClick={() => clearCart()}
                  >
                    Clear cart
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="w-full lg:w-80 shrink-0">
          <ProceedCheckout
            cart={cart}
            itemsTotalPrice={itemsTotalPrice}
            shipingPrice={shipingPrice}
          />
        </div>
      </div>
    </div>
  );
};

export default CartLists;
