import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Landmark,
  LayoutDashboard,
  LibraryBig,
  Mail,
  MapPin,
  Menu,
  Moon,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Users,
  X
} from "lucide-react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth.jsx";
import juAuditorium from "../assets/ju-campus-gallery-2.jpg";
import juLibrary from "../assets/ju-campus-gallery-1.jpg";
import juMainLawn from "../assets/ju-campus-gallery-3.jpg";
import juResearchBuilding from "../assets/ju-research-building.jpg";
import juSportsGround from "../assets/ju-sports-ground.jpg";
import "../App.css";

function useCounter(target, duration = 1800, enabled = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let frame;
    const startedAt = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, enabled, target]);

  return count;
}

function Stat({ value, suffix = "", label, icon: Icon, compact = false, to = "/about" }) {
  const ref = useMemo(() => ({ current: null }), []);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const count = useCounter(value, 1800, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`rounded-[24px] border border-white/50 bg-white/70 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/55 ${
        compact ? "min-w-[150px]" : ""
      }`}
    >
      <Link to={to} className="block h-full p-5 transition hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-200">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
          {count.toLocaleString()}
          {suffix}
        </div>
        <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">{label}</p>
      </Link>
    </motion.div>
  );
}

function SectionHeading({ eyebrow, title, children, dark = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55 }}
      className="mx-auto mb-12 max-w-3xl text-center"
    >
      <div
        className={`mx-auto mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] ${
          dark
            ? "border-white/15 bg-white/10 text-cyan-100"
            : "border-blue-200 bg-white/70 text-blue-700 shadow-sm"
        }`}
      >
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        {eyebrow}
      </div>
      <h2 className={`text-3xl font-black tracking-tight md:text-5xl ${dark ? "text-white" : "text-slate-950 dark:text-white"}`}>
        {title}
      </h2>
      {children && (
        <p className={`mx-auto mt-5 max-w-2xl text-base leading-8 ${dark ? "text-blue-100/80" : "text-slate-600 dark:text-slate-300"}`}>
          {children}
        </p>
      )}
    </motion.div>
  );
}

function ServiceCard({ item, index }) {
  const Icon = item.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ delay: index * 0.045, duration: 0.45 }}
      whileHover={{ y: -10, scale: 1.015 }}
    >
      <Link
        to={item.to}
        className="group relative block h-full overflow-hidden rounded-[28px] border border-white/60 bg-white/80 p-6 shadow-[0_22px_70px_rgba(15,23,42,0.10)] backdrop-blur-2xl transition-all duration-300 hover:border-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:border-white/10 dark:bg-slate-950/55"
      >
        <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.gradient}`} />
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-100 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-80 dark:bg-cyan-500/20" />
        <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-xl shadow-blue-500/20`}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-black text-slate-950 dark:text-white">{item.title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.description}</p>
        <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition-transform group-hover:translate-x-1 dark:text-cyan-300">
          Open <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </div>
      </Link>
    </motion.div>
  );
}

