import React, { useContext, useState, useEffect } from "react";
import { ProductContext } from "../contexts/ProductContext";
import ProductLists from "../components/ProductList";
import FilterByPrice from "../components/filters/FilterByPrice";
import FilterByTags from "../components/filters/FilterByTags";
import FilterByVendor from "../components/filters/FilterByVendor";
import FilterByCategory from "../components/filters/FilterByCategory";
import { useBreadcrumb } from "../contexts/BreadCrumbContext";
import Breadcrumb from "../components/BreadCrumb";

function FilterByRating({ onRatingChange }) {
  return (
    <div className="flex flex-col">
      <label className="text-gray-700">Filter by Rating:</label>
      <select
        className="rounded border px-2 py-1"
        onChange={(e) => onRatingChange(e.target.value)}
      >
        <option value="All">All Ratings</option>
        <option value="1">1 Star & Up</option>
        <option value="2">2 Stars & Up</option>
        <option value="3">3 Stars & Up</option>
        <option value="4">4 Stars & Up</option>
        <option value="5">5 Stars</option>
      </select>
    </div>
  );
}

function Products() {
  const { filteredProducts, onFilterProducts } = useContext(ProductContext);
  const { addBreadcrumb, clearBreadcrumbs } = useBreadcrumb();
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(20);
  const [sortOrder, setSortOrder] = useState("default");
  const [rating, setRating] = useState("All");

  useEffect(() => {
    clearBreadcrumbs();
    addBreadcrumb({ label: "Home", path: "/" });
    addBreadcrumb({ label: "Products", path: "/products" });
  }, []);

  useEffect(() => {
    const sortProducts = () => {
      const sorted = [...filteredProducts].sort((a, b) => {
        if (sortOrder === "priceLowToHigh") return a.price - b.price;
        if (sortOrder === "priceHighToLow") return b.price - a.price;
        return 0;
      });
      onFilterProducts(sorted);
    };

    sortProducts();
  }, [sortOrder]);

  useEffect(() => {
    const filterByRating = () => {
      let filtered = filteredProducts;
      console.log("filtered", filtered);
      console.log("rating", rating);
      // Filter by rating
      if (rating !== "All") {
        filtered = filtered.filter(
          (product) => product.average_rating <= Number(rating)
        );
      }

      onFilterProducts(filtered);
    };

    filterByRating();
  }, [rating]);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleFilterByRating = (newRating) => {
    setRating(newRating);
  };

  return (
    <div className="container-fluid mx-auto">
      <div className="mx-2 text-sm">
        <Breadcrumb />
      </div>
      <div className="shadow-md py-0">
        {/* Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mx-5 px-4 py-2 items-baseline shadow-md">
          <FilterByCategory />
          <FilterByVendor />
          <FilterByTags />
          <FilterByPrice />
          <FilterByRating onRatingChange={handleFilterByRating} />
        </div>

        {/* Sorting and Display Options */}
        <div className="flex flex-row items-center justify-between px-4 py-2 mb-4">
          <select
            className="rounded border px-2 py-1"
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="default">⬇️⬆️ Sort by featured</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
          </select>

          <span className="text-gray-600">
            Showing {currentProducts.length} of {filteredProducts.length}{" "}
            products
          </span>
        </div>

        {/* Product List */}
        <ProductLists products={currentProducts} />

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 mx-1 bg-gray-300 rounded hover:bg-gray-400"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-4 py-2 mx-1 bg-gray-300 rounded hover:bg-gray-400"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Products;
