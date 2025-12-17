import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const DriverH = () => {
  const { user, driverStatus } = useAuth();

  return (
    <div className="max-w-xl border-2 border-gray-200 rounded-xl p-6 bg-white">
      <div className="flex flex-col items-center gap-3 mb-6">
        {user?.profilePicture ? (
          <img
            src={`http://localhost:6200${user.profilePicture}`}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-xl">
            {user?.name?.[0]}
          </div>
        )}
        <div className="text-center">
          <h1 className="text-xl font-semibold">{user?.name}</h1>
          <p className={`text-sm ${driverStatus === "online" ? "text-green-600" : "text-red-500"}`}>
            {driverStatus}
          </p>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Link to="personal-info" className="bg-white p-4 rounded-xl shadow flex items-center justify-center text-center h-20 font-medium text-gray-700 hover:shadow-lg transition cursor-pointer">Profile</Link>
        <Link to="vehicle" className="bg-white p-4 rounded-xl shadow flex items-center justify-center text-center h-20 font-medium text-gray-700 hover:shadow-lg transition cursor-pointer">Vehicle</Link>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Link to="earnings" className="bg-white p-4 rounded-xl shadow flex items-center justify-center text-center h-20 font-medium text-gray-700 hover:shadow-lg transition cursor-pointer">Earnings</Link>
        <Link to="security" className="bg-white p-4 rounded-xl shadow flex items-center justify-center text-center h-20 font-medium text-gray-700 hover:shadow-lg transition cursor-pointer">Security</Link>
      </div>
      
    </div>
  );
};

export default DriverH;
