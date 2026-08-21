import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { selectClass } from "../../common/formStyles";
import Spinner from "../../common/Spinner";

const API_URL = process.env.REACT_APP_API_URL;

const VendorSelect = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch(`${API_URL}/vendors/`);
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
    return <Spinner size="sm" />;
  }

  if (error) {
    return <div className="text-xs text-red-500">Error: {error}</div>;
  }

  return (
    <select className={selectClass} onChange={(e) => handleVendorSelect(e.target.value)}>
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
