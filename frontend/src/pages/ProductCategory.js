import React, { useContext, useEffect } from "react";
import Breadcrumb from "../components/BreadCrumb";
import { useParams } from "react-router-dom";
import { ProductContext } from "../contexts/ProductContext";
import { useBreadcrumb } from "../contexts/BreadCrumbContext";
import CategoryLists from "../components/CategoryLists";
import EmptyState from "../common/EmptyState";

import Product from "../components/Product";

function ProductCategory() {
  const { filteredProducts, categories, setFilter, resetFilters } =
    useContext(ProductContext);
  const { addBreadcrumb, clearBreadcrumbs } = useBreadcrumb();
  const { id } = useParams("id");
  const currentCategory = categories.find((c) => c.id === Number(id));

  useEffect(() => {
    setFilter("categoryId", Number(id));
    return () => resetFilters();
  }, [id]);

  useEffect(() => {
    clearBreadcrumbs();
    addBreadcrumb({ label: "Home", path: "/" });
    addBreadcrumb({ label: "Categories", path: "/categories" });
    // Prefer the actual selected category's own title (works correctly
    // for a top-level category page too, where the first product's
    // *sub*category title would otherwise be shown instead).
    const label = currentCategory?.title || filteredProducts[0]?.category?.title;
    if (label) {
      addBreadcrumb({ label });
    }
  }, [id, filteredProducts, currentCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="bg-white rounded-xl shadow-card px-4 py-3 mb-4">
        <Breadcrumb />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-500 mb-4">
            We found {filteredProducts.length} product
            {filteredProducts.length === 1 ? "" : "s"} for you!
          </p>

          {filteredProducts.length === 0 ? (
            <EmptyState
              title="No products in this category"
              description="Check back later or browse other categories."
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <Product product={product} key={product.id} />
              ))}
            </div>
          )}
        </div>

        <aside className="w-full lg:w-64 shrink-0">
          <CategoryLists />
        </aside>
      </div>
    </div>
  );
}

export default ProductCategory;
