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
    autoplay: true,
    autoplaySpeed: 3000,
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
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default FeaturedProducts;
