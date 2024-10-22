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
      <select className="py-1 bg-card outline-gray border rounded-sm border-gray_lighter text-gray_lighter ">
        <option value="location" className="bg-bg_secondary text-gray_light">
          Your Location
        </option>
        <option value="Electronics">Electronics</option>
        <option value="Fashion">Fashion</option>
        <option value="Home">Home</option>
      </select>

      <div className="bg-white border border-gray_lighter px-2 rounded py-1  shadow-md  relative">
        <small className="bottom-5 left-6 absolute text-xs px-1 rounded-full  bg-green-500">
          {cart?.items?.length}
        </small>
        <Link to={`cart/`}>
          <p>
            <img src={AddCartIcon} alt="cart_icon" className="w-7 h-7" />
          </p>
        </Link>
      </div>
      <div className=" bg-white border  border-gray_lighter px-2 rounded py-1  shadow-md  relative">
        <small className="bottom-5 left-6 absolute text-xs px-1 rounded-full  bg-red-500">
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
        <div className="bg-white border border-gray_lighter sm:px-2 rounded  py-1 shadow-md flex flex-row items-center gap-2">
          <img
            src={user ? user.profile_image : AccountIcon}
            alt="accountIcon"
            className="w-6 h-6 rounded-md"
          />
          <p className="font-sans text-gray">
            {user ? user.username : "Account"}
          </p>
        </div>
      </Link>
      <LogButton />
    </div>
  );
}

export default RightContent;
