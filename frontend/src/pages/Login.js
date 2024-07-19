import React, { useContext, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import loginIcons from "../assets/icons/images/signin.gif";
import SummaryApi from "../common";
// import { useAuth } from "../contexts/AuthContext";
import { CsrfContext } from "../contexts/CsrfContext";
import { AuthContext } from "../contexts/AuthContext";
const Login = () => {
  // const { user, login } = useAuth();
  const { csrfToken } = useContext(CsrfContext);
  const { user, login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("token:", csrfToken);
    console.log("testing...1");

    const dataResponse = await fetch(SummaryApi.signIn.url, {
      method: "post",
      // credentials: "include",
      headers: {
        "content-type": "application/json",
        // "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(data),
    });
    if (dataResponse.ok) {
      console.log("data responses", dataResponse);
      const dataApi = await dataResponse.json();

      if (dataApi.success) {
        localStorage.setItem("userId", dataApi.user.id);
        console.log("user datas:", dataApi.user);
        // return dataApi.user;
      }

      if (dataApi.error) {
        console.log(dataApi.message);
      }
    } else {
      console.log("the error is from server");
    }
  };

  return (
    <section id="login">
      <div className="mx-auto container p-4">
        <div className="bg-white p-5 w-full max-w-sm mx-auto">
          <div className="w-20 h-20 mx-auto">
            <img src={loginIcons} alt="login icons" />
          </div>

          <form className="pt-6 flex flex-col gap-2" onSubmit={handleSubmit}>
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
            </div>

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
                  onClick={() => setShowPassword((preve) => !preve)}
                >
                  <span>🔑</span>
                </div>
              </div>
              <Link
                to={"/forgot-password"}
                className="block w-fit ml-auto hover:underline hover:text-red-600"
              >
                Forgot password ?
              </Link>
            </div>

            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6">
              Login
            </button>
          </form>

          <p className="my-5">
            Don't have account ?{" "}
            <Link
              to={"/signup/"}
              className=" text-red-600 hover:text-red-700 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
