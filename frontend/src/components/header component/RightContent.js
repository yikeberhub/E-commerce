import React from "react";
import { Link } from "react-router-dom";
import AccountIcon from "../../assets/icons/user.svg";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/cartContext";
import LogButton from "../../common/LogButton";
import AddCartIcon from "../../assets/icons/images/cart.png";
import AddWishlistIcon from "../../assets/icons/images/wishlist_purple.png";

import { useWishlist } from "../../contexts/WishlistContext";

function RightContent() {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user } = useAuth();

  return (
    <div className="flex flex-row sm:gap-4 gap-2 items-center  ">
      <div className="border border-gray-300 sm:px-2 rounded  py-1 shadow-md">
        <select className="py-1">
          <option value="loc">Your Location</option>
        </select>
      </div>
      <div className="border border-gray-300 px-2 rounded py-1  shadow-md  relative">
        <small className="bottom-5 left-6 absolute text-xs px-1 rounded-full border bg-green-500">
          {cart?.items?.length}
        </small>
        <Link to={`cart/`}>
          <p>
            <img src={AddCartIcon} alt="cart_icon" className="w-7 h-7" />
          </p>
        </Link>
      </div>
      <div className="border border-gray-300 px-2 rounded py-1  shadow-md  relative">
        <small className="bottom-5 left-6 absolute text-xs px-1 rounded-full border bg-green-500">
          {wishlist?.items?.length}
        </small>{" "}
        <Link to={`wishlist/`}>
          <p>
            <img
              src={AddWishlistIcon}
              alt="wishlist_icon"
              className="w-7 h-7 "
            />
          </p>
        </Link>
      </div>
      <Link to={`/dashboard/`}>
        <div className="border border-gray-300 sm:px-2 rounded  py-1 shadow-md flex flex-row items-center gap-2">
          <img
            src={user ? user.profile_image : AccountIcon}
            alt="accountIcon"
            className="w-6 h-6 rounded-md"
          />
          <p className="font-sans ">{user ? user.username : "Account"}</p>
        </div>
      </Link>
      <LogButton />
    </div>
  );
}

export default RightContent;
