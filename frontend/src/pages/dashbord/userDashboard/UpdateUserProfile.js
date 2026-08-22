import React, { useState, useEffect } from "react";
import { FiX, FiCamera } from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";
import { inputClass } from "../../../common/formStyles";
import AccountIcon from "../../../assets/icons/user.svg";

const API_URL = process.env.REACT_APP_API_URL;

function UpdateUserProfile({ onClose }) {
  const { user, authTokens, fetchUserInfo } = useAuth();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setData({
        email: user.email,
        username: user.username,
        bio: user.bio,
        phone_number: user.phone_number,
      });
    }
  }, [user]);

  const [message, setMessage] = useState({
    success_message: "",
    email_error: "",
    user_name_error: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData((prev) => ({
        ...prev,
        profile_image: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ email_error: "", user_name_error: "", success_message: "" });

    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("bio", data.bio || "");
    formData.append("phone_number", data.phone_number || "");

    if (data.profile_image) {
      formData.append("profile_image", data.profile_image);
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/users/${user.id}/update/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: formData,
      });

      if (response.ok) {
        await fetchUserInfo();
        setMessage((prev) => ({
          ...prev,
          success_message: "Profile updated successfully!",
        }));
        setTimeout(() => onClose(), 1200);
      } else {
        const errorData = await response.json();

        setMessage((prev) => ({
          ...prev,
          email_error: errorData.email?.[0] || "",
          user_name_error: errorData.username?.[0] || errorData.detail || "",
        }));
      }
    } catch (error) {
      console.error("Error", error);
      setMessage((prev) => ({
        ...prev,
        user_name_error: "An error occurred. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-soft max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Edit Profile</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition"
            aria-label="Close"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <form className="p-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="w-20 h-20 mx-auto relative overflow-hidden rounded-full border-2 border-slate-100 group">
            <img
              src={
                data.profile_image
                  ? URL.createObjectURL(data.profile_image)
                  : user?.profile_image || AccountIcon
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <label className="absolute inset-0 flex items-center justify-center bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors cursor-pointer">
              <FiCamera className="text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <input
                type="file"
                name="profile_image"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={data.username || ""}
                required
                onChange={handleOnChange}
                className={inputClass}
              />
              {message.user_name_error && (
                <p className="text-red-500 text-xs mt-1.5">
                  {message.user_name_error}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={data.email || ""}
                onChange={handleOnChange}
                required
                className={inputClass}
              />
              {message.email_error && (
                <p className="text-red-500 text-xs mt-1.5">
                  {message.email_error}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Bio
            </label>
            <textarea
              className={`${inputClass} min-h-[80px]`}
              name="bio"
              value={data.bio || ""}
              onChange={handleOnChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Phone
            </label>
            <input
              type="text"
              name="phone_number"
              onChange={handleOnChange}
              value={data.phone_number || ""}
              className={inputClass}
            />
          </div>

          <div className="flex items-center justify-between mt-2">
            {message.success_message ? (
              <p className="text-sm text-emerald-600 font-medium">
                {message.success_message}
              </p>
            ) : (
              <span />
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateUserProfile;
