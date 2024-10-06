import React, { useEffect, useReducer, useState } from "react";
import AccountIcon from "../../../assets/icons/user.svg";

import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const { user, fetchUserInfo } = useAuth();
  const [data, setData] = useState({});

  useEffect(() => {
    if (user) {
      console.log("user fetched now");
      setData({
        email: user.email,
        username: user.username,
        bio: user.bio,
        phone_number: user.phone_number,
        profile_image: user.profile_image,
      });
    }
  }, [user]);

  const [message, setMessage] = useState({
    success_message: "",
    email_error: "",
    user_name_error: "",
    password_error: "",
  });
  const [openEditProfile, setOpenEditProfile] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log("name", e.target.name, "value,", e.target.value);
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
    console.log("handle submit is called");
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
    formData.append("bio", data.bio);
    formData.append("phone_number", data.phone_number);

    data.profile_image && formData.append("profile_image", data.profile_image);

    try {
      const response = await fetch(
        `http://localhost:8000/users/${user.id}/update/`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        setMessage((prev) => ({
          ...prev,
          success_message: "user profile updated successfylly!!!",
        }));
        fetchUserInfo();
        console.log("user updated successfully", responseData);
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
  if (!user) {
    console.log("user is not fetched yet");
  }

  if (!user) return <div className="w-44 h-14 bg-green-500">loading...</div>;

  return (
    <div>
      <div className="mx-6 my-2 py-2 flex flex-row">
        <p>
          {" "}
          <span className="text-gray-600 mx-2">🏠 Home </span>
          <span>➡️</span>
        </p>
        <p>
          <span className="text-gray-600 mx-2">Pages</span>
          <span>➡️</span>
        </p>
        <p>
          <span className="text-gray-600 mx-2">My Account</span>
        </p>
      </div>
      <hr className=" border-gray-300 my-2" />

      <div className="grid grid-cols-6  mx-auto">
        <div className="col-span-6 sm:col-span-2 mx-auto py-2">
          <ul className="px-2 py-1 shadow-md shadow-gray-400 z-20 align-middle items-center mx-10 mt-2">
            <li className="w-64 bg-green-600 py-2 mr-5  text-white text-sm font-semibold text-start ps-2  rounded-md">
              <h2> 👩‍🏫 Profile</h2>
            </li>
            <li className="flex flex-rowi items-center w-64 py-2 my-2 border border-gray-300 text-gray-600 text-sm font-semibold text-start ps-2 pr-5 rounded-md">
              <span>
                <img
                  src={AccountIcon}
                  alt="account_det_img"
                  className="w-4 h-4"
                />
              </span>
              <h2 className="ms-2">Dashboard</h2>
            </li>
            <li className="flex flex-rowi items-center w-64 py-2 my-2 border border-gray-300 text-gray-600 text-sm font-semibold text-start ps-2 pr-5 rounded-md">
              <span>
                <img
                  src={AccountIcon}
                  alt="account_det_img"
                  className="w-4 h-4"
                />
              </span>
              <h2 className="ms-2">Orders</h2>
            </li>
            <li className="flex flex-rowi items-center w-64 py-2 my-2 border border-gray-300 text-gray-600 text-sm font-semibold text-start ps-2 pr-5 rounded-md">
              <span>
                <img
                  src={AccountIcon}
                  alt="account_det_img"
                  className="w-4 h-4"
                />
              </span>
              <h2 className="ms-2">Track your Order</h2>
            </li>

            <li className="flex flex-rowi items-center w-64 py-2 my-2 border border-gray-300 text-gray-600 text-sm font-semibold text-start ps-2 pr-5 rounded-md">
              <span>
                <img
                  src={AccountIcon}
                  alt="account_det_img"
                  className="w-4 h-4"
                />
              </span>
              <h2 className="ms-2">My Address</h2>
            </li>
            <li className="flex flex-rowi items-center w-64 py-2 my-2 border border-gray-300 text-gray-600 text-sm font-semibold text-start ps-2 pr-5 rounded-md">
              <span>
                <img
                  src={AccountIcon}
                  alt="account_det_img"
                  className="w-4 h-4"
                />
              </span>
              <h2 className="ms-2">Account Detail</h2>
            </li>
          </ul>
        </div>
        <div className="sm:col-span-4   py-2 ">
          <h2 className="font-bold text-gray-600 py-1 ms-6">My Profile</h2>
          <hr className="border border-r-gray-500" />
          <div className="flex flex-row ms-1">
            <div className=" mr-2  mt-20 ">
              <img
                src={user ? user.profile_image : AccountIcon}
                alt="profile_img"
                className="w-24 h-24 rounded-full"
              />{" "}
            </div>

            <div>
              <ul className=" w-72 px-2  py-2 shadow-lg shadow-gray-300 align-middle items-center  lg-mr-10 mt-2">
                <li className="lg-w-64 py-2 my-2  border border-gray-300 text-gray-600 text-sm font-semibold text-start ps-2 pr-5 rounded-sm">
                  <h3>
                    Name:{" "}
                    <span className="text-gray-700 mx-2">{user.username}</span>
                  </h3>
                </li>
                <li className="lg-w-64 py-2 my-2 border border-gray-300 text-gray-600 text-sm font-semibold text-start ps-2 pr-5 rounded-sm">
                  <h3>
                    Bio:
                    <span className="text-gray-700 mx-2">{user.bio}</span>
                  </h3>
                </li>
                <li className="lg-w-64 py-2 my-2 border border-gray-300 text-gray-600 text-sm font-semibold text-start ps-2 pr-5 rounded-sm">
                  <h3>
                    Phone:
                    <span className="text-gray-700 mx-2">
                      +{user.phone_number}
                    </span>
                  </h3>
                </li>
                <li className="lg-w-64 py-2 my-2 border border-gray-300 text-gray-600 text-sm font-semibold text-start ps-2 pr-5 rounded-sm">
                  <h3>
                    Email:
                    <span className="text-gray-700 mx-2">{user.email}</span>
                  </h3>
                </li>
                <li className="lg-w-64 py-2 my-2 border border-gray-300 text-gray-600 text-sm font-semibold text-start ps-2 pr-5 rounded-sm">
                  <h3>
                    Verified <span className="rounded-full">✅</span>
                  </h3>
                </li>
              </ul>
              {!openEditProfile && (
                <button
                  className="bg-green-600 px-3 py-1 my-2 rounded-sm text-white"
                  onClick={(e) => setOpenEditProfile((prev) => !prev)}
                >
                  Edit Profile
                </button>
              )}
            </div>
            {/* popup edit modal  */}
            {openEditProfile && (
              <div className="  w-auto rounded-md shadow-black border border-gray-300 shadow-2xl ms-4  mt-4 mb-2">
                <div className="my-2 mx-2">
                  <div className="flex flex-row justify-between items-center">
                    <h1 className="font-semibold py-1 px-2 border border-gray-300">
                      Edit Profile
                    </h1>
                    <small className="text-green-500 py-1 px-2 ">
                      {message.success_message}
                    </small>
                    <p
                      className="pr-2 mr-2 py-2 hover:cursor-pointer"
                      onClick={(e) => setOpenEditProfile(false)}
                    >
                      ❌
                    </p>
                  </div>

                  <form
                    className="pt-6 flex flex-col gap-2"
                    onSubmit={(e) => handleSubmit(e)}
                  >
                    <div className="flex flex-row">
                      <div>
                        <label>Username:</label>
                        <div className="bg-slate-100 p-2">
                          <input
                            type="text"
                            name="username"
                            value={data.username}
                            required
                            onChange={(e) => handleOnChange(e)}
                            className="w-full h-full outline-none bg-transparent"
                          />
                        </div>
                        {message.user_name_error && (
                          <p className="text-red-600 mt-1">
                            {message.user_name_error}
                          </p>
                        )}
                      </div>

                      <div className="ml-2">
                        <div className="grid">
                          <label>Email:</label>
                          <div className="bg-slate-100 p-2">
                            <input
                              type="email"
                              placeholder="Enter email"
                              name="email"
                              value={data.email}
                              onChange={(e) => handleOnChange(e)}
                              required
                              className="w-full h-full outline-none bg-transparent"
                            />
                          </div>
                          {message.email_error && (
                            <p className="text-red-600 mt-1">
                              {message.email_error}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid">
                      <label>Bio:</label>
                      <div className="bg-slate-100 p-2">
                        <textarea
                          className="w-full h-full outline-none bg-transparent"
                          name="bio"
                          onChange={(e) => handleOnChange(e)}
                        >
                          {data.bio}
                        </textarea>
                      </div>
                      {message.email_error && (
                        <p className="text-red-600 mt-1">
                          {message.email_error}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-row">
                      <div>
                        <label>Phone:</label>
                        <div className="bg-slate-100 p-2">
                          <input
                            type="text"
                            name="phone_number"
                            onChange={(e) => handleOnChange(e)}
                            value={data.phone_number}
                            className="w-full h-full outline-none bg-transparent"
                          />
                        </div>
                        {message.user_name_error && (
                          <p className="text-red-600 mt-1">
                            {message.user_name_error}
                          </p>
                        )}
                      </div>

                      <div className="ml-2">
                        <div className="grid">
                          <label>Profile Image:</label>
                          <div className="bg-slate-100 p-2">
                            <input
                              type="file"
                              name="profile_image"
                              onChange={(e) => handleFileChange(e)}
                              className="w-full h-full outline-none bg-transparent"
                            />
                          </div>
                          {message.email_error && (
                            <p className="text-red-600 mt-1">
                              {message.email_error}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <button className="bg-blue-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6">
                      Update Profile
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
