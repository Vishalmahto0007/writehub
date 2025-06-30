import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FilePenLine } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useAppDispatch } from "../../hooks/redux";
import { loginUser } from "../../store/slices/authSlice";

import bgPic from "../../../src/images/bg-pic.png";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = form;

    // Basic validations
    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await dispatch(loginUser({ email, password }));
      toast.success("Login successful!");
      // window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 dark:from-gray-900 dark:via-gray-950 dark:to-indigo-900 relative transition-colors">
      <Toaster position="top-center" />
      <div className="flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full mx-4 my-8 h-[70vh]">
        {/* Left: Vector Illustration */}
        <div className="hidden md:flex w-1/2 h-full">
          <img
            src={bgPic}
            alt="Login Illustration"
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Right: Login Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col h-full relative">
          <div className="absolute top-8 left-0 w-full flex justify-center">
            <div className="flex items-center gap-2">
              <FilePenLine className="w-6 h-6 text-indigo-700 dark:text-white" />
              <span className="text-3xl font-extrabold text-indigo-700 dark:text-white tracking-wide">
                WriteHub
              </span>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex flex-1 items-center justify-center w-full">
            <div className="w-full max-w-xs mt-8">
              <div className="h-12" />
              <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">
                Don't have an account yet?{" "}
                <Link
                  to="/signup"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Sign Up
                </Link>
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  className="border rounded px-3 py-2 bg-white dark:bg-gray-100 text-gray-900 placeholder-gray-400 border-gray-300 dark:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
                <input
                  className="border rounded px-3 py-2 bg-white dark:bg-gray-100 text-gray-900 placeholder-gray-400 border-gray-300 dark:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  type="password"
                  name="password"
                  placeholder="Enter 6 characters or more"
                  value={form.password}
                  onChange={handleChange}
                />

                <div className="mt-1 mb-2 text-right">
                  <Link
                    to="/forgot-password"
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {error && <div className="text-red-500 text-sm">{error}</div>}

                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-indigo-600 dark:bg-indigo-700 text-white hover:bg-indigo-700 dark:hover:bg-indigo-800 font-semibold mt-2 transition-colors"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "LOGIN"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
