import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Security = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // frontend validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      return setError("All fields are required");
    }

    if (newPassword.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (newPassword !== confirmPassword) {
      return setError("New passwords do not match");
    }

    try {
      setLoading(true);

      await axios.put(
        "http://localhost:6200/api/users/password",
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Password updated. Please login again.");

      // 🔐 auto logout after password change
      setTimeout(() => {
        logout();
        navigate("/login", { replace: true });
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Password update failed");
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setShowModal(true);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
  };

  const closeModal = () => {
    setShowModal(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Security</h1>
        <p className="text-sm text-gray-600">Manage your password and security settings</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-5 flex justify-between items-center hover:bg-gray-50 transition">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-600">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <p className="text-sm font-medium text-gray-500">Password</p>
            </div>
            <p className="text-base font-semibold text-gray-900">Update your password</p>
            <p className="text-sm text-gray-500 mt-1">Keep your account secure by regularly updating your password</p>
          </div>
          <button
            onClick={openModal}
            className="ml-4 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
          >
            Change
          </button>
        </div>
      </div>

      {/* PASSWORD UPDATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Update Password</h2>
              <p className="text-sm text-gray-600 mt-1">Enter your current password and choose a new one</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                )}
                {success && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 text-sm font-medium">{success}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter new password (min 6 characters)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="p-6 bg-gray-50 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Security;
