import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const Vehicle = () => {
  const { user, token, updateUser } = useAuth();

  const [editing, setEditing] = useState(null); // "model" | "number" | "license"
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pageLoading, setPageLoading] = useState(true);

  // Fetch complete driver profile on mount
  useEffect(() => {
    const fetchDriverProfile = async () => {
      try {
        const res = await axios.get("http://localhost:6200/api/drivers/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        updateUser(res.data);
      } catch (err) {
        console.error("Failed to fetch driver profile:", err);
      } finally {
        setPageLoading(false);
      }
    };

    if (token) {
      fetchDriverProfile();
    }
  }, [token, updateUser]);

  const startEdit = (field) => {
    setEditing(field);
    if (field === "model") setValue(user.vehicleModel || "");
    else if (field === "number") setValue(user.vehicleNumber || "");
    else if (field === "license") setValue(user.licenseNumber || "");
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

      if (!value) {
        return setError("This field is required");
      }

      const updateData = {};
      if (editing === "model") updateData.vehicleModel = value;
      else if (editing === "number") updateData.vehicleNumber = value;
      else if (editing === "license") updateData.licenseNumber = value;

      const res = await axios.put(
        "http://localhost:6200/api/drivers/vehicle",
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      updateUser(res.data);
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Vehicle Details</h1>
        <p className="text-sm text-gray-600">Manage your vehicle information and documents</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-200">
        {/* VEHICLE MODEL */}
        <div className="p-5 flex justify-between items-center hover:bg-gray-50 transition">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-1">Vehicle Model</p>
            <p className="text-base font-semibold text-gray-900">{user.vehicleModel || "Not added"}</p>
          </div>
          <button
            onClick={() => startEdit("model")}
            className="ml-4 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
          >
            Edit
          </button>
        </div>

        {/* VEHICLE NUMBER */}
        <div className="p-5 flex justify-between items-center hover:bg-gray-50 transition">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-1">Vehicle Registration Number</p>
            <p className="text-base font-semibold text-gray-900">{user.vehicleNumber || "Not added"}</p>
          </div>
          <button
            onClick={() => startEdit("number")}
            className="ml-4 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
          >
            Edit
          </button>
        </div>

        {/* LICENSE NUMBER */}
        <div className="p-5 flex justify-between items-center hover:bg-gray-50 transition">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-1">Driving License Number</p>
            <p className="text-base font-semibold text-gray-900">{user.licenseNumber || "Not added"}</p>
          </div>
          <button
            onClick={() => startEdit("license")}
            className="ml-4 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
          >
            Edit
          </button>
        </div>
      </div>

      {/* APPROVAL STATUS */}
      <div className="mt-6 p-5 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-start gap-3">
          <div className={`w-3 h-3 rounded-full mt-1 ${user.isApproved ? "bg-green-500" : "bg-yellow-500"}`}></div>
          <div>
            <p className="font-semibold text-blue-900">
              {user.isApproved ? "Verified" : "Pending Verification"}
            </p>
            <p className="text-sm text-blue-800 mt-1">
              {user.isApproved 
                ? "Your vehicle details have been verified and approved."
                : "Your vehicle details are under review. This typically takes 24-48 hours."}
            </p>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Update {editing === "model" ? "Vehicle Model" : editing === "number" ? "Vehicle Number" : "License Number"}
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
                {editing === "model" ? "Vehicle Model" : editing === "number" ? "Vehicle Registration Number" : "Driving License Number"}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder={
                  editing === "model" ? "e.g., Maruti Swift" : 
                  editing === "number" ? "e.g., DL01AB1234" : 
                  "e.g., AB1234567890"
                }
              />
              <p className="text-xs text-gray-500 mt-2">
                {editing === "model" && "Enter your vehicle model name"}
                {editing === "number" && "Enter your vehicle registration number"}
                {editing === "license" && "Enter your driving license number"}
              </p>
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

export default Vehicle;
