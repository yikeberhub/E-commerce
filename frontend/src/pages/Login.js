import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginIcons from "../assets/icons/images/signin.gif";
import { useAuth } from "../contexts/AuthContext";
import Spinner from "../common/Spinner";

const Login = () => {
  const { setTokens, user, fetchUserInfo } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const [messages, setMessages] = useState({ email: "", password: "" });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if user is already logged in
    if (user) {
      navigate("/"); // redirect to home if user is authenticated
    }
  }, [user, navigate]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessages({});
      const response = await fetch("http://127.0.0.1:8000/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        setTokens(data, () => {
          navigate("/"); // Redirect to home after setting tokens
        });

        alert("Login successful!");
      } else {
        const errorData = await response.json();
        console.log("error:", errorData);
        setMessages({
          email:
            errorData.errors[0]?.field === "email"
              ? errorData.errors[0]?.message
              : "",
          password:
            errorData.errors[0]?.field === "password"
              ? errorData.errors[0]?.message
              : "",
        });
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <section id="login">
          <div className="mx-auto container p-4">
            <div className="bg-white text-black rounded-sm p-5 w-full max-w-sm mx-auto">
              <div className="w-20 h-20 mx-auto">
                <img src={loginIcons} alt="login icons" />
              </div>

              <form
                className="pt-6 flex flex-col gap-2"
                onSubmit={handleSubmit}
              >
                {/* Email Input */}
                <div className="grid">
                  <label>Email : </label>
                  <div className="bg-slate-100 p-2">
                    <input
                      type="email"
                      placeholder="enter email"
                      name="email"
                      value={data.email}
                      onChange={handleOnChange}
                      className="w-full h-full outline-none bg-transparent"
                    />
                  </div>
                  <small className="text-red-400 text-xs">
                    {messages["email"]}
                  </small>
                </div>

                {/* Password Input */}
                <div>
                  <label>Password : </label>
                  <div className="bg-slate-100 p-2 flex">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="enter password"
                      value={data.password}
                      name="password"
                      onChange={handleOnChange}
                      className="w-full h-full outline-none bg-transparent"
                    />
                    <div
                      className="cursor-pointer text-xl"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      <span>🔑</span>
                    </div>
                  </div>
                  <small className="text-red-400 text-xs">
                    {messages["password"]}
                  </small>

                  <Link
                    to={"/forgot-password"}
                    className="block w-fit ml-auto hover:underline hover:text-red-600"
                  >
                    Forgot password ?
                  </Link>
                </div>

                <button className="bg-red-500 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6">
                  Login
                </button>
              </form>

              <p className="my-5">
                Don't have an account?{" "}
                <Link
                  to={"/signup/"}
                  className="text-red-600 hover:text-red-700 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Login;
