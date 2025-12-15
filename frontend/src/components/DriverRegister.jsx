import React, { useState } from "react";
import sideImage from "../assets/dr-side.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DriverRegister = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carNumber, setCarNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [drivingLicense, setDrivingLicense] = useState("");
  const [gender, setGender] = useState("");

  // simple plate pattern: letters, numbers, spaces, hyphens allowed (2-15 chars)
  const platePattern = /^[A-Z0-9 -]{2,15}$/i;

  const validate = () => {
    if (!name.trim()) return "Name is required";
    if (!email) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid email";
    if (!gender) return "Please select your gender";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password !== confirm) return "Passwords do not match";
    if (!carModel.trim()) return "Vehicle model is required";
    if (!carNumber.trim()) return "Vehicle number plate is required";
    if (!platePattern.test(carNumber.trim())) return "Enter a valid vehicle number plate";
    // simple driving license pattern: letters, numbers, spaces, hyphens (3-25 chars)
    const licensePattern = /^[A-Z0-9 -]{3,25}$/i;

    if (!drivingLicense.trim()) return "Driving license is required";
    if (!licensePattern.test(drivingLicense.trim())) return "Enter a valid driving license number";

    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) return setError(v);

    try {
      setLoading(true);
      // backend endpoint
      await axios.post(
        "http://localhost:6200/api/drivers/register",
        {
          name: name.trim(),
          email,
          password,
          gender,
          vehicleModel: carModel.trim(),
          vehicleNumber: carNumber.trim(),
          licenseNumber: drivingLicense.trim(),
        }
      );

      alert("Driver Registration successful");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Driver Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl flex w-full max-w-4xl overflow-hidden">

        {/* LEFT IMAGE SECTION - remove this block if you don't want an image */}
        <div className="hidden md:block w-1/2">
          <img
            src={sideImage}
            alt="Driver registration illustration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="w-full md:w-1/2 p-8 sm:p-10">
          <h1 className="text-3xl font-semibold text-gray-800 text-center mb-2">
            Driver Registration
          </h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Create your driver account
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="text-sm text-red-600 bg-red-100 p-2 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-700 mb-1">Full name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>


            {/* New driver fields */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Vehicle model</label>
              <input
                value={carModel}
                onChange={(e) => setCarModel(e.target.value)}
                placeholder="e.g. Honda City, Swift, Innova"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Vehicle number plate</label>
              <input
                value={carNumber}
                onChange={(e) => setCarNumber(e.target.value)}
                placeholder="e.g. KA01AB1234"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">Letters, numbers, spaces and hyphens allowed.</p>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Driving license</label>
              <input
                value={drivingLicense}
                onChange={(e) => setDrivingLicense(e.target.value)}
                placeholder="e.g. DL-01-20190012345"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">Enter your driving license number (letters & numbers allowed).</p>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Min 6 characters</p>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Confirm password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat password"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>



            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create account"}
            </button>

            <div className="text-center text-sm text-gray-700 mt-3">
              Already have an account?{" "}
              <a href="/login" className="text-indigo-600 hover:underline">Sign in</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DriverRegister;
