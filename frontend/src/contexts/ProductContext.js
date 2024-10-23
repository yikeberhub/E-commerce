import { createContext, useEffect, useState } from "react";
import SummaryApi from "../common";
const ProductContext = createContext(null);

function ProductProvider({ children }) {
  const [products, setProduct] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [showSearchedProducts, setShowSearchedProducts] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts();
  }, []);

  const handleFilterProduct = (products) => {
    setFilteredProducts(products);
    setShowSearchedProducts((state) => !state);
  };

  const handleSetProduct = (products) => setProduct(products);

  const getProducts = async () => {
    try {
      const response = await fetch(SummaryApi.allProduct.url, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const products = data || [];
      setProduct(products);
    } catch (error) {
      console.error("error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        setLoading,
        getProducts: getProducts,
        filteredProducts,
        selectedProduct,
        onFilterProducts: handleFilterProduct,
        onSetProduct: handleSetProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export { ProductProvider, ProductContext };
