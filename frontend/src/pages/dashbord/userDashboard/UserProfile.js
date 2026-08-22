import React, { useState } from "react";
import {
  FiMail,
  FiPhone,
  FiFileText,
  FiCheckCircle,
  FiDollarSign,
  FiEdit2,
} from "react-icons/fi";
import AccountIcon from "../../../assets/icons/user.svg";

import { useAuth } from "../../../contexts/AuthContext";
import UpdateUserProfile from "./UpdateUserProfile";

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-b-0">
    <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-50 text-primary-600 shrink-0">
      <Icon className="text-sm" />
    </span>
    <div className="min-w-0">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-medium text-slate-800 truncate">
        {value || "—"}
      </p>
    </div>
  </div>
);

function UserProfile() {
  const { user } = useAuth();
  const [openEditProfile, setOpenEditProfile] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
        <img
          src={user?.profile_image || AccountIcon}
          alt="profile"
          className="w-20 h-20 rounded-full object-cover border-2 border-slate-100 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-slate-900 truncate">
            {user?.username}
          </h1>
          <p className="text-sm text-slate-500 truncate">{user?.email}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpenEditProfile(true)}
          className="flex items-center justify-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition shrink-0"
        >
          <FiEdit2 className="text-xs" /> Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
        <InfoRow icon={FiMail} label="Email" value={user?.email} />
        <InfoRow
          icon={FiPhone}
          label="Phone"
          value={user?.phone_number ? `+${user.phone_number}` : ""}
        />
        <InfoRow icon={FiFileText} label="Bio" value={user?.bio} />
        <InfoRow
          icon={FiCheckCircle}
          label="Account Status"
          value={
            user?.account_status
              ? user.account_status.charAt(0).toUpperCase() +
                user.account_status.slice(1)
              : undefined
          }
        />
        <InfoRow
          icon={FiDollarSign}
          label="Balance"
          value={
            user?.balance != null ? `${user.balance} ETB` : undefined
          }
        />
      </div>

      {openEditProfile && (
        <UpdateUserProfile onClose={() => setOpenEditProfile(false)} />
      )}
    </div>
  );
}

export default UserProfile;
