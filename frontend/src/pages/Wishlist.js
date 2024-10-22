import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import WishlistItem from "../components/WishlistItem";
import { useWishlist } from "../contexts/WishlistContext";
import { useAuth } from "../contexts/AuthContext";

function Wishlist() {
  const { wishlist, loading, message, fetchWishlist, clearWishlist } =
    useWishlist();
  const { user } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return alert(message);

  return (
    <div className="col-span-5 h-screen bg-bg_secondary text-gray_light grid grid-cols-6 border border-gray shadow-md ">
      <div className="col-span-4 px-2 sm:mx-2 sm:my-2">
        <h1 className="text-3xl mx-2 py-2 text-gray_lightest">
          Your Wishlists
        </h1>
        <p className="text-gray_lightest  py-1">
          You have{" "}
          {wishlist.length
            ? `${wishlist.items.length} Item in the wishlist`
            : "no Item in the wishlist"}{" "}
          .
        </p>
        <div className="bg-card rounded-md h-auto">
          <table className="table-auto w-full  shadow-lg">
            <thead>
              <tr className=" border  border-spacing-x-32">
                <th className="">product</th>
                <th className="">Title</th>
                <th className="">price</th>
                <th className="">Stock status</th>
                <th className="">Action</th>
                <th className="">Remove</th>
              </tr>
            </thead>
            <tbody>
              {wishlist.length === 0 ? (
                <div className="text-danger py-1 text-md text-center">
                  your wishlist is empty
                </div>
              ) : (
                wishlist.items.map((wishlistItem) => (
                  <WishlistItem
                    wishlistItem={wishlistItem}
                    key={wishlistItem.product.id}
                  />
                ))
              )}
            </tbody>
          </table>
          <div className="flex flex-row items-center justify-between px-2 py-2 my-2 ">
            <Link to={`/`}>
              <button className="bg-green mt-2 py-1 px-2 rounded text-white">
                Continue shoping
              </button>
            </Link>

            {wishlist.items && (
              <button
                className="bg-green mt-1  py-2 px-2 rounded text-white"
                onClick={clearWishlist}
              >
                clear wishlist
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Wishlist;
