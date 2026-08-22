import { createContext, useEffect, useMemo, useState } from "react";
import SummaryApi from "../common";

const API_URL = process.env.REACT_APP_API_URL;

const ProductContext = createContext(null);

const initialFilters = {
  maxPrice: null,
  categoryTitles: [],
  categoryId: null,
  vendorTitles: [],
  tags: [],
  rating: "All",
  discount: "",
  sortOrder: "default",
};

function ProductProvider({ children }) {
  const [products, setProduct] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filters, setFilters] = useState(initialFilters);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts();
  }, []);

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(initialFilters);

  const handleSetProduct = (products) => setProduct(products);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/products/categories/`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const categoryData = await response.json();
      setCategories(categoryData);
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

  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((product) =>
        product.title?.toLowerCase().includes(term)
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter(
        (product) => product.category?.title === selectedCategory
      );
    }

    if (filters.categoryId != null) {
      result = result.filter(
        (product) => product.category?.id === filters.categoryId
      );
    }

    if (filters.categoryTitles.length > 0) {
      result = result.filter(
        (product) =>
          product.category && filters.categoryTitles.includes(product.category.title)
      );
    }

    if (filters.vendorTitles.length > 0) {
      result = result.filter((product) =>
        filters.vendorTitles.includes(product?.vendor?.title)
      );
    }

    if (filters.tags.length > 0) {
      result = result.filter((product) =>
        product.tags?.some((tag) => filters.tags.includes(tag.name))
      );
    }

    if (filters.maxPrice != null && filters.maxPrice > 0) {
      result = result.filter((product) => product.price <= filters.maxPrice);
    }

    if (filters.rating !== "All") {
      result = result.filter(
        (product) => product.average_rating >= Number(filters.rating)
      );
    }

    if (filters.discount !== "") {
      const threshold = parseInt(filters.discount, 10);
      result =
        threshold === 0
          ? result.filter((product) => !product.discount_percentage)
          : result.filter(
              (product) => (product.discount_percentage || 0) >= threshold
            );
    }

    if (filters.sortOrder === "priceLowToHigh") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (filters.sortOrder === "priceHighToLow") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, searchTerm, selectedCategory, filters]);

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        onSetCategories: setCategories,
        fetchCategories,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        loading,
        setLoading,
        getProducts: getProducts,
        filteredProducts,
        filters,
        setFilter,
        resetFilters,
        selectedProduct,
        onSetProduct: handleSetProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export { ProductProvider, ProductContext };
