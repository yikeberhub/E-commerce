import React, { createContext, useContext, useEffect, useState } from "react";

const VendorContext = createContext(null);

export const VendorProvider = ({ children }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadVendors();
  }, []);
  const token = localStorage.getItem("access");

  // Fetch vendors
  const loadVendors = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/vendors/");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setVendors(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders for a specific vendor
  const loadVendorOrders = async (vendorId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/vendors/${vendorId}/orders/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch vendor orders");
      }
      const data = await response.json();
      console.log("order data", data.orders);

      setOrders(data.orders);
    } catch (error) {
      setError(error.message);
    }
  };

  // Fetch products for a specific vendor
  const loadVendorProducts = async (vendorId) => {
    console.log("token is ", token);
    try {
      const response = await fetch(
        `http://localhost:8000/vendors/${vendorId}/products/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch vendor products");
      }
      const data = await response.json();
      console.log("vendor product", data.products);
      setProducts(data.products);
    } catch (error) {
      setError(error.message);
    }
  };

  // Add a new vendor
  const addVendor = async (vendorData) => {
    const token = localStorage.getItem("access");
    try {
      const response = await fetch("http://localhost:8000/vendors/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer${token}`,
        },
        body: JSON.stringify(vendorData),
      });
      if (!response.ok) {
        throw new Error("Failed to add vendor");
      }
      const newVendor = await response.json();
      setVendors((prev) => [...prev, newVendor]);
    } catch (error) {
      setError(error.message);
    }
  };

  // Update an existing vendor
  const updateVendor = async (vendorId, updatedData) => {
    try {
      const response = await fetch(
        `http://localhost:8000/vendors/${vendorId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update vendor");
      }
      const updatedVendor = await response.json();
      setVendors((prev) =>
        prev.map((vendor) => (vendor.id === vendorId ? updatedVendor : vendor))
      );
    } catch (error) {
      setError(error.message);
    }
  };

  // Delete a vendor
  const deleteVendor = async (vendorId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/vendors/${vendorId}/`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete vendor");
      }
      setVendors((prev) => prev.filter((vendor) => vendor.id !== vendorId));
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <VendorContext.Provider
      value={{
        vendors,
        loading,
        error,
        orders,
        products,
        addVendor,
        updateVendor,
        deleteVendor,
        loadVendorOrders,
        loadVendorProducts,
        reloadVendors: loadVendors,
      }}
    >
      {children}
    </VendorContext.Provider>
  );
};

// Custom hook to use the Vendor context
export const useVendor = () => useContext(VendorContext);
