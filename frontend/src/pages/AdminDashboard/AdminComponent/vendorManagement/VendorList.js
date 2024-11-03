import { useVendor } from "../../../../contexts/VendorContext";
import { NavLink, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import AlertModal from "../../../../common/AlertModal";
import { useState } from "react";

const VendorList = () => {
  const { vendors, loading, error, deleteVendor } = useVendor();
  const { status } = useParams("status");

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success"); // e.g

  const filteredVendors = vendors.filter((vendor) => {
    if (status === "active") return vendor.is_active;
    if (status === "inactive") return !vendor.is_active;
    return true;
  });
  const handleDelete = async (vendorId) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      await deleteVendor(vendorId);
      setAlertMessage("Vendor deleted successfully!");
      setAlertType("success");
      setAlertVisible(true);
    }
  };

  if (loading)
    return <p className="text-center text-blue-500">Loading vendors...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="overflow-x-auto p-6 bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-700 mb-4 text-start">
        <span className="text-lg text-purple-700">
          {" "}
          {status?.toLocaleUpperCase()}
        </span>{" "}
        Vendor List
      </h2>
      <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="py-3 px-5 text-left font-semibold text-lg">Title</th>
            <th className="py-3 px-5 text-left font-semibold text-lg">Email</th>
            <th className="py-3 px-5 text-left font-semibold text-lg">Phone</th>
            <th className="py-3 px-5 text-left font-semibold text-lg">
              Address
            </th>
            <th className="py-3 px-5 text-left font-semibold text-lg">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredVendors.length > 0 ? (
            filteredVendors.map((vendor) => (
              <tr
                key={vendor.id}
                className="border-b hover:bg-blue-50 transition duration-200"
              >
                <td className="py-3 px-5 font-medium">{vendor.title}</td>
                <td className="py-3 px-5">{vendor.email}</td>
                <td className="py-3 px-5">{vendor.phone_number}</td>
                <td className="py-3 px-5">{vendor.address}</td>
                <td className="py-3 px-5 flex space-x-2">
                  <NavLink
                    to={
                      !status
                        ? `detail/${vendor.id}`
                        : `/admin-dashboard/vendor-management/vendors/detail/${vendor.id}`
                    }
                    className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition duration-200"
                  >
                    <FontAwesomeIcon icon={faEye} className="mr-2" />
                    Details
                  </NavLink>
                  <button
                    onClick={() => handleDelete(vendor.id)}
                    className="flex items-center bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-200"
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-2" /> Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                className="text-center py-4 font-semibold text-gray-500"
              >
                No vendors available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {alertVisible && (
        <AlertModal
          message={alertMessage}
          type={alertType}
          isVisible={alertVisible}
          onClose={() => setAlertVisible(false)} // close the modal
        />
      )}
    </div>
  );
};

export default VendorList;
