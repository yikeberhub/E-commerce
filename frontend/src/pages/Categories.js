import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductContext } from "../contexts/ProductContext.js";
import CategoryLists from "../components/CategoryLists.js";
import Breadcrumb from "../components/BreadCrumb.js";
import { useBreadcrumb } from "../contexts/BreadCrumbContext.js";
import { ProductGridSkeleton } from "../common/Skeleton";
import EmptyState from "../common/EmptyState";
import { selectClass, inputClass } from "../common/formStyles";

const Categories = () => {
  const { categories } = useContext(ProductContext);
  const { addBreadcrumb, clearBreadcrumbs } = useBreadcrumb();

  const [searchTerm, setSearchTerm] = useState("");
  const [itemsToShow, setItemsToShow] = useState(50);
  const [sortOrder, setSortOrder] = useState("featured");

  useEffect(() => {
    clearBreadcrumbs();
    addBreadcrumb({ label: "Home", path: "/" });
    addBreadcrumb({ label: "Categories", path: "/categories" });
  }, []);

  if (!categories) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-4">
        <ProductGridSkeleton count={8} columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" />
      </div>
    );
  }

  // The grid shows top-level categories only — each one's subcategories
  // are listed as chips on its card. A search still matches a category
  // by its own title or any of its subcategories' titles, so a search
  // for "sneakers" surfaces the "Fashion" card rather than nothing.
  const topLevelCategories = categories.filter((c) => !c.parent);
  const subcategoriesOf = (parentId) =>
    categories.filter((c) => c.parent === parentId);

  const term = searchTerm.toLowerCase();
  const filteredCategories = topLevelCategories.filter(
    (category) =>
      category.title.toLowerCase().includes(term) ||
      subcategoriesOf(category.id).some((sub) =>
        sub.title.toLowerCase().includes(term)
      )
  );

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (sortOrder === "featured") return a.id - b.id;
    if (sortOrder === "alphabetical") return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="bg-white rounded-xl shadow-card p-5 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
        <div className="mb-2">
          <Breadcrumb />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4">
          <h2 className="text-sm text-slate-500 shrink-0">
            {topLevelCategories.length} categories
          </h2>
          <input
            type="text"
            placeholder="Search categories"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${inputClass} sm:max-w-xs sm:ml-auto`}
          />
          <select
            value={itemsToShow}
            onChange={(e) => setItemsToShow(Number(e.target.value))}
            className={selectClass}
          >
            <option value={50}>Show 50</option>
            <option value={100}>Show 100</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className={selectClass}
          >
            <option value="featured">Sort by Featured</option>
            <option value="alphabetical">Sort Alphabetically</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          {sortedCategories.length === 0 ? (
            <EmptyState
              title="No categories found"
              description="Try a different search term."
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {sortedCategories.slice(0, itemsToShow).map((category) => (
                <div
                  key={category.id}
                  className="group bg-white rounded-xl border border-slate-100 shadow-card hover:shadow-soft hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                >
                  <Link to={`/categories/${category.id}`}>
                    <div className="aspect-square bg-slate-50 overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3 pb-2">
                      <h3 className="text-sm font-semibold text-slate-800 group-hover:text-primary-600 transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {category.num_of_products} products
                      </p>
                    </div>
                  </Link>
                  {subcategoriesOf(category.id).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 px-3 pb-3">
                      {subcategoriesOf(category.id).map((sub) => (
                        <Link
                          key={sub.id}
                          to={`/categories/${sub.id}`}
                          className="text-[11px] font-medium text-slate-500 bg-slate-50 hover:bg-primary-50 hover:text-primary-600 rounded-full px-2 py-0.5 transition-colors"
                        >
                          {sub.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
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
};

export default Categories;
