import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, setAccessToken } from "../lib/api";
import { useAuth } from "../lib/auth.jsx";

export function AdminLogin() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await api.post("/auth/admin/login", { email, password });
      const accessToken = res.data?.data?.accessToken;
      if (!accessToken) throw new Error("Missing token");
      setAccessToken(accessToken);
      login({ accessToken, role: "admin" });
      nav("/admin");
    } catch (err) {
      setError(err?.response?.data?.error?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-academic-navydark via-slate-900 to-black text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Academic Seal */}
        <div className="mx-auto h-16 w-16 bg-academic-navy rounded-full flex items-center justify-center border-2 border-academic-gold shadow-lg shadow-academic-gold/20">
          <span className="font-serif-academic font-bold text-2xl text-academic-gold">JU</span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white font-serif-academic">
          Administration Portal
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Sign in with administrator credentials to manage university records
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-950/60 backdrop-blur-xl py-8 px-4 border border-slate-800 shadow-2xl rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-300">
                Administrator Email Address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-academic-gold focus:ring-1 focus:ring-academic-gold outline-none"
                  placeholder="admin@uni.edu"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">
                Secret Access Key / Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-academic-gold focus:ring-1 focus:ring-academic-gold outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <div>
              <button
                disabled={busy}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-academic-navy bg-academic-gold hover:bg-academic-goldhover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-academic-gold disabled:opacity-50 transition duration-150 ease-in-out cursor-pointer"
              >
                {busy ? "Signing in Administrator..." : "Enter Portal"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <Link to="/" className="text-slate-400 hover:text-white transition duration-150">
              ← Return to Jammu University Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
