import { createContext, useState } from "react";

const ProductContext = createContext(null);

function ProductProvider({ children }) {
  const [products, setProduct] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [wishlists, setWishlists] = useState([]);
  const [searchedProducts, setSearchedProducts] = useState(products);
  const [showCartLists, setShowCartLists] = useState(false);
  const [showWishlists, setShowWishlists] = useState(false);
  const [showSearchedProducts, setShowSearchedProducts] = useState(false);

  const handleAddToCart = (product) => {
    setCartItems((curCarts) => [...curCarts, product]);
  };
  const handleFilterProduct = (products) => {
    setSearchedProducts(products);
    setShowSearchedProducts((state) => !state);
  };
  const handleAddToWishlist = (product) => {
    setWishlists((curWishlists) => [...curWishlists, product]);
  };

  const handleShowCartList = () => {
    setShowCartLists((state) => !state);
  };

  const handleShowWishlists = () => {
    setShowWishlists((state) => !state);
  };
  const handleSetProduct = (products) => setProduct(products);

  const handleRemoveCartItem = (prod) => {
    setCartItems((prevCartList) =>
      prevCartList.filter((product) => product !== prod)
    );
  };
  const handleRemoveWishlistItem = (prod) => {
    setWishlists((prevWishList) =>
      prevWishList.filter((product) => product !== prod)
    );
  };
  return (
    <ProductContext.Provider
      value={{
        cartItems,
        products,
        searchedProducts,
        showCartLists,
        selectedProduct,
        setSelectedProduct,
        showSearchedProducts,
        wishlists: wishlists,
        showWishlists: showWishlists,
        onFilterProducts: handleFilterProduct,
        onAddToCart: handleAddToCart,
        onAddWishlist: handleAddToWishlist,
        onSetProduct: handleSetProduct,
        onSetShowCartList: handleShowCartList,
        onSetShowWishlist: handleShowWishlists,
        onRemoveWishListItem: handleRemoveWishlistItem,
        onRemoveCartItem: handleRemoveCartItem,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export { ProductProvider, ProductContext };
