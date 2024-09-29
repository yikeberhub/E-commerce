import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginIcons from "../assets/icons/images/signin.gif";
import SummaryApi from "../common";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    setMessage({ email_error: "", user_name_error: "", password_error: "" }); // Clear previous messages

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
    formData.append("profile_image", data.profile_image);

    try {
      const response = await fetch(SummaryApi.signUp.url, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Signup successful!", responseData);
        navigate("/login");
      } else {
        const errorData = await response.json();
        console.log("error", errorData);

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
    }
  };

  return (
    <section id="signup">
      <div className="mx-auto container p-4">
        <div className="bg-white p-5 w-full max-w-sm mx-auto">
          <div className="w-20 h-20 mx-auto relative overflow-hidden rounded-full">
            <img
              src={
                data.profile_image
                  ? URL.createObjectURL(data.profile_image)
                  : loginIcons
              }
              alt="Profile"
            />
            <label>
              <div className="text-xs bg-opacity-80 bg-slate-200 pb-4 pt-2 cursor-pointer text-center absolute bottom-0 w-full">
                Upload Photo
              </div>
              <input
                type="file"
                name="profile_image"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          <form className="pt-6 flex flex-col gap-2" onSubmit={handleSubmit}>
            <div className="grid">
              <label>Username:</label>
              <div className="bg-slate-100 p-2">
                <input
                  type="text"
                  placeholder="Enter your username"
                  name="username"
                  value={data.username}
                  onChange={handleOnChange}
                  required
                  className="w-full h-full outline-none bg-transparent"
                />
              </div>
              {message.user_name_error && (
                <p className="text-red-600 mt-1">{message.user_name_error}</p>
              )}
            </div>
            <div className="grid">
              <label>Email:</label>
              <div className="bg-slate-100 p-2">
                <input
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={data.email}
                  onChange={handleOnChange}
                  required
                  className="w-full h-full outline-none bg-transparent"
                />
              </div>
              {message.email_error && (
                <p className="text-red-600 mt-1">{message.email_error}</p>
              )}
            </div>

            <div>
              <label>Password:</label>
              <div className="bg-slate-100 p-2 flex">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={data.password}
                  name="password"
                  onChange={handleOnChange}
                  required
                  className="w-full h-full outline-none bg-transparent"
                />
                <div
                  className="cursor-pointer text-xl"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <span>🔑</span>
                </div>
              </div>
              {message.password_error && (
                <p className="text-red-600 mt-1">{message.password_error}</p>
              )}
            </div>

            <div>
              <label>Confirm Password:</label>
              <div className="bg-slate-100 p-2 flex">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Enter confirm password"
                  value={data.confirmPassword}
                  name="confirmPassword"
                  onChange={handleOnChange}
                  required
                  className="w-full h-full outline-none bg-transparent"
                />
                <div
                  className="cursor-pointer text-xl"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  <span>🔑</span>
                </div>
              </div>
              {message.password_error && (
                <p className="text-red-600 mt-1">{message.password_error}</p>
              )}
            </div>

            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6">
              Sign Up
            </button>
          </form>

          <p className="my-5">
            Already have an account?
            <Link
              to={"/login/"}
              className="text-red-600 hover:text-red-700 hover:underline"
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
