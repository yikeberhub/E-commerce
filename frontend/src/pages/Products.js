import Mobile from "../assets/products/mobile/SAMSUNG Galaxy A03 (Black, 32 GB) (3 GB RAM) 3.webp";
import Earphone from "../assets/products/earphones/boAt Rockerz 103 Pro 3.webp";
import Mobile2 from "../assets/products/mobile/realme Narzo 50 (Speed Blue, 64 GB) (4 GB RAM) 4.webp";
import Camera from "../assets/products/camera/DIGITEK® (DTR 260 GT) Gorilla Tripod-Mini 33 CM (13 Inch) Tripod for Mobile Phone with Phone Mount & Remote, Flexible Gorilla Stand for DSLR & Action Cameras 2.jpg";

import React, { useContext } from "react";
import { ProductContext } from "../contexts/ProductContext";
import Card from "../utilities/CardComp";
import ListComp from "../utilities/ListComp";
import ProductLists from "../components/ProductList";

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

          <Card title="By Category">
            <ListComp style={`text-lg py-2 px-2 border rounded-sm shadow-sm`}>
              <p className="flex flex-row items-center gap-3">
                <input type="checkbox" name="vendor" />
                <img src={Mobile} alt="img" className="w-7 h-7 rounded-md" />
                <label className="ml-2">Laptop</label>
              </p>
            </ListComp>
            <ListComp style={`text-lg py-2 px-2 border rounded-sm shadow-sm`}>
              <p className="flex flex-row items-center gap-3">
                <input type="checkbox" name="vendor" />
                <img src={Camera} alt="img" className="w-7 h-7 rounded-md" />
                <label className="ml-2">Camera</label>
              </p>
            </ListComp>
            <ListComp style={`text-lg py-2 px-2 border rounded-sm shadow-sm`}>
              <p className="flex flex-row items-center gap-3">
                <input type="checkbox" name="vendor" />
                <img src={Mobile} alt="img" className="w-7 h-7 rounded-md" />
                <label className="ml-2">Tablet</label>
              </p>
            </ListComp>
            <ListComp style={`text-lg py-2 px-2 border rounded-sm shadow-sm`}>
              <p className="flex flex-row items-center gap-3">
                <input type="checkbox" name="vendor" />
                <img src={Earphone} alt="img" className="w-7 h-7 rounded-md" />
                <label className="ml-2">Earphone</label>
              </p>
            </ListComp>
          </Card>

          {/* by vendor */}
          <Card title="By vendor">
            <ListComp style={`text-lg py-2 px-2 border rounded-sm shadow-sm`}>
              <input type="checkbox" name="vendor" />
              <label className="ml-2">Samsung</label>
            </ListComp>
            <ListComp style={`text-lg py-2 px-2 border rounded-sm shadow-sm`}>
              <input type="checkbox" name="vendor" />
              <label className="ml-2">Dell</label>
            </ListComp>
            <ListComp style={`text-lg py-2 px-2 border rounded-sm shadow-sm`}>
              <input type="checkbox" name="vendor" />
              <label className="ml-2">Synix</label>
            </ListComp>
            <ListComp style={`text-lg py-2 px-2 border rounded-sm shadow-sm`}>
              <input type="checkbox" name="vendor" />
              <label className="ml-2">Lg</label>
            </ListComp>
          </Card>
          {/* by popular tags */}

          <Card title="Popular Tags">
            <div className="grid grid-col grid-cols-2">
              <ListComp style={`my-2`}>
                <button className="text-lg rounded-full px-3 py-1 my-2 text-green-600 border ">
                  <span className="text-2xl mr-2">&times;</span>{" "}
                  <span>Rogas</span>
                </button>
              </ListComp>
              <ListComp style={`my-2`}>
                <button className="text-lg rounded-full px-3 py-1 text-green-600 border">
                  <span className="text-2xl mr-2">&times;</span>{" "}
                  <span>Lenovo</span>
                </button>
              </ListComp>
              <ListComp style={`my-2`}>
                <button className="text-lg rounded-full px-3 py-1 text-green-600 border">
                  <span className="text-2xl mr-2">&times;</span>{" "}
                  <span>Dell</span>
                </button>
              </ListComp>
              <ListComp style={`my-2`}>
                <button className="text-lg rounded-full px-3 py-1 text-green-600 border">
                  <span className="text-2xl mr-2">&times;</span>{" "}
                  <span>Samsung</span>
                </button>
              </ListComp>
            </div>
          </Card>

          {/* by price */}
          <Card title="By Price">
            <ListComp>
              <input type="range" min={0} max={100} className="w-full" />
              <p className="flex flex-row items-center justify-between">
                <span>from: $0.0 </span>
                <span>to:$500.0</span>
              </p>
            </ListComp>

            <ListComp style={`my-2`}>
              <input
                type="number"
                min={0}
                className="`outline-none rounded-md bg-white border border-gray-500 px-2 text-green-500 py-2 my-2  w-full "
                placeholder="0"
              />
              <button
                type="submit"
                className="bg-blue-500 rounded-md px-2 py-2 mt-2 text-xl font-semibold text-white w-full"
              >
                filter
              </button>
            </ListComp>
          </Card>
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
