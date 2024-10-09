import { React, useEffect, useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import EditAddress from "./EditAddress";

function Address() {
  const { user, fetchUserInfo } = useAuth();
  const [defaultAddress, setDefaultAddress] = useState(1);
  const [openedEditAddress, setOpenedEditAddress] = useState(false);
  const [openedCreateAddress, setOpenedCreateAddress] = useState(false);
  const [numSelected, setNumSelected] = useState(false);
  const addresses = user.addresses;
  
  const handleSetDefault = async (id) => {
    const token = localStorage.getItem("access");
    try {
      const response = await fetch(
        `http://localhost:8000/users/address/${id}/set-default/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Couldn't delete Address");
      }
      const responseData = await response.json();
      console.log("you added default address!", responseData.address.id);
      fetchUserInfo();
      setDefaultAddress(responseData.address.id);
    } catch (error) {
      console.log("Error", error.message);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    const token = localStorage.getItem("access");
    console.log("address id", addressId);
    try {
      const response = await fetch(
        `http://localhost:8000/users/address/${addressId}/delete/`,
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
      const data = await response.json();
      console.log("address deleted successfully!", data);
      fetchUserInfo();
    } catch (error) {
      console.log("Error", error.message);
    }
  };

  if (!user.addresses) return <div>No address Found...</div>;

  return (
    <div className=" w-full items-center shadow-md rounded-sms px-2 py-2 mx-0">
      <div className="w-full bg-white">
        <div className="flex flex-row items-center justify-start gap-x-4">
          <h1 className="text-2xl py-2 px-2  font-mono  ">My Address</h1>
          {!openedCreateAddress && (
            <button
              className="bg-green-500 py-1 rounded-md px-2"
              onClick={() => setOpenedCreateAddress(true)}
            >
              Create Address
            </button>
          )}
        </div>
        <div className="flex flex-row gap-2 w-full">
          <div
            className={`${
              !openedCreateAddress &&
              !openedEditAddress &&
              "grid grid-cols-2 gap-x-4"
            } py-2 px-2 bg-white w-2/3`}
          >
            {addresses.map((address, key) => (
              <div
                className="flex flex-row gap-2 py-1 w-fit mb-2 text-gray-700 bg-gray-50  shadow-md "
                key={address.id}
              >
                <div className="px-2 py-2 ">
                  <div className="flex flex-row gap-4 items-center">
                    <h2 className="bg-gray-200 px-2 py-1 rounded-sm w-fit">
                      Address {key + 1}
                    </h2>
                    <span
                      className="text-xs hover:cursor-pointer hover:text-sm"
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      ❌
                    </span>
                  </div>

                  <div className="grid grid-cols-2 py-2  items-center gap-x-1 text-sm text-gray-700 ">
                    <div className="flex flex-row gap-1 my-1 text-center">
                      <p>Full Name:</p>
                      <p className="text-xs">{address.full_name}</p>
                    </div>
                    <div className="flex flex-row gap-1 my-1">
                      <p>Phone Number:</p>
                      <p className="text-xs">{address.phone_number}</p>
                    </div>
                    <div className="flex flex-row gap-1 my-1">
                      <p>Kebele:</p>
                      <p className="text-xs">{address.kebele}</p>
                    </div>
                    <div className="flex flex-row gap-1 py-1">
                      <p>City:</p>
                      <p className="text-xs">{address.city}</p>
                    </div>
                    <div className="flex flex-row gap-1 py-1">
                      <p> Woreda:</p>
                      <p className="text-xs">{address.woreda}</p>
                    </div>
                    <div className="flex flex-row gap-1 py-1">
                      <p>Region:</p>
                      <p className="text-xs">{address.region}</p>
                    </div>
                    <div className="flex flex-row gap-1 py-1">
                      <p>Postal Code:</p>
                      <p className="text-xs">{address.postal_code}</p>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between">
                    {defaultAddress !== address.id ? (
                      <button
                        className="mx-2 py-2 shadow-md rounded-sm w-fit px-2 flex flex-row gap-2 items-center"
                        onClick={() => {
                          handleSetDefault(address.id);
                          console.log("here is addres id:", address.id);
                        }}
                      >
                        make Default
                      </button>
                    ) : (
                      <span>✅</span>
                    )}
                    {!openedEditAddress && (
                      <button
                        className="bg-green-500 py-1 rounded-md px-2"
                        onClick={() => {
                          setOpenedEditAddress(address.id);
                          setNumSelected(key + 1);
                        }}
                      >
                        Edit Address
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {openedCreateAddress && (
            <EditAddress
              create={true}
              edit={false}
              use={false}
              setOpenedCreateAddress={setOpenedCreateAddress}
              showCloseBtn={true}
              shadow="shadow-2xl shadow-gray-700"
            />
          )}
          {openedEditAddress && (
            <EditAddress
              id={openedEditAddress}
              numSelected={numSelected}
              setOpenedEditAddress={setOpenedEditAddress}
              showCloseBtn={true}
              edit={true}
              shadow="shadow-2xl shadow-gray-700"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Address;
