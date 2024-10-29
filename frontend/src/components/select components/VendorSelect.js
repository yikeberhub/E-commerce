import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const VendorSelect = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch("http://localhost:8000/vendors/");
        if (!response.ok) {
          throw new Error("Failed to fetch vendors");
        }
        const data = await response.json();
        setVendors(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  const handleVendorSelect = (vendorId) => {
    if (vendorId === "all") {
      navigate("vendors/");
    } else {
      navigate(`/vendors/${vendorId}`);
    }
  };

  if (loading) {
    return <div>Loading vendors...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <select
      className="rounded border px-2 py-1 text-black hover:bg-gray-100"
      onChange={(e) => handleVendorSelect(e.target.value)}
    >
      <option value="">Select a vendor</option>
      {vendors.map((vendor) => (
        <option key={vendor.id} value={vendor.id}>
          {vendor.title}
        </option>
      ))}
      <option value="all">All</option>
    </select>
  );
};

export default VendorSelect;
