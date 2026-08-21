import React, { useContext, useState } from "react";
import { FiDollarSign } from "react-icons/fi";
import Card from "../../utilities/CardComp";
import { ProductContext } from "../../contexts/ProductContext";
import { inputClass } from "../../common/formStyles";

function FilterByPrice() {
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
    <Card title="Price" icon={<FiDollarSign />}>
      <label className="block mb-2 text-xs font-medium text-slate-500">
        Up to <span className="text-slate-800 font-semibold">{price || 0} ETB</span>
      </label>
      <input
        onChange={(e) => setPrice(e.target.value)}
        type="range"
        min={0}
        value={price}
        max={100000}
        className="premium-range w-full"
      />

      <div className="flex items-center gap-2 mt-3">
        <input
          type="number"
          min={0}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={inputClass}
          placeholder="Enter price"
        />
        <button
          type="button"
          className="shrink-0 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-3 py-2 rounded-lg transition"
          onClick={handleSearch}
        >
          Go
        </button>
      </div>
    </Card>
  );
}

export default FilterByPrice;
