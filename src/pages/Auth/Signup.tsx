import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FilePenLine, CalendarDays } from "lucide-react";
import { authAPI } from "../../services/api";

const bgPic = "../src/images/bg-pic.png";

// Helper to format date for display (dd-mm-yyyy)
const formatDisplay = (iso: string) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
};

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    gender: "Male",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const hiddenDateRef = useRef<HTMLInputElement>(null);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, dob: e.target.value });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const { name, email, password, dob, gender } = form;

  //   if (!name || !email || !password || !dob || !gender) {
  //     setError("All fields are required.");
  //     return;
  //   }

  //   setError("");
  //   setLoading(true);

  //   try {
  //     await authAPI.register({ name, email, password, dob, gender });
  //     setLoading(false);
  //     navigate("/verify", { state: { email } });
  //   } catch (err: any) {
  //     setLoading(false);
  //     setError(err.message || "Signup failed");
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, password, dob, gender } = form;

    // Validation
    if (!name.trim()) return setError("Name is required.");
    if (!email.trim()) return setError("Email is required.");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return setError("Enter a valid email address.");
    if (!password || password.length < 6)
      return setError("Password must be at least 6 characters.");
    if (!dob) return setError("Date of birth is required.");
    if (!gender) return setError("Gender is required.");

    setError("");
    setLoading(true);

    try {
      await authAPI.register({ name, email, password, dob, gender });
      setLoading(false);
      navigate("/verify", { state: { email } });
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || err.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 dark:from-gray-900 dark:via-gray-950 dark:to-indigo-900 relative transition-colors">
      <div className="flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full mx-4 my-8 h-[70vh]">
        {/* Left Image */}
        <div className="hidden md:flex w-1/2 h-full">
          <img
            src={bgPic}
            alt="Sign Up Illustration"
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Right Signup Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col h-full relative">
          <div className="absolute top-8 left-0 w-full flex justify-center">
            <div className="flex items-center gap-2">
              <FilePenLine className="w-6 h-6 text-indigo-700 dark:text-white" />
              <span className="text-3xl font-extrabold text-indigo-700 dark:text-white tracking-wide">
                WriteHub
              </span>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center w-full">
            <div className="w-full max-w-xs mt-8">
              <div className="h-12" />
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 bg-white dark:bg-gray-100 text-gray-900 placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 bg-white dark:bg-gray-100 text-gray-900 placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 bg-white dark:bg-gray-100 text-gray-900 placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />

                <div className="relative">
                  <input
                    type="text"
                    name="dob"
                    value={formatDisplay(form.dob)}
                    placeholder="Date of Birth"
                    readOnly
                    className="border rounded px-3 py-2 pr-10 w-full bg-white dark:bg-gray-100 text-gray-900 placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    onClick={() => hiddenDateRef.current?.showPicker()}
                  />
                  <input
                    type="date"
                    ref={hiddenDateRef}
                    value={form.dob}
                    onChange={handleDateChange}
                    max={new Date().toISOString().split("T")[0]}
                    className="absolute top-0 left-0 opacity-0 pointer-events-none"
                    tabIndex={-1}
                  />
                  <CalendarDays
                    size={18}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                    onClick={() => hiddenDateRef.current?.showPicker()}
                  />
                </div>

                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 bg-white dark:bg-gray-100 text-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                {error && <div className="text-red-500 text-sm">{error}</div>}

                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 font-semibold mt-2 transition-colors"
                  disabled={loading}
                >
                  {loading ? "Signing Up..." : "SIGN UP"}
                </button>
              </form>

              <div className="text-gray-500 dark:text-gray-400 mb-6 text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-indigo-600 hover:underline">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
