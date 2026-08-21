import React from "react";
import { Link } from "react-router-dom";
import WishlistItem from "../components/WishlistItem";
import { useWishlist } from "../contexts/WishlistContext";
import { useAuth } from "../contexts/AuthContext";
import { RowSkeleton } from "../common/Skeleton";
import EmptyState from "../common/EmptyState";

function Wishlist() {
  const { wishlist, loading, clearWishlist } = useWishlist();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <EmptyState
          title="Please log in to view your wishlist"
          description="Sign in to see items you've saved for later."
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
    <div className="max-w-4xl mx-auto px-4 py-4">
      <div className="bg-white rounded-xl shadow-card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Your Wishlist
          </h1>
          <span className="text-sm text-slate-500">
            {wishlist?.items?.length
              ? `${wishlist.items.length} item${wishlist.items.length === 1 ? "" : "s"}`
              : "Empty"}
          </span>
        </div>

        {loading ? (
          <RowSkeleton count={3} />
        ) : !wishlist?.items?.length ? (
          <EmptyState
            title="Your wishlist is empty"
            description="Save products you like so you can find them later."
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
              {wishlist.items.map((wishlistItem) => (
                <WishlistItem
                  wishlistItem={wishlistItem}
                  key={wishlistItem.product.id}
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
                onClick={clearWishlist}
              >
                Clear wishlist
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default Wishlist;
