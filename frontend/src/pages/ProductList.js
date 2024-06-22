import React from "react";
import Mobile from "../assets/products/mobile/SAMSUNG Galaxy A03 (Black, 32 GB) (3 GB RAM) 3.webp";
import Earphone from "../assets/products/earphones/boAt Rockerz 103 Pro 3.webp";
import Mobile2 from "../assets/products/mobile/realme Narzo 50 (Speed Blue, 64 GB) (4 GB RAM) 4.webp";
import Camera from "../assets/products/camera/DIGITEK® (DTR 260 GT) Gorilla Tripod-Mini 33 CM (13 Inch) Tripod for Mobile Phone with Phone Mount & Remote, Flexible Gorilla Stand for DSLR & Action Cameras 2.jpg";

import Product from "../components/Product";

const ProductLists = ({ products, onAddToCart, onAddToWishlist }) => {
  return (
    <div className=" col-span-5 flex  items-center justify-center px-2 py-5 border border-gray-200 shadow-md  sm:px-5 ">
      <div className="grid sm:grid-cols-8 lg:grid-cols-10 sm:content-start gap-2 w-full py-2">
        {products.map((product, key) => (
          <Product
            product={product}
            key={key}
            onAddToCart={onAddToCart}
            onAddToWishlist={onAddToWishlist}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductLists;
