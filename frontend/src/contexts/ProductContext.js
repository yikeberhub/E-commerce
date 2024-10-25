import { createContext, useEffect, useState } from "react";
import SummaryApi from "../common";
const ProductContext = createContext(null);

function ProductProvider({ children }) {
  const [products, setProduct] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [showSearchedProducts, setShowSearchedProducts] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts();
  }, []);

  const handleFilterProduct = (products) => {
    setFilteredProducts(products);
    setShowSearchedProducts((state) => !state);
  };

  const handleSetProduct = (products) => setProduct(products);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/products/categories/"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const categoryData = await response.json();
      setCategories(categoryData);
      console.log("Fetched categories:", categoryData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

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
        categories,
        onSetCategories: setCategories,
        fetchCategories,
        searchTerm,
        setSearchTerm,
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