function FloatingShape({ className, delay = 0 }) {
  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      animate={{ y: [0, -22, 0], x: [0, 14, 0], scale: [1, 1.08, 1] }}
      transition={{ duration: 8, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

const services = [
  {
    title: "Admissions",
    description: "A guided, digital-first admissions experience for applicants, merit lists, eligibility and program discovery.",
    icon: GraduationCap,
    gradient: "from-blue-600 to-cyan-500",
    to: "/admissions"
  },
  {
    title: "Results",
    description: "Fast semester records, verified marksheets, SGPA, CGPA and transparent academic history.",
    icon: Award,
    gradient: "from-indigo-600 to-blue-500",
    to: "/results"
  },
  {
    title: "Student Portal",
    description: "Attendance, assignments, notices and academic essentials in one secure student workspace.",
    icon: LayoutDashboard,
    gradient: "from-cyan-500 to-teal-500",
    to: "/student-portal"
  },
  {
    title: "Faculty Portal",
    description: "Tools for course coordination, notices, attendance, grading workflows and student support.",
    icon: Users,
    gradient: "from-sky-500 to-blue-700",
    to: "/faculty-portal"
  },
  {
    title: "Departments",
    description: "Explore schools, programs, faculty strengths, research labs and academic calendars.",
    icon: Building2,
    gradient: "from-violet-600 to-blue-500",
    to: "/departments"
  },
  {
    title: "Research",
    description: "Innovation hubs, doctoral work, funded projects and interdisciplinary research initiatives.",
    icon: LibraryBig,
    gradient: "from-blue-700 to-slate-700",
    to: "/research"
  },
  {
    title: "Scholarships",
    description: "Financial aid, merit support, category scholarships and student success resources.",
    icon: BadgeCheck,
    gradient: "from-emerald-500 to-cyan-500",
    to: "/scholarships"
  },
  {
    title: "Placements",
    description: "Career readiness, partner networks, internships, placement drives and alumni pathways.",
    icon: BriefcaseBusiness,
    gradient: "from-orange-500 to-blue-600",
    to: "/placements"
  }
];

const gallery = [
  {
    title: "Dhanvantri Library",
    image: juLibrary,
    alt: "Dhanvantri Library building at the University of Jammu",
    position: "50% 50%"
  },
  {
    title: "Brig. Rajinder Singh Auditorium",
    image: juAuditorium,
    alt: "Brigadier Rajinder Singh Auditorium at the University of Jammu",
    position: "50% 50%"
  },
  {
    title: "Research Facilities",
    image: juResearchBuilding,
    alt: "Research building at the University of Jammu",
    position: "50% 50%"
  },
  {
    title: "Sports Facilities",
    image: juSportsGround,
    alt: "University of Jammu sports ground",
    position: "50% 50%"
  }
];

const partners = ["TCS", "Infosys", "Wipro", "HCLTech", "Deloitte", "IBM", "Accenture", "Tech Mahindra"];

const testimonials = [
  {
    name: "Aarav Sharma",
    program: "B.Tech Computer Science",
    quote: "The new portal makes academic life feel organized. Results, attendance and notices are finally easy to follow."
  },
  {
    name: "Zoya Khan",
    program: "MBA",
    quote: "Jammu University feels more connected now. The experience is modern, confident and genuinely useful."
  },
  {
    name: "Riya Gupta",
    program: "M.Sc Physics",
    quote: "The digital services save time and the interface feels premium without losing the university identity."
  }
];

export function Landing() {
  const location = useLocation();
  const { accessToken, role, logout } = useAuth();
  const [notices, setNotices] = useState([]);
  const [searchRoll, setSearchRoll] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [searchBusy, setSearchBusy] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [feedbackForm, setFeedbackForm] = useState({ name: "", email: "", rating: 0, message: "" });
  const [feedbackHover, setFeedbackHover] = useState(0);
  const [feedbackBusy, setFeedbackBusy] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 70, damping: 18 });
  const smoothY = useSpring(mouseY, { stiffness: 70, damping: 18 });
  const heroImageY = useTransform(smoothY, [-0.5, 0.5], [18, -18]);
  const orbX = useTransform(smoothX, [-0.5, 0.5], [28, -28]);
  const orbY = useTransform(smoothY, [-0.5, 0.5], [-24, 24]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/academics", label: "Academics" },
    { to: "/campus-life", label: "Campus Life" },
    { to: "/placements", label: "Placements" },
    { to: "/contact", label: "Contact" }
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex((current) => (current + 1) % testimonials.length);
    }, 5200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    api
      .get("/notices")
      .then((res) => setNotices(res.data?.data?.notices || []))
      .catch((err) => console.error("Failed to load notices", err));
  }, []);

  const handleMouseMove = useCallback(
    (event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
    },
    [mouseX, mouseY]
  );

  const handleVerifyRoll = useCallback(
    async (e) => {
      e.preventDefault();
      if (!searchRoll.trim()) return;
      setSearchBusy(true);
      setSearchError("");
      setSearchResult(null);

      try {
        const res = await api.get(`/auth/verify-student/${encodeURIComponent(searchRoll.trim())}`);
        const data = res.data?.data;
        if (data?.found) {
          setSearchResult({
            rollNumber: data.student.rollNumber,
            name: data.student.name,
            branch: data.student.branch,
            semester: data.student.semester,
            status: "Active"
          });
        } else {
          setSearchError("No student record found for this roll number.");
        }
      } catch {
        setSearchError("Verification service unavailable. Please try again later.");
      } finally {
        setSearchBusy(false);
      }
    },
    [searchRoll]
  );

  const handleFeedbackSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!feedbackForm.rating) {
        setFeedbackError("Please select a star rating.");
        return;
      }
      setFeedbackBusy(true);
      setFeedbackError("");
      setFeedbackSuccess(false);
      try {
        await api.post("/feedback", feedbackForm);
        setFeedbackSuccess(true);
        setFeedbackForm({ name: "", email: "", rating: 0, message: "" });
      } catch (err) {
        setFeedbackError(err?.response?.data?.error?.message || "Failed to submit feedback. Please try again.");
      } finally {
        setFeedbackBusy(false);
      }
    },
    [feedbackForm]
  );

  const visibleNotices = notices.slice(0, 3);

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_18%_8%,rgba(147,197,253,0.50),transparent_28rem),radial-gradient(circle_at_86%_18%,rgba(125,211,252,0.42),transparent_30rem),linear-gradient(135deg,#f8fbff_0%,#eff6ff_38%,#eefcff_72%,#ffffff_100%)] text-slate-950 transition-colors duration-500 dark:bg-[radial-gradient(circle_at_18%_8%,rgba(37,99,235,0.30),transparent_28rem),radial-gradient(circle_at_86%_18%,rgba(6,182,212,0.20),transparent_30rem),linear-gradient(135deg,#020617_0%,#0f172a_46%,#082f49_100%)] dark:text-white">
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.055)_1px,transparent_1px)] bg-[size:80px_80px] opacity-70 dark:opacity-25" />
          <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/80 to-transparent dark:from-slate-950/70" />
          <FloatingShape className="left-[-8rem] top-24 h-80 w-80 bg-blue-300/35 dark:bg-blue-600/25" />
          <FloatingShape className="right-[-9rem] top-44 h-96 w-96 bg-cyan-200/55 dark:bg-cyan-500/18" delay={1.2} />
          <FloatingShape className="bottom-20 left-1/3 h-72 w-72 bg-indigo-200/45 dark:bg-indigo-500/16" delay={2.1} />
        </div>

        <header className="fixed inset-x-0 top-4 z-50 px-4">
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mx-auto flex max-w-7xl items-center justify-between rounded-[28px] border px-4 py-3 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-2xl transition-all duration-300 ${
              scrolled
                ? "border-white/80 bg-white/90 dark:border-white/10 dark:bg-slate-950/82"
                : "border-white/70 bg-white/72 dark:border-white/10 dark:bg-slate-950/56"
            }`}
          >
            <Link to="/" className="flex items-center gap-3" aria-label="Jammu University home">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-cyan-500 text-sm font-black text-white shadow-lg shadow-blue-600/25">
                JU
              </div>
              <div className="leading-tight">
                <p className="text-sm font-black tracking-tight text-slate-950 dark:text-white">Jammu University</p>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700 dark:text-cyan-300">NAAC A+ Accredited</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 rounded-2xl border border-slate-200/80 bg-white/60 p-1 dark:border-white/10 dark:bg-white/5 lg:flex" aria-label="Primary">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                    location.pathname === link.to
                      ? "bg-blue-700 text-white shadow-lg shadow-blue-700/20"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              <button
                type="button"
                onClick={() => setDarkMode((current) => !current)}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/70 text-slate-700 transition hover:-translate-y-0.5 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              {accessToken ? (
                <>
                  <Link to={role === "admin" ? "/admin" : "/student"} className="rounded-2xl bg-blue-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800">
                    Dashboard
                  </Link>
                  <button onClick={logout} className="rounded-2xl border border-slate-200 bg-white/70 px-5 py-3 text-sm font-black text-slate-700 transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5 dark:text-white">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login/student" className="rounded-2xl border border-slate-200 bg-white/70 px-5 py-3 text-sm font-black text-slate-700 transition hover:-translate-y-0.5 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-white">
                    Student Login
                  </Link>
                  <Link to="/admissions" className="rounded-2xl bg-blue-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800">
                    Admissions
                  </Link>
                </>
              )}
            </div>

            <button
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/70 text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white lg:hidden"
              onClick={() => setMobileMenuOpen((current) => !current)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </motion.div>

          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto mt-3 max-w-7xl rounded-[26px] border border-white/60 bg-white/90 p-4 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/90 lg:hidden"
            >
              <div className="grid gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`rounded-2xl px-4 py-3 text-sm font-bold ${
                      location.pathname === link.to
                        ? "bg-blue-700 text-white"
                        : "text-slate-700 hover:bg-blue-50 dark:text-slate-100 dark:hover:bg-white/10"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => setDarkMode((current) => !current)}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50 dark:text-slate-100 dark:hover:bg-white/10"
                >
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  {darkMode ? "Light mode" : "Dark mode"}
                </button>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link to="/login/student" className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-black text-slate-700 dark:border-white/10 dark:text-white">
                    Login
                  </Link>
                  <Link to="/admissions" className="rounded-2xl bg-blue-700 px-4 py-3 text-center text-sm font-black text-white">
                    Apply
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </header>

        <main className="relative z-10">
          <section id="about" onMouseMove={handleMouseMove} className="relative overflow-hidden px-4 pb-16 pt-32 md:pt-36 lg:pb-20">
            <div className="mx-auto grid max-w-7xl items-center gap-10 lg:min-h-[calc(100vh-9rem)] lg:grid-cols-[minmax(0,0.94fr)_minmax(320px,0.86fr)] xl:gap-14">
              <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-cyan-200">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  Official Digital University Portal
                </div>
                <h1 className="text-4xl font-black leading-[1.04] tracking-tight text-slate-950 dark:text-white sm:text-5xl md:text-6xl xl:text-7xl">
                  A smarter Jammu University for the next generation.
                </h1>
                <p className="mt-7 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 md:text-lg">
                  As a flagship university, Jammu deserves a digital campus with the same confidence as its classrooms: clear admissions, trusted records, research visibility, placements and student services in one refined experience.
                </p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link to="/admissions" className="group inline-flex items-center justify-center gap-2 rounded-[20px] bg-blue-700 px-7 py-4 text-sm font-black text-white shadow-[0_22px_60px_rgba(37,99,235,0.28)] transition hover:-translate-y-1 hover:bg-blue-800">
                    Start Application
                    <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                  <Link to="/login/student" className="inline-flex items-center justify-center gap-2 rounded-[20px] border border-slate-200 bg-white/75 px-7 py-4 text-sm font-black text-slate-800 shadow-lg shadow-slate-900/5 backdrop-blur transition hover:-translate-y-1 hover:text-blue-700 dark:border-white/10 dark:bg-white/10 dark:text-white">
                    Enter Student Portal
                  </Link>
                </div>

                <div className="mt-9 grid grid-cols-2 gap-3 md:grid-cols-4">
                  <Stat value={15000} suffix="+" label="Students" icon={GraduationCap} compact to="/admissions" />
                  <Stat value={850} suffix="+" label="Faculty" icon={Users} compact to="/login/faculty" />
                  <Stat value={42} suffix="+" label="Departments" icon={Building2} compact to="/departments" />
                  <Stat value={1} suffix=" A+" label="NAAC" icon={Award} compact to="/about" />
                </div>
              </motion.div>

              <motion.div style={{ y: heroImageY }} className="relative mx-auto w-full max-w-lg lg:max-w-xl">
                <motion.div style={{ x: orbX, y: orbY }} className="absolute -inset-4 rounded-[44px] bg-gradient-to-br from-blue-500/18 via-cyan-300/22 to-white blur-2xl dark:from-blue-500/30 dark:to-cyan-500/20" />
                <div className="relative overflow-hidden rounded-[32px] border border-white/80 bg-white/78 p-2.5 shadow-[0_30px_90px_rgba(15,23,42,0.20)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/60 md:rounded-[40px] md:p-3">
                  <img src={juMainLawn} alt="Main campus lawns and academic buildings at the University of Jammu" className="h-[340px] w-full rounded-[24px] object-cover sm:h-[420px] md:rounded-[32px] lg:h-[460px]" />
                  <div className="absolute inset-3 rounded-[32px] bg-gradient-to-tr from-blue-950/30 via-transparent to-white/10" />
                  <div className="absolute inset-x-5 bottom-5 rounded-[24px] border border-white/45 bg-white/86 p-4 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/78 sm:inset-x-6 sm:bottom-6 sm:p-5 md:rounded-[28px]">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-700 text-white sm:h-12 sm:w-12">
                        <Landmark className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-slate-950 dark:text-white">Flagship Mountain Campus</p>
                        <p className="text-xs leading-5 text-slate-600 dark:text-slate-300 sm:text-sm">A premium digital front door for Jammu University.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          <section id="stats" className="px-4 py-12">
            <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-5">
              <Stat value={15000} suffix="+" label="Active learners" icon={GraduationCap} to="/admissions" />
              <Stat value={850} suffix="+" label="Faculty mentors" icon={Users} to="/login/faculty" />
              <Stat value={300} suffix="+" label="Placement drives" icon={BriefcaseBusiness} to="/placements" />
              <Stat value={42} suffix="+" label="Departments" icon={Building2} to="/departments" />
              <Stat value={1} suffix=" A+" label="NAAC accreditation" icon={Award} to="/about" />
            </div>
          </section>

          <section id="verify" className="px-4 py-16">
            <div className="mx-auto grid max-w-7xl gap-8 rounded-[36px] border border-white/70 bg-white/78 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/55 lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
              <div>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-700 text-white">
                  <Search className="h-6 w-6" aria-hidden="true" />
                </div>
                <h2 className="text-3xl font-black text-slate-950 dark:text-white">Verify a student record instantly.</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Enter a roll number to confirm whether a student profile exists in the university records.
                </p>
              </div>
              <form onSubmit={handleVerifyRoll} className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    value={searchRoll}
                    onChange={(e) => setSearchRoll(e.target.value)}
                    placeholder="Enter roll number, e.g. 22CS001"
                    className="min-h-[56px] flex-1 rounded-[20px] border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-slate-900 dark:text-white"
                  />
                  <button type="submit" disabled={searchBusy} className="min-h-[56px] rounded-[20px] bg-blue-700 px-7 text-sm font-black text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800 disabled:opacity-60">
                    {searchBusy ? "Checking..." : "Verify"}
                  </button>
                </div>
                {searchError && <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700 dark:border-red-500/30 dark:bg-red-950/30 dark:text-red-200">{searchError}</p>}
                {searchResult && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-3 rounded-[24px] border border-emerald-200 bg-emerald-50/80 p-5 text-sm dark:border-emerald-500/30 dark:bg-emerald-950/30">
                    <div className="flex items-center gap-2 font-black text-emerald-700 dark:text-emerald-200">
                      <BadgeCheck className="h-5 w-5" /> Record found
                    </div>
                    <div className="grid gap-2 text-slate-700 dark:text-slate-200 sm:grid-cols-4">
                      <span><strong>Roll:</strong> {searchResult.rollNumber}</span>
                      <span><strong>Name:</strong> {searchResult.name}</span>
                      <span><strong>Branch:</strong> {searchResult.branch}</span>
                      <span><strong>Semester:</strong> {searchResult.semester}</span>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
          </section>

          <section id="services" className="px-4 py-20">
            <SectionHeading eyebrow="Academic Ecosystem" title="Premium services designed around every university journey.">
              From admissions to placements, each module feels fast, secure and thoughtfully connected.
            </SectionHeading>
            <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service, index) => (
                <ServiceCard key={service.title} item={service} index={index} />
              ))}
            </div>
          </section>

          <section id="announcements" className="px-4 py-20">
            <SectionHeading eyebrow="Latest Announcements" title="Important updates without the clutter.">
              A polished notice experience connected to the university backend.
            </SectionHeading>
            <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
              {(visibleNotices.length ? visibleNotices : [
                { _id: "default-1", title: "Admissions window open", body: "Program applications, eligibility checks and student registration are now available.", createdAt: new Date().toISOString() },
                { _id: "default-2", title: "Examination services live", body: "Students can access results, attendance and assignment services through the portal.", createdAt: new Date().toISOString() },
                { _id: "default-3", title: "Placement preparation", body: "Career readiness sessions and placement partner activities continue this semester.", createdAt: new Date().toISOString() }
              ]).map((notice, index) => (
                <motion.div
                  key={notice._id}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Link to="/academics" className="block h-full rounded-[28px] border border-white/60 bg-white/80 p-6 shadow-[0_22px_70px_rgba(15,23,42,0.10)] backdrop-blur-2xl transition hover:-translate-y-1 hover:border-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:border-white/10 dark:bg-slate-950/55">
                    <div className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-blue-700 dark:text-cyan-300">
                      <CalendarDays className="h-4 w-4" />
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </div>
                    <h3 className="text-xl font-black text-slate-950 dark:text-white">{notice.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{notice.body}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          <section id="gallery" className="px-4 py-20">
            <SectionHeading eyebrow="Campus Gallery" title="A modern campus framed for ambition.">
              Academic spaces, research culture and student life presented with visual depth.
            </SectionHeading>
            <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-4">
              {gallery.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className={`${index === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
                >
                  <Link to="/campus-life" className="group relative block min-h-72 overflow-hidden rounded-[32px] border border-white/60 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.16)] focus:outline-none focus:ring-4 focus:ring-blue-200">
                    <img src={item.image} alt={item.alt} style={{ objectPosition: item.position }} className="h-72 w-full object-cover transition duration-700 group-hover:scale-110 md:h-full" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/5 to-transparent" />
                    <span className="absolute bottom-5 left-5 text-lg font-black text-white">{item.title}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          <section id="placements" className="px-4 py-20">
            <div className="mx-auto max-w-7xl overflow-hidden rounded-[40px] bg-[radial-gradient(circle_at_20%_0%,rgba(59,130,246,0.45),transparent_24rem),linear-gradient(135deg,#020617,#0f172a_54%,#082f49)] p-8 shadow-[0_30px_100px_rgba(15,23,42,0.24)] md:p-12">
              <SectionHeading eyebrow="Career Outcomes" title="Placement partnerships that open real doors." dark>
                Training, internships and industry relationships help students move from campus to careers.
              </SectionHeading>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {partners.map((partner) => (
                  <motion.div
                    key={partner}
                    whileHover={{ y: -6, scale: 1.02 }}
                  >
                    <Link to="/placements" className="flex h-24 items-center justify-center rounded-[24px] border border-white/10 bg-white/[0.06] text-xl font-black tracking-tight text-white shadow-xl transition hover:bg-white/[0.12] focus:outline-none focus:ring-4 focus:ring-cyan-300/30">
                      {partner}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section className="px-4 py-20">
            <SectionHeading eyebrow="Student Voices" title="A university experience people can feel.">
              Real stories, smooth transitions and a more human portal experience.
            </SectionHeading>
            <div className="mx-auto max-w-4xl rounded-[36px] border border-white/70 bg-white/80 p-8 shadow-[0_28px_90px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/55">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45 }}
                className="text-center"
              >
                <div className="mb-6 flex justify-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="text-2xl font-black leading-10 text-slate-950 dark:text-white">"{testimonials[testimonialIndex].quote}"</p>
                <p className="mt-6 font-black text-blue-700 dark:text-cyan-300">{testimonials[testimonialIndex].name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{testimonials[testimonialIndex].program}</p>
              </motion.div>
              <div className="mt-8 flex items-center justify-center gap-3">
                <button onClick={() => setTestimonialIndex((testimonialIndex + testimonials.length - 1) % testimonials.length)} className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-white" aria-label="Previous testimonial">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button onClick={() => setTestimonialIndex((testimonialIndex + 1) % testimonials.length)} className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-white" aria-label="Next testimonial">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </section>

          <section id="feedback" className="px-4 py-20">
            <div className="mx-auto grid max-w-7xl gap-8 rounded-[40px] border border-white/70 bg-white/82 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/55 lg:grid-cols-[0.85fr_1.15fr] lg:p-8">
              <div>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-700 text-white">
                  <Mail className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-black text-slate-950 dark:text-white">Help improve the portal.</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Feedback is sent directly through the existing backend endpoint.
                </p>
              </div>

              {feedbackSuccess ? (
                <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-500/30 dark:bg-emerald-950/30">
                  <BadgeCheck className="mx-auto h-12 w-12 text-emerald-600" />
                  <h3 className="mt-4 text-xl font-black text-slate-950 dark:text-white">Thank you for the feedback.</h3>
                  <button onClick={() => setFeedbackSuccess(false)} className="mt-6 text-sm font-black text-blue-700 dark:text-cyan-300">
                    Submit another response
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackForm((prev) => ({ ...prev, rating: star }))}
                        onMouseEnter={() => setFeedbackHover(star)}
                        onMouseLeave={() => setFeedbackHover(0)}
                        className="text-amber-400 transition hover:scale-110"
                        aria-label={`Rate ${star} out of 5`}
                      >
                        <Star className={`h-7 w-7 ${star <= (feedbackHover || feedbackForm.rating) ? "fill-current" : ""}`} />
                      </button>
                    ))}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input value={feedbackForm.name} onChange={(e) => setFeedbackForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Name" className="min-h-[52px] rounded-[18px] border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 dark:border-white/10 dark:bg-slate-900 dark:text-white" />
                    <input type="email" value={feedbackForm.email} onChange={(e) => setFeedbackForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="Email" className="min-h-[52px] rounded-[18px] border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 dark:border-white/10 dark:bg-slate-900 dark:text-white" />
                  </div>
                  <textarea required rows={4} value={feedbackForm.message} onChange={(e) => setFeedbackForm((prev) => ({ ...prev, message: e.target.value }))} placeholder="Tell us what can be improved..." className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-900 dark:border-white/10 dark:bg-slate-900 dark:text-white" />
                  {feedbackError && <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700 dark:border-red-500/30 dark:bg-red-950/30 dark:text-red-200">{feedbackError}</p>}
                  <button disabled={feedbackBusy} className="w-full rounded-[20px] bg-blue-700 px-7 py-4 text-sm font-black text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800 disabled:opacity-60">
                    {feedbackBusy ? "Submitting..." : "Submit Feedback"}
                  </button>
                </form>
              )}
            </div>
          </section>
        </main>

        <footer id="contact" className="relative z-10 mt-10 bg-slate-950 px-4 py-16 text-white">
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.25fr_0.75fr_0.75fr_1fr]">
            <div>
              <Link to="/" className="mb-5 flex items-center gap-3" aria-label="Jammu University home">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 text-sm font-black">JU</div>
                <div>
                  <p className="font-black">Jammu University</p>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">NAAC A+ Accredited</p>
                </div>
              </Link>
              <p className="max-w-sm text-sm leading-7 text-slate-300">
                A premium digital gateway for learning, research, academic records and university services.
              </p>
              <div className="mt-6 flex gap-3">
                <a href="mailto:coe@jammuuniversity.ac.in" aria-label="Email university" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition hover:bg-white/10">
                  <Mail className="h-5 w-5" />
                </a>
                <a href="tel:+911912435243" aria-label="Call university" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition hover:bg-white/10">
                  <Phone className="h-5 w-5" />
                </a>
                <a href="https://maps.google.com/?q=University%20of%20Jammu" target="_blank" rel="noreferrer" aria-label="Open university location" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition hover:bg-white/10">
                  <MapPin className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-black">Portals</h3>
              <div className="grid gap-3 text-sm text-slate-300">
                <Link to="/login/student">Student Login</Link>
                <Link to="/signup/student">Student Registration</Link>
                <Link to="/login/admin">Admin Portal</Link>
                <Link to="/results">Results</Link>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-black">University</h3>
              <div className="grid gap-3 text-sm text-slate-300">
                <Link to="/academics">Academics</Link>
                <Link to="/about">About University</Link>
                <Link to="/placements">Placements</Link>
                <Link to="/campus-life">Campus Gallery</Link>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-black">Contact</h3>
              <div className="grid gap-3 text-sm text-slate-300">
                <a href="tel:+911912435243" className="flex gap-2"><Phone className="h-4 w-4 text-cyan-300" /> +91 191 243 5243</a>
                <a href="mailto:coe@jammuuniversity.ac.in" className="flex gap-2"><Mail className="h-4 w-4 text-cyan-300" /> coe@jammuuniversity.ac.in</a>
                <a href="https://maps.google.com/?q=University%20of%20Jammu" target="_blank" rel="noreferrer" className="flex gap-2"><MapPin className="h-4 w-4 text-cyan-300" /> Baba Saheb Ambedkar Rd, Jammu</a>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-12 flex max-w-7xl flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-400 md:flex-row">
            <span>Copyright {new Date().getFullYear()} University of Jammu. All rights reserved.</span>
            <span>Designed for academic excellence and modern governance.</span>
          </div>
          <p className="mx-auto mt-4 max-w-7xl text-xs font-semibold text-slate-500">
            Designed and developed by Kanav Arora.
          </p>
        </footer>
      </div>
    </div>
  );
}
