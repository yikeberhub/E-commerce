import { React, useState } from "react";
import { FaFileInvoice, FaArrowLeft } from "react-icons/fa"; // Import icons

// OrderDetail Component
const OrderDetailAdmin = ({ order, onClose }) => {
  const [status, setStatus] = useState(order.status);
  const [notes, setNotes] = useState(order.notes || "");

  const handleStatusChange = () => {
    console.log("Updated Order Status:", status);
  };

  const calculateTotal = (price, quantity) => {
    return price * quantity;
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Order Details
      </h2>

      {/* Navigation Links */}
      <div className="flex space-x-4 mb-4 text-gray-700">
        <div className="flex items-center cursor-pointer text-green-500 hover:underline">
          <FaFileInvoice className="mr-2" />
          <span onClick={() => window.print()}>Print Invoice</span>
        </div>
        <div
          className="flex items-center cursor-pointer text-blue-500 hover:underline"
          onClick={onClose}
        >
          <FaArrowLeft className="mr-2" />
          <span>Back to Orders</span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-500">
        {/* Order Status Section */}
        <div className="bg-white p-4 rounded shadow-md">
          <label className="block text-gray-700 mb-1">Order Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={handleStatusChange}
            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded"
          >
            Update Status
          </button>
        </div>

        {/* Payment Details Section */}
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-2">Payment Status:</h3>
          <p className="text-sm">
            <strong className="font-medium">Status:</strong>{" "}
            {order.payment.payment_status || "Not available"}
          </p>
          <p className="text-sm">
            <strong className="font-medium">Payment Method:</strong>{" "}
            {order.payment.payment_method || "Not available"}
          </p>
          <p className="text-sm">
            <strong className="font-medium">Transaction ID:</strong>{" "}
            {order.payment.transaction_id || "N/A"}
          </p>
          <p className="text-sm">
            <strong className="font-medium">Charge:</strong> $
            {order.payment.charge || "0.00"}
          </p>
          <p className="text-sm">
            <strong className="font-medium">Created At:</strong>{" "}
            {new Date(order.payment.created_at).toLocaleString() ||
              "Not available"}
          </p>
          <p className="text-sm">
            <strong className="font-medium">Updated At:</strong>{" "}
            {new Date(order.payment.updated_at).toLocaleString() ||
              "Not available"}
          </p>
        </div>

        {/* Customer Information Section */}
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="text-md font-semibold mb-2">Customer Information:</h3>
          <p className="text-sm">
            <strong className="font-medium">Name:</strong> {order.user.username}
          </p>
          <p className="text-sm">
            <strong className="font-medium">Email:</strong>{" "}
            {order.user.email || "Not available"}
          </p>
          <p className="text-sm">
            <strong className="font-medium">Phone:</strong>{" "}
            {order.user.phone || "Not available"}
          </p>
          <p className="text-sm">
            <strong className="font-medium">Address:</strong>{" "}
            {order.address[0] || "Not available"}
          </p>
          <button className="mt-2 text-blue-500 text-sm hover:underline">
            Contact Customer
          </button>
        </div>

        {/* Shipping Information Section */}
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-2">Shipping Information:</h3>
          <p className="text-sm">
            <strong className="font-medium">Full Name:</strong>{" "}
            {order.address.full_name || "Not available"}
          </p>
          <p className="text-sm">
            <strong className="font-medium">Kebele:</strong>{" "}
            {order.address.kebele || "Not available"}
          </p>
          <p className="text-sm">
            <strong className="font-medium">City:</strong>{" "}
            {order.address.city || "Not available"}
          </p>
          <p className="text-sm">
            <strong className="font-medium">Region:</strong>{" "}
            {order.address.region || "Not available"}
          </p>
          <p className="text-sm">
            <strong className="font-medium">Phone Number:</strong>{" "}
            {order.address.phone_number || "Not available"}
          </p>
          <p className="text-sm">
            <strong className="font-medium">Postal Code:</strong>{" "}
            {order.address.postal_code || "Not available"}
          </p>
        </div>
      </div>

      {/* Order Items Section */}
      <div className="mt-4 bg-white p-4 rounded shadow-md text-gray-500">
        <h3 className="text-lg font-semibold">Order Items:</h3>
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Image</th>
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Quantity</th>
              <th className="py-2 px-4 border-b">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.length > 0 ? (
              order.items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="py-2 px-4 border-b">
                    <img
                      src={item.product.image || "placeholder.jpg"}
                      alt={item.product.title}
                      className="w-16 h-16 object-cover"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">{item.product.title}</td>
                  <td className="py-2 px-4 border-b">${item.product.price}</td>
                  <td className="py-2 px-4 border-b">{item.quantity}</td>
                  <td className="py-2 px-4 border-b">
                    ${calculateTotal(item.product.price, item.quantity)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-2 px-4 text-center">
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Change Log Section */}
      <div className="mt-4 bg-white p-4 rounded shadow-md text-gray-500">
        <h3 className="text-lg font-semibold">Change Log:</h3>
        <ul>
          {order?.changeLog?.length > 0 ? (
            order.changeLog.map((log, index) => <li key={index}>{log}</li>)
          ) : (
            <li>No changes recorded</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default OrderDetailAdmin;
