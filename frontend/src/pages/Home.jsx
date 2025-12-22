import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/home-hero.jpg";
import { Navigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const user = storedUser && storedUser !== "undefined"
    ? JSON.parse(storedUser)
    : null;
  const [city, setCity] = useState("Kolkata, IN");


  const handleSeePrices = () => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (user?.role === "driver") {
      navigate("/driver-home");
    } else {
      navigate("/ride");
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* LEFT CONTENT */}
          <div className="space-y-8">
            
            {/* Location */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-600">📍 Serving</span>
              <span className="text-sm font-bold text-blue-600">{city}</span>
              <button 
                className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium transition"
                onClick={() => setCity("Multiple Cities")}
              >
                Change
              </button>
            </div>

            {/* Heading */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
                Go anywhere with<br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Rebu Ride
                </span>
              </h1>
              <p className="text-lg text-gray-600 max-w-md">
                Safe, reliable, and affordable rides whenever you need them. Book instantly and go.
              </p>
            </div>

            {/* Booking Form */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-4 max-w-md border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Book a ride</h3>
              
              <div className="space-y-3">
                {/* Pickup */}
                <div className="relative">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Pickup</label>
                  <input
                    type="text"
                    placeholder="Enter pickup location"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
                  />
                </div>

                {/* Dropoff */}
                <div className="relative">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Dropoff</label>
                  <input
                    type="text"
                    placeholder="Enter dropoff location"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
                  />
                </div>

                {/* Button */}
                <button
                  onClick={handleSeePrices}
                  className="w-full mt-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  See available rides
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center">No account needed. Sign up to save preferences.</p>
            </div>

            {/* Features moved to centered section below */}
          </div>

          {/* RIGHT IMAGE */}
          <div className="hidden lg:flex flex-col justify-center items-center gap-6 mt-8 lg:mt-12">
            <div className="relative w-full max-w-lg">
              {/* Gradient Circle Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
              
              <img
                src={heroImage}
                alt="Ride illustration"
                className="w-full relative z-10 drop-shadow-2xl rounded-2xl"
              />
            </div>

            {/* Info Cards Below Image */}
            <div className="w-full max-w-lg grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 text-center hover:shadow-xl transition">
                <p className="text-2xl font-bold text-blue-600 mb-1">5 min</p>
                <p className="text-sm text-gray-600">Average Wait</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 text-center hover:shadow-xl transition">
                <p className="text-2xl font-bold text-purple-600 mb-1">₹50+</p>
                <p className="text-sm text-gray-600">From Any City</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Centered Features Section */}
      <div className="max-w-4xl mx-auto px-6 mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">⚡</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">Quick Booking</p>
            <p className="text-xs text-gray-600">Under 2 minutes</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">🛡️</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">Safe & Secure</p>
            <p className="text-xs text-gray-600">Verified drivers</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">Best Prices</p>
            <p className="text-xs text-gray-600">Transparent pricing</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">🌍</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">24/7 Available</p>
            <p className="text-xs text-gray-600">Always running</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16 mt-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">10K+</p>
              <p className="text-gray-600 text-sm">Active Drivers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">50K+</p>
              <p className="text-gray-600 text-sm">Happy Rides</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-green-600 mb-2">4.8★</p>
              <p className="text-gray-600 text-sm">Average Rating</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">24/7</p>
              <p className="text-gray-600 text-sm">Customer Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to ride?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Rebu Ride for their daily commute.
          </p>
          <button
            onClick={handleSeePrices}
            className="px-8 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
