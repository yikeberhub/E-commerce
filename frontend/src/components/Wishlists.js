import React from "react";
import WishlistItem from "./WishlistItem";

const Wishlists = ({ addedProducts }) => {
  return (
    <div>
      {addedProducts.map((product, key) => (
        <WishlistItem product={product} key={key} />
      ))}
    </div>
  );
};

export default Wishlists;
