import React, { useEffect, useState, useContext } from "react";
import ListComp from "../../utilities/ListComp";
import Card from "../../utilities/CardComp";
import { ProductContext } from "../../contexts/ProductContext"; // Assuming you have a context for products

function FilterByCategory() {
  const { products, onFilterProducts } = useContext(ProductContext);
  const [categories, setCategories] = useState([]);
  const [checkedCategories, setCheckedCategories] = useState({});

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

        // Initialize checked categories state
        const initialChecked = categoryData.reduce((acc, category) => {
          acc[category.title] = false; // Ensure category has a title property
          return acc;
        }, {});

        setCategories(categoryData);
        setCheckedCategories(initialChecked);
        console.log("Fetched categories:", categoryData); // Log fetched category data
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []); // No dependencies means this runs once on mount

  const handleCheckboxChange = (category) => {
    setCheckedCategories((prev) => {
      const newChecked = { ...prev, [category]: !prev[category] };

      const selectedCategories = Object.keys(newChecked).filter(
        (cat) => newChecked[cat]
      );

      const filteredProducts =
        selectedCategories.length === 0
          ? products
          : products.filter(
              (product) =>
                product.category &&
                selectedCategories.includes(product.category.title) // Ensure product.category is defined
            );

      onFilterProducts(filteredProducts);
      return newChecked;
    });
  };

  return (
    <div className="p-4">
      <Card title="By Category">
        <div className="flex flex-col space-y-3">
          {categories.map((item, index) => (
            <ListComp
              key={index}
              style={`text-lg py-2 px-2 border border-gray-200 rounded-md shadow-sm hover:shadow-lg transition-shadow duration-300`}
            >
              <p className="flex flex-row items-center gap-3">
                <input
                  type="checkbox"
                  name={item.title.toLowerCase()}
                  checked={checkedCategories[item.title] || false}
                  onChange={() => handleCheckboxChange(item.title)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                {item.image && (
                  <img
                    src={item.image} // Assuming category has an image property
                    alt={item.title}
                    className="w-8 h-8 rounded-md shadow-md"
                  />
                )}
                <label className="ml-2 text-gray-800 font-semibold hover:text-blue-600 transition-colors duration-200">
                  {item.title}
                </label>
              </p>
            </ListComp>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default FilterByCategory;
