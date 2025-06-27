import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/cartContext";

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
      className="relative mb-4 flex items-center bg-gray-50"
      onClick={() => handleNavigate(promotion.product.id)}
    >
      <img
        src={promotion.product.image}
        alt={promotion.product.title}
        className="w-auto h-72 object-cover rounded-lg shadow-lg"
      />

      <div className="absolute inset-0 flex flex-col justify-center items-center text-white bg-opacity-50 rounded-lg p-4">
        <h2 className="text-xl font-bold mb-2 text-blue-500">
          {promotion.product.title}
        </h2>
        <p className="text-md mb-2 text-center text-blue-400">
          {promotion.description}
        </p>
        <span className="bg-red-600 text-white font-bold px-4 py-2 rounded-full mb-2">
          {promotion.discount_percentage}%
        </span>
        <div className="flex space-x-2 mt-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={handleAddToCart}
          >
            {!addedToCart ? (
              <span>Add to Cart</span>
            ) : (
              <span>Remove from Cart</span>
            )}
          </button>
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded-lg"
            onClick={handleAddToWishlist}
          >
            {!addedToWishlist ? (
              <span>Add to Wishlist</span>
            ) : (
              <span>Remove from Wishlist</span>
            )}
          </button>
        </div>
        <p className="text-md mt-2">{promotion.product.title}</p>
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
        const response = await fetch("http://localhost:8000/promotions/");
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} right-0 top-1/2 transform -translate-y-1/2 z-10`}
        style={{
          ...style,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#007BFF",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          color: "#000000",
          cursor: "pointer",
          boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
        }}
        onClick={onClick}
        aria-label="Next"
      ></div>
    );
  };

  const SamplePrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} left-0 top-1/2 transform -translate-y-1/2 z-10`}
        style={{
          ...style,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#007BFF",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          color: "#000000",
          cursor: "pointer",
          boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
        }}
        onClick={onClick}
        aria-label="Previous"
      ></div>
    );
  };

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
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-4 text-black text-left mt-2 bg-gray-100">
          Promotion
        </h2>
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
