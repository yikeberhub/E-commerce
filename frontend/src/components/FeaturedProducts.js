// FeaturedProducts.js
import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Product from "./Product";

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/products/featured/"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch featured products");
        }
        const data = await response.json();
        setFeaturedProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} right-0 top-1/2 transform -translate-y-1/2 z-10`}
        style={{
          ...style,
          display: "block",
          background: "transparent",
          border: "none",
        }}
        onClick={onClick}
        role="button"
        aria-label="Next"
      >
        <FaChevronRight className="text-gray-800 text-2xl" />
      </div>
    );
  };

  const SamplePrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} left-0 top-1/2 transform -translate-y-1/2 z-10`}
        style={{
          ...style,
          display: "block",
          background: "transparent",
          border: "none",
        }}
        onClick={onClick}
        role="button"
        aria-label="Previous"
      >
        <FaChevronLeft className="text-gray-800 text-2xl" />
      </div>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000, // Time in milliseconds to wait before transitioning to the next slide
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto my-8 bg-gray-100 ">
      <h2 className="text-2xl font-bold mb-4 text-black">Featured Products</h2>
      <Slider {...settings}>
        {featuredProducts.map((product) => (
          <div key={product.id} className="p-4">
            <Product product={product} />
            {/* <div className="flex flex-col items-center p-4 w-full bg-white shadow-lg rounded-lg transition-transform hover:scale-105 duration-300 relative">
              <Link to={`/product/${product.id}`} className="w-full">
                <img
                  src={product.image}
                  className="h-40 w-full rounded-md object-cover mb-2"
                  alt={product.title}
                />
                <h3 className="text-gray-900 text-lg font-semibold">
                  {product.title}
                </h3>
                <p className="text-green-600 font-bold">${product.price}</p>
                {product.discount_percentage > 0 && (
                  <span className="text-red-500 text-sm">
                    {product.discount_percentage}% off!
                  </span>
                )}
              </Link>
              <div className="flex justify-center mt-4 w-full space-x-4">
                <button
                  // onClick={handleAddToCart}
                  className="flex items-center bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
                >
                  <FaShoppingCart className="mr-1" /> Add to Cart
                </button>
                <button
                  // onClick={handleAddToWishlist}
                  className="flex items-center bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition duration-200"
                >
                  <FaHeart className="mr-1" /> Wishlist
                </button>
              </div>
            </div> */}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default FeaturedProducts;
