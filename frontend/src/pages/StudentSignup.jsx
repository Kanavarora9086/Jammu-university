import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, setAccessToken } from "../lib/api";
import { useAuth } from "../lib/auth.jsx";

const BRANCHES = [
  "Computer Science",
  "Information Technology",
  "Electronics & Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Physics",
  "Chemistry",
  "Mathematics",
  "Commerce",
  "Economics",
  "English Literature",
  "Other"
];

export function StudentSignup() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    rollNumber: "",
    name: "",
    email: "",
    branch: "",
    semester: 1,
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function onChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "semester" ? Number(value) : value
    }));
  }

  // Simple validation helpers
  const passwordStrength = (() => {
    const p = formData.password;
    if (p.length === 0) return null;
    if (p.length < 8) return { label: "Too Short", color: "text-red-400", bg: "bg-red-400", width: "w-1/4" };
    let score = 0;
    if (/[a-z]/.test(p)) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^a-zA-Z0-9]/.test(p)) score++;
    if (score <= 1) return { label: "Weak", color: "text-orange-400", bg: "bg-orange-400", width: "w-1/3" };
    if (score <= 2) return { label: "Fair", color: "text-yellow-400", bg: "bg-yellow-400", width: "w-1/2" };
    if (score <= 3) return { label: "Good", color: "text-emerald-400", bg: "bg-emerald-400", width: "w-3/4" };
    return { label: "Strong", color: "text-emerald-400", bg: "bg-emerald-400", width: "w-full" };
  })();

  const passwordsMatch = formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword;
  const passwordsMismatch = formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword;

  async function onSubmit(e) {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setBusy(true);
    setError("");

    try {
      const res = await api.post("/auth/student/signup", {
        rollNumber: formData.rollNumber,
        name: formData.name,
        email: formData.email,
        branch: formData.branch,
        semester: formData.semester,
        password: formData.password
      });

      const accessToken = res.data?.data?.accessToken;
      if (!accessToken) throw new Error("Authentication failed");

      setAccessToken(accessToken);
      login({ accessToken, role: "student" });
      nav("/student");
    } catch (err) {
      setError(err?.response?.data?.error?.message || "Sign up failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const filledCount = [
    formData.name, formData.rollNumber, formData.email, formData.branch,
    formData.password, formData.confirmPassword
  ].filter(Boolean).length;
  const progressPercent = Math.round((filledCount / 6) * 100);

  return (
    <div className="min-h-screen bg-academic-navydeep flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.06)_0%,transparent_50%)]" />
      <div className="absolute top-32 left-10 w-72 h-72 bg-academic-gold/5 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-academic-navy/20 rounded-full blur-3xl animate-float-slow pointer-events-none" />

      <div className="relative z-10 animate-fade-in">
        {/* Header */}
        <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
          <Link to="/" className="inline-block group">
            <div className="mx-auto h-16 w-16 bg-academic-navy rounded-full flex items-center justify-center border-2 border-academic-gold shadow-glow-gold transition-shadow duration-300 group-hover:shadow-glow-gold-lg">
              <span className="font-serif-academic font-bold text-2xl text-academic-gold">JU</span>
            </div>
          </Link>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white font-serif-academic">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Register for your Jammu University Student Portal
          </p>
        </div>

        {/* Form Card */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
          <div className="glass-card-gold rounded-2xl py-8 px-6 sm:px-10 shadow-2xl animate-fade-in-up">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-400">Registration Progress</span>
                <span className="text-academic-gold font-semibold">{progressPercent}%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-academic-gold to-academic-goldlight rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <form className="space-y-5" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name */}
                <div>
                  <label htmlFor="signup-name" className="block text-sm font-medium text-slate-300">Full Name</label>
                  <input
                    id="signup-name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={onChange}
                    className="mt-1.5 block w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 input-glow outline-none transition-all duration-300"
                    placeholder="John Doe"
                    autoComplete="name"
                  />
                </div>

                {/* Roll Number */}
                <div>
                  <label htmlFor="signup-roll" className="block text-sm font-medium text-slate-300">Roll Number</label>
                  <input
                    id="signup-roll"
                    name="rollNumber"
                    type="text"
                    required
                    value={formData.rollNumber}
                    onChange={onChange}
                    className="mt-1.5 block w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 input-glow outline-none transition-all duration-300"
                    placeholder="22CS001"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-slate-300">Email Address</label>
                  <input
                    id="signup-email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={onChange}
                    className="mt-1.5 block w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 input-glow outline-none transition-all duration-300"
                    placeholder="john.doe@email.com"
                    autoComplete="email"
                  />
                </div>

                {/* Branch */}
                <div>
                  <label htmlFor="signup-branch" className="block text-sm font-medium text-slate-300">Department / Branch</label>
                  <select
                    id="signup-branch"
                    name="branch"
                    required
                    value={formData.branch}
                    onChange={onChange}
                    className="mt-1.5 block w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-white input-glow outline-none transition-all duration-300 cursor-pointer"
                  >
                    <option value="" className="bg-slate-950">Select department...</option>
                    {BRANCHES.map((b) => (
                      <option key={b} value={b} className="bg-slate-950">{b}</option>
                    ))}
                  </select>
                </div>

                {/* Semester */}
                <div>
                  <label htmlFor="signup-semester" className="block text-sm font-medium text-slate-300">Current Semester</label>
                  <select
                    id="signup-semester"
                    name="semester"
                    value={formData.semester}
                    onChange={onChange}
                    className="mt-1.5 block w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-white input-glow outline-none transition-all duration-300 cursor-pointer"
                  >
                    {[...Array(8)].map((_, i) => (
                      <option key={i + 1} value={i + 1} className="bg-slate-950">
                        Semester {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-slate-300">Password</label>
                  <div className="mt-1.5 relative">
                    <input
                      id="signup-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={onChange}
                      className="block w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 pr-12 text-sm text-white placeholder-slate-500 input-glow outline-none transition-all duration-300"
                      placeholder="Min 8 characters"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                  {/* Password strength indicator */}
                  {passwordStrength && (
                    <div className="mt-2">
                      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${passwordStrength.bg} rounded-full transition-all duration-300 ${passwordStrength.width}`} />
                      </div>
                      <span className={`text-[10px] mt-1 block ${passwordStrength.color}`}>{passwordStrength.label}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Confirm Password - full width */}
              <div>
                <label htmlFor="signup-confirm" className="block text-sm font-medium text-slate-300">Confirm Password</label>
                <div className="mt-1.5 relative">
                  <input
                    id="signup-confirm"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={onChange}
                    className={`block w-full rounded-xl border bg-slate-900/60 px-4 py-2.5 pr-12 text-sm text-white placeholder-slate-500 input-glow outline-none transition-all duration-300 ${
                      passwordsMismatch ? "border-red-500/50" : passwordsMatch ? "border-emerald-500/50" : "border-slate-800"
                    }`}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                  />
                  {passwordsMatch && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                  {passwordsMismatch && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </div>
                  )}
                </div>
                {passwordsMismatch && (
                  <p className="text-[10px] text-red-400 mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-3.5 text-sm text-red-300 flex items-start gap-2 animate-scale-in">
                  <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={busy}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-glow-gold text-sm font-semibold text-academic-navy bg-academic-gold hover:bg-academic-goldhover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-academic-gold disabled:opacity-50 transition-all duration-200 btn-shimmer cursor-pointer"
              >
                {busy ? (
                  <>
                    <div className="spinner" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-slate-800/50 flex items-center justify-between text-sm">
              <Link to="/login/student" className="text-academic-gold hover:text-academic-goldhover hover:underline transition font-medium">
                Already registered? Sign in
              </Link>
              <Link to="/" className="text-slate-400 hover:text-white transition flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
