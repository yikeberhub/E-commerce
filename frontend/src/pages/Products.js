import Mobile from "../assets/products/mobile/SAMSUNG Galaxy A03 (Black, 32 GB) (3 GB RAM) 3.webp";
import Earphone from "../assets/products/earphones/boAt Rockerz 103 Pro 3.webp";
import Mobile2 from "../assets/products/mobile/realme Narzo 50 (Speed Blue, 64 GB) (4 GB RAM) 4.webp";
import Camera from "../assets/products/camera/DIGITEK® (DTR 260 GT) Gorilla Tripod-Mini 33 CM (13 Inch) Tripod for Mobile Phone with Phone Mount & Remote, Flexible Gorilla Stand for DSLR & Action Cameras 2.jpg";

import React, { useContext } from "react";
import { ProductContext } from "../contexts/ProductContext";
import Card from "../utilities/CardComp";
import ListComp from "../utilities/ListComp";
import ProductLists from "../components/ProductList";
import FilterByPrice from "../components/filters/FilterByPrice";
import FilterByTags from "../components/filters/FilterByTags";
import FilterByVendor from "../components/filters/FilterByVendor";
import FilterByCategory from "../components/filters/FilterByCategory";

function Products() {
  const { products } = useContext(ProductContext);

  return (
    <div className="container-fluid mx-auto px-2">
      <div className="mt-2 px-2 shadow-md ">
        <select className="py-2 px-r ml-4my-1 rounded shadow-sm bg-gray-200">
          <option value={4}>Filters</option>
        </select>
        <div className="grid grid-col sm:grid-cols-5 gap-2 mx-5 px-4 py-2 items-center  shadow-md">
          {/* by categories */}
          <FilterByCategory />

          {/* by vendor */}
          <FilterByVendor />
          {/* by popular tags */}

          <FilterByTags />

          {/* by price */}
          <FilterByPrice />
        </div>

        <div className="px-2 mx-2 py-2 mb-7">
          <div className="flex flex-row items-center gap-5">
            <select className="rounded border px-2 py-1">
              <option value={20}>📱Show 50</option>
            </select>
            <select
              className="py-1 rounded border px-4
            "
            >
              <option value={20}>⬇️⬆️Sort by featured</option>
            </select>
          </div>

          <ProductLists products={products} />
        </div>
      </div>
    </div>
  );
}

export default Products;
