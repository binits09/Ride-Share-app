import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const UserH = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-xl border-2 border-gray-200 rounded-xl p-6 bg-white">
      <div className="flex flex-col items-center gap-3 mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-xl">
          {(user?.name?.[0] || "?")?.toUpperCase()}
        </div>
        <div className="text-center">
          <h1 className="text-xl font-semibold">{user?.name}</h1>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Link to="personal-info" className="bg-white p-4 rounded-xl shadow flex items-center justify-center text-center h-20 font-medium text-gray-700 hover:shadow-lg transition cursor-pointer">Profile</Link>
        <Link to="security" className="bg-white p-4 rounded-xl shadow flex items-center justify-center text-center h-20 font-medium text-gray-700 hover:shadow-lg transition cursor-pointer">Security</Link>
      </div>

      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold mb-2">Account Tips</h2>
        <p className="text-sm text-gray-600">
          Complete your profile to unlock more features.
        </p>
      </div>
    </div>
  );
};

export default UserH;
