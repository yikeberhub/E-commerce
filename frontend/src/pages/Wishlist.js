import React, { Link, useContext } from "react";
import { ProductContext } from "../contexts/ProductContext";
import WishlistItem from "../components/WishlistItem";

function Wishlist() {
  const { wishlists } = useContext(ProductContext);
  return (
    <div className="col-span-5 grid grid-cols-6 border border-gray-200 shadow-md ">
      <div className="col-span-4 px-2">
        <h1 className="text-3xl mx-2 py-2">Your Wishlists</h1>
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
              {wishlists.map((product, key) => (
                <WishlistItem product={product} key={key} />
              ))}
            </tbody>
          </table>
          <div className="flex flex-row items-center justify-between px-2 py-2">
            {/* <Link to={`/`}> */}
            <button className="bg-green-500 mt-2 py-1 px-2 rounded text-white">
              Continue shoping
            </button>
            {/* </Link> */}

            <button className="bg-green-500 mt-1  py-2 px-2 rounded text-white">
              update wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Wishlist;
