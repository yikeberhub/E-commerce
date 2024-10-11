import { React, useState } from "react";
import AccountIcon from "../../../assets/icons/user.svg";

import { useAuth } from "../../../contexts/AuthContext";
import UpdateUserProfile from "./UpdateUserProfile";

function UserProfile() {
  const { user, fetchUserInfo } = useAuth();
  const [openEditProfile, setOpenEditProfile] = useState(false);

  if (!user) {
    console.log("user is not fetched yet");
  }

  return (
    <div>
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
                <span className="text-gray-700 mx-2">+{user.phone_number}</span>
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
          <UpdateUserProfile setOpenEditProfile={setOpenEditProfile} />
        )}
      </div>
    </div>
  );
}

export default UserProfile;
