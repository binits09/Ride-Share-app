import React from "react";
import { useAuth } from "../../context/AuthContext";

const DriverH = () => {
  const { user, driverStatus } = useAuth();

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-xl">
          {user?.name?.[0]}
        </div>
        <div>
          <h1 className="text-xl font-semibold">{user?.name}</h1>
          <p className={`text-sm ${driverStatus === "online" ? "text-green-600" : "text-red-500"}`}>
            {driverStatus}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">Vehicle details</div>
        <div className="bg-white p-4 rounded-xl shadow">Earnings</div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold mb-2">Account status</h2>
        <p className="text-sm text-gray-600">
          Complete your documents to start receiving more rides.
        </p>
      </div>
    </div>
  );
};

export default DriverH;
