import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/cartContext";
import { Skeleton } from "../common/Skeleton";

const API_URL = process.env.REACT_APP_API_URL;

const PromotedProduct = ({ promotion }) => {
  const { newItem, checkItemInCart, addCartItem, removeCartItem } = useCart();
  const {
    addWishlistItem,
    removeWishlistItem,
    checkItemInWishlist,
    newWishlistItem,
  } = useWishlist();
  const navigate = useNavigate();

  const addedToCart = checkItemInCart(promotion.product.id)["isAdded"];
  const addedToWishlist = checkItemInWishlist(promotion.product.id)["isAdded"];

  const handleAddToCart = () => {
    const checkedResult = checkItemInCart(promotion.product.id);
    if (!checkedResult["isAdded"]) {
      addCartItem(promotion.product.id, newItem.quantity);
    } else {
      removeCartItem(checkedResult["item"].id);
    }
  };

  const handleAddToWishlist = () => {
    const checkedResult = checkItemInWishlist(promotion.product.id);
    if (!checkedResult["isAdded"]) {
      addWishlistItem(promotion.product.id, newWishlistItem.quantity);
    } else {
      removeWishlistItem(checkedResult["item"].id);
    }
  };
  const handleNavigate = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div
      className="relative mb-1 rounded-xl overflow-hidden cursor-pointer"
      onClick={() => handleNavigate(promotion.product.id)}
    >
      <img
        src={promotion.product.image}
        alt={promotion.product.title}
        className="w-full h-56 sm:h-72 object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end items-start text-white p-4 sm:p-6">
        <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full mb-2">
          {promotion.discount_percentage}% OFF
        </span>
        <h2 className="text-lg sm:text-2xl font-bold mb-1">
          {promotion.product.title}
        </h2>
        <p className="text-sm text-white/80 mb-3 max-w-md line-clamp-2">
          {promotion.description}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
          >
            {!addedToCart ? "Add to Cart" : "Remove from Cart"}
          </button>
          <button
            className="bg-white/90 hover:bg-white text-slate-800 text-sm font-medium px-4 py-2 rounded-lg transition"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToWishlist();
            }}
          >
            {!addedToWishlist ? "Add to Wishlist" : "Remove from Wishlist"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch(`${API_URL}/promotions/`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Fetched Promotions:", data);
        setPromotions(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-card p-4 sm:p-5 my-4">
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="w-full h-56 sm:h-72 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  const SampleNextArrow = ({ onClick }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label="Next"
      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center text-slate-700 hover:bg-white transition"
    >
      <FiChevronRight />
    </button>
  );

  const SamplePrevArrow = ({ onClick }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label="Previous"
      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center text-slate-700 hover:bg-white transition"
    >
      <FiChevronLeft />
    </button>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(promotions.length, 1),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(promotions.length, 1),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: Math.min(promotions.length, 1),
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    promotions.length !== 0 && (
      <div className="bg-white rounded-xl shadow-card p-4 sm:p-5 my-4">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Promotions</h2>
        <Slider {...settings}>
          {promotions.map((promotion) => (
            <PromotedProduct key={promotion.id} promotion={promotion} />
          ))}
        </Slider>
      </div>
    )
  );
};

export default Promotions;
