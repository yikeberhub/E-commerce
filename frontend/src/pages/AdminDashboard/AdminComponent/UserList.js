import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaUsers, FaUserPlus } from "react-icons/fa"; // Import icons from React Icons

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [activeView, setActiveView] = useState("all"); // Track the active view

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(
        "http://localhost:8000/admin_api/super-admin-dashboard/users/"
      );
      const data = await response.json();
      setUsers(data);
      filterUsers(data); // Filter users once data is fetched
    };
    fetchUsers();
  }, []);

  const filterUsers = (data) => {
    const regularUsers = data.filter((user) => user.role !== "admin");
    const adminUsers = data.filter((user) => user.role === "admin");

    setFilteredUsers(regularUsers);
    setAdmins(adminUsers);
  };

  const handleDelete = async (id) => {
    await fetch(
      `http://localhost:8000/admin_api/super-admin-dashboard/users/${id}/`,
      {
        method: "DELETE",
      }
    );
    setFilteredUsers(filteredUsers.filter((user) => user.id !== id));
    setAdmins(admins.filter((admin) => admin.id !== id)); // Remove admin if deleted
  };

  const handleRoleChange = async (id, newRole) => {
    const token = localStorage.getItem("access");
    const response = await fetch(
      `http://localhost:8000/admin_api/super-admin-dashboard/users/${id}/`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      }
    );

    if (response.ok) {
      const updatedUser = await response.json();
      setUsers(users.map((user) => (user.id === id ? updatedUser : user)));
      filterUsers(users); // Re-filter users to update views
    } else {
      console.error("Failed to update role", await response.text());
    }
  };

  const renderUsers = () => {
    if (activeView === "admins") return admins;
    if (activeView === "customers") return filteredUsers;
    return users;
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">User List</h1>

      <nav className="mb-4 flex space-x-4">
        <Link
          to="#"
          onClick={() => setActiveView("all")}
          className={`flex items-center space-x-2 py-2 px-4 rounded ${
            activeView === "all"
              ? "bg-blue-500 text-white"
              : "text-blue-500 hover:bg-blue-100"
          }`}
        >
          <FaUserPlus />
          <span>All Users</span>
        </Link>
        <Link
          to="#"
          onClick={() => setActiveView("admins")}
          className={`flex items-center space-x-2 py-2 px-4 rounded ${
            activeView === "admins"
              ? "bg-blue-500 text-white"
              : "text-blue-500 hover:bg-blue-100"
          }`}
        >
          <FaUsers />
          <span>Admins</span>
        </Link>
        <Link
          to="#"
          onClick={() => setActiveView("customers")}
          className={`flex items-center space-x-2 py-2 px-4 rounded ${
            activeView === "customers"
              ? "bg-blue-500 text-white"
              : "text-blue-500 hover:bg-blue-100"
          }`}
        >
          <FaUser />
          <span>Customers</span>
        </Link>
        <Link
          to="add-user"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
        >
          Add User
        </Link>
      </nav>

      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="py-3 px-4 text-left">Username</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-left">Phone Number</th>
            <th className="py-3 px-4 text-left">Role</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {renderUsers().map((user) => (
            <tr key={user.id} className="border-b">
              <td className="py-2 px-4">
                <Link
                  to={`user-detail/${user.id}`}
                  className="text-blue-500 hover:underline"
                >
                  {user.username}
                </Link>
              </td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4">{user.phone_number}</td>
              <td className="py-2 px-4">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="border border-gray-300 rounded px-2"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="py-2 px-4">
                <Link
                  to={`edit-user/${user.id}`}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-500 hover:underline ml-4"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
