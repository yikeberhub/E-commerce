import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductContext } from "../contexts/ProductContext.js";
import CategoryLists from "../components/CategoryLists.js";
import Breadcrumb from "../components/BreadCrumb.js";
import { useBreadcrumb } from "../contexts/BreadCrumbContext.js";

const Categories = () => {
  const { categories } = useContext(ProductContext);
  const { addBreadcrumb, clearBreadcrumbs } = useBreadcrumb();

  console.log("cat....", categories);

  const [searchTerm, setSearchTerm] = useState("");
  const [itemsToShow, setItemsToShow] = useState(50);
  const [sortOrder, setSortOrder] = useState("featured");

  useEffect(() => {
    clearBreadcrumbs();
    addBreadcrumb({ label: "Home", path: "/" });
    addBreadcrumb({ label: "Categories", path: "/categories" });
  }, []);

  if (!categories) return <div>Loading...</div>;

  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCategories = filteredCategories.sort((a, b) => {
    if (sortOrder === "featured") {
      return a.id - b.id;
    } else if (sortOrder === "alphabetical") {
      return a.title.localeCompare(b.title);
    }

    return 0;
  });

  return (
    <div className="bg-gray-100 min-h-screen mx-auto text-black container my-1">
      <div className="w-full mb-4 bg-gray-200 rounded-md py-6 mx-auto shadow-lg px-2 lg:px-10">
        <h2 className="text-3xl font-mono font-semibold mb-2">Categories</h2>
        <Breadcrumb />
      </div>

      <div>
        {/* Controls for filtering and sorting */}
        <div className="flex flex-row items-center justify-between mt-4 space-x-2">
          <h1 className="py-1 mx-2 text-3xl font-semibold font-mono shadow-sm">
            {categories?.length} Categories
          </h1>
          <input
            type="text"
            placeholder="Search Categories"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md p-2 mb-2 md:mb-0 md:mr-2 w-1/3 focus:outline-blue-500"
          />
          <select
            value={itemsToShow}
            onChange={(e) => setItemsToShow(Number(e.target.value))}
            className="border border-gray-300 rounded-md p-2 mb-2 md:mb-0 md:mr-2"
          >
            <option value={50}>Show 50</option>
            <option value={100}>Show 100</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="featured">Sort by Featured</option>
            <option value="alphabetical">Sort Alphabetically</option>
          </select>
        </div>
        <div className="flex flex-row gap-2 w-full">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-6 p-6 w-4/5">
            {sortedCategories.slice(0, itemsToShow).map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105"
              >
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-4/5  object-cover"
                />
                <Link to={`/categories/${category.id}`}>
                  <div className="px-3">
                    <h2 className="text-lg font-semibold">{category.title}</h2>
                    <p className="text-gray-600 font-mono text-sm">
                      {category.num_of_products} products
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <div className="w-1/5 ">
            <CategoryLists />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
