import React, { useEffect, useState, useContext } from "react";
import { FiGrid } from "react-icons/fi";
import Card from "../../utilities/CardComp";
import Checkbox from "../../common/Checkbox";
import { ProductContext } from "../../contexts/ProductContext";

const API_URL = process.env.REACT_APP_API_URL;

function FilterByCategory() {
  const { setFilter } = useContext(ProductContext);
  const [categories, setCategories] = useState([]);
  const [checkedCategories, setCheckedCategories] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/products/categories/`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const categoryData = await response.json();

        const initialChecked = categoryData.reduce((acc, category) => {
          acc[category.title] = false;
          return acc;
        }, {});

        setCategories(categoryData);
        setCheckedCategories(initialChecked);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCheckboxChange = (category) => {
    setCheckedCategories((prev) => {
      const newChecked = { ...prev, [category]: !prev[category] };

      const selectedCategories = Object.keys(newChecked).filter(
        (cat) => newChecked[cat]
      );

      setFilter("categoryTitles", selectedCategories);
      return newChecked;
    });
  };

  // Two levels: a top-level category's own checkbox selects everything
  // under it (ProductContext's category resolver treats a top-level
  // title as matching all its subcategories' products), and each
  // subcategory beneath it is its own, independently selectable row.
  const topLevel = categories.filter((c) => !c.parent);

  return (
    <Card title="Category" icon={<FiGrid />}>
      <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
        {topLevel.map((top) => (
          <div key={top.id}>
            <Checkbox
              checked={checkedCategories[top.title] || false}
              onChange={() => handleCheckboxChange(top.title)}
              label={top.title}
              icon={
                top.image && (
                  <img
                    src={top.image}
                    alt=""
                    className="w-6 h-6 rounded object-cover shrink-0"
                  />
                )
              }
            />
            <div className="flex flex-col gap-0.5 pl-6 mt-0.5">
              {categories
                .filter((c) => c.parent === top.id)
                .map((item) => (
                  <Checkbox
                    key={item.id}
                    checked={checkedCategories[item.title] || false}
                    onChange={() => handleCheckboxChange(item.title)}
                    label={item.title}
                    icon={
                      item.image && (
                        <img
                          src={item.image}
                          alt=""
                          className="w-5 h-5 rounded object-cover shrink-0"
                        />
                      )
                    }
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default FilterByCategory;
