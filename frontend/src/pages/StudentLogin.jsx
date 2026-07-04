import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound
} from "lucide-react";
import { api, setAccessToken } from "../lib/api";
import { useAuth } from "../lib/auth.jsx";
import juLibrary from "../assets/ju-campus-gallery-1.jpg";

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#F25022" d="M2 2h9.5v9.5H2z" />
      <path fill="#7FBA00" d="M12.5 2H22v9.5h-9.5z" />
      <path fill="#00A4EF" d="M2 12.5h9.5V22H2z" />
      <path fill="#FFB900" d="M12.5 12.5H22V22h-9.5z" />
    </svg>
  );
}

function LoginField({ icon: Icon, label, children }) {
  return (
    <label className="group block">
      <span className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
        <Icon className="h-4 w-4 text-[#163D7A]" />
        {label}
      </span>
      <div className="rounded-[14px] border border-[#E2E8F0] bg-white shadow-sm transition group-focus-within:-translate-y-0.5 group-focus-within:border-[#2563EB] group-focus-within:shadow-[0_14px_34px_rgba(37,99,235,0.14)]">
        {children}
      </div>
    </label>
  );
}

export function StudentLogin() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [rollNumberOrEmail, setRollNumberOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
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

  function ssoNotice(provider) {
    setError(`${provider} login is not enabled for this university portal yet. Please sign in with roll number or email.`);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F8FAFC] px-4 py-6 text-[#0F172A] sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_12%,rgba(37,99,235,0.16),transparent_24rem),radial-gradient(circle_at_28%_88%,rgba(22,61,122,0.12),transparent_26rem)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(22,61,122,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(22,61,122,0.045)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <motion.div className="absolute right-[12%] top-20 h-56 w-56 rounded-full bg-blue-200/45 blur-3xl" animate={{ y: [0, -18, 0], scale: [1, 1.08, 1] }} transition={{ duration: 7, repeat: Infinity }} />
      <motion.div className="absolute bottom-14 left-[48%] h-72 w-72 rounded-full bg-[#EEF5FF] blur-3xl" animate={{ y: [0, 20, 0], scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity }} />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1100px] items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[36px] border border-white/80 bg-white/48 shadow-[0_34px_120px_rgba(11,31,58,0.16)] backdrop-blur-2xl lg:grid-cols-[45fr_55fr]">
        <section className="relative hidden min-h-[720px] overflow-hidden p-4 lg:block">
          <div className="absolute inset-4 overflow-hidden rounded-[30px] shadow-[0_30px_90px_rgba(11,31,58,0.24)]">
            <img src={juLibrary} alt="Dhanvantri Library at the University of Jammu" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/92 via-[#0B1F3A]/38 to-[#0B1F3A]/12" />
          </div>

          <div className="relative flex h-full min-h-[720px] flex-col justify-between p-8 text-white">
            <Link to="/" className="flex w-fit items-center gap-3 rounded-[24px] border border-white/20 bg-white/14 px-4 py-3 backdrop-blur-2xl">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-[#163D7A] text-sm font-black">JU</div>
              <div>
                <p className="font-black">Jammu University</p>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-100">Student Workspace</p>
              </div>
            </Link>

            <div className="max-w-xl">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/12 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] backdrop-blur-2xl">
                <Sparkles className="h-4 w-4 text-[#C8A44D]" />
                Future Starts Here.
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="text-5xl font-black leading-[1.02] tracking-tight">
                Welcome back to your academic workspace.
              </motion.h1>
              <p className="mt-6 text-lg leading-8 text-blue-50/90">
                Access attendance, examinations, assignments and academic resources through a secure university portal.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                [GraduationCap, "50,000+", "Students"],
                [BookOpen, "120+", "Programs"],
                [Award, "NAAC A+", "Accredited"]
              ].map(([Icon, value, label], index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 + index * 0.08 }}
                  className="rounded-[26px] border border-white/16 bg-white/14 p-5 backdrop-blur-2xl"
                >
                  <Icon className="mb-4 h-6 w-6 text-[#C8A44D]" />
                  <p className="text-2xl font-black">{value}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-blue-100">{label}</p>
                </motion.div>
              ))}
            </div>

            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 5.5, repeat: Infinity }} className="absolute right-10 top-36 rounded-[26px] border border-white/20 bg-white/16 p-5 shadow-2xl backdrop-blur-2xl">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-[#C8A44D]" />
                <div>
                  <p className="text-sm font-black">Secure Portal</p>
                  <p className="mt-1 text-xs text-blue-100">Encrypted academic access</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="flex min-h-[720px] items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="w-full max-w-[500px]">
            <div className="student-login-surface rounded-[28px] border border-[#E5E7EB] bg-white/88 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-[20px] sm:p-10">
              <div className="mb-8 text-center">
                <Link to="/" className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-[18px] bg-gradient-to-br from-[#163D7A] to-[#2563EB] text-base font-black text-white shadow-[0_16px_40px_rgba(37,99,235,0.22)]" aria-label="Jammu University home">
                  JU
                </Link>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#DCE7F5] bg-[#EEF5FF] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#163D7A]">
                  <UserRound className="h-4 w-4" />
                  Secure student access
                </div>
                <h1 className="text-4xl font-black tracking-tight text-[#0F172A]">Student Login</h1>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#475569]">
                  Access your dashboard, attendance, examinations and academic resources.
                </p>
              </div>

              <div className="mb-5 grid grid-cols-2 gap-3">
                <button type="button" onClick={() => ssoNotice("Google")} className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[14px] border border-[#E2E8F0] bg-white px-4 text-sm font-black text-[#475569] transition hover:-translate-y-0.5 hover:bg-[#EEF5FF] hover:text-[#163D7A]">
                  <GoogleIcon />
                  Google
                </button>
                <button type="button" onClick={() => ssoNotice("Microsoft")} className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[14px] border border-[#E2E8F0] bg-white px-4 text-sm font-black text-[#475569] transition hover:-translate-y-0.5 hover:bg-[#EEF5FF] hover:text-[#163D7A]">
                  <MicrosoftIcon />
                  Microsoft
                </button>
              </div>

              <div className="mb-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#E2E8F0]" />
                <span className="text-xs font-black uppercase tracking-[0.16em] text-[#64748B]">or use university credentials</span>
                <div className="h-px flex-1 bg-[#E2E8F0]" />
              </div>

              <form className="space-y-5" onSubmit={onSubmit}>
                <LoginField icon={Mail} label="Roll Number / Email">
                  <input
                    id="student-login-id"
                    value={rollNumberOrEmail}
                    onChange={(e) => setRollNumberOrEmail(e.target.value)}
                    className="h-[52px] w-full rounded-[14px] bg-transparent px-5 text-sm font-bold text-[#0F172A] outline-none placeholder:text-[#94A3B8]"
                    placeholder="22CS001 or student@uni.edu"
                    autoComplete="username"
                    required
                  />
                </LoginField>

                <LoginField icon={Lock} label="Password">
                  <div className="relative">
                    <input
                      id="student-login-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-[52px] w-full rounded-[14px] bg-transparent px-5 pr-14 text-sm font-bold text-[#0F172A] outline-none placeholder:text-[#94A3B8]"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-xl p-2 text-[#64748B] transition hover:bg-[#EEF5FF] hover:text-[#163D7A]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </LoginField>

                <div className="flex items-center justify-between gap-3">
                  <label className="flex cursor-pointer items-center gap-3 text-sm font-bold text-[#475569]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-[#DCE7F5] text-[#163D7A]"
                    />
                    Remember me
                  </label>
                  <Link to="/forgot-password/student" className="text-sm font-black text-[#163D7A] transition hover:text-[#2563EB]">
                    Forgot Password?
                  </Link>
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-[18px] border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                    {error}
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={busy}
                  className="relative h-[52px] w-full overflow-hidden rounded-[14px] bg-gradient-to-r from-[#163D7A] to-[#2563EB] px-7 text-sm font-black text-white shadow-[0_16px_42px_rgba(37,99,235,0.24)] transition disabled:opacity-60"
                >
                  <span className="relative z-10 inline-flex items-center justify-center gap-2">
                    {busy ? "Signing in..." : "Sign In"}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                  <span className="absolute inset-y-0 left-[-40%] w-1/3 skew-x-12 bg-white/20 transition-all duration-700 group-hover:left-[120%]" />
                </motion.button>
              </form>

              <div className="mt-7 rounded-[18px] bg-[#EEF5FF] p-4 text-center text-sm font-bold text-[#475569]">
                New to the portal?{" "}
                <Link to="/signup/student" className="font-black text-[#163D7A] hover:text-[#2563EB]">
                  Register Now
                </Link>
              </div>
              <Link to="/" className="mt-5 flex items-center justify-center gap-2 text-sm font-black text-[#64748B] transition hover:text-[#163D7A]">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </div>
          </motion.div>
        </section>
        </div>
      </div>
    </main>
  );
}
