import React, { useState } from "react";
import sideImage from "../assets/register-side.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Toast from "./Toast";
import { useToast } from "../utils/useToast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();

  const validate = () => {
    if (!name.trim()) return "Name is required";
    if (!email) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid email";
    if (!password) return "Password is required";
    if (password.length < 6)
      return "Password must be at least 6 characters";
    if (password !== confirm) return "Passwords do not match";
    if (!gender) return "Please select your gender";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:6200/api/auth/register", {
        name,
        email,
        password,
        gender,
      });

      showToast("Registration successful!", "success");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl flex w-full max-w-4xl overflow-hidden">

        {/* LEFT IMAGE */}
        <div className="hidden md:block w-1/2">
          <img
            src={sideImage}
            alt="Registration illustration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="w-full md:w-1/2 p-8 sm:p-10">
          <h1 className="text-3xl font-semibold text-gray-800 text-center mb-2">
            Create account
          </h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Sign up to get started
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-sm text-red-600 bg-red-100 p-2 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Full name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Confirm password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat password"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create account"}
            </button>

             <div className="text-center text-sm text-gray-700 mt-3">
              Create account as Driver?{" "}
              <a href="/driver-register" className="text-lime-600 hover:underline">
                DriverRegister
              </a>
            </div>

            <div className="text-center text-sm text-gray-700 mt-3">
              Already have an account?{" "}
              <a href="/login" className="text-indigo-600 hover:underline">
                Sign in
              </a>
            </div>
          </form>
        </div>

      </div>
    </div>
    </>
  );
};

export default Register;
