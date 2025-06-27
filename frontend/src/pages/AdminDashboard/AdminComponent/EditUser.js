import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone_number: "",
    role: "",
  });
  const navigator = useNavigate();

  console.log("id is", id);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(
        `http://localhost:8000/admin_api/super-admin-dashboard/users/${id}/`
      );
      const data = await response.json();
      setUser(data);
    };
    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");
    const userData = {
      username: user.username,
      email: user.email,
      phone_number: user.phone_number,
      role: user.role,
    };

    console.log("Sending data:", userData);

    const response = await fetch(
      `http://localhost:8000/admin_api/super-admin-dashboard/users/${id}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      }
    );

    if (response.ok) {
      navigator("/admin-dashboard/customer-management/");
    } else {
      const errorData = await response.json();
      console.error("Error updating user:", errorData);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Edit User</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <input
          type="text"
          placeholder="Username"
          value={user.username || ""}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          required
          className="w-full border border-gray-300 rounded p-2 mb-4"
        />
        <input
          type="email"
          placeholder="Email"
          value={user.email || ""}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          required
          className="w-full border border-gray-300 rounded p-2 mb-4"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={user.phone_number || ""}
          onChange={(e) => setUser({ ...user, phone_number: e.target.value })}
          className="w-full border border-gray-300 rounded p-2 mb-4"
        />
        <select
          value={user.role || ""}
          onChange={(e) => setUser({ ...user, role: e.target.value })}
          className="w-full border border-gray-300 rounded p-2 mb-4"
          required
        >
          <option value="">Select Role</option>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update User
        </button>
      </form>
    </div>
  );
};

export default EditUser;
