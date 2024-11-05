// ProductManagement.js
import React, { useContext, useState } from "react";
import { ProductContext } from "../../contexts/ProductContext";
import { faL } from "@fortawesome/free-solid-svg-icons";
import AddProductForm from "./AdminComponent/AddProductForm";

const ProductManagement = () => {
  const { products } = useContext(ProductContext);

  const [isOpened, setIsOpened] = useState(false);
  console.log("products", products);

  const handleIsOpened = () => {
    setIsOpened((prev) => !prev);
  };
  return (
    <section className="bg-white shadow-md p-4 rounded-lg mb-6">
      <h2 className="font-semibold text-lg">Product Management</h2>
      <div className="flex justify-between mt-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleIsOpened}
        >
          Add Product
        </button>
      </div>
      <div className="mt-4">
        <ul>
          {products.length > 0 ? (
            products.map((product) => (
              <li
                key={product.id}
                className="flex justify-between p-2 border-b"
              >
                <span>{product.title}</span>
                <span>${product.price}</span>
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-600">No products available.</li>
          )}
        </ul>
      </div>
      {isOpened && <AddProductForm vendor onclose={handleIsOpened} />}
    </section>
  );
};

export default ProductManagement;
