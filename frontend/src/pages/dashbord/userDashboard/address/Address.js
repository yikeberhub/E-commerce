import React, { useState } from "react";
import { FiPlus, FiTrash2, FiEdit2, FiCheckCircle, FiMapPin } from "react-icons/fi";
import { useAuth } from "../../../../contexts/AuthContext";
import EmptyState from "../../../../common/EmptyState";
import EditAddress from "./EditAddress";

const API_URL = process.env.REACT_APP_API_URL;

function Address() {
  const { user, fetchUserInfo } = useAuth();
  const [openedEditAddress, setOpenedEditAddress] = useState(false);
  const [openedCreateAddress, setOpenedCreateAddress] = useState(false);
  const [numSelected, setNumSelected] = useState(false);
  const addresses = user.addresses;

  const handleSetDefault = async (id) => {
    const token = localStorage.getItem("access");
    try {
      const response = await fetch(
        `${API_URL}/users/address/${id}/set-default/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Couldn't set default address");
      }
      fetchUserInfo();
    } catch (error) {
      console.error("Error", error.message);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    const token = localStorage.getItem("access");
    try {
      const response = await fetch(
        `${API_URL}/users/address/${addressId}/delete/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Couldn't delete Address");
      }
      fetchUserInfo();
    } catch (error) {
      console.error("Error", error.message);
    }
  };

  if (!addresses) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FiMapPin className="text-primary-500" /> My Addresses
        </h1>
        {!openedCreateAddress && (
          <button
            className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-3.5 py-2 rounded-lg transition"
            onClick={() => setOpenedCreateAddress(true)}
          >
            <FiPlus className="text-xs" /> Add Address
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 min-w-0">
          {addresses.length === 0 ? (
            <EmptyState
              title="No addresses yet"
              description="Add an address to speed up checkout."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {addresses.map((address, key) => (
                <div
                  key={address.id}
                  className="bg-slate-50 rounded-xl border border-slate-100 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                      Address {key + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(address.id)}
                      className="text-slate-400 hover:text-red-500 transition"
                      aria-label="Delete address"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-slate-600">
                    <p>
                      <span className="text-slate-400">Name:</span>{" "}
                      {address.full_name}
                    </p>
                    <p>
                      <span className="text-slate-400">Phone:</span>{" "}
                      {address.phone_number}
                    </p>
                    <p>
                      <span className="text-slate-400">Kebele:</span>{" "}
                      {address.kebele}
                    </p>
                    <p>
                      <span className="text-slate-400">City:</span>{" "}
                      {address.city}
                    </p>
                    <p>
                      <span className="text-slate-400">Woreda:</span>{" "}
                      {address.woreda}
                    </p>
                    <p>
                      <span className="text-slate-400">Region:</span>{" "}
                      {address.region}
                    </p>
                    <p className="col-span-2">
                      <span className="text-slate-400">Postal Code:</span>{" "}
                      {address.postal_code || "N/A"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200/70">
                    {!address.is_default ? (
                      <button
                        className="text-xs font-medium text-slate-500 hover:text-primary-600 transition"
                        onClick={() => handleSetDefault(address.id)}
                      >
                        Make Default
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <FiCheckCircle /> Default
                      </span>
                    )}
                    {!openedEditAddress && (
                      <button
                        className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 transition"
                        onClick={() => {
                          setOpenedEditAddress(address.id);
                          setNumSelected(key + 1);
                        }}
                      >
                        <FiEdit2 className="text-xs" /> Edit
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {openedCreateAddress && (
          <div className="w-full lg:w-96 shrink-0">
            <EditAddress
              create={true}
              edit={false}
              use={false}
              setOpenedCreateAddress={setOpenedCreateAddress}
              showCloseBtn={true}
            />
          </div>
        )}
        {openedEditAddress && (
          <div className="w-full lg:w-96 shrink-0">
            <EditAddress
              id={openedEditAddress}
              numSelected={numSelected}
              setOpenedEditAddress={setOpenedEditAddress}
              showCloseBtn={true}
              edit={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Address;
