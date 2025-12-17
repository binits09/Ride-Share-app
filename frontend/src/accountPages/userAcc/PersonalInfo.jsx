import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const PersonalInfo = () => {
  const { user, token, updateUser } = useAuth();

  const [editing, setEditing] = useState(null); // "name" | "email"
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const startEdit = (field) => {
    setEditing(field);
    setValue(field === "name" ? user.name : user.email);
    setError("");
    setSuccess("");
  };

  const cancelEdit = () => {
    setEditing(null);
    setValue("");
  };

  const save = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      let res;

      if (editing === "name") {
        res = await axios.put(
          "http://localhost:6200/api/users/me",
          { name: value },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      if (editing === "email") {
        res = await axios.put(
          "http://localhost:6200/api/users/email",
          { email: value },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      updateUser(res.data); // 🔥 update context + localStorage
      setSuccess("Updated successfully");
      setEditing(null);

    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h1>
        <p className="text-sm text-gray-600">Manage your personal details and account information</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-200">
        {/* NAME */}
        <div className="p-5 flex justify-between items-center hover:bg-gray-50 transition">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-1">Full Name</p>
            <p className="text-base font-semibold text-gray-900">{user.name}</p>
          </div>
          <button
            onClick={() => startEdit("name")}
            className="ml-4 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
          >
            Edit
          </button>
        </div>

        {/* EMAIL */}
        <div className="p-5 flex justify-between items-center hover:bg-gray-50 transition">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-1">Email Address</p>
            <p className="text-base font-semibold text-gray-900">{user.email}</p>
          </div>
          <button
            onClick={() => startEdit("email")}
            className="ml-4 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
          >
            Edit
          </button>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Update {editing === "name" ? "Name" : "Email"}
              </h2>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm font-medium">{success}</p>
                </div>
              )}

              <label className="block text-sm font-medium text-gray-700 mb-2">
                {editing === "name" ? "Full Name" : "Email Address"}
              </label>
              <input
                type={editing === "email" ? "email" : "text"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder={editing === "name" ? "Enter your name" : "Enter your email"}
              />
            </div>

            <div className="p-6 bg-gray-50 flex gap-3">
              <button
                onClick={cancelEdit}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-white transition"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfo;
