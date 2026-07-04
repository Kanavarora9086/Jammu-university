import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  BriefcaseBusiness,
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Upload,
  User,
  Building2,
  Hash,
  BookOpen
} from "lucide-react";
import { api, setAccessToken } from "../lib/api";
import { useAuth } from "../lib/auth.jsx";
import juAuditorium from "../assets/ju-campus-gallery-2.jpg";

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

const COURSES = ["B.Tech", "B.Sc", "B.Com", "B.A", "M.Tech", "M.Sc", "MBA", "M.A", "Ph.D"];

const steps = [
  { label: "Identity", note: "Personal profile" },
  { label: "Academics", note: "University records" },
  { label: "Security", note: "Password setup" },
  { label: "Review", note: "Consent & submit" }
];

function strengthMeta(password) {
  if (!password) return { score: 0, label: "Not started", color: "bg-slate-200", text: "text-slate-500" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score: 25, label: "Weak", color: "bg-rose-500", text: "text-rose-600" };
  if (score === 2) return { score: 50, label: "Fair", color: "bg-amber-500", text: "text-amber-600" };
  if (score === 3) return { score: 75, label: "Good", color: "bg-blue-600", text: "text-blue-700" };
  return { score: 100, label: "Excellent", color: "bg-emerald-500", text: "text-emerald-600" };
}

