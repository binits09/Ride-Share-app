import React, { useState } from "react";
import sideImage from "../assets/login-side.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    if (!email) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid email";
    if (!password) return "Password is required";
    if (password.length < 6)
      return "Password must be at least 6 characters";
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

      const res = await axios.post(
        "http://localhost:6200/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl flex w-full max-w-4xl overflow-hidden">

        {/* LEFT IMAGE */}
        <div className="hidden md:block w-1/2">
          <img
            src={sideImage}
            alt="Login illustration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="w-full md:w-1/2 p-8 sm:p-10">
          <h1 className="text-3xl font-semibold text-gray-800 text-center mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Sign in to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-sm text-red-600 bg-red-100 p-2 rounded">
                {error}
              </div>
            )}

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
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="text-center text-sm text-gray-700 mt-3">
              Don’t have an account?{" "}
              <a href="/register" className="text-indigo-600 hover:underline">
                Create one
              </a>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;
