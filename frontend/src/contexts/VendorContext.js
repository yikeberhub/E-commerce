import {
  Children,
  useContext,
  useEffect,
  createContext,
  useState,
} from "react";

const VendorContext = createContext(null);
export const VendorProvider = ({ children }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVendors = async () => {
      try {
        const data = await fetchVendors();
        setVendors(data);
        console.log("vendors", vendors);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await fetch("http://localhost:8000/vendors/");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching vendors:", error);
      throw error;
    }
  };

  return (
    <VendorContext.Provider value={{ vendors, loading, error }}>
      {children}
    </VendorContext.Provider>
  );
};

export const useVendor = () => useContext(VendorContext);
