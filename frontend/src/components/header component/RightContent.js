import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AccountIcon from "../../assets/icons/user.svg";
import { ProductContext } from "../../contexts/ProductContext";

function RightContent() {
  const { onSetShowCartList, onSetShowWishlist, addToCart, wishlists } =
    useContext(ProductContext);
  return (
    <div className="flex flex-row sm:gap-4 gap-2 items-center  ">
      <div className="border border-gray-300 sm:px-2 rounded  py-1 shadow-md">
        <select className="py-1">
          <option value="loc">Your Location</option>
        </select>
      </div>
      <div
        className="border border-gray-300 px-2 rounded py-2  shadow-md  relative"
        onClick={(e) => onSetShowCartList()}
      >
        <small className="bottom-5 left-6 absolute text-xs px-1 rounded-full border bg-green-500">
          {addToCart?.length}
        </small>
        <Link to={`cart/`}>
          <p>🛒cart</p>
        </Link>
      </div>
      <div className="border border-gray-300 px-2 rounded py-2  shadow-md  relative">
        <small className="bottom-5 left-6 absolute text-xs px-1 rounded-full border bg-green-500">
          {wishlists?.length}
        </small>
        <p onClick={(e) => onSetShowWishlist()}>💟wishlist</p>
      </div>
      <div className="border border-gray-300 sm:px-2 rounded  py-1 shadow-md flex flex-row items-center gap-2">
        <img src={AccountIcon} alt="accountIcon" className="w-6 h-6 " />
        <p>Account</p>
      </div>
      <Link to={`login/`}>
        <div>Login</div>
      </Link>
    </div>
  );
}

export default RightContent;
