import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import AlertModal from "../common/AlertModal";
import { inputClass } from "../common/formStyles";

const API_URL = process.env.REACT_APP_API_URL;

const Login = () => {
  const { setTokens } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const [messages, setMessages] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessages({ email: "", password: "" });
      const response = await fetch(`${API_URL}/users/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        localStorage.setItem("access", responseData.access);
        localStorage.setItem("refresh", responseData.refresh);
        await setTokens(responseData); // Role-based redirect handled in AuthContext

        setAlertMessage("Login successful!");
        setAlertType("success");
        setAlertVisible(true);
      } else {
        const errorData = await response.json();
        setMessages({
          email:
            errorData.errors?.[0]?.field === "email"
              ? errorData.errors[0]?.message
              : "",
          password:
            errorData.errors?.[0]?.field === "password"
              ? errorData.errors[0]?.message
              : "",
        });

        setAlertMessage("Login failed. Please check your credentials.");
        setAlertType("error");
        setAlertVisible(true);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setAlertMessage("An unexpected error occurred. Please try again later.");
      setAlertType("error");
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-8">
            <div className="flex flex-col items-center text-center mb-6">
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 text-primary-600 mb-3">
                <FiLogIn className="text-xl" />
              </span>
              <h1 className="text-2xl font-bold text-slate-900">
                Welcome back
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Log in to continue to your account
              </p>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
                {messages.email && (
                  <p className="text-red-500 text-xs mt-1.5">{messages.email}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <Link
                    to={"/forgot-password"}
                    className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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
                {messages.password && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {messages.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="text-sm text-slate-500 text-center mt-6">
              Don't have an account?{" "}
              <Link
                to={"/signup/"}
                className="text-primary-600 font-medium hover:text-primary-700 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </section>

      {alertVisible && (
        <AlertModal
          message={alertMessage}
          type={alertType}
          isVisible={alertVisible}
          onClose={() => setAlertVisible(false)}
        />
      )}
    </>
  );
};

export default Login;
