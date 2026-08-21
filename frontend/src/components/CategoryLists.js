import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiLayers } from "react-icons/fi";
import Category from "./Category";
import Card from "../utilities/CardComp";
import { Skeleton } from "../common/Skeleton";

const API_URL = process.env.REACT_APP_API_URL;

const CategoryLists = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/products/categories/`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const categoryData = await response.json();
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Card title="Categories" icon={<FiLayers />}>
      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      ) : (
        <ul className="flex flex-col">
          {categories.map((category) => (
            <li key={category.id}>
              <Link to={`/categories/${category.id}`}>
                <Category category={category} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default CategoryLists;
