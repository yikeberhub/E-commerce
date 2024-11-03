import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AccountIcon from "../../assets/icons/user.svg";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/cartContext";
import LogButton from "../../common/LogButton";
import AddCartIcon from "../../assets/icons/images/cart.png";
import AddWishlistIcon from "../../assets/icons/images/wishlist_purple.png";
import AlertModal from "../../common/AlertModal";
import { useWishlist } from "../../contexts/WishlistContext";

function RightContent() {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const handleNavigation = () => {
    if (!user) {
      setAlertMessage("Please login first to add items!");
      setAlertVisible(true);
      setAlertType("error");
    }
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
    navigate("/login");
  };

  return (
    <div className="flex flex-row sm:gap-4 gap-2 items-center">
      {alertVisible && (
        <AlertModal
          message={alertMessage}
          type={alertType}
          isVisible={alertVisible}
          onClose={handleCloseAlert}
        />
      )}

      <div className="bg-white border border-gray_lighter px-2 rounded py-1 shadow-md relative">
        <small className="bottom-5 left-6 absolute text-xs px-1 rounded-full bg-green-500">
          {cart?.items?.length}
        </small>
        {!user ? (
          <div onClick={handleNavigation}>
            <img
              src={AddCartIcon}
              alt="cart_icon"
              className="w-7 h-7 cursor-pointer"
            />
          </div>
        ) : (
          <Link to={`cart/`}>
            <img src={AddCartIcon} alt="cart_icon" className="w-7 h-7" />
          </Link>
        )}
      </div>

      <div className="bg-white border border-gray_lighter px-2 rounded py-1 shadow-md relative">
        <small className="bottom-5 left-6 absolute text-xs px-1 rounded-full bg-red-500">
          {wishlist?.items?.length}
        </small>
        {!user ? (
          <div onClick={handleNavigation}>
            <img
              src={AddWishlistIcon}
              alt="wishlist_icon"
              className="w-7 h-7 cursor-pointer"
            />
          </div>
        ) : (
          <Link to={`wishlist/`}>
            <img
              src={AddWishlistIcon}
              alt="wishlist_icon"
              className="w-7 h-7"
            />
          </Link>
        )}
      </div>

      {user && (
        <Link to={`/user-dashboard/`}>
          <div className="bg-white border border-gray_lighter sm:px-2 rounded py-1 shadow-md flex flex-row items-center gap-2">
            <img
              src={user.profile_image || AccountIcon}
              alt="accountIcon"
              className="w-6 h-6 rounded-md"
            />
            <p className="font-sans text-gray">{user.first_name}</p>
          </div>
        </Link>
      )}

      <LogButton />
    </div>
  );
}

export default RightContent;
