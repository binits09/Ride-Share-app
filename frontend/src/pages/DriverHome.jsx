import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import sideImage from "../assets/driver-main.jpg";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";
import { useToast } from "../utils/useToast";



const DriverHome = () => {
  const navigate = useNavigate();
  const { user, driverStatus } = useAuth();
  const { toasts, showToast, removeToast } = useToast();
  

  const handleStartDriving = () => {
  if (driverStatus !== "online") {
    showToast("You need to go online first to start driving...", "warning");
    return;
  }
  navigate("/driver");
};



  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
        />
      ))}
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl flex w-full max-w-6xl overflow-hidden">

        {/* LEFT CONTENT */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name} 👋
          </h1>

          <p className="text-gray-600 mb-6">
            {driverStatus === "online"
              ? "You are online and ready to receive ride requests."
              : "You’re currently offline. Go online to start receiving ride requests."}
          </p>


          {/* Status */}
          <div className="flex items-center gap-2 mb-6">
            <p className="text-sm text-gray-600">
              Status:{" "}
              <span
                className={
                  driverStatus === "online" ? "text-green-600" : "text-red-600"
                }>
                {driverStatus === "online" ? "Online" : "Offline"}
              </span>
            </p>
          </div>

          {/* Action */}
          <button
            onClick={handleStartDriving}
            
            className={`w-fit px-6 py-3 rounded-lg font-medium transition
    ${driverStatus === "online"
                ? "bg-green-600 text-white hover:bg-green-500"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
          >
            Start Driving
          </button>

        </div>

        {/* RIGHT IMAGE */}
        <div className="hidden md:block w-1/2 bg-gray-100">
          <img
            src={sideImage}
            alt="Driver illustration"
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </div>
    </>
  );
};

export default DriverHome;
