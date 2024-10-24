import React, { useContext, useState, useEffect } from "react";
import { ProductContext } from "../contexts/ProductContext";
import ProductLists from "../components/ProductList";
import FilterByPrice from "../components/filters/FilterByPrice";
import FilterByTags from "../components/filters/FilterByTags";
import FilterByVendor from "../components/filters/FilterByVendor";
import FilterByCategory from "../components/filters/FilterByCategory";
import { useBreadcrumb } from "../contexts/BreadCrumbContext";
import Breadcrumb from "../components/BreadCrumb";

function Products() {
  const { filteredProducts, onFilterProducts } = useContext(ProductContext);
  const { addBreadcrumb, clearBreadcrumbs } = useBreadcrumb();

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(20);
  const [sortOrder, setSortOrder] = useState("default");

  useEffect(() => {
    clearBreadcrumbs();
    addBreadcrumb({ label: "Home", path: "/" });
    addBreadcrumb({ label: "Products", path: "/products" });

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

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="container-fluid mx-auto">
      <div className="mx-2">
        <Breadcrumb />
      </div>
      <div className=" shadow-md">
        {/* Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mx-5 px-4 py-2 items-center shadow-md">
          <FilterByCategory />
          <FilterByVendor />
          <FilterByTags />
          <FilterByPrice />
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
