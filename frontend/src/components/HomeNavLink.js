import React, { useContext, useEffect, useState } from "react";
import { ProductContext } from "../contexts/ProductContext";

function HomeNavLink() {
  const { products, onFilterProducts } = useContext(ProductContext);
  const [categories, setCategories] = useState([]);

  console.log("categories home nav", categories);

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/products/categories/"
        ); // Adjust the URL as needed
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    if (category === "All") {
      onFilterProducts(products);
    } else {
      const filteredProducts = products.filter(
        (product) => product?.category?.title === category
      );
      console.log("filtered products in navlink", filteredProducts);
      onFilterProducts(filteredProducts);
    }
  };

  return (
    <div className="flex flex-col bg-card md:flex-row justify-between items-center mx-2 container-md my-4 py-4">
      <h1 className="text-3xl font-bold text-gray-800 py-2">
        Popular Products
      </h1>
      <ul className="flex flex-row justify-between items-center mx-2 py-2 gap-4">
        <li
          className="text-lg hover:text-xl hover:cursor-pointer hover:border-b-2 hover:border-b-yellow-200 hover:rounded-b-md px-2 py-2 text-black transition-all duration-200 ease-in-out"
          onClick={() => handleCategoryClick("All")}
        >
          All
        </li>
        {categories.map((category, index) => (
          <li
            key={index}
            className="text-lg hover:text-xl hover:cursor-pointer hover:border-b-2 hover:border-b-yellow-200 hover:rounded-b-md px-2 py-2 text-black transition-all duration-200 ease-in-out"
            onClick={() => handleCategoryClick(category.title)}
          >
            {category.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomeNavLink;
