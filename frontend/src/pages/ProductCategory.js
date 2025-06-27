import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../components/BreadCrumb";
import { useParams } from "react-router-dom";
import { ProductContext } from "../contexts/ProductContext";
import { useBreadcrumb } from "../contexts/BreadCrumbContext";
import CategoryLists from "../components/CategoryLists";

import Product from "../components/Product";

function ProductCategory() {
  const { products, filteredProducts, onFilterProducts } =
    useContext(ProductContext);
  const { addBreadcrumb, clearBreadcrumbs } = useBreadcrumb();
  const { id } = useParams("id");
  console.log("filtered context", products);

  useEffect(() => {
    const fetchProductsByCategory = () => {
      console.log("i am called");
      const productsInCategory = products.filter(
        (product) => product.category?.id === Number(id)
      );
      console.log("products filterred is", productsInCategory);
      onFilterProducts(productsInCategory);
    };

    fetchProductsByCategory();
  }, [id]);

  useEffect(() => {
    clearBreadcrumbs();
    addBreadcrumb({ label: "Home", path: "/" });
    addBreadcrumb({ label: "Categories", path: "/categories" });
    addBreadcrumb({ label: filteredProducts[0]?.category?.title });
  }, []);

  console.log("param", id);
  return (
    <div className=" min-h-screen mx-auto text-black container my-1">
      <div className="w-full mb-4 bg-gray-200 rounded-md py-6 mx-auto shadow-lg px-2 lg:px-10">
        <h2 className="text-3xl font-mono font-semibold mb-2">Categories</h2>
        <Breadcrumb />
      </div>
      <div className="mx-auto px-3  w-full shadow-sm bg-gray-50">
        <p className="text-md  px-2 py-1 text-fuchsia-500">
          We found {filteredProducts.length} products for you!
        </p>
      </div>
      <div className="flex flex-row gap-2 w-full">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-6 p-6 w-4/5">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105"
            >
              <Product product={product} />
            </div>
          ))}
        </div>
        <div className="w-1/5 ">
          <CategoryLists />
        </div>
      </div>
    </div>
  );
}

export default ProductCategory;
