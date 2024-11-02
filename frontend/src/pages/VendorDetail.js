import React, { useContext, useEffect, useState } from "react";
import {
  FaComment,
  FaStar,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useBreadcrumb } from "../contexts/BreadCrumbContext";
import Breadcrumb from "../components/BreadCrumb";
import { useVendor } from "../contexts/VendorContext";
import ProductLists from "../components/ProductList";
import { ProductContext } from "../contexts/ProductContext";
import CategoryLists from "../components/CategoryLists";
import CommentForm from "../components/CommentForm";
import Modal from "../common/Modal";
function VendorDetail() {
  const { products, onFilterProducts } = useContext(ProductContext);
  const { vendors } = useVendor();
  const { id } = useParams();
  const { addBreadcrumb, clearBreadcrumbs } = useBreadcrumb();

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const filteredProducts = products.filter(
      (product) => product.vendor.id === Number(id)
    );
    onFilterProducts(filteredProducts);
  }, [id, products, onFilterProducts]);

  useEffect(() => {
    clearBreadcrumbs();
    addBreadcrumb({ label: "Home", path: "/" });
    addBreadcrumb({ label: "Vendors", path: "/vendors" });

    const vendor = vendors.find((vendor) => vendor.id === Number(id));
    if (vendor) {
      addBreadcrumb({ label: vendor.title });
    }
  }, [id]);

  const vendor = vendors.find((vendor) => vendor.id === Number(id));
  if (!vendor) return <div>Vendor not found</div>;

  return (
    <div className="container mx-auto my-6 px-4 min-h-screen">
      <div className="w-full bg-white rounded-md py-4 shadow-lg mb-2 px-2">
        <Breadcrumb />
      </div>

      <div className="container mx-auto bg-gray-50">
        <div className="grid h-auto w-full bg-gray-200">
          <div
            key={vendor.id}
            className="flex md:flex-row justify-around bg-gray-50 opacity-100 rounded-lg items-center shadow-lg py-4 px-6 transition-transform transform border border-gray-200"
          >
            <div className="flex flex-row space-x-4 items-center">
              <div className="flex items-center mb-4">
                <div>
                  <img
                    src={vendor.logo}
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
              <div className="items-baseline mt-4">
                <h3 className="font-semibold text-md text-gray-700">
                  Follow Us On
                </h3>
                <div className="flex space-x-4 mt-2">
                  <a
                    href={vendor.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFacebook className="text-blue-600 hover:text-blue-800 transition-colors duration-200" />
                  </a>
                  <a
                    href={vendor.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTwitter className="text-blue-400 hover:text-blue-500 transition-colors duration-200" />
                  </a>
                  <a
                    href={vendor.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram className="text-pink-500 hover:text-pink-600 transition-colors duration-200" />
                  </a>
                  <a
                    href={vendor.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaLinkedin className="text-blue-700 hover:text-blue-800 transition-colors duration-200" />
                  </a>
                </div>
              </div>
            </div>
            <div
              className="flex items-center  cursor-pointer py-2 rounded-md shadow-sm shadow-green-400 px-2 border border-blue-500 hover
              text-white hover:border-blue-600  hover:px-3 "
              onClick={() => setIsModalOpen(true)}
            >
              <FaComment className="text-blue-500 text-2xl mr-2" />
              <span className="text-blue-500 hover:text-blue-600 font-semibold">
                Comment Us
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="m-4">Our Product lists here</div>
      <div className="flex flex-row mt-4">
        <div className="w-3/4">
          <ProductLists />
        </div>
        <div className="w-1/4">
          <CategoryLists />
        </div>
      </div>

      {/* Modal for Comment Form */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CommentForm
          vendorId={vendor.id}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default VendorDetail;
