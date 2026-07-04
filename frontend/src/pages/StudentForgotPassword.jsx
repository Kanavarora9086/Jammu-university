import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export function StudentForgotPassword() {
  const [formData, setFormData] = useState({
    rollNumber: "",
    email: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  function onChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setBusy(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/auth/student/forgot-password", {
        rollNumber: formData.rollNumber,
        email: formData.email,
        newPassword: formData.newPassword
      });
      
      setSuccess(res.data?.message || "Password updated successfully!");
      setFormData({
        rollNumber: "",
        email: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (err) {
      setError(err?.response?.data?.error?.message || "Verification failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-academic-navydark via-slate-900 to-black text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto h-16 w-16 bg-academic-navy rounded-full flex items-center justify-center border-2 border-academic-gold shadow-lg shadow-academic-gold/20">
          <span className="font-serif-academic font-bold text-2xl text-academic-gold">JU</span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white font-serif-academic">
          Password Recovery
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Reset your Jammu University Student Password
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-950/60 backdrop-blur-xl py-8 px-4 border border-slate-800 shadow-2xl rounded-2xl sm:px-10">
          {success ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto h-12 w-12 bg-emerald-950/50 border border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center text-xl font-bold">
                ✓
              </div>
              <h3 className="text-lg font-semibold text-white">Reset Successful</h3>
              <p className="text-sm text-slate-300">{success}</p>
              <div className="pt-4">
                <Link
                  to="/login/student"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-academic-navy bg-academic-gold hover:bg-academic-goldhover focus:outline-none transition duration-150 cursor-pointer"
                >
                  Proceed to Login
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={onSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Registered Roll Number
                </label>
                <input
                  name="rollNumber"
                  type="text"
                  required
                  value={formData.rollNumber}
                  onChange={onChange}
                  className="mt-1 block w-full rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-academic-gold focus:ring-1 focus:ring-academic-gold outline-none"
                  placeholder="22CS001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Registered Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={onChange}
                  className="mt-1 block w-full rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-academic-gold focus:ring-1 focus:ring-academic-gold outline-none"
                  placeholder="student@uni.edu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">
                  New Password
                </label>
                <input
                  name="newPassword"
                  type="password"
                  required
                  value={formData.newPassword}
                  onChange={onChange}
                  className="mt-1 block w-full rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-academic-gold focus:ring-1 focus:ring-academic-gold outline-none"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Confirm New Password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={onChange}
                  className="mt-1 block w-full rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-academic-gold focus:ring-1 focus:ring-academic-gold outline-none"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-academic-navy bg-academic-gold hover:bg-academic-goldhover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-academic-gold disabled:opacity-50 transition duration-150 ease-in-out cursor-pointer"
                >
                  {busy ? "Verifying & Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          )}

          {!success && (
            <div className="mt-6 flex items-center justify-between text-sm">
              <Link to="/login/student" className="text-academic-gold hover:underline">
                Back to Login
              </Link>
              <Link to="/" className="text-slate-400 hover:text-white transition duration-150">
                ← Return Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