function Field({ icon: Icon, label, name, value, onChange, type = "text", placeholder = " ", error, children, autoComplete }) {
  return (
    <label className="group block">
      <span className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
        <Icon className="h-4 w-4 text-blue-600" />
        {label}
      </span>
      <div className={`relative rounded-[22px] border bg-white/80 shadow-sm transition group-focus-within:-translate-y-0.5 group-focus-within:border-blue-500 group-focus-within:shadow-[0_18px_50px_rgba(37,99,235,0.14)] ${error ? "border-rose-300" : "border-slate-200"}`}>
        {children || (
          <input
            name={name}
            value={value}
            onChange={onChange}
            type={type}
            placeholder={placeholder}
            autoComplete={autoComplete}
            className="min-h-[58px] w-full rounded-[22px] bg-transparent px-5 text-sm font-bold text-slate-950 outline-none placeholder:text-slate-400"
          />
        )}
      </div>
      {error && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-xs font-bold text-rose-600">{error}</motion.p>}
    </label>
  );
}

export function StudentSignup() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [profilePreview, setProfilePreview] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    rollNumber: "",
    registrationNumber: "",
    branch: "",
    course: "",
    semester: 1,
    password: "",
    confirmPassword: ""
  });

  const passwordStrength = useMemo(() => strengthMeta(formData.password), [formData.password]);

  function onChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "semester" ? Number(value) : value }));
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePreview(URL.createObjectURL(file));
  }

  function validationFor(currentStep = step) {
    const errors = {};
    if (currentStep === 0) {
      if (!formData.name.trim()) errors.name = "Full name is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Enter a valid email address.";
      if (!/^[0-9]{10}$/.test(formData.mobile)) errors.mobile = "Enter a 10 digit mobile number.";
    }
    if (currentStep === 1) {
      if (!formData.rollNumber.trim()) errors.rollNumber = "Roll number is required.";
      if (!formData.registrationNumber.trim()) errors.registrationNumber = "Registration number is required.";
      if (!formData.branch) errors.branch = "Select your department.";
      if (!formData.course) errors.course = "Select your course.";
    }
    if (currentStep === 2) {
      if (formData.password.length < 8) errors.password = "Password must be at least 8 characters.";
      if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Passwords do not match.";
    }
    if (currentStep === 3) {
      if (!acceptedTerms || !acceptedPrivacy) errors.terms = "Accept terms and privacy policy to continue.";
    }
    return errors;
  }

  const currentErrors = validationFor(step);
  const progress = Math.round(((step + 1) / steps.length) * 100);

  function nextStep() {
    const errors = validationFor(step);
    if (Object.keys(errors).length) {
      setError(Object.values(errors)[0]);
      return;
    }
    setError("");
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const errors = validationFor(3);
    if (Object.keys(errors).length) {
      setError(Object.values(errors)[0]);
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

      setSuccess(true);
      setTimeout(() => {
        setAccessToken(accessToken);
        login({ accessToken, role: "student" });
        nav("/student");
      }, 900);
    } catch (err) {
      setError(err?.response?.data?.error?.message || "Sign up failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function ssoNotice(provider) {
    setError(`${provider} sign up is not enabled for this university portal yet. Please continue with email registration.`);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_10%_8%,rgba(59,130,246,0.45),transparent_30rem),radial-gradient(circle_at_90%_20%,rgba(6,182,212,0.34),transparent_28rem),linear-gradient(135deg,#eff6ff_0%,#f8fbff_46%,#ecfeff_100%)] text-slate-950">
      <motion.div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-blue-300/35 blur-3xl" animate={{ y: [0, -22, 0], scale: [1, 1.08, 1] }} transition={{ duration: 8, repeat: Infinity }} />
      <motion.div className="absolute -right-24 bottom-20 h-96 w-96 rounded-full bg-cyan-300/35 blur-3xl" animate={{ y: [0, 24, 0], scale: [1, 1.1, 1] }} transition={{ duration: 9, repeat: Infinity }} />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[1.03fr_0.97fr]">
        <section className="relative hidden min-h-screen overflow-hidden p-8 lg:block">
          <div className="absolute inset-8 overflow-hidden rounded-[44px] shadow-[0_34px_110px_rgba(15,23,42,0.22)]">
            <img src={juAuditorium} alt="Brigadier Rajinder Singh Auditorium at the University of Jammu" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950/82 via-blue-950/18 to-transparent" />
          </div>

          <div className="relative flex h-full flex-col justify-between p-10 text-white">
            <Link to="/" className="flex w-fit items-center gap-3 rounded-[24px] border border-white/20 bg-white/14 px-4 py-3 backdrop-blur-2xl">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-blue-700 text-sm font-black">JU</div>
              <div>
                <p className="font-black">Jammu University</p>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-100">Student Onboarding</p>
              </div>
            </Link>

            <div className="max-w-xl">
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/14 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] backdrop-blur-2xl">
                <Sparkles className="h-4 w-4" />
                Build your academic identity
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="text-6xl font-black leading-[0.98] tracking-tight">
                Create your portal account with confidence.
              </motion.h1>
              <p className="mt-6 text-lg leading-8 text-blue-50/88">
                Join a secure academic workspace for results, attendance, assignments, notices and opportunities.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                [Award, "NAAC A+", "Accredited"],
                [BriefcaseBusiness, "300+", "Placement drives"],
                [ShieldCheck, "Secure", "JWT access"]
              ].map(([Icon, title, note], index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 + index * 0.08 }}
                  className="rounded-[26px] border border-white/16 bg-white/14 p-5 backdrop-blur-2xl"
                >
                  <Icon className="mb-4 h-6 w-6 text-cyan-200" />
                  <p className="text-2xl font-black">{title}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-blue-100">{note}</p>
                </motion.div>
              ))}
            </div>

            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute right-16 top-44 rounded-[26px] border border-white/20 bg-white/16 p-5 text-white shadow-2xl backdrop-blur-2xl">
              <p className="text-sm font-black">Scholarship desk</p>
              <p className="mt-1 text-xs text-blue-100">Merit support available</p>
            </motion.div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
            <div className="mb-6 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3 lg:hidden">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-700 text-sm font-black text-white">JU</div>
                <span className="font-black">Jammu University</span>
              </Link>
              <Link to="/login/student" className="ml-auto rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:text-blue-700">
                Already have an account? Sign In
              </Link>
            </div>

            <div className="rounded-[36px] border border-white/70 bg-white/82 p-5 shadow-[0_30px_100px_rgba(15,23,42,0.14)] backdrop-blur-2xl sm:p-8">
              <div className="mb-7">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">Student registration</p>
                <h2 className="mt-2 text-4xl font-black tracking-tight">Create your academic account</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">A premium guided setup for your Jammu University student portal.</p>
              </div>

              <div className="mb-7">
                <div className="mb-3 flex items-center justify-between text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                  <span>{steps[step].label}</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-blue-700 to-cyan-400" animate={{ width: `${progress}%` }} />
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {steps.map((item, index) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => index <= step && setStep(index)}
                      className={`rounded-2xl p-3 text-left transition ${index <= step ? "bg-blue-50 text-blue-800" : "bg-slate-50 text-slate-400"}`}
                    >
                      <span className="block text-xs font-black">{item.label}</span>
                      <span className="hidden text-[10px] font-bold sm:block">{item.note}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5 grid grid-cols-2 gap-3">
                <button type="button" onClick={() => ssoNotice("Google")} className="rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:-translate-y-0.5 hover:text-blue-700">
                  Google Sign Up
                </button>
                <button type="button" onClick={() => ssoNotice("Microsoft")} className="rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:-translate-y-0.5 hover:text-blue-700">
                  Microsoft Sign Up
                </button>
              </div>

              <form onSubmit={onSubmit}>
                <AnimatePresence mode="wait">
                  {step === 0 && (
                    <motion.div key="step-1" initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -28 }} className="space-y-5">
                      <div className="flex items-center gap-4 rounded-[26px] bg-blue-50 p-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-white shadow-inner">
                          {profilePreview ? <img src={profilePreview} alt="Profile preview" className="h-full w-full object-cover" /> : <Camera className="m-5 h-6 w-6 text-blue-600" />}
                        </div>
                        <label className="cursor-pointer rounded-2xl bg-blue-700 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-800">
                          <Upload className="mr-2 inline h-4 w-4" />
                          Upload Profile Photo
                          <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                        </label>
                      </div>
                      <Field icon={User} label="Full Name" name="name" value={formData.name} onChange={onChange} error={currentErrors.name} autoComplete="name" />
                      <Field icon={Mail} label="Email Address" name="email" type="email" value={formData.email} onChange={onChange} error={currentErrors.email} autoComplete="email" />
                      <Field icon={Phone} label="Mobile Number" name="mobile" value={formData.mobile} onChange={onChange} error={currentErrors.mobile} placeholder="10 digit mobile number" />
                    </motion.div>
                  )}

                  {step === 1 && (
                    <motion.div key="step-2" initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -28 }} className="grid gap-5 sm:grid-cols-2">
                      <Field icon={Hash} label="Roll Number" name="rollNumber" value={formData.rollNumber} onChange={onChange} error={currentErrors.rollNumber} />
                      <Field icon={BadgeCheck} label="Registration Number" name="registrationNumber" value={formData.registrationNumber} onChange={onChange} error={currentErrors.registrationNumber} />
                      <Field icon={Building2} label="Department" error={currentErrors.branch}>
                        <select name="branch" value={formData.branch} onChange={onChange} className="min-h-[58px] w-full rounded-[22px] bg-transparent px-5 text-sm font-bold text-slate-950 outline-none">
                          <option value="">Select department</option>
                          {BRANCHES.map((branch) => <option key={branch} value={branch}>{branch}</option>)}
                        </select>
                      </Field>
                      <Field icon={BookOpen} label="Course" error={currentErrors.course}>
                        <select name="course" value={formData.course} onChange={onChange} className="min-h-[58px] w-full rounded-[22px] bg-transparent px-5 text-sm font-bold text-slate-950 outline-none">
                          <option value="">Select course</option>
                          {COURSES.map((course) => <option key={course} value={course}>{course}</option>)}
                        </select>
                      </Field>
                      <Field icon={GraduationCap} label="Semester">
                        <select name="semester" value={formData.semester} onChange={onChange} className="min-h-[58px] w-full rounded-[22px] bg-transparent px-5 text-sm font-bold text-slate-950 outline-none">
                          {[...Array(8)].map((_, i) => <option key={i + 1} value={i + 1}>Semester {i + 1}</option>)}
                        </select>
                      </Field>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step-3" initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -28 }} className="space-y-5">
                      <Field icon={Lock} label="Password" error={currentErrors.password}>
                        <div className="relative">
                          <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={onChange} className="min-h-[58px] w-full rounded-[22px] bg-transparent px-5 pr-14 text-sm font-bold text-slate-950 outline-none" autoComplete="new-password" />
                          <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </Field>
                      <div>
                        <div className="mb-2 flex justify-between text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                          <span>Password strength</span>
                          <span className={passwordStrength.text}>{passwordStrength.label}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <motion.div className={`h-full ${passwordStrength.color}`} animate={{ width: `${passwordStrength.score}%` }} />
                        </div>
                      </div>
                      <Field icon={Lock} label="Confirm Password" error={currentErrors.confirmPassword}>
                        <div className="relative">
                          <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={onChange} className="min-h-[58px] w-full rounded-[22px] bg-transparent px-5 pr-14 text-sm font-bold text-slate-950 outline-none" autoComplete="new-password" />
                          <button type="button" onClick={() => setShowConfirmPassword((prev) => !prev)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </Field>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="step-4" initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -28 }} className="space-y-5">
                      <div className="rounded-[28px] bg-blue-50 p-5">
                        <div className="mb-4 flex items-center gap-3">
                          <CheckCircle2 className="h-6 w-6 text-blue-700" />
                          <p className="text-lg font-black">Review your account</p>
                        </div>
                        <div className="grid gap-3 text-sm font-bold text-slate-700 sm:grid-cols-2">
                          <span>Name: {formData.name || "-"}</span>
                          <span>Email: {formData.email || "-"}</span>
                          <span>Roll: {formData.rollNumber || "-"}</span>
                          <span>Department: {formData.branch || "-"}</span>
                        </div>
                      </div>
                      <label className="flex cursor-pointer items-start gap-3 rounded-[22px] border border-slate-200 bg-white/80 p-4 text-sm font-bold text-slate-700">
                        <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-1 h-4 w-4" />
                        I agree to the Jammu University Terms & Conditions.
                      </label>
                      <label className="flex cursor-pointer items-start gap-3 rounded-[22px] border border-slate-200 bg-white/80 p-4 text-sm font-bold text-slate-700">
                        <input type="checkbox" checked={acceptedPrivacy} onChange={(e) => setAcceptedPrivacy(e.target.checked)} className="mt-1 h-4 w-4" />
                        I acknowledge the Privacy Policy and student data usage notice.
                      </label>
                      {currentErrors.terms && <p className="text-xs font-bold text-rose-600">{currentErrors.terms}</p>}
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-[22px] border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-700">
                    {error}
                  </motion.div>
                )}

                {success && (
                  <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="mt-5 rounded-[22px] border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
                    Account created. Opening your dashboard...
                  </motion.div>
                )}

                <div className="mt-7 flex gap-3">
                  {step > 0 && (
                    <button type="button" onClick={() => { setError(""); setStep((prev) => prev - 1); }} className="inline-flex items-center justify-center gap-2 rounded-[20px] border border-slate-200 bg-white px-6 py-4 text-sm font-black text-slate-700 transition hover:-translate-y-0.5">
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>
                  )}
                  {step < steps.length - 1 ? (
                    <button type="button" onClick={nextStep} className="ml-auto inline-flex items-center justify-center gap-2 rounded-[20px] bg-blue-700 px-7 py-4 text-sm font-black text-white shadow-[0_20px_60px_rgba(37,99,235,0.25)] transition hover:-translate-y-0.5 hover:bg-blue-800">
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button type="submit" disabled={busy || success} className="ml-auto inline-flex items-center justify-center gap-2 rounded-[20px] bg-blue-700 px-7 py-4 text-sm font-black text-white shadow-[0_20px_60px_rgba(37,99,235,0.25)] transition hover:-translate-y-0.5 hover:bg-blue-800 disabled:opacity-60">
                      {busy ? "Creating account..." : "Create Account"}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
