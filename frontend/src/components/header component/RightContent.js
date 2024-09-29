import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AccountIcon from "../../assets/icons/user.svg";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/cartContext";
import LogButton from "../../common/LogButton";

function RightContent() {
  const { cart } = useCart();
  const { user } = useAuth();

  return (
    <div className="flex flex-row sm:gap-4 gap-2 items-center  ">
      <div className="border border-gray-300 sm:px-2 rounded  py-1 shadow-md">
        <select className="py-1">
          <option value="loc">Your Location</option>
        </select>
      </div>
      <div className="border border-gray-300 px-2 rounded py-2  shadow-md  relative">
        <small className="bottom-5 left-6 absolute text-xs px-1 rounded-full border bg-green-500">
          {cart?.items?.length}
        </small>
        <Link to={`cart/`}>
          <p>🛒cart</p>
        </Link>
      </div>
      <div className="border border-gray-300 px-2 rounded py-2  shadow-md  relative">
        <small className="bottom-5 left-6 absolute text-xs px-1 rounded-full border bg-green-500"></small>
        <Link to={`wishlist/`}>
          <p>💟wishlist</p>
        </Link>
      </div>
      <div className="border border-gray-300 sm:px-2 rounded  py-1 shadow-md flex flex-row items-center gap-2">
        <img
          src={user ? user.profile_image : AccountIcon}
          alt="accountIcon"
          className="w-6 h-6 rounded-md"
        />
        <p>{user ? user.username : "Account"}</p>
      </div>
      <LogButton />
    </div>
  );
}

export default RightContent;
