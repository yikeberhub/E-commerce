// UserList.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(
        "http://localhost:8000/admin_api/super-admin-dashboard/users/"
      );
      const data = await response.json();
      setUsers(data);
      console.log("user list data", data);
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    await fetch(
      `http://localhost:8000/admin_api/super-admin-dashboard/users/${id}/`,
      {
        method: "DELETE",
      }
    );
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">User List</h1>
      <Link
        to="add-user"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4 inline-block"
      >
        Add User
      </Link>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="py-3 px-4 text-left">Username</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-left">Phone Number</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="py-2 px-4">
                {" "}
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
