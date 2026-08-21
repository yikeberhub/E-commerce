// FeaturedProducts.js
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Product from "./Product";
import { ProductGridSkeleton } from "../common/Skeleton";

const API_URL = process.env.REACT_APP_API_URL;

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products/featured/`);
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

  const SampleNextArrow = ({ onClick }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label="Next"
      className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-slate-600 hover:text-primary-600 hover:border-primary-200 transition"
    >
      <FiChevronRight />
    </button>
  );

  const SamplePrevArrow = ({ onClick }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label="Previous"
      className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-slate-600 hover:text-primary-600 hover:border-primary-200 transition"
    >
      <FiChevronLeft />
    </button>
  );

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

  if (loading)
    return (
      <div className="bg-white rounded-xl shadow-card p-4 sm:p-5 my-4">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Featured Products
        </h2>
        <ProductGridSkeleton count={5} columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" />
      </div>
    );
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!featuredProducts.length) return null;

  return (
    <div className="bg-white rounded-xl shadow-card p-4 sm:p-5 my-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">
        Featured Products
      </h2>
      <Slider {...settings}>
        {featuredProducts.map((product) => (
          <div key={product.id} className="p-2">
            <Product product={product} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default FeaturedProducts;
