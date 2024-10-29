import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Category from "./Category";
import { ProductContext } from "../contexts/ProductContext";

const CategoryLists = () => {
  const { products } = useContext(ProductContext);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/products/categories/"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const categoryData = await response.json();
        setCategories(categoryData);
        console.log("Fetched categories:", categoryData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-white py-2 shadow-md shadow-gray-300 rounded mt-4 mx-2 px-2 mb-4">
      <h3 className="px-2 font-bold text-gray-900 text-lg py-2 rounded border-b border-green-500">
        Categories
      </h3>
      <ul className="bg-gray-50">
        {categories.map((category) => (
          <li key={category.id}>
            <Link to={`/category/${category.title}`}>
              <Category category={category} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryLists;
