import React, { useState } from "react";
const VendorRegistrationModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    logo: null,
    banner_image: null,
    description: "",
    address: "",
    email: "",
    phone_number: "",
    website: "",
    subscription_plan: "monthly",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    const token = localStorage.getItem("access");
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    try {
      const response = await fetch("http://localhost:8000/vendors/register/", {
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log("Vendor registered successfully");
        onClose();
      } else {
        const errorData = await response.json();
        console.error("Error registering vendor:", errorData);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
    console.log([...data]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-md w-full">
        <h2 className="text-lg font-semibold mb-2">Register as a Vendor</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <div className="flex items-center mb-2">
            <label className="text-gray-700 w-1/3 text-sm" htmlFor="title">
              Shop Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-2/3 border border-gray-300 rounded-md p-1 text-sm"
            />
          </div>
          <div className="flex items-center mb-2">
            <label className="text-gray-700 w-1/3 text-sm" htmlFor="logo">
              Logo
            </label>
            <input
              type="file"
              name="logo"
              id="logo"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 block w-2/3 border border-gray-300 rounded-md p-1 text-sm"
            />
          </div>
          <div className="flex items-center mb-2">
            <label
              className="text-gray-700 w-1/3 text-sm"
              htmlFor="bannerImage"
            >
              Banner Image
            </label>
            <input
              type="file"
              name="banner_image"
              id="bannerImage"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 block w-2/3 border border-gray-300 rounded-md p-1 text-sm"
            />
          </div>
          <div className="flex items-center mb-2">
            <label
              className="text-gray-700 w-1/3 text-sm"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
              className="mt-1 block w-2/3 border border-gray-300 rounded-md p-1 text-sm"
            />
          </div>
          <div className="flex items-center mb-2">
            <label className="text-gray-700 w-1/3 text-sm" htmlFor="address">
              Address
            </label>
            <input
              type="text"
              name="address"
              id="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="mt-1 block w-2/3 border border-gray-300 rounded-md p-1 text-sm"
            />
          </div>
          <div className="flex items-center mb-2">
            <label className="text-gray-700 w-1/3 text-sm" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-2/3 border border-gray-300 rounded-md p-1 text-sm"
            />
          </div>
          <div className="flex items-center mb-2">
            <label
              className="text-gray-700 w-1/3 text-sm"
              htmlFor="phoneNumber"
            >
              Phone Number
            </label>
            <input
              type="text"
              name="phone_number"
              id="phoneNumber"
              value={formData.phone_number}
              onChange={handleChange}
              className="mt-1 block w-2/3 border border-gray-300 rounded-md p-1 text-sm"
            />
          </div>
          <div className="flex items-center mb-2">
            <label className="text-gray-700 w-1/3 text-sm" htmlFor="website">
              Website
            </label>
            <input
              type="url"
              name="website"
              id="website"
              value={formData.website}
              onChange={handleChange}
              className="mt-1 block w-2/3 border border-gray-300 rounded-md p-1 text-sm"
            />
          </div>
          <div className="flex items-center mb-2">
            <label
              className="text-gray-700 w-1/3 text-sm"
              htmlFor="subscriptionPlan"
            >
              Subscription Plan
            </label>
            <select
              name="subscription_plan"
              id="subscriptionPlan"
              value={formData.subscription_plan}
              onChange={handleChange}
              className="mt-1 block w-2/3 border border-gray-300 rounded-md p-1 text-sm"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 bg-red-500 text-red-800 rounded-md px-2 py-1 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-md px-2 py-1 text-sm"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const VendorComponent = ({ vendor }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="py-2 my-4 px-3 bg-gray-50 rounded-md shadow-md">
      <h1 className="font-semibold text-xl">Vendor</h1>
      <div className="flex items-center">
        <img
          src={vendor?.logo}
          className="w-24 h-24 rounded-full"
          alt="vendor-img"
        />
        <span className="px-4 text-md font-semibold">Samsung PLC</span>
        <p>⭐⭐⭐ (3) 589 Reviews</p>
      </div>
      <h2 className="font-semibold text-md">Info</h2>
      <p className="flex flex-col gap-2 text-md font-semibold text-gray_light">
        <small>Address: Ethiopia, Bahirdar</small>
        <small>Contact seller: +2519539503</small>
      </p>
      <hr className="text-gray" />
      <div className="flex justify-between text-lg font-semibold">
        <div>
          <p>Rating</p>
          <p className="text-xl">100%</p>
        </div>
        <div>
          <p>Ship on time</p>
          <p className="text-xl">100%</p>
        </div>
        <div>
          <p>Chat response</p>
          <p className="text-xl">100%</p>
        </div>
      </div>
      {/* Other vendor information... */}
      <h2 className="py-2">
        Become a vendor?
        <span
          className="text-green-500 px-2 cursor-pointer"
          onClick={() => setModalOpen(true)}
        >
          Register now
        </span>
      </h2>
      <VendorRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default VendorComponent;
