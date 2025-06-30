import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FilePenLine } from "lucide-react";
import { authAPI } from "../../services/api";

import bgPic from "../../../src/images/bg-pic.png";

const Verify = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { email, forReset } = (location.state as any) || {};
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 dark:from-gray-900 dark:via-gray-950 dark:to-indigo-900">
        <div className="flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 my-8 h-[60vh]">
          <div className="hidden md:flex w-1/2">
            <img
              src={bgPic}
              alt="Verify Illustration"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 p-8 flex flex-col">
            <div className="flex justify-center mt-4 mb-6">
              <div className="flex items-center gap-2">
                <FilePenLine className="w-6 h-6 text-indigo-700 dark:text-white" />
                <span className="text-3xl font-extrabold text-indigo-700 dark:text-white">
                  WriteHub
                </span>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-xs text-center">
                <p className="text-red-500 mb-4">
                  No email provided for verification.
                </p>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  onClick={() => navigate("/signup")}
                >
                  Go to Signup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");
  //   setLoading(true);
  //   try {
  //     // let url = "";
  //     // let body: any = { email, code };
  //     // if (forReset) {
  //     //   url = "http://localhost:8080/api/auth/verify-reset";
  //     //   body.newPassword = newPassword;
  //     // } else {
  //     //   url = "http://localhost:8080/api/auth/verify";
  //     // }
  //     // const res = await fetch(url, {
  //     //   method: "POST",
  //     //   headers: { "Content-Type": "application/json" },
  //     //   body: JSON.stringify(body),
  //     //   credentials: "include",
  //     // });
  //     await authAPI.verifyCode(email, code);

  //     // const data = await res.json();
  //     // setLoading(false);
  //     if (!res.ok) throw new Error(data.message || "Verification failed");
  //     toast.success(
  //       forReset ? "Password reset successful!" : "Account verified!"
  //     );
  //     setTimeout(() => navigate("/login"), 1500);
  //   } catch (err: any) {
  //     setLoading(false);
  //     setError(err.message);
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Call the verifyCode API
      await authAPI.verifyCode(email, code);

      toast.success(
        forReset ? "Password reset successful!" : "Account verified!"
      );

      // Redirect to login after a delay
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authAPI.resendVerificationCode(email);
      toast.success("Verification code resent.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 dark:from-gray-900 dark:via-gray-950 dark:to-indigo-900">
      <Toaster position="top-center" />
      <div className="flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 my-8 h-[60vh]">
        <div className="hidden md:flex w-1/2">
          <img
            src={bgPic}
            alt="Verify Illustration"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 p-8 flex flex-col relative">
          <div className="absolute top-8 left-0 w-full flex justify-center">
            <div className="flex items-center gap-2">
              <FilePenLine className="w-6 h-6 text-indigo-700 dark:text-white" />
              <span className="text-3xl font-extrabold text-indigo-700 dark:text-white">
                WriteHub
              </span>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center w-full">
            <div className="w-full max-w-xs mt-8">
              <h2 className="text-xl font-bold mb-2 text-center text-gray-900 dark:text-white">
                {forReset ? "Reset Password" : "Verify Account"}
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  className="border rounded px-3 py-2 bg-white dark:bg-gray-100 text-gray-900 placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  type="text"
                  name="code"
                  placeholder="Verification Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
                {forReset && (
                  <input
                    className="border rounded px-3 py-2 bg-white dark:bg-gray-100 text-gray-900 placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                )}
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded bg-indigo-600 dark:bg-indigo-700 text-white hover:bg-indigo-700 dark:hover:bg-indigo-800 font-semibold transition-colors"
                    disabled={loading}
                  >
                    {loading
                      ? forReset
                        ? "Resetting..."
                        : "Verifying..."
                      : forReset
                      ? "Reset Password"
                      : "Verify"}
                  </button>
                  {!forReset && (
                    <button
                      type="button"
                      className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold transition-colors"
                      onClick={handleResend}
                      disabled={resending}
                    >
                      {resending ? "Resending..." : "Resend Code"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;
