import React, { useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { useParams, Link } from "react-router-dom";
import { useBreadcrumb } from "../contexts/BreadCrumbContext";
import Breadcrumb from "../components/BreadCrumb";
import { useVendor } from "../contexts/VendorContext";

function VendorDetail() {
  const { vendors } = useVendor();
  const { id } = useParams("id");
  const { addBreadcrumb, clearBreadcrumbs } = useBreadcrumb();

  console.log("vendors", vendors);
  console.log("parm id", id);
  useEffect(() => {
    clearBreadcrumbs();
    addBreadcrumb({ label: "Home", path: "/" });
    addBreadcrumb({ label: "Vendors", path: "/vendors" });
    vendor && addBreadcrumb({ label: vendor.title });
  }, []);

  const vendor = vendors.filter((vendor) => vendor.id === Number(id))[0];
  console.log("vendor det", vendor);
  if (!vendor) return <div>Vendor not found</div>;
  return (
    <div className="container mx-auto my-6 px-4 min-h-screen">
      <div className="w-full bg-white rounded-md py-4 shadow-lg mb-2 px-2">
        <Breadcrumb />
      </div>

      {/* Vendor Cards Grid */}
      <div className="container mx-auto bg-gray-200">
        <div className="grid h-auto w-full bg-gray-200">
          <div
            key={vendor.id}
            className="flex flex-col bg-gray-200 opacity-100 rounded-lg items-centers shadow-lg py-4 px-6 transition-transform transform  border border-gray-200"
          >
            <div className="flex items-center mb-4">
              <div>
                <img
                  src={vendor.image}
                  alt={vendor.title}
                  className="h-28 w-28 rounded-full border-2 border-blue-500"
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorDetail;
