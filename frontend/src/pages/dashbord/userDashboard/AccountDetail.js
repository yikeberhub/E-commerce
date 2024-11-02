import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";

const AccountDetail = () => {
  const { user } = useAuth();
  const [error, setError] = useState(null);

  if (!user) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-xl mt-8">
      <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-800">
        Account Details
      </h2>

      {user && (
        <>
          <div className="flex flex-col md:flex-row items-center mb-10">
            <img
              src={user.profile_image}
              alt="Profile"
              className="w-36 h-36 rounded-full border-4 border-indigo-300 mb-4 md:mb-0 md:mr-8 shadow-md"
            />
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-semibold text-gray-900">
                {user.first_name} {user.last_name}
              </h3>
              <p className="text-gray-700 mt-2">
                Email:{" "}
                <span className="font-medium text-gray-800">{user.email}</span>
              </p>
              <p className="text-gray-700">
                Phone:{" "}
                <span className="font-medium text-gray-800">
                  {user.phone_number || "N/A"}
                </span>
              </p>
              <p className="text-gray-700">
                Date of Birth:{" "}
                <span className="font-medium text-gray-800">
                  {user.date_of_birth || "N/A"}
                </span>
              </p>
              <p className="text-gray-700">
                Role:{" "}
                <span className="font-medium text-gray-800">{user.role}</span>
              </p>
              <p
                className={`text-lg font-semibold ${
                  user.account_status === "active"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                Status: {user.account_status}
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-6 text-gray-800">Addresses</h3>
          {user.addresses && user.addresses.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {user.addresses.map((address) => (
                <div
                  key={address.id}
                  className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-md hover:shadow-lg transform transition duration-200 hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-lg text-indigo-700">
                      {address.full_name}
                    </p>
                    {address.is_default && (
                      <span className="px-2 py-1 text-sm font-semibold text-white bg-green-500 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-1">
                    <strong>Phone:</strong> {address.phone_number}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <strong>Street Address:</strong> {address.street_address}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <strong>City:</strong> {address.city}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <strong>Region:</strong> {address.region}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <strong>Woreda:</strong> {address.woreda}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <strong>Kebele:</strong> {address.kebele}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <strong>Postal Code:</strong> {address.postal_code || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Delivery Instructions:</strong>{" "}
                    {address.delivery_instruction || "N/A"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-4">No addresses available.</p>
          )}
        </>
      )}
    </div>
  );
};

export default AccountDetail;
