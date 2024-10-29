import React, { useEffect, useState } from "react";
import { FaStar, FaStore } from "react-icons/fa";
import { Link } from "react-router-dom";
import Breadcrumb from "../components/BreadCrumb";
import { useVendor } from "../contexts/VendorContext";
import { useBreadcrumb } from "../contexts/BreadCrumbContext";

const Vendors = () => {
  const { vendors = [], loading, error } = useVendor();
  const { addBreadcrumb, clearBreadcrumbs } = useBreadcrumb();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    clearBreadcrumbs();
    addBreadcrumb({ label: "Home", path: "/" });
    addBreadcrumb({ label: "Vendors", path: "/vendors" });
  }, []);

  // Filter and sort vendors
  const filteredVendors = vendors
    .filter((vendor) => {
      return (
        vendor.title &&
        vendor.description &&
        (vendor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vendor.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    })
    .filter((vendor) => {
      return filterCategory ? vendor.category === filterCategory : true;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "rating") {
        return b.authentic_rating - a.authentic_rating;
      }
      return 0;
    });

  if (loading)
    return (
      <div className="text-center text-lg font-semibold">
        Loading vendors...
      </div>
    );
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (filteredVendors.length === 0)
    return (
      <div className="text-center text-lg font-semibold">No vendors found</div>
    );

  return (
    <div className="container mx-auto my-6 px-4">
      <div className="w-full bg-white rounded-md py-4 shadow-lg mb-2 px-2">
        <Breadcrumb />
      </div>
      <h1 className="text-4xl font-extrabold mb-3 text-blue-600 text-center">
        Vendors
      </h1>

      <div className="flex flex-col items-center mb-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search vendors by thier name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-3 w-full max-w-md rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />

        <div className="flex flex-row gap-3 mt-4 items-center justify-between">
          {/* Filter Dropdown */}
          <h3 className="text-md font-semibold text-gray-600">
            We have {vendors.length} Vendors
          </h3>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="home">Home & Garden</option>
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Authentic Rating</option>
          </select>
        </div>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => (
          <div
            key={vendor.id}
            className="flex flex-col bg-white rounded-lg shadow-lg p-4 transition-transform transform hover:scale-105 border border-gray-200"
          >
            <div className="flex items-center mb-4">
              <div>
                <img
                  src={vendor.image}
                  alt={vendor.title}
                  className="h-24 w-24 rounded-full border-2 border-blue-500"
                />
                <p className="text-sm text-gray-500">7 products</p>
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200">
                  {vendor.title}
                </h2>
                <p className="text-gray-600 flex items-center">
                  <FaStar className="text-yellow-500" />(
                  {vendor.authentic_rating})
                </p>
                <h3 className="font-semibold text-md mt-4 text-gray-700">
                  Info
                </h3>
                <p className="flex flex-col gap-1 text-md text-gray-600">
                  <small>Address: {vendor.address}</small>
                  <small>Contact seller: {vendor.phone_number}</small>
                </p>
              </div>
            </div>
            <Link to={`/vendors/${vendor.id}`}>
              <button className="bg-blue-600 w-fit hover:bg-blue-700 transition-colors duration-200 px-4 py-1 rounded-md text-white font-bold flex items-center">
                <FaStore className="mr-2" /> View Store
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vendors;
