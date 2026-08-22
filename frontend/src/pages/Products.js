import React, { useContext, useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";
import { ProductContext } from "../contexts/ProductContext";
import ProductLists from "../components/ProductList";
import FilterByPrice from "../components/filters/FilterByPrice";
import FilterByTags from "../components/filters/FilterByTags";
import FilterByVendor from "../components/filters/FilterByVendor";
import FilterByCategory from "../components/filters/FilterByCategory";
import { useBreadcrumb } from "../contexts/BreadCrumbContext";
import Breadcrumb from "../components/BreadCrumb";
import DiscountFilter from "../components/filters/DiscountFilter";
import { selectClass } from "../common/formStyles";
import Drawer from "../common/Drawer";

function FilterByRating({ rating, onRatingChange }) {
  return (
    <select
      className={selectClass}
      value={rating}
      onChange={(e) => onRatingChange(e.target.value)}
    >
      <option value="All">All Ratings</option>
      <option value="1">1 Star &amp; Up</option>
      <option value="2">2 Stars &amp; Up</option>
      <option value="3">3 Stars &amp; Up</option>
      <option value="4">4 Stars &amp; Up</option>
      <option value="5">5 Stars</option>
    </select>
  );
}

function Products() {
  const { filteredProducts, filters, setFilter, resetFilters } =
    useContext(ProductContext);
  const { addBreadcrumb, clearBreadcrumbs } = useBreadcrumb();
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(20);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    resetFilters();
    clearBreadcrumbs();
    addBreadcrumb({ label: "Home", path: "/" });
    addBreadcrumb({ label: "Products", path: "/products" });
    return () => resetFilters();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts]);

  const handleDiscountChange = (value) => {
    setFilter("discount", value);
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleFilterByRating = (newRating) => {
    setFilter("rating", newRating);
  };

  const filterPanels = (
    <>
      <FilterByCategory />
      <FilterByVendor />
      <FilterByTags />
      <FilterByPrice />
      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-4">
        <h3 className="text-sm font-semibold text-slate-800 mb-3 pb-2 border-b border-slate-100">
          Rating
        </h3>
        <FilterByRating rating={filters.rating} onRatingChange={handleFilterByRating} />
      </div>
    </>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="bg-white rounded-xl shadow-card px-4 py-3 mb-4">
        <Breadcrumb />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters sidebar — desktop only */}
        <aside className="hidden lg:flex lg:w-64 shrink-0 flex-col gap-4">
          {filterPanels}
        </aside>

        {/* Products */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-row items-center gap-3 bg-white rounded-xl shadow-card px-4 py-3 mb-4">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="lg:hidden flex items-center gap-1.5 text-sm font-medium border border-slate-200 rounded-lg px-3 py-2 hover:border-primary-300 hover:text-primary-600 transition shrink-0"
            >
              <FaFilter className="text-xs" /> Filters
            </button>
            <select
              className={selectClass}
              value={filters.sortOrder}
              onChange={(e) => setFilter("sortOrder", e.target.value)}
            >
              <option value="default">Sort by featured</option>
              <option value="priceLowToHigh">Price: Low to High</option>
              <option value="priceHighToLow">Price: High to Low</option>
            </select>
            <span className="hidden sm:inline text-sm text-slate-500 ml-auto">
              Showing {currentProducts.length} of {filteredProducts.length}{" "}
              products
            </span>
            <div className="ml-auto sm:ml-0">
              <DiscountFilter
                selectedDiscount={filters.discount}
                onDiscountChange={handleDiscountChange}
              />
            </div>
          </div>

          <ProductLists products={currentProducts} />

          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 text-sm font-medium bg-white border border-slate-200 rounded-lg shadow-sm hover:border-primary-300 hover:text-primary-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-sm text-slate-500 px-2">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="px-4 py-2 text-sm font-medium bg-white border border-slate-200 rounded-lg shadow-sm hover:border-primary-300 hover:text-primary-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Filters — mobile/tablet drawer */}
      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
        position="bottom"
      >
        <div className="flex flex-col gap-4">{filterPanels}</div>
      </Drawer>
    </div>
  );
}

export default Products;
