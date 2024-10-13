import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import WishlistItem from "../components/WishlistItem";
import { useWishlist } from "../contexts/WishlistContext";
import { useAuth } from "../contexts/AuthContext";

function Wishlist() {
  const { wishlist, loading, message, fetchWishlist, clearWishlist } =
    useWishlist();
  const { user } = useAuth();

  // useEffect(() => {
  //   fetchWishlist();
  // }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return alert(message);

  return (
    <div className="col-span-5 grid grid-cols-6 border border-gray-200 shadow-md ">
      <div className="col-span-4 px-2">
        <h1 className="text-3xl mx-2 py-2">Your Wishlists</h1>
        <p>
          You have{" "}
          {wishlist.length
            ? `${wishlist.items.length} Item in the wishlist`
            : "no Item in the wishlist"}{" "}
          .
        </p>
        <div className="bg-gray-50 h-64">
          <table className="table-auto w-full  shadow-lg">
            <thead>
              <tr className="bg-gray-200 border  border-spacing-x-32">
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
                <div>your wishlist is empty</div>
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
          <div className="flex flex-row items-center justify-between px-2 py-2">
            <Link to={`/`}>
              <button className="bg-green-500 mt-2 py-1 px-2 rounded text-white">
                Continue shoping
              </button>
            </Link>

            {wishlist.items && (
              <button
                className="bg-green-500 mt-1  py-2 px-2 rounded text-white"
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
