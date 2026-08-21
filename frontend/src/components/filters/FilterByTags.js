import React, { useEffect, useState, useContext } from "react";
import { FiHash } from "react-icons/fi";
import Card from "../../utilities/CardComp";
import { ProductContext } from "../../contexts/ProductContext";

const API_URL = process.env.REACT_APP_API_URL;

function FilterByTag() {
  const { products, onFilterProducts } = useContext(ProductContext);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`${API_URL}/products/tags/`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setTags(data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  const handleTagClick = (tag) => {
    setSelectedTags((prev) => {
      const newSelectedTags = prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag];

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
    <Card title="Popular Tags" icon={<FiHash />}>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const active = selectedTags.includes(tag.name);
          return (
            <button
              key={tag.id}
              type="button"
              className={`text-xs font-medium rounded-full px-3 py-1.5 border transition-colors duration-200 ${
                active
                  ? "bg-primary-600 border-primary-600 text-white"
                  : "bg-white border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-600"
              }`}
              onClick={() => handleTagClick(tag.name)}
            >
              {tag.name}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

export default FilterByTag;
