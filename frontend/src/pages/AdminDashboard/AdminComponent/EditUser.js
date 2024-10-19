// EditUser.js

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState({});
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
    await fetch(
      `http://localhost:8000/admin_api/super-admin-dashboard/users/${id}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      }
    );
    navigator("/admin-dashboard/customer-management/");
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
