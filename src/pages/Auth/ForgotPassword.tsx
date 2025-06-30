import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FilePenLine } from "lucide-react";
import { authAPI } from "../../services/api";

const bgPic = "../src/images/bg-pic.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<"email" | "reset">("email");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required.");
      return;
    }
    setError("");
    setMsg("");
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setMsg("If this email exists, a reset code has been sent.");
      setStep("reset");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to send reset code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !newPassword) {
      setError("All fields are required.");
      return;
    }
    setError("");
    setMsg("");
    setLoading(true);
    try {
      await authAPI.verifyResetCode(email, code, newPassword);
      setMsg("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 dark:from-gray-900 dark:via-gray-950 dark:to-indigo-900 relative transition-colors">
      <div className="flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full mx-4 my-8 h-[70vh]">
        {/* Left: Vector Illustration */}
        <div className="hidden md:flex w-1/2 h-full">
          <img
            src={bgPic}
            alt="Forgot Password Illustration"
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Right: Forgot Password Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col h-full relative">
          {/* App Name & Icon Centered */}
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
              <h2 className="text-xl font-bold mb-2 text-center text-gray-900 dark:text-white">
                Forgot Password
              </h2>

              {step === "email" ? (
                <form
                  onSubmit={handleEmailSubmit}
                  className="flex flex-col gap-4"
                >
                  <input
                    className="border rounded px-3 py-2 bg-white dark:bg-gray-100 text-gray-900 placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  {msg && <div className="text-green-600 text-sm">{msg}</div>}
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-indigo-600 dark:bg-indigo-700 text-white hover:bg-indigo-700 dark:hover:bg-indigo-800 font-semibold mt-2 transition-colors"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Reset Code"}
                  </button>
                </form>
              ) : (
                <form
                  onSubmit={handleResetSubmit}
                  className="flex flex-col gap-4"
                >
                  <input
                    className="border rounded px-3 py-2 bg-white dark:bg-gray-100 text-gray-900 placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    type="text"
                    placeholder="Enter code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <input
                    className="border rounded px-3 py-2 bg-white dark:bg-gray-100 text-gray-900 placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  {msg && <div className="text-green-600 text-sm">{msg}</div>}
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-indigo-600 dark:bg-indigo-700 text-white hover:bg-indigo-700 dark:hover:bg-indigo-800 font-semibold mt-2 transition-colors"
                    disabled={loading}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              )}

              <div className="mt-4 text-sm text-center">
                <Link
                  to="/login"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
