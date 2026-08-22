import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiStar, FiMapPin, FiPhone, FiX } from "react-icons/fi";
import Card from "../utilities/CardComp";
import { inputClass } from "../common/formStyles";

const API_URL = process.env.REACT_APP_API_URL;

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
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] != null) data.append(key, formData[key]);
    });

    try {
      setSubmitting(true);
      setError("");
      const response = await fetch(`${API_URL}/vendors/register/`, {
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        onClose();
      } else {
        const errorData = await response.json();
        setError(
          errorData?.detail ||
            Object.values(errorData || {})[0]?.[0] ||
            "Failed to register vendor. Please check your details."
        );
      }
    } catch (error) {
      setError("A network error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const fieldClass = inputClass;
  const labelClass = "block text-xs font-medium text-slate-600 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="bg-white rounded-2xl shadow-soft p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Register as a Vendor
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition"
            aria-label="Close"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-xs mb-3 bg-red-50 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className={labelClass} htmlFor="title">
              Shop Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              required
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="logo">
              Logo
            </label>
            <input
              type="file"
              name="logo"
              id="logo"
              accept="image/*"
              onChange={handleChange}
              className={`${fieldClass} py-1.5`}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="bannerImage">
              Banner Image
            </label>
            <input
              type="file"
              name="banner_image"
              id="bannerImage"
              accept="image/*"
              onChange={handleChange}
              className={`${fieldClass} py-1.5`}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="description">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="address">
              Address
            </label>
            <input
              type="text"
              name="address"
              id="address"
              value={formData.address}
              onChange={handleChange}
              required
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="phoneNumber">
              Phone Number
            </label>
            <input
              type="text"
              name="phone_number"
              id="phoneNumber"
              value={formData.phone_number}
              onChange={handleChange}
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="website">
              Website
            </label>
            <input
              type="url"
              name="website"
              id="website"
              value={formData.website}
              onChange={handleChange}
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="subscriptionPlan">
              Subscription Plan
            </label>
            <select
              name="subscription_plan"
              id="subscriptionPlan"
              value={formData.subscription_plan}
              onChange={handleChange}
              className={fieldClass}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700 text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              {submitting ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StatBlock = ({ label, value }) => (
  <div className="text-center flex-1">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="text-lg font-bold text-slate-900">{value}%</p>
  </div>
);

const VendorComponent = ({ vendor }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <Card title="Vendor">
      {vendor ? (
        <>
          <Link
            to={`/vendors/${vendor.id}`}
            className="flex items-center gap-3 group"
          >
            <img
              src={vendor.logo}
              className="w-16 h-16 rounded-full object-cover border border-slate-100"
              alt={vendor.title}
            />
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 truncate group-hover:text-primary-600 transition">
                {vendor.title}
              </p>
              <p className="text-sm text-amber-500 flex items-center gap-1 mt-0.5">
                <FiStar className="fill-current" /> {vendor.authentic_rating}
                /100
              </p>
            </div>
          </Link>

          <div className="flex flex-col gap-1.5 mt-3 text-sm text-slate-500">
            {vendor.address && (
              <p className="flex items-center gap-1.5">
                <FiMapPin className="text-slate-400 shrink-0" />
                <span className="truncate">{vendor.address}</span>
              </p>
            )}
            {vendor.phone_number && (
              <p className="flex items-center gap-1.5">
                <FiPhone className="text-slate-400 shrink-0" />
                {vendor.phone_number}
              </p>
            )}
          </div>

          <div className="flex justify-between mt-4 pt-4 border-t border-slate-100">
            <StatBlock label="Rating" value={vendor.authentic_rating} />
            <StatBlock label="Ship on time" value={vendor.shipping_on_time} />
            <StatBlock
              label="Chat response"
              value={vendor.chat_response_time}
            />
          </div>
        </>
      ) : (
        <p className="text-sm text-slate-400">Vendor information unavailable.</p>
      )}

      <p className="text-sm text-slate-500 mt-4 pt-4 border-t border-slate-100">
        Want to sell on our marketplace?{" "}
        <button
          type="button"
          className="text-primary-600 font-medium hover:text-primary-700 hover:underline"
          onClick={() => setModalOpen(true)}
        >
          Register now
        </button>
      </p>

      <VendorRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </Card>
  );
};

export default VendorComponent;
