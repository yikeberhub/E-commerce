import React, { useState } from "react";

function AddVendor() {
  const [vendorData, setVendorData] = useState({
    title: "",
    logo: null,
    banner_image: null,
    description: "",
    address: "",
    email: "",
    phone_number: "",
    website: "",
    chat_response_time: 100,
    shipping_on_time: 100,
    authentic_rating: 100.0,
    days_return: 30,
    warranty_period: 12,
    subscription_plan: "monthly",
    is_active: true,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setVendorData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(vendorData);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Vendor</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-4 max-w-xl "
      >
        <div className="mb-3">
          <label
            className="block text-gray-700 font-semibold mb-1"
            htmlFor="title"
          >
            Vendor Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={vendorData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-1"
            required
          />
        </div>

        <div className="mb-3">
          <label
            className="block text-gray-700 font-semibold mb-1"
            htmlFor="logo"
          >
            Logo
          </label>
          <input
            type="file"
            name="logo"
            id="logo"
            accept="image/*"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-1"
          />
        </div>

        <div className="mb-3">
          <label
            className="block text-gray-700 font-semibold mb-1"
            htmlFor="banner_image"
          >
            Banner Image
          </label>
          <input
            type="file"
            name="banner_image"
            id="banner_image"
            accept="image/*"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-1"
          />
        </div>

        <div className="mb-3">
          <label
            className="block text-gray-700 font-semibold mb-1"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            name="description"
            id="description"
            value={vendorData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-1"
            rows="3"
          ></textarea>
        </div>

        <div className="mb-3">
          <label
            className="block text-gray-700 font-semibold mb-1"
            htmlFor="address"
          >
            Address
          </label>
          <input
            type="text"
            name="address"
            id="address"
            value={vendorData.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-1"
            required
          />
        </div>

        <div className="mb-3">
          <label
            className="block text-gray-700 font-semibold mb-1"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={vendorData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-1"
            required
          />
        </div>

        <div className="mb-3">
          <label
            className="block text-gray-700 font-semibold mb-1"
            htmlFor="phone_number"
          >
            Phone Number
          </label>
          <input
            type="text"
            name="phone_number"
            id="phone_number"
            value={vendorData.phone_number}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-1"
            required
          />
        </div>

        <div className="mb-3">
          <label
            className="block text-gray-700 font-semibold mb-1"
            htmlFor="website"
          >
            Website
          </label>
          <input
            type="url"
            name="website"
            id="website"
            value={vendorData.website}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-1"
          />
        </div>

        <div className="mb-3">
          <label
            className="block text-gray-700 font-semibold mb-1"
            htmlFor="subscription_plan"
          >
            Subscription Plan
          </label>
          <select
            name="subscription_plan"
            id="subscription_plan"
            value={vendorData.subscription_plan}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-1"
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="mb-3">
          <label
            className="block text-gray-700 font-semibold mb-1"
            htmlFor="is_active"
          >
            Is Active?
          </label>
          <select
            name="is_active"
            id="is_active"
            value={vendorData.is_active}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-1"
          >
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Vendor
        </button>
      </form>
    </div>
  );
}

export default AddVendor;
