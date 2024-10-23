import React, { useContext, useState } from "react";
import ListComp from "../../utilities/ListComp";
import Card from "../../utilities/CardComp";
import { ProductContext } from "../../contexts/ProductContext";

function FilterByTags() {
  const { products, onFilterProducts } = useContext(ProductContext);
  const [price, setPrice] = useState(0);

  const handleSearch = () => {
    if (price > 0) {
      const filteredProducts = products.filter(
        (product) => product.price <= Number(price)
      );

      onFilterProducts(filteredProducts);
    }
  };

  return (
    <div className="p-4">
      <Card title="Filter by Price" className="shadow-lg rounded-lg">
        <ListComp>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Select Price Range:
          </label>
          <input
            onChange={(e) => setPrice(e.target.value)}
            type="range"
            min={1000}
            value={price}
            max={100000}
            className="w-full h-2 bg-green-500 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-500">from: $0.0</span>
            <span className="text-gray-500">to: ${price}.0</span>
          </div>
        </ListComp>

        <ListComp style="my-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Or Enter Price:
          </label>
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="outline-none rounded-md bg-gray-50 border border-gray-300 px-3 py-2 w-full placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200"
            placeholder="Enter price"
          />
          <button
            type="button"
            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-150"
            onClick={handleSearch}
          >
            Filter
          </button>
        </ListComp>
      </Card>
    </div>
  );
}

export default FilterByTags;
