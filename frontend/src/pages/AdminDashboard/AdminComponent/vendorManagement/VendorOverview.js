import React from "react";
import { useVendor } from "../../../../contexts/VendorContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
  faStar,
  faThumbsUp,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";

const VendorOverview = () => {
  const { vendors, loading, error } = useVendor();

  if (loading) return <p className="text-center">Loading vendors...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-6 bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => (
          <Link
            key={vendor.id} // Add the key prop here for the Link component
            to={`/admin-dashboard/vendor-management/vendors/detail/${vendor.id}`}
          >
            <div className="bg-white shadow-md rounded-lg p-6 flex flex-col">
              <div className="flex items-center mb-4">
                <img
                  src={vendor.logo} // Ensure this path is correct
                  alt={`${vendor.title} logo`}
                  className="w-16 h-16 rounded-full mr-4" // Rounded image with margin
                />
                <div>
                  <FontAwesomeIcon
                    icon={faStar}
                    className="text-yellow-500 mr-2"
                  />
                  <span className="text-lg font-semibold">{vendor.title}</span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                {vendor.description || "No description available."}
              </p>
              <div className="flex items-center">
                <FontAwesomeIcon
                  icon={faThumbsUp}
                  className="text-blue-500 mr-2"
                />
                <span className="text-gray-700">
                  Active Vendor: {vendor.is_active ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center mt-2">
                <FontAwesomeIcon
                  icon={faCommentDots}
                  className="text-green-500 mr-2"
                />
                <span className="text-gray-700">
                  Total Reviews: {vendor.total_reviews || 0}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VendorOverview;
