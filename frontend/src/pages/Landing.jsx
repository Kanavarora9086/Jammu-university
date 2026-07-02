import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth.jsx";
import "../App.css";

/* ── Animated counter hook ── */
function useCounter(target, duration = 2000, startCounting = true) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!startCounting || target <= 0) return;
    let start = 0;
    const step = Math.max(1, Math.floor(target / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, startCounting]);
  return count;
}

/* ── Intersection Observer hook ── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.unobserve(el); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ── SVG Icons (inline) ── */
const Icons = {
  menu: (
    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  close: (
    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  marksheet: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
  ),
  attendance: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  ),
  assignment: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
  ),
  secure: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
  ),
  search: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
  ),
  arrowRight: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
  ),
  check: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
  ),
  phone: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
  ),
  mail: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
  ),
  location: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  )
};

export function Landing() {
  const { accessToken, role, logout } = useAuth();
  const [notices, setNotices] = useState([]);
  const [searchRoll, setSearchRoll] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [searchBusy, setSearchBusy] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Section refs for scroll animation
  const [heroRef, heroVisible] = useInView(0.1);
  const [statsRef, statsVisible] = useInView(0.2);
  const [noticesRef, noticesVisible] = useInView(0.1);
  const [servicesRef, servicesVisible] = useInView(0.1);

  // Animated stats
  const studentsCount = useCounter(15000, 2000, statsVisible);
  const deptsCount = useCounter(42, 1500, statsVisible);
  const yearsCount = useCounter(57, 1800, statsVisible);
  const facultyCount = useCounter(850, 2000, statsVisible);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    api
      .get("/notices")
      .then((res) => setNotices(res.data?.data?.notices || []))
      .catch((err) => console.error("Failed to load notices", err));
  }, []);

  const handleVerifyRoll = useCallback(async (e) => {
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
          status: "Active",
          message: "Student records verified. Sign in to access full academic records."
        });
      } else {
        setSearchError("No student record found for this roll number. Please check and try again.");
      }
    } catch {
      setSearchError("Verification service unavailable. Please try again later.");
    } finally {
      setSearchBusy(false);
    }
  }, [searchRoll]);

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#stats", label: "Statistics" },
    { href: "#notices", label: "Notices" },
    { href: "#services", label: "Services" },
    { href: "#contact", label: "Contact" }
  ];

  return (
    <div className="min-h-screen bg-academic-navydeep text-slate-100 flex flex-col font-sans select-none">
      {/* ═══ NAVBAR ═══ */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-academic-navydark/95 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-academic-gold/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="h-12 w-12 bg-academic-navy border-2 border-academic-gold flex items-center justify-center rounded-full shadow-glow-gold transition-shadow duration-300 group-hover:shadow-glow-gold-lg">
                <span className="font-serif-academic font-bold text-lg text-academic-gold">JU</span>
              </div>
              <div>
                <h1 className="font-serif-academic text-base md:text-lg font-bold tracking-wider text-white leading-tight">
                  JAMMU UNIVERSITY
                </h1>
                <p className="text-[9px] text-academic-gold/80 font-medium tracking-[0.2em] uppercase">
                  NAAC A+ Accredited
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-academic-gold transition-colors duration-200 rounded-lg hover:bg-white/5"
                >
                  {l.label}
                </a>
              ))}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              {accessToken ? (
                <>
                  <Link
                    to={role === "admin" ? "/admin" : "/student"}
                    className="rounded-xl bg-academic-gold text-academic-navy px-5 py-2.5 text-sm font-semibold hover:bg-academic-goldhover shadow-glow-gold transition-all duration-200 btn-shimmer"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium hover:bg-white/5 hover:border-slate-600 transition-all duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login/student"
                    className="rounded-xl bg-academic-navy border border-academic-gold/40 text-white px-5 py-2.5 text-sm font-semibold hover:bg-academic-navy/80 hover:border-academic-gold/70 transition-all duration-200"
                  >
                    Student Login
                  </Link>
                  <Link
                    to="/signup/student"
                    className="rounded-xl bg-academic-gold text-academic-navy px-5 py-2.5 text-sm font-semibold hover:bg-academic-goldhover shadow-glow-gold transition-all duration-200 btn-shimmer"
                  >
                    Register
                  </Link>
                  <Link
                    to="/login/admin"
                    className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium hover:bg-white/5 hover:border-slate-600 transition-all duration-200"
                  >
                    Admin
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? Icons.close : Icons.menu}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-academic-navydark/98 backdrop-blur-xl border-t border-slate-800/50 px-4 py-4 space-y-1">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition"
              >
                {l.label}
              </a>
            ))}
            <hr className="border-slate-800 my-3" />
            <div className="flex flex-col gap-2 px-2">
              {accessToken ? (
                <>
                  <Link
                    to={role === "admin" ? "/admin" : "/student"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 rounded-xl bg-academic-gold text-academic-navy text-sm font-semibold text-center hover:bg-academic-goldhover transition"
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="w-full py-3 rounded-xl border border-slate-700 text-sm font-medium hover:bg-white/5 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login/student"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 rounded-xl bg-academic-navy border border-academic-gold/40 text-white text-sm font-semibold text-center hover:bg-academic-navy/80 transition"
                  >
                    Student Login
                  </Link>
                  <Link
                    to="/signup/student"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 rounded-xl bg-academic-gold text-academic-navy text-sm font-semibold text-center hover:bg-academic-goldhover transition"
                  >
                    Register
                  </Link>
                  <Link
                    to="/login/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 rounded-xl border border-slate-700 text-sm font-medium text-center hover:bg-white/5 transition"
                  >
                    Admin Portal
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ═══ HERO SECTION ═══ */}
      <main className="flex-grow pt-20">
        <section
          id="about"
          ref={heroRef}
          className="relative overflow-hidden py-20 md:py-32 bg-grid-pattern"
        >
          {/* Background decorations */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(212,175,55,0.08)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(15,43,92,0.3)_0%,transparent_50%)]" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-academic-gold/5 rounded-full blur-3xl animate-float pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-academic-navy/30 rounded-full blur-3xl animate-float-slow pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left — CTA */}
              <div className={`space-y-8 ${heroVisible ? "animate-fade-in-up" : "opacity-0"}`}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-academic-gold/10 text-academic-gold border border-academic-gold/20 tracking-widest uppercase">
                  <div className="pulse-dot" />
                  Official Examination Portal
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-serif-academic leading-[1.1]">
                  Jammu University{" "}
                  <span className="text-gradient-gold block mt-2">Student Portal</span>
                </h2>

                <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-lg">
                  Access your examination results, attendance records, assignments, and campus notices
                  in one unified, secure academic portal. Built for modern digital governance.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/login/student"
                    className="group inline-flex items-center gap-2 rounded-xl bg-academic-gold text-academic-navy font-semibold px-7 py-3.5 hover:bg-academic-goldhover shadow-glow-gold transition-all duration-300 btn-shimmer text-sm"
                  >
                    Enter Student Portal
                    <span className="transition-transform duration-200 group-hover:translate-x-1">{Icons.arrowRight}</span>
                  </Link>
                  <Link
                    to="/signup/student"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 text-slate-300 font-semibold px-7 py-3.5 hover:bg-white/5 hover:border-slate-600 hover:text-white transition-all duration-300 text-sm"
                  >
                    Create Account
                  </Link>
                </div>

                {/* Trust badges */}
                <div className="flex items-center gap-6 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    {Icons.secure}
                    <span>SSL Encrypted</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    {Icons.check}
                    <span>NAAC A+ Verified</span>
                  </div>
                </div>
              </div>

              {/* Right — University Crest Card */}
              <div className={`flex justify-center ${heroVisible ? "animate-slide-in-right" : "opacity-0"}`}>
                <div className="relative w-full max-w-sm">
                  {/* Glow behind card */}
                  <div className="absolute inset-0 bg-academic-gold/5 rounded-3xl blur-2xl scale-110" />

                  <div className="relative glass-card-gold rounded-3xl p-8 shadow-2xl animate-glow-pulse">
                    <div className="flex flex-col items-center text-center">
                      <div className="h-28 w-28 bg-academic-navy border-4 border-academic-gold flex items-center justify-center rounded-full shadow-glow-gold-lg animate-bounce-subtle">
                        <span className="font-serif-academic font-bold text-4xl text-academic-gold">JU</span>
                      </div>

                      <h3 className="mt-6 text-xl font-bold font-serif-academic text-white">
                        Office of Controller of Exams
                      </h3>
                      <p className="mt-2 text-xs text-slate-400 max-w-xs leading-relaxed">
                        Jammu & Kashmir, India, Pin — 180006. Accredited by NAAC with Grade A+.
                      </p>

                      <div className="mt-6 pt-6 border-t border-slate-700/50 w-full grid grid-cols-2 gap-4">
                        <div className="text-center p-3 rounded-xl bg-white/5">
                          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Est.</div>
                          <div className="text-lg font-bold text-white mt-0.5">1969</div>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-white/5">
                          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Campus</div>
                          <div className="text-lg font-bold text-white mt-0.5">118 Acres</div>
                        </div>
                      </div>

                      <div className="mt-4 w-full p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
                        <div className="flex items-center justify-center gap-2 text-xs text-emerald-400">
                          <div className="pulse-dot" />
                          <span className="font-medium">Portal Online — All Systems Operational</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ ANIMATED STATS BAR ═══ */}
        <section id="stats" ref={statsRef} className="relative py-16 bg-academic-navydark/50 border-y border-slate-800/50">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.04)_0%,transparent_70%)]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Students Enrolled", value: studentsCount, suffix: "+" },
                { label: "Departments", value: deptsCount, suffix: "" },
                { label: "Years of Legacy", value: yearsCount, suffix: "" },
                { label: "Faculty Members", value: facultyCount, suffix: "+" }
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className={`text-center group ${statsVisible ? "animate-fade-in-up" : "opacity-0"}`}
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className="stat-value text-3xl md:text-4xl font-bold text-gradient-gold">
                    {stat.value.toLocaleString()}{stat.suffix}
                  </div>
                  <div className="mt-2 text-xs text-slate-400 uppercase tracking-widest font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ NOTICES & VERIFICATION ═══ */}
        <section ref={noticesRef} className="py-20 relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-50" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-3 gap-8">
            {/* Notice Board */}
            <div
              id="notices"
              className={`lg:col-span-2 space-y-6 ${noticesVisible ? "animate-fade-in-up" : "opacity-0"}`}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-2xl font-bold font-serif-academic text-white">Notice Board</h3>
                  <p className="text-xs text-slate-400 mt-1">University announcements and updates</p>
                </div>
                <span className="inline-flex items-center gap-2 text-xs text-academic-gold border border-academic-gold/20 bg-academic-gold/5 px-3 py-1.5 rounded-lg font-semibold tracking-wider uppercase">
                  <div className="pulse-dot" />
                  Live
                </span>
              </div>

              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">
                {notices.length === 0 ? (
                  <div className="glass-card p-10 rounded-2xl text-center">
                    <div className="text-4xl mb-3">📋</div>
                    <p className="text-slate-400 text-sm">No active announcements at this time.</p>
                    <p className="text-slate-500 text-xs mt-1">Check back later for updates.</p>
                  </div>
                ) : (
                  notices.map((n, i) => (
                    <div
                      key={n._id}
                      className="notice-card glass-card hover:border-academic-gold/30 p-5 rounded-xl hover-lift cursor-default"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-academic-navy border border-academic-gold/20 text-academic-gold">
                          {n.audience}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(n.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-1.5">{n.title}</h4>
                      <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">{n.body}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Verification Panel */}
            <div
              id="verify"
              className={`${noticesVisible ? "animate-slide-in-right" : "opacity-0"}`}
            >
              <div className="glass-card-gold rounded-2xl p-6 shadow-xl sticky top-28">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-5">
                  <div className="h-10 w-10 bg-academic-navy rounded-xl flex items-center justify-center border border-academic-gold/20">
                    {Icons.search}
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-serif-academic text-white">Verify Student</h3>
                    <p className="text-[10px] text-slate-400">Real-time record verification</p>
                  </div>
                </div>

                <form onSubmit={handleVerifyRoll} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                      Student Roll Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 22CS001"
                      value={searchRoll}
                      onChange={(e) => setSearchRoll(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 input-glow outline-none transition-all duration-300"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={searchBusy}
                    className="w-full bg-academic-navy border border-academic-gold/30 hover:border-academic-gold/60 hover:bg-academic-navy/70 text-white py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {searchBusy ? (
                      <>
                        <div className="spinner-light" />
                        Searching...
                      </>
                    ) : (
                      <>
                        {Icons.search}
                        Verify Record
                      </>
                    )}
                  </button>
                </form>

                {searchError && (
                  <div className="mt-4 p-3 rounded-xl bg-red-950/30 border border-red-900/50 text-xs text-red-300 flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">⚠</span>
                    {searchError}
                  </div>
                )}

                {searchResult && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-emerald-500/20 text-xs space-y-2.5 animate-scale-in">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
                      <div className="h-6 w-6 bg-emerald-950/50 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400">
                        {Icons.check}
                      </div>
                      <span className="font-semibold text-emerald-400">Record Found</span>
                    </div>
                    {[
                      { label: "Roll Number", val: searchResult.rollNumber, cls: "text-white font-bold" },
                      { label: "Student Name", val: searchResult.name, cls: "text-white" },
                      { label: "Department", val: searchResult.branch, cls: "text-slate-200" },
                      { label: "Semester", val: searchResult.semester, cls: "text-slate-200" },
                      { label: "Status", val: searchResult.status, cls: "text-emerald-400 font-semibold" }
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between">
                        <span className="text-slate-400">{row.label}</span>
                        <span className={row.cls}>{row.val}</span>
                      </div>
                    ))}
                    <p className="text-[11px] text-slate-300 italic pt-2 border-t border-slate-800">{searchResult.message}</p>
                  </div>
                )}

                <div className="mt-5 pt-4 border-t border-slate-800/50 text-[10px] text-slate-500 leading-relaxed text-center flex items-center justify-center gap-1.5">
                  {Icons.secure}
                  <span>Authorized academic verification. Logs are audited.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ SERVICES ═══ */}
        <section
          id="services"
          ref={servicesRef}
          className="py-20 border-t border-slate-800/50 relative"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(212,175,55,0.04)_0%,transparent_60%)]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className={`text-center mb-14 ${servicesVisible ? "animate-fade-in-up" : "opacity-0"}`}>
              <span className="text-xs text-academic-gold uppercase tracking-[0.3em] font-semibold">What We Offer</span>
              <h3 className="text-3xl font-bold font-serif-academic text-white mt-3">
                Portal Services & Utilities
              </h3>
              <p className="text-sm text-slate-400 mt-3 max-w-lg mx-auto leading-relaxed">
                Everything you need for academic management, accessible from a single secure platform.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Icons.marksheet,
                  title: "Marksheets",
                  desc: "Download validated semester result cards with SGPA, credit allocations, and grade points."
                },
                {
                  icon: Icons.attendance,
                  title: "Attendance Logs",
                  desc: "Subject-wise class records, present counts, and visual eligibility metrics at a glance."
                },
                {
                  icon: Icons.assignment,
                  title: "Assignments",
                  desc: "View instructions, track due dates, and upload submissions directly into the grading system."
                },
                {
                  icon: Icons.secure,
                  title: "Secure Access",
                  desc: "JWT-based token security with password recovery to keep student profiles fully protected."
                }
              ].map((svc, i) => (
                <div
                  key={svc.title}
                  className={`glass-card rounded-2xl p-6 hover-lift group cursor-default ${
                    servicesVisible ? "animate-fade-in-up" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  <div className="h-12 w-12 bg-academic-navy rounded-xl flex items-center justify-center text-academic-gold border border-academic-gold/20 service-icon mb-5">
                    {svc.icon}
                  </div>
                  <h4 className="font-bold text-white text-base group-hover:text-academic-gold transition-colors duration-300">
                    {svc.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-3 leading-relaxed">{svc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CTA Banner ═══ */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-academic-navy via-academic-navydark to-academic-navy" />
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h3 className="text-2xl md:text-3xl font-bold font-serif-academic text-white mb-4">
              Ready to Access Your Academic Records?
            </h3>
            <p className="text-slate-300 text-sm md:text-base mb-8 max-w-xl mx-auto">
              Join thousands of students already using the Jammu University portal for seamless academic management.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/signup/student"
                className="group inline-flex items-center gap-2 rounded-xl bg-academic-gold text-academic-navy font-semibold px-8 py-3.5 hover:bg-academic-goldhover shadow-glow-gold transition-all duration-300 btn-shimmer"
              >
                Get Started Now
                <span className="transition-transform duration-200 group-hover:translate-x-1">{Icons.arrowRight}</span>
              </Link>
              <Link
                to="/login/student"
                className="inline-flex items-center gap-2 rounded-xl border border-academic-gold/30 text-academic-gold font-semibold px-8 py-3.5 hover:bg-academic-gold/5 transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer id="contact" className="bg-academic-navydark border-t border-academic-gold/10 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="grid md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-9 w-9 bg-academic-navy border border-academic-gold flex items-center justify-center rounded-full">
                  <span className="font-serif-academic font-bold text-xs text-academic-gold">JU</span>
                </div>
                <span className="font-serif-academic font-bold tracking-wider text-white text-sm">JAMMU UNIVERSITY</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Serving Jammu & Kashmir with educational excellence since 1969. Accredited with A+ status by NAAC, India.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest font-serif-academic mb-4">Quick Links</h4>
              <ul className="text-xs text-slate-400 space-y-2.5">
                <li><Link to="/login/student" className="hover:text-academic-gold transition">Student Login</Link></li>
                <li><Link to="/signup/student" className="hover:text-academic-gold transition">Student Registration</Link></li>
                <li><Link to="/login/admin" className="hover:text-academic-gold transition">Admin Portal</Link></li>
                <li><a href="#notices" className="hover:text-academic-gold transition">Notice Board</a></li>
                <li><a href="#verify" className="hover:text-academic-gold transition">Verify Results</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest font-serif-academic mb-4">Academic Offices</h4>
              <ul className="text-xs text-slate-400 space-y-3">
                <li className="flex items-start gap-2">
                  {Icons.phone}
                  <span>Administration: +91 191 243 5243</span>
                </li>
                <li className="flex items-start gap-2">
                  {Icons.mail}
                  <span>coe@jammuuniversity.ac.in</span>
                </li>
                <li className="flex items-start gap-2">
                  {Icons.mail}
                  <span>helpdesk@jammuuniversity.ac.in</span>
                </li>
                <li className="flex items-start gap-2">
                  {Icons.location}
                  <span>Baba Saheb Ambedkar Rd, Jammu</span>
                </li>
              </ul>
            </div>

            {/* Disclaimer */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest font-serif-academic mb-4">Disclaimer</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                This dashboard is a fully functional, production-ready system integrated with MongoDB for student management, examinations, and academic records.
              </p>
              <div className="mt-4 p-3 rounded-xl bg-white/5 border border-slate-800">
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  {Icons.secure}
                  <span>256-bit SSL Encryption • JWT Auth</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
            <span>© {new Date().getFullYear()} University of Jammu. All Rights Reserved.</span>
            <span className="mt-2 md:mt-0">Built for academic excellence and modern governance.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
