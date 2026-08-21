import { React, useState, useEffect } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { inputClass } from "../../../../common/formStyles";

const API_URL = process.env.REACT_APP_API_URL;

const Field = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-medium text-slate-500 mb-1">
      {label}
    </label>
    <input {...props} className={inputClass} />
  </div>
);

function EditAddress({
  id,
  setOpenedEditAddress,
  setOpenedCreateAddress,
  numSelected = false,
  showCloseBtn = false,
  shadow = "",
  edit = false,
  use = false,
  create = false,
}) {
  const { user, fetchUserInfo } = useAuth();
  const [data, setData] = useState({
    full_name: "",
    phone_number: "",
    kebele: "",
    city: "",
    region: "",
    woreda: "",
    postal_code: "",
    delivery_instruction: "",
  });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  let value = user.addresses.filter((address) => address.id === id);
  let address = value[0];
  if (use) {
    value = user.addresses.filter((address) => address.is_default);
    address = value[0];
  }

  useEffect(() => {
    if (user && (edit || use) && address) {
      setData({
        full_name: address.full_name,
        phone_number: address.phone_number,
        kebele: address.kebele,
        city: address.city,
        region: address.region,
        woreda: address.woreda,
        postal_code: address.postal_code,
        delivery_instruction: address.delivery_instruction,
      });
    }
  }, [user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");
    // "use" mode edits the existing default address in place, same as "edit".
    const isUpdate = edit || (use && address);
    const url = isUpdate
      ? `${API_URL}/users/address/${address.id}/update/`
      : `${API_URL}/users/address/create/`;
    const method = isUpdate ? "PUT" : "POST";

    setSaving(true);
    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save address");
      }
      setMessage(isUpdate ? "Address updated" : "Address created");
      if (!isUpdate) {
        setData({
          full_name: "",
          phone_number: "",
          kebele: "",
          city: "",
          region: "",
          woreda: "",
          postal_code: "",
          delivery_instruction: "",
        });
      }
      fetchUserInfo();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`bg-white rounded-xl border border-slate-100 ${shadow}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-800">
          {use && "Shipping Address"}
          {create && "Add New Address"}
          {edit && `Edit Address ${numSelected || ""}`}
        </h2>
        {showCloseBtn && (
          <button
            type="button"
            className="text-slate-400 hover:text-slate-600 transition"
            onClick={() =>
              edit ? setOpenedEditAddress(false) : setOpenedCreateAddress(false)
            }
          >
            ✕
          </button>
        )}
      </div>

      <form className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3" onSubmit={handleSubmit}>
        <Field
          label="Full Name"
          type="text"
          name="full_name"
          onChange={handleOnChange}
          value={data.full_name || ""}
          placeholder="Enter full name"
        />
        <Field
          label="Phone Number"
          type="text"
          name="phone_number"
          onChange={handleOnChange}
          value={data.phone_number || ""}
          placeholder="Enter phone number"
        />
        <Field
          label="Kebele"
          type="text"
          name="kebele"
          onChange={handleOnChange}
          value={data.kebele || ""}
          placeholder="Enter kebele"
        />
        <Field
          label="City"
          type="text"
          name="city"
          onChange={handleOnChange}
          value={data.city || ""}
          placeholder="Enter city"
        />
        <Field
          label="Region"
          type="text"
          name="region"
          onChange={handleOnChange}
          value={data.region || ""}
          placeholder="Enter region"
        />
        <Field
          label="Woreda"
          type="text"
          name="woreda"
          onChange={handleOnChange}
          value={data.woreda || ""}
          placeholder="Enter woreda"
        />
        <Field
          label="Postal Code (optional)"
          type="text"
          name="postal_code"
          onChange={handleOnChange}
          value={data.postal_code || ""}
          placeholder="Enter postal code"
        />
        <Field
          label="Delivery Instructions (optional)"
          type="text"
          name="delivery_instruction"
          onChange={handleOnChange}
          value={data.delivery_instruction || ""}
          placeholder="e.g. Gate code, landmark"
        />

        <div className="sm:col-span-2 flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-60"
          >
            {saving ? "Saving..." : use || edit ? "Save Address" : "Create Address"}
          </button>
          {message && <span className="text-xs text-slate-500">{message}</span>}
        </div>
      </form>
    </div>
  );
}

export default EditAddress;
