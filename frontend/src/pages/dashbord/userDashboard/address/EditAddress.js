import { React, useState, useEffect } from "react";
import { useAuth } from "../../../../contexts/AuthContext";

function EditAddress({
  id,
  setOpenedEditAddress,
  showCloseBtn = false,
  shadow = "shadow-none",
  edit = false,
  use = false,
}) {
  const { user } = useAuth();
  const [data, setData] = useState({});

  useEffect(() => {
    if (user) {
      const value = user.addresses.filter((address) => address.id === id);
      const address = value[0];
      setData({
        full_name: address.full_name,
        phone_number: address.phone_number,
        woreda: address.woreda,
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
  return (
    <div className={`w - fit bg-white ${shadow} rounded-md`}>
      <div className="flex flex-row justify-around items-center shadow-md my-1 ">
        <h1 className="text-center text-2xl py-2 px-2  font-mono  ">
          {use ? (
            <span>Use Address {id}</span>
          ) : (
            <span> Edit Address {id}</span>
          )}
        </h1>
        {showCloseBtn && (
          <span
            className=" hover:text-xl hover:cursor-pointer"
            onClick={() => setOpenedEditAddress(false)}
          >
            ❌
          </span>
        )}
      </div>
      <form className="  py-2 shadow-lg shadow-gray-300  items-center   mt-2">
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
              value={data.delivery_instructions}
              placeholder="Enter Delivery Instructions Code(optional)"
              className="text-gray-700 mx-2 py-1 px-2 border border-gray-400 rounded-sm block focus:bg-gray-100 focus:outline-indigo-400 outline-1"
            />
          </div>
          <button className="bg-green-500 rounded-md py-1 px-2 hover:bg-purple-600">
            Update Address
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditAddress;
