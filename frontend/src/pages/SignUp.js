import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCamera,
  FiUserPlus,
} from "react-icons/fi";
import SummaryApi from "../common";
import { inputClass } from "../common/formStyles";
import defaultAvatar from "../assets/icons/images/signin.gif";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    email_error: "",
    user_name_error: "",
    password_error: "",
  });

  const [data, setData] = useState({
    email: "",
    password: "",
    username: "",
    confirmPassword: "",
    profile_image: null,
  });

  const navigate = useNavigate();

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
    setMessage({ email_error: "", user_name_error: "", password_error: "" });

    if (data.password !== data.confirmPassword) {
      setMessage((prev) => ({
        ...prev,
        password_error: "Passwords do not match.",
      }));
      return;
    }

    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (data.profile_image) {
      formData.append("profile_image", data.profile_image);
    }

    try {
      setLoading(true);
      const response = await fetch(SummaryApi.signUp.url, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        navigate("/login");
      } else {
        const errorData = await response.json();

        if (errorData.email) {
          setMessage((prev) => ({ ...prev, email_error: errorData.email[0] }));
        }
        if (errorData.username) {
          setMessage((prev) => ({
            ...prev,
            user_name_error: errorData.username[0],
          }));
        }
        if (errorData.password) {
          setMessage((prev) => ({
            ...prev,
            password_error: errorData.password[0],
          }));
        }
      }
    } catch (error) {
      console.error("Error", error);
      setMessage((prev) => ({
        ...prev,
        password_error: "An error occurred. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 text-primary-600 mb-3">
              <FiUserPlus className="text-xl" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900">
              Create your account
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Join us and start shopping today
            </p>
          </div>

          <div className="w-20 h-20 mx-auto relative overflow-hidden rounded-full border-2 border-slate-100 mb-6 group">
            <img
              src={
                data.profile_image
                  ? URL.createObjectURL(data.profile_image)
                  : defaultAvatar
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

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Username
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  placeholder="Choose a username"
                  name="username"
                  value={data.username}
                  onChange={handleOnChange}
                  required
                  className={`${inputClass} pl-9`}
                />
              </div>
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
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  name="email"
                  value={data.email}
                  onChange={handleOnChange}
                  required
                  className={`${inputClass} pl-9`}
                />
              </div>
              {message.email_error && (
                <p className="text-red-500 text-xs mt-1.5">
                  {message.email_error}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={data.password}
                  name="password"
                  onChange={handleOnChange}
                  required
                  className={`${inputClass} pl-9 pr-9`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={data.confirmPassword}
                  name="confirmPassword"
                  onChange={handleOnChange}
                  required
                  className={`${inputClass} pl-9 pr-9`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {message.password_error && (
                <p className="text-red-500 text-xs mt-1.5">
                  {message.password_error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-sm text-slate-500 text-center mt-6">
            Already have an account?{" "}
            <Link
              to={"/login/"}
              className="text-primary-600 font-medium hover:text-primary-700 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
