import React from "react";
import { FiMail, FiPhone, FiCalendar, FiShield, FiMapPin } from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";
import { TextBlockSkeleton, Skeleton } from "../../../common/Skeleton";
import AccountIcon from "../../../assets/icons/user.svg";

const InfoItem = ({ icon: Icon, label, value }) => (
  <p className="flex items-center gap-2 text-sm text-slate-600 mt-2">
    <Icon className="text-slate-400 shrink-0" />
    {label}: <span className="font-medium text-slate-800">{value || "N/A"}</span>
  </p>
);

const AccountDetail = () => {
  const { user } = useAuth();

  if (!user)
    return (
      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Skeleton className="w-28 h-28 rounded-full shrink-0" />
          <div className="w-full">
            <TextBlockSkeleton lines={4} />
          </div>
        </div>
      </div>
    );

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-card p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-6">Account Details</h2>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
        <img
          src={user.profile_image || AccountIcon}
          alt="Profile"
          className="w-28 h-28 rounded-full border-2 border-slate-100 shrink-0 object-cover"
        />
        <div className="text-center md:text-left">
          <h3 className="text-xl font-semibold text-slate-900">
            {user.first_name || user.last_name
              ? `${user.first_name} ${user.last_name}`.trim()
              : user.username}
          </h3>
          <InfoItem icon={FiMail} label="Email" value={user.email} />
          <InfoItem icon={FiPhone} label="Phone" value={user.phone_number} />
          <InfoItem
            icon={FiCalendar}
            label="Date of Birth"
            value={user.date_of_birth}
          />
          <p className="flex items-center gap-2 text-sm mt-2">
            <FiShield className="text-slate-400 shrink-0" />
            Status:{" "}
            <span
              className={`font-medium capitalize ${
                user.account_status === "active"
                  ? "text-emerald-600"
                  : "text-red-500"
              }`}
            >
              {user.account_status}
            </span>
          </p>
        </div>
      </div>

      <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <FiMapPin className="text-primary-500" /> Addresses
      </h3>
      {user.addresses && user.addresses.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {user.addresses.map((address) => (
            <div
              key={address.id}
              className="bg-slate-50 p-4 rounded-xl border border-slate-100"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-slate-800">
                  {address.full_name}
                </p>
                {address.is_default && (
                  <span className="px-2 py-0.5 text-xs font-medium text-white bg-primary-600 rounded-full">
                    Default
                  </span>
                )}
              </div>
              <div className="text-sm text-slate-600 space-y-0.5">
                <p>Phone: {address.phone_number}</p>
                <p>Street: {address.street_address}</p>
                <p>City: {address.city}</p>
                <p>Region: {address.region}</p>
                <p>Woreda: {address.woreda}</p>
                <p>Kebele: {address.kebele}</p>
                <p>Postal Code: {address.postal_code || "N/A"}</p>
                <p>Delivery Notes: {address.delivery_instruction || "N/A"}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400">No addresses available.</p>
      )}
    </div>
  );
};

export default AccountDetail;
