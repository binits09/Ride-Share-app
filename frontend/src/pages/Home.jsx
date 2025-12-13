import React from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/home-hero.jpg";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSeePrices = () => {
    if (!token) {
      navigate("/login");
    } else {
      navigate("/Ride"); //ride page 
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

        {/* LEFT CONTENT */}
        <div>
          {/* Location */}
          <p className="text-sm text-gray-600 mb-4">
            📍 Kolkata, IN{" "}
            <span className="text-indigo-600 cursor-pointer hover:underline">
              Change city
            </span>
          </p>

          {/* Heading */}
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
            Go anywhere with <br /> Rebu Ride
          </h1>

          {/* Form */}
          <div className="space-y-4 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Pickup location"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Dropoff location"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black"
              />
            </div>

            <button
              onClick={handleSeePrices}
              className="w-fit px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              See prices
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hidden lg:block">
          <img
            src={heroImage}
            alt="Ride illustration"
            className="w-full max-w-lg mx-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
