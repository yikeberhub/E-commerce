import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingBag, FiHeart } from "react-icons/fi";
import AccountIcon from "../../assets/icons/user.svg";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/cartContext";
import LogButton from "../../common/LogButton";
import AlertModal from "../../common/AlertModal";
import { useWishlist } from "../../contexts/WishlistContext";

const IconBadge = ({ count }) =>
  count > 0 ? (
    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-semibold text-white bg-primary-600 rounded-full">
      {count}
    </span>
  ) : null;

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
    <div className="flex flex-row gap-3 items-center">
      {alertVisible && (
        <AlertModal
          message={alertMessage}
          type={alertType}
          isVisible={alertVisible}
          onClose={handleCloseAlert}
        />
      )}

      {!user ? (
        <button
          type="button"
          onClick={handleNavigation}
          className="relative w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center transition"
        >
          <FiShoppingBag className="text-lg text-slate-600" />
          <IconBadge count={cart?.items?.length} />
        </button>
      ) : (
        <Link
          to="/cart"
          className="relative w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center transition"
        >
          <FiShoppingBag className="text-lg text-slate-600" />
          <IconBadge count={cart?.items?.length} />
        </Link>
      )}

      {!user ? (
        <button
          type="button"
          onClick={handleNavigation}
          className="relative w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center transition"
        >
          <FiHeart className="text-lg text-slate-600" />
          <IconBadge count={wishlist?.items?.length} />
        </button>
      ) : (
        <Link
          to="/wishlist"
          className="relative w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center transition"
        >
          <FiHeart className="text-lg text-slate-600" />
          <IconBadge count={wishlist?.items?.length} />
        </Link>
      )}

      {user && (
        <Link
          to="/user-dashboard"
          className="hidden sm:flex items-center gap-2 border border-slate-200 rounded-full pl-1 pr-3 py-1 hover:border-primary-300 transition"
        >
          <img
            src={user.profile_image || AccountIcon}
            alt=""
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-sm text-slate-700">{user.first_name}</span>
        </Link>
      )}

      <LogButton />
    </div>
  );
}

export default RightContent;
