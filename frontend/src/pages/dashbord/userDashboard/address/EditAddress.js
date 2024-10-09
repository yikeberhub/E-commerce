import { React, useState, useEffect } from "react";
import { useAuth } from "../../../../contexts/AuthContext";

function EditAddress({
  id,
  setOpenedEditAddress,
  setOpenedCreateAddress,
  numSelected = false,
  showCloseBtn = false,
  shadow = "shadow-none",
  edit = false,
  use = false,
  create = false,
}) {
  const { user, fetchUserInfo } = useAuth();
  const [data, setData] = useState({
    full_name: "",
    phone_number: "",
    kebele: "",
    city: "",
    region: "",
    postal_code: "",
    delivery_instruction: "",
  });
  const [message, setMessage] = useState("");

  let value = user.addresses.filter((address, key) => address.id === id);
  let address = value[0];
  if (use) {
    value = user.addresses.filter((address, key) => address.is_default);
    address = value[0];
  }

  useEffect(() => {
    if (user && (edit || use)) {
      setData({
        full_name: address.full_name,
        phone_number: address.phone_number,
        kebele: address.kebele,
        city: address.city,
        region: address.region,
        postal_code: address.postal_code,
        delivery_instruction: address.delivery_instructions,
      });
    }
  }, [user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");
    let url = "http://localhost:8000/users/address/create/";
    let method = "POST";

    if (edit) {
      url = `http://localhost:8000/users/address/${address.id}/update/`;
      method = "PUT";
    }

    try {
      console.log("datas :", data);
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("failed to Update Address");
      }
      const responseData = await response.json();
      if (edit) {
        console.log("Address Updated successfully!", responseData);
        setMessage("Address Updated successfully");
      } else {
        console.log("Address Created successfully!", responseData);
        setMessage("Address Created successfully");
        setData({
          full_name: "",
          phone_number: "",
          kebele: "",
          city: "",
          region: "",
          postal_code: "",
          delivery_instruction: "",
        });
      }
      fetchUserInfo();
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className={`w - fit bg-white ${shadow} rounded-md`}>
      <div className="flex flex-row justify-around items-center shadow-md my-1 ">
        <h1 className="text-center text-2xl py-2 px-2  font-mono  ">
          {use && <span>Use Default Address </span>}

          {create && <span>Create New Address </span>}

          {edit && <span> Edit Address {numSelected && numSelected}</span>}
        </h1>
        {showCloseBtn && (
          <span
            className=" hover:text-xl hover:cursor-pointer"
            onClick={() =>
              edit ? setOpenedEditAddress(false) : setOpenedCreateAddress(false)
            }
          >
            ❌
          </span>
        )}
      </div>
      <form
        className="  py-2 shadow-lg shadow-gray-300  items-center   mt-2"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-row">
          <div className=" py-2 my-2   text-gray-600 text-sm font-semibold text-start ps-2  rounded-sm">
            <label className="mx-2 my-2">Full Name: </label>
            <input
              type="text"
              name="full_name"
              onChange={(e) => handleOnChange(e)}
              value={data.full_name}
              placeholder="Enter full name"
              className="text-gray-700 mx-2 py-1 px-2 border border-gray-400 rounded-sm block focus:bg-gray-100 focus:outline-indigo-400 outline-1"
            />
          </div>
          <div className=" py-2 my-2   text-gray-600 text-sm font-semibold text-start ps-2  rounded-sm">
            <label className="mx-2 my-2">Phone Number: </label>
            <input
              type="text"
              name="phone_number"
              onChange={(e) => handleOnChange(e)}
              value={data.phone_number}
              placeholder="Enter phone number"
              className="text-gray-700 mx-2 py-1 px-2 border border-gray-400 rounded-sm block focus:bg-gray-100 focus:outline-indigo-400 outline-1"
            />
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="py-2 my-2   text-gray-600 text-sm font-semibold text-start ps-2  rounded-sm">
            <label className="mx-2 my-2">Kebele: </label>
            <input
              type="text"
              name="kebele"
              onChange={(e) => handleOnChange(e)}
              value={data.kebele}
              placeholder="Enter full name"
              className="text-gray-700 mx-2 py-1 px-2 border border-gray-400 rounded-sm block focus:bg-gray-100 focus:outline-indigo-400 outline-1"
            />
          </div>
          <div className=" py-2 my-2   text-gray-600 text-sm font-semibold text-start ps-2  rounded-sm">
            <label className="mx-2 my-2">City: </label>
            <input
              type="text"
              name="city"
              onChange={(e) => handleOnChange(e)}
              value={data.city}
              placeholder="Enter City name"
              className="text-gray-700 mx-2 py-1 px-2 border border-gray-400 rounded-sm block focus:bg-gray-100 focus:outline-indigo-400 outline-1"
            />
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <div className=" py-2 my-2   text-gray-600 text-sm font-semibold text-start ps-2  rounded-sm">
            <label className="mx-2 my-2">Region: </label>
            <input
              type="text"
              name="region"
              onChange={(e) => handleOnChange(e)}
              value={data.region}
              placeholder="Enter Region name"
              className="text-gray-700 mx-2 py-1 px-2 border border-gray-400 rounded-sm block focus:bg-gray-100 focus:outline-indigo-400 outline-1"
            />
          </div>
          <div className="lg-w-64 py-2 my-2   text-gray-600 text-sm font-semibold text-start ps-2  rounded-sm">
            <label className="mx-2 my-2">Postal Code: </label>
            <input
              type="text"
              name="postal_code"
              onChange={(e) => handleOnChange(e)}
              value={data.postal_code}
              placeholder="Enter Postal Code(optional)"
              className="text-gray-700 mx-2 py-1 px-2 border border-gray-400 rounded-sm block focus:bg-gray-100 focus:outline-indigo-400 outline-1"
            />
          </div>
        </div>

        <div className="flex flex-row gap-6 items-center">
          <div className="lg-w-64 py-2 my-2   text-gray-600 text-sm font-semibold text-start ps-2  rounded-sm">
            <label className="mx-2 my-2">Delivery Instructions: </label>
            <input
              type="text"
              name="delivery_instruction"
              onChange={(e) => handleOnChange(e)}
              value={data.delivery_instruction}
              placeholder="Enter Delivery Instructions Code(optional)"
              className="text-gray-700 mx-2 py-1 px-2 border border-gray-400 rounded-sm block focus:bg-gray-100 focus:outline-indigo-400 outline-1"
            />
          </div>

          {create && (
            <button
              type="submit"
              className="bg-green-500 rounded-md py-1 px-2 hover:bg-purple-600"
            >
              Create Address
            </button>
          )}
          {edit && (
            <button
              type="submit"
              className="bg-green-500 bg-opacity-100 rounded-md py-1 px-2 hover:bg-purple-600"
            >
              Update Address
            </button>
          )}
        </div>
      </form>
      <div
        className="text-green-500 ms-2 py-2 shadow-sm 
      "
      >
        <small className="text-center py-2 items-center">{message}</small>
      </div>
    </div>
  );
}

export default EditAddress;
