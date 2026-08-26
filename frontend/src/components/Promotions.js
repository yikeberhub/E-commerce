import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { FiChevronLeft, FiChevronRight, FiZap, FiHeart, FiShoppingBag, FiCheck } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
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

  // The product's own price vs. old price is the single source of truth for
  // discount — the same numbers the Featured Products badge uses — so a
  // promoted product never shows a different % or price than its own card.
  const price = Number(promotion.product.price) || 0;
  const oldPrice = Number(promotion.product.old_price) || 0;
  const discountPct = Number(promotion.discount_percentage) || 0;
  const hasDiscount = discountPct > 0 && oldPrice > price;

  return (
    <div className="px-1">
      <div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-primary-900 to-slate-950 cursor-pointer shadow-soft"
        onClick={() => handleNavigate(promotion.product.id)}
      >
        <div className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl" />

        <div className="relative grid grid-cols-1 lg:grid-cols-2 items-center gap-6 lg:gap-10 p-6 sm:p-8 lg:p-12">
          <div className="order-2 lg:order-1 text-white">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-amber-300 mb-3">
              <FiZap className="text-xs" /> Limited-Time Offer
            </span>

            {hasDiscount && (
              <div className="inline-flex items-center gap-1 bg-amber-400 text-slate-900 rounded-lg px-3 py-1 mb-4 font-extrabold text-base shadow-lg shadow-amber-500/20">
                -{discountPct.toFixed(0)}% <span className="text-[11px] font-bold">OFF</span>
              </div>
            )}

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-2 line-clamp-2">
              {promotion.product.title}
            </h2>

            {promotion.description && (
              <p className="text-sm sm:text-base text-white/60 mb-5 max-w-md line-clamp-2">
                {promotion.description}
              </p>
            )}

            <div className="flex items-end gap-3 mb-6">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {price.toLocaleString()} ETB
              </span>
              {hasDiscount && (
                <span className="text-base text-white/40 line-through mb-1">
                  {oldPrice.toLocaleString()} ETB
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                className="flex items-center gap-2 bg-white text-slate-900 hover:bg-amber-300 font-semibold text-sm px-5 py-2.5 rounded-full transition shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart();
                }}
              >
                {addedToCart ? <FiCheck /> : <FiShoppingBag />}
                {addedToCart ? "In Your Cart" : "Shop Now"}
              </button>
              <button
                className="flex items-center gap-1.5 border border-white/25 text-white hover:bg-white/10 text-sm font-medium px-5 py-2.5 rounded-full transition"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToWishlist();
                }}
              >
                {addedToWishlist ? <FaHeart className="text-rose-400" /> : <FiHeart />}
                Wishlist
              </button>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative w-44 h-44 sm:w-60 sm:h-60 lg:w-80 lg:h-80">
              <div className="absolute inset-0 rounded-full bg-white/10 blur-2xl" />
              <div className="relative w-full h-full rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/10 p-5 sm:p-7 flex items-center justify-center shadow-2xl">
                <img
                  src={promotion.product.image}
                  alt={promotion.product.title}
                  className="max-w-full max-h-full object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
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
    return <Skeleton className="w-full h-64 sm:h-80 rounded-2xl my-4" />;
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
    autoplaySpeed: 4000,
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
      <div className="my-4 promo-slider">
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
