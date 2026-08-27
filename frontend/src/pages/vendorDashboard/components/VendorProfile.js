import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FiSettings, FiCamera, FiCheckCircle, FiCalendar } from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";
import { inputClass } from "../../../common/formStyles";

const API_URL = process.env.REACT_APP_API_URL;

const SUBSCRIPTION_STYLES = {
  active: "bg-emerald-50 text-emerald-600",
  expired: "bg-red-50 text-red-600",
  none: "bg-slate-100 text-slate-500",
};

const SUBSCRIPTION_LABELS = {
  active: "Active",
  expired: "Expired",
  none: "No subscription on file",
};

const emptyForm = {
  title: "",
  description: "",
  address: "",
  email: "",
  phone_number: "",
  website: "",
  days_return: "",
  warranty_period: "",
};

function VendorProfile() {
  const { vendor, refetchVendor } = useOutletContext();
  const { authTokens } = useAuth();
  const [data, setData] = useState(emptyForm);
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (vendor) {
      setData({
        title: vendor.title || "",
        description: vendor.description || "",
        address: vendor.address || "",
        email: vendor.email || "",
        phone_number: vendor.phone_number || "",
        website: vendor.website || "",
        days_return: vendor.days_return ?? "",
        warranty_period: vendor.warranty_period ?? "",
      });
    }
  }, [vendor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaved(false);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));
    if (logoFile) formData.append("logo", logoFile);
    if (bannerFile) formData.append("banner_image", bannerFile);

    try {
      setSaving(true);
      const response = await fetch(`${API_URL}/vendors/${vendor.id}/`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${authTokens.access}` },
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to save profile.");
      setSaved(true);
      setLogoFile(null);
      setBannerFile(null);
      await refetchVendor();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!vendor) return null;

  const subscriptionStatus = vendor.subscription_status || "none";

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <FiCalendar className="text-primary-500" /> Subscription
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium capitalize text-slate-600 bg-slate-50 rounded-full px-2.5 py-1">
            {vendor.subscription_plan} plan
          </span>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${SUBSCRIPTION_STYLES[subscriptionStatus]}`}
          >
            {SUBSCRIPTION_LABELS[subscriptionStatus]}
          </span>
          {vendor.subscription_end_date && (
            <span className="text-xs text-slate-400">
              {subscriptionStatus === "expired" ? "Expired" : "Renews"} on{" "}
              {new Date(vendor.subscription_end_date).toLocaleDateString()}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Contact support to renew or change your plan — subscription payments are recorded by an admin.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
      <h1 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <FiSettings className="text-primary-500" /> Shop Settings
      </h1>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-4">
          {error}
        </p>
      )}
      {saved && (
        <p className="text-sm text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2 mb-4 flex items-center gap-1.5">
          <FiCheckCircle /> Profile updated.
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl">
        <div className="flex items-center gap-6">
          <div className="relative w-20 h-20 shrink-0 group">
            <img
              src={logoFile ? URL.createObjectURL(logoFile) : vendor.logo}
              alt="Logo"
              className="w-20 h-20 rounded-full object-cover border-2 border-slate-100 bg-slate-50"
            />
            <label className="absolute inset-0 flex items-center justify-center bg-slate-900/0 group-hover:bg-slate-900/40 rounded-full transition-colors cursor-pointer">
              <FiCamera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 mb-1">Banner</p>
            <div className="relative h-16 w-full rounded-lg overflow-hidden group bg-slate-50 border border-slate-100">
              <img
                src={bannerFile ? URL.createObjectURL(bannerFile) : vendor.banner_image}
                alt="Banner"
                className="w-full h-full object-cover"
              />
              <label className="absolute inset-0 flex items-center justify-center bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors cursor-pointer">
                <FiCamera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBannerFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Shop Name
          </label>
          <input
            type="text"
            name="title"
            value={data.title}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Description
          </label>
          <textarea
            name="description"
            value={data.description}
            onChange={handleChange}
            className={`${inputClass} min-h-[80px]`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Contact Email
            </label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Phone Number
            </label>
            <input
              type="text"
              name="phone_number"
              value={data.phone_number}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={data.address}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={data.website}
              onChange={handleChange}
              placeholder="https://..."
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Return Window (days)
            </label>
            <input
              type="number"
              name="days_return"
              min="0"
              value={data.days_return}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Warranty Period (months)
            </label>
            <input
              type="number"
              name="warranty_period"
              min="0"
              value={data.warranty_period}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="self-start bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
      </div>
    </div>
  );
}

export default VendorProfile;
