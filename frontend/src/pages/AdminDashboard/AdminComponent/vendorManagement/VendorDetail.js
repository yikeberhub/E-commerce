import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useVendor } from "../../../../contexts/VendorContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faGlobe,
  faInfoCircle,
  faCheckCircle,
  faClock,
  faClipboardCheck,
  faThumbsUp,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";

const ProductTable = ({ products }) => {
  return (
    <table className="max-w-screen-xl bg-gray-50 border border-gray-300 rounded-lg shadow-lg">
      <thead>
        <tr className="bg-blue-600 text-white uppercase text-sm leading-normal">
          <th className="py-3 px-6 text-left">Product ID</th>
          <th className="py-3 px-6 text-left">Title</th>
          <th className="py-3 px-6 text-left">Vendor</th>
          <th className="py-3 px-6 text-left">Category</th>
          <th className="py-3 px-6 text-left">Tags</th>
          <th className="py-3 px-6 text-left">Price</th>
          <th className="py-3 px-6 text-left">Old Price</th>
          <th className="py-3 px-6 text-left">Discount %</th>
          <th className="py-3 px-6 text-left">Stock Quantity</th>
          <th className="py-3 px-6 text-left">Status</th>
          <th className="py-3 px-6 text-left">Avg Rating</th>
          <th className="py-3 px-6 text-left"># of Reviews</th>
          <th className="py-3 px-6 text-left">Date Created</th>
          <th className="py-3 px-6 text-left">Last Updated</th>
        </tr>
      </thead>
      <tbody className="text-gray-800 text-sm font-light">
        {products.map((product, index) => (
          <tr
            key={product.id}
            className={`border-b border-gray-200 ${
              index % 2 === 0 ? "bg-white" : "bg-gray-100"
            } hover:bg-indigo-50`}
          >
            <td className="py-3 px-6 text-left whitespace-nowrap">
              {product.id}
            </td>
            <td className="py-3 px-6 text-left">{product.title}</td>
            <td className="py-3 px-6 text-left flex items-center space-x-2">
              {product.vendor?.logo ? (
                <img
                  src={product.vendor.logo}
                  alt={`${product.vendor.title} logo`}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded-full" />
              )}
              <span>{product.vendor?.title || "N/A"}</span>
            </td>
            <td className="py-3 px-6 text-left">
              {product.category?.title || "N/A"}
            </td>
            <td className="py-3 px-6 text-left">
              {product.tags && product.tags.length > 0
                ? product.tags.map((tag, index) => (
                    <span key={tag.id}>
                      {tag.name}
                      {index < product.tags.length - 1 ? ", " : ""}
                    </span>
                  ))
                : "No Tags"}
            </td>
            <td className="py-3 px-6 text-left">${product.price}</td>
            <td className="py-3 px-6 text-left">${product.old_price}</td>
            <td className="py-3 px-6 text-left">
              {product.discount_percentage
                ? `${product.discount_percentage.toFixed(2)}%`
                : "0%"}
            </td>
            <td className="py-3 px-6 text-left">{product.stock_quantity}</td>
            <td className="py-3 px-6 text-left">{product.product_status}</td>
            <td className="py-3 px-6 text-left">
              {product.average_rating
                ? product.average_rating.toFixed(1)
                : "N/A"}
            </td>
            <td className="py-3 px-6 text-left">
              {product.number_of_reviews || 0}
            </td>
            <td className="py-3 px-6 text-left">
              {new Date(product.date).toLocaleDateString()}
            </td>
            <td className="py-3 px-6 text-left">
              {new Date(product.updated).toLocaleDateString()}{" "}
              {new Date(product.updated).toLocaleTimeString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const VendorDetail = () => {
  const { id } = useParams();
  const {
    vendors,
    loadVendorOrders,
    loadVendorProducts,
    orders,
    products,
    loading,
    error,
  } = useVendor();

  const vendor = vendors.find((vendor) => vendor.id === parseInt(id));
  const [activeTab, setActiveTab] = useState("details"); // Default tab

  useEffect(() => {
    if (vendor) {
      loadVendorOrders(vendor.id);
      loadVendorProducts(vendor.id);
    }
  }, [id, vendor]);

  if (loading)
    return (
      <p className="text-center text-gray-700">Loading vendor details...</p>
    );
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;
  if (!vendor)
    return <p className="text-center text-gray-700">Vendor not found.</p>;

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-indigo-800">
        {vendor.title} Details
      </h2>
      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Navigation Buttons */}
        <div className="mt-4">
          <button
            onClick={() => setActiveTab("details")}
            className={`mr-4 px-4 py-2 text-white rounded ${
              activeTab === "details" ? "bg-indigo-600" : "bg-indigo-400"
            }`}
          >
            Vendor Details
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`mr-4 px-4 py-2 text-white rounded ${
              activeTab === "products" ? "bg-indigo-600" : "bg-indigo-400"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`mr-4 px-4 py-2 text-white rounded ${
              activeTab === "orders" ? "bg-indigo-600" : "bg-indigo-400"
            }`}
          >
            Orders
          </button>
        </div>

        {/* Conditional Rendering based on Active Tab */}
        {activeTab === "details" && (
          <div className="mt-6">
            {/* Vendor Information Section */}
            <div className="flex flex-col md:flex-row items-start">
              <div className="w-full md:w-1/3 mb-4 md:mb-0">
                <img
                  src={vendor.logo}
                  alt={vendor.title}
                  className="w-40 h-40 rounded-lg shadow-md border border-indigo-300"
                />
              </div>
              <div className="w-full md:w-2/3 md:ml-6">
                <h3 className="text-2xl font-semibold text-indigo-700">
                  Vendor Information
                </h3>
                <p className="mt-2 text-gray-600 flex items-center">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="mr-2 text-indigo-600"
                  />
                  <strong>Email:</strong> {vendor.email}
                </p>
                <p className="mt-2 text-gray-600 flex items-center">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="mr-2 text-indigo-600"
                  />
                  <strong>Phone Number:</strong> {vendor.phone_number}
                </p>
                <p className="mt-2 text-gray-600 flex items-center">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="mr-2 text-indigo-600"
                  />
                  <strong>Address:</strong> {vendor.address}
                </p>
                <p className="mt-2 text-gray-600 flex items-center">
                  <FontAwesomeIcon
                    icon={faGlobe}
                    className="mr-2 text-indigo-600"
                  />
                  <strong>Website:</strong> {vendor.website || "N/A"}
                </p>
                <p className="mt-2 text-gray-600 flex items-center">
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="mr-2 text-indigo-600"
                  />
                  <strong>Description:</strong> {vendor.description}
                </p>
                <p className="mt-2 text-gray-600 flex items-center">
                  <FontAwesomeIcon
                    icon={
                      vendor.account_status === "Active"
                        ? faCheckCircle
                        : faInfoCircle
                    }
                    className="mr-2 text-indigo-600"
                  />
                  <strong>Status:</strong> {vendor.account_status}
                </p>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="mt-6">
              <h3 className="text-2xl font-semibold text-indigo-700">
                Performance Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <p className="text-gray-600 flex items-center">
                  <FontAwesomeIcon
                    icon={faClock}
                    className="mr-2 text-indigo-600"
                  />
                  <strong>Chat Response Time:</strong>{" "}
                  {vendor.chat_response_time} minutes
                </p>
                <p className="text-gray-600 flex items-center">
                  <FontAwesomeIcon
                    icon={faClipboardCheck}
                    className="mr-2 text-indigo-600"
                  />
                  <strong>Shipping On Time:</strong> {vendor.shipping_on_time}%
                </p>
                <p className="text-gray-600 flex items-center">
                  <FontAwesomeIcon
                    icon={faThumbsUp}
                    className="mr-2 text-indigo-600"
                  />
                  <strong>Authentic Rating:</strong> {vendor.authentic_rating}
                </p>
                <p className="text-gray-600 flex items-center">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="mr-2 text-indigo-600"
                  />
                  <strong>Days for Return:</strong> {vendor.days_return} days
                </p>
                <p className="text-gray-600 flex items-center">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="mr-2 text-indigo-600"
                  />
                  <strong>Warranty Period:</strong> {vendor.warranty_period}{" "}
                  months
                </p>
                <p className="text-gray-600 flex items-center">
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="mr-2 text-indigo-600"
                  />
                  <strong>Subscription Plan:</strong> {vendor.subscription_plan}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="mt-6 w-full">
            <h3 className="text-2xl font-semibold text-indigo-700">Products</h3>
            {products?.length === 0 ? (
              <p className="text-gray-600">
                No products found for this vendor.
              </p>
            ) : (
              <div className="overflow-scroll">
                <ProductTable products={products} />
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="mt-6">
            <h3 className="text-2xl font-semibold text-indigo-700">Orders</h3>
            {orders?.length === 0 ? (
              <p className="text-gray-600">No orders found for this vendor.</p>
            ) : (
              <table className="w-full mt-4 border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-indigo-100 text-indigo-700">
                    <th className="border border-gray-200 px-4 py-2">
                      Order ID
                    </th>
                    <th className="border border-gray-200 px-4 py-2">Date</th>
                    <th className="border border-gray-200 px-4 py-2">
                      Customer
                    </th>
                    <th className="border border-gray-200 px-4 py-2">Status</th>
                    <th className="border border-gray-200 px-4 py-2">
                      Total Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="text-gray-600">
                      <td className="border border-gray-200 px-4 py-2 text-center">
                        {order.id}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-center">
                        {new Date(order.created_at).toLocaleString()}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-center">
                        {order.user.username}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-center">
                        {order.status}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-center">
                        {order.total_price} BIRR
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* You can add more conditional rendering for other tabs here */}
      </div>
    </div>
  );
};

export default VendorDetail;
