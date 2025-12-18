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
  const [uploadingPicture, setUploadingPicture] = useState(false);

  const startEdit = (field) => {
    setEditing(field);
    if (field === "name") setValue(user.name);
    else if (field === "email") setValue(user.email);
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
          "http://localhost:6200/api/drivers/me",
          { name: value },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      if (editing === "email") {
        res = await axios.put(
          "http://localhost:6200/api/drivers/email",
          { email: value },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      updateUser(res.data);
      setSuccess("Updated successfully");
      setEditing(null);

    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      setTimeout(() => setError(""), 3000);
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      setUploadingPicture(true);
      setError("");
      setSuccess("");

      const formData = new FormData();
      formData.append("profilePicture", file);

      const res = await axios.post(
        "http://localhost:6200/api/drivers/profile-picture",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      updateUser(res.data);
      setSuccess("Profile picture updated successfully");
      setTimeout(() => setSuccess(""), 3000);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload profile picture");
      setTimeout(() => setError(""), 3000);
    } finally {
      setUploadingPicture(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h1>
        <p className="text-sm text-gray-600">Manage your personal details and account information</p>
      </div>

      {/* Global error/success messages */}
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

      {/* PROFILE PICTURE */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            {user.profilePicture ? (
              <img
                src={`http://localhost:6200${user.profilePicture}`}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold border-2 border-gray-200">
                {user?.name?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            {uploadingPicture && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-1">Profile Picture</p>
            <p className="text-xs text-gray-600 mb-3">JPG, PNG or GIF. Max size 5MB</p>
            <label className="inline-block">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                disabled={uploadingPicture}
                className="hidden"
              />
              <span className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer inline-block border border-blue-200">
                {uploadingPicture ? "Uploading..." : "Upload New Picture"}
              </span>
            </label>
          </div>
        </div>
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
