import React, { useContext, useState } from "react";
import ListComp from "../../utilities/ListComp";
import Card from "../../utilities/CardComp";
import { ProductContext } from "../../contexts/ProductContext";
import { useNavigate } from "react-router-dom";

function FilterByTags() {
  const { products, onFilterProducts } = useContext(ProductContext);
  const [price, setPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  console.log("price is", price);
  const handleSearch = () => {
    if (price !== 0) {
      console.log("price is", price);
      const filteredProducts = products.filter(
        (product) => product.price <= Number(price)
      );
      console.log(filteredProducts);

      onFilterProducts(filteredProducts);
      navigate(`search-product/?ld=${isLoading}`);
    }
  };
  return (
    <div>
      <Card title="By Price">
        <ListComp>
          <input
            onChange={(e) => setPrice(e.target.value)}
            type="range"
            min={1000}
            value={price}
            max={100000}
            className="w-full"
          />
          <p className="flex flex-row items-center justify-between">
            <span>from: $0.0 </span>
            <span>to:${price}.0</span>
          </p>
        </ListComp>

        <ListComp style={`my-2`}>
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="outline-none rounded-md bg-gray-50 border border-gray px-2 text-green py-2 my-2  w-full placeholder-blue-500 "
            placeholder="0"
          />
          <button
            type="submit"
            className="bg-blue-500 rounded-md px-2 py-2 my-1 mt-2 text-md font-semibold text-white w-full"
            onClick={(e) => handleSearch()}
          >
            filter
          </button>
        </ListComp>
      </Card>
    </div>
  );
}

export default FilterByTags;
