import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, setAccessToken } from "../lib/api";
import { useAuth } from "../lib/auth.jsx";

export function StudentLogin() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [rollNumberOrEmail, setRollNumberOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await api.post("/auth/student/login", { rollNumberOrEmail, password });
      const accessToken = res.data?.data?.accessToken;
      if (!accessToken) throw new Error("Missing token");
      setAccessToken(accessToken);
      login({ accessToken, role: "student" });
      nav("/student");
    } catch (err) {
      setError(err?.response?.data?.error?.message || "Login failed. Please check your credentials.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-academic-navydeep flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.06)_0%,transparent_50%)]" />
      <div className="absolute top-20 right-20 w-80 h-80 bg-academic-gold/5 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-academic-navy/20 rounded-full blur-3xl animate-float-slow pointer-events-none" />

      <div className="relative z-10 animate-fade-in">
        {/* Header */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <Link to="/" className="inline-block group">
            <div className="mx-auto h-16 w-16 bg-academic-navy rounded-full flex items-center justify-center border-2 border-academic-gold shadow-glow-gold transition-shadow duration-300 group-hover:shadow-glow-gold-lg">
              <span className="font-serif-academic font-bold text-2xl text-academic-gold">JU</span>
            </div>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white font-serif-academic">
            Student Portal
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to access results, attendance, and assignments
          </p>
        </div>

        {/* Form Card */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="glass-card-gold rounded-2xl py-8 px-6 sm:px-10 shadow-2xl animate-fade-in-up">
            <form className="space-y-6" onSubmit={onSubmit}>
              {/* Roll Number / Email */}
              <div>
                <label htmlFor="student-login-id" className="block text-sm font-medium text-slate-300">
                  Roll Number / Email Address
                </label>
                <div className="mt-1.5">
                  <input
                    id="student-login-id"
                    value={rollNumberOrEmail}
                    onChange={(e) => setRollNumberOrEmail(e.target.value)}
                    className="block w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 input-glow outline-none transition-all duration-300"
                    placeholder="22CS001 or student@uni.edu"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center">
                  <label htmlFor="student-login-password" className="block text-sm font-medium text-slate-300">
                    Password
                  </label>
                  <Link
                    to="/forgot-password/student"
                    className="text-xs text-academic-gold hover:text-academic-goldhover hover:underline transition"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="mt-1.5 relative">
                  <input
                    id="student-login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 pr-12 text-sm text-white input-glow outline-none transition-all duration-300"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
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
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Footer links */}
            <div className="mt-8 pt-6 border-t border-slate-800/50 flex items-center justify-between text-sm">
              <Link to="/signup/student" className="text-academic-gold hover:text-academic-goldhover hover:underline transition font-medium">
                New? Register here
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
