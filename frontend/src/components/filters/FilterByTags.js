import React, { useEffect, useState, useContext } from "react";
import ListComp from "../../utilities/ListComp";
import Card from "../../utilities/CardComp";
import { ProductContext } from "../../contexts/ProductContext"; // Assuming you have a context for products

function FilterByTag() {
  const { products, onFilterProducts } = useContext(ProductContext);
  const [tags, setTags] = useState([]); // State to hold tags
  const [selectedTags, setSelectedTags] = useState([]);

  // Fetch tags from the backend
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("http://localhost:8000/products/tags/"); // Adjust the URL as needed
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setTags(data); // Set tags from the response
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  const handleTagClick = (tag) => {
    setSelectedTags((prev) => {
      const newSelectedTags = prev.includes(tag)
        ? prev.filter((t) => t !== tag) // Remove tag if already selected
        : [...prev, tag]; // Add tag if not selected

      // Filter products based on selected tags
      const filteredProducts =
        newSelectedTags.length === 0
          ? products
          : products.filter((product) =>
              product.tags.some((productTag) =>
                newSelectedTags.includes(productTag.name)
              )
            );

      onFilterProducts(filteredProducts);
      return newSelectedTags;
    });
  };

  return (
    <div>
      <Card title="Popular Tags">
        <div className="grid grid-cols-2 gap-2">
          {tags.map((tag) => (
            <ListComp key={tag.id}>
              <button
                className={`flex w-fit items-center text-sm rounded-full px-2 text-white ${
                  selectedTags.includes(tag.name)
                    ? "bg-green-900"
                    : "bg-green-500"
                } border-gray-500 border-transparent hover:bg-green-700 transition-colors duration-200`}
                onClick={() => handleTagClick(tag.name)}
              >
                <span className="text-2xl mr-2">&times;</span>
                <span>{tag.name}</span>
              </button>
            </ListComp>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default FilterByTag;
