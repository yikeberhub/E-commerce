import { React, useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";

function UpdateUserProfile({ setOpenEditProfile }) {
  const { user, fetchUserInfo } = useAuth();
  const [data, setData] = useState({});

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
    password_error: "",
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

  return (
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
                <p className="text-red-600 mt-1">{message.user_name_error}</p>
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
                  <p className="text-red-600 mt-1">{message.email_error}</p>
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
                defaultValue={data.bio}
                onChange={(e) => handleOnChange(e)}
              ></textarea>
            </div>
            {message.email_error && (
              <p className="text-red-600 mt-1">{message.email_error}</p>
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
                <p className="text-red-600 mt-1">{message.user_name_error}</p>
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
                  <p className="text-red-600 mt-1">{message.email_error}</p>
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
  );
}

export default UpdateUserProfile;
