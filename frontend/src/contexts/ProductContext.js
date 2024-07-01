import { createContext, useState } from "react";
import initialProducts from "../data";

const ProductContext = createContext(null);

function ProductProvider({ children }) {
  const [products, setProduct] = useState([]);
  const [addToCart, setAddToCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [wishlists, setWishlists] = useState([]);
  const [showProductLists, setShowProductLists] = useState(true);
  const [searchedProducts, setSearchedProducts] = useState(products);
  const [showCartLists, setShowCartLists] = useState(false);
  const [showWishlists, setShowWishlists] = useState(false);
  const [showSearchedProducts, setShowSearchedProducts] = useState(false);

  const handleAddToCart = (product) => {
    setAddToCart((curCarts) => [...curCarts, product]);
  };
  const handleFilterProduct = (products) => {
    setSearchedProducts(products);
    setShowCartLists((state) => (state ? !state : state));
    setShowProductLists((state) => (state ? !state : state));
    setShowWishlists((state) => (state ? !state : state));
    setShowSearchedProducts((state) => !state);
  };
  const handleAddToWishlist = (product) => {
    setWishlists((curWishlists) => [...curWishlists, product]);
  };

  const handleShowCartList = () => {
    setShowCartLists((state) => !state);
    setShowProductLists((state) => (state ? !state : state));
    setShowWishlists((state) => (state ? !state : state));
    setShowSearchedProducts((state) => (state ? !state : state));
  };

  const handleShowWishlists = () => {
    console.log("wishlists is clicked");
    setShowCartLists((state) => (state ? !state : state));
    setShowProductLists((state) => (state ? !state : state));
    setShowWishlists((state) => !state);
    setShowSearchedProducts((state) => (state ? !state : state));
  };
  const handleSetProduct = (products) => setProduct(products);
  // console.log(Wishlists);

  return (
    <ProductContext.Provider
      value={{
        addToCart,
        products,
        searchedProducts,
        showCartLists,
        selectedProduct,
        setSelectedProduct,
        showProductLists,
        showSearchedProducts,
        wishlists: wishlists,
        showWishlists: showWishlists,
        onFilterProducts: handleFilterProduct,
        onAddToCart: handleAddToCart,
        onAddWishlist: handleAddToWishlist,
        onSetProduct: handleSetProduct,
        onSetShowCartList: handleShowCartList,
        onSetShowWishlist: handleShowWishlists,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export { ProductProvider, ProductContext };
