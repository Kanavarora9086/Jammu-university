import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Download,
  FileSearch,
  FlaskConical,
  GraduationCap,
  Landmark,
  LibraryBig,
  Mail,
  MapPin,
  Microscope,
  Phone,
  Receipt,
  Search,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";
import juFoundationDay from "../assets/ju-foundation-day.jpg";
import juLibrary from "../assets/ju-campus-gallery-1.jpg";

const nav = [
  ["/about", "About"],
  ["/admissions", "Admissions"],
  ["/academics", "Academics"],
  ["/departments", "Departments"],
  ["/research", "Research"],
  ["/placements", "Placements"],
  ["/contact", "Contact"]
];

function Shell({ children, accent = "blue", dark = false }) {
  const { pathname } = useLocation();
  return (
    <main className={`${dark ? "bg-slate-950 text-white" : "bg-[#f8fbff] text-slate-950"} min-h-screen overflow-hidden`}>
      <div className={`fixed inset-0 -z-0 ${dark ? "bg-[radial-gradient(circle_at_20%_8%,rgba(37,99,235,0.28),transparent_30rem),radial-gradient(circle_at_88%_14%,rgba(6,182,212,0.18),transparent_28rem)]" : "bg-[radial-gradient(circle_at_18%_8%,rgba(147,197,253,0.45),transparent_28rem),radial-gradient(circle_at_86%_18%,rgba(125,211,252,0.35),transparent_30rem),linear-gradient(135deg,#f8fbff_0%,#eff6ff_45%,#ffffff_100%)]"}`} />
      <div className="relative z-10 px-4 py-8">
        <nav className={`mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 rounded-[24px] border px-4 py-3 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-2xl md:rounded-[28px] ${dark ? "border-white/10 bg-white/[0.08]" : "border-white/70 bg-white/86"}`}>
          <Link to="/" className="flex items-center gap-3" aria-label="Jammu University home">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accentClass(accent)} text-sm font-black text-white`}>JU</div>
            <div>
              <p className="text-sm font-black">Jammu University</p>
              <p className={`text-[11px] font-bold uppercase tracking-[0.16em] ${dark ? "text-cyan-200" : "text-blue-700"}`}>Official Portal</p>
            </div>
          </Link>
          <div className="hidden items-center gap-1 lg:flex">
            {nav.map(([to, label]) => (
              <Link key={to} to={to} className={`rounded-xl px-3 py-2 text-sm font-black transition ${pathname === to ? "bg-blue-700 text-white" : dark ? "text-slate-200 hover:bg-white/10" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"}`}>
                {label}
              </Link>
            ))}
          </div>
          <Link to="/login/student" className={`w-full rounded-2xl px-4 py-3 text-center text-sm font-black shadow-lg transition hover:-translate-y-0.5 sm:w-auto ${dark ? "bg-white text-slate-950" : "bg-blue-700 text-white shadow-blue-700/20"}`}>
            Portal Login
          </Link>
        </nav>
        {children}
        <footer className={`mx-auto mt-20 grid max-w-7xl gap-8 rounded-[36px] p-8 ${dark ? "border border-white/10 bg-white/5" : "border border-white/70 bg-white/80 shadow-[0_24px_80px_rgba(15,23,42,0.10)]"}`}>
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
            <Link to="/" className="block">
              <div className="mb-4 flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${accentClass(accent)} text-sm font-black text-white`}>JU</div>
                <div>
                  <p className="font-black">Jammu University</p>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">NAAC A+</p>
                </div>
              </div>
              <p className={`max-w-sm text-sm leading-7 ${dark ? "text-slate-300" : "text-slate-600"}`}>A production-ready digital gateway for academic services, research, placements and student success.</p>
            </Link>
            <FooterLinks title="Explore" links={[["/about", "About"], ["/academics", "Academics"], ["/campus-life", "Campus Life"]]} dark={dark} />
            <FooterLinks title="Services" links={[["/admissions", "Admissions"], ["/results", "Results"], ["/scholarships", "Scholarships"]]} dark={dark} />
            <div>
              <h3 className="mb-4 text-sm font-black">Contact</h3>
              <div className={`grid gap-3 text-sm ${dark ? "text-slate-300" : "text-slate-600"}`}>
                <a href="tel:+911912435243" className="flex gap-2"><Phone className="h-4 w-4 text-blue-500" /> +91 191 243 5243</a>
                <a href="mailto:coe@jammuuniversity.ac.in" className="flex gap-2"><Mail className="h-4 w-4 text-blue-500" /> coe@jammuuniversity.ac.in</a>
                <a href="https://maps.google.com/?q=University%20of%20Jammu" target="_blank" rel="noreferrer" className="flex gap-2"><MapPin className="h-4 w-4 text-blue-500" /> University of Jammu</a>
              </div>
            </div>
          </div>
          <p className={`border-t pt-5 text-xs font-semibold ${dark ? "border-white/10 text-slate-400" : "border-slate-200 text-slate-500"}`}>
            Designed and developed by Kanav Arora.
          </p>
        </footer>
      </div>
    </main>
  );
}

function FooterLinks({ title, links, dark }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-black">{title}</h3>
      <div className={`grid gap-3 text-sm ${dark ? "text-slate-300" : "text-slate-600"}`}>
        {links.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}
      </div>
    </div>
  );
}

function accentClass(accent) {
  return {
    emerald: "from-emerald-600 to-cyan-500",
    violet: "from-violet-700 to-blue-500",
    amber: "from-amber-500 to-blue-700",
    rose: "from-rose-500 to-blue-700",
    slate: "from-slate-800 to-blue-700"
  }[accent] || "from-blue-700 to-cyan-500";
}

function Eyebrow({ children, dark = false }) {
  return <div className={`mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.18em] ${dark ? "border-white/15 bg-white/10 text-cyan-100" : "border-blue-200 bg-white/80 text-blue-700"}`}><Sparkles className="h-4 w-4" />{children}</div>;
}

function Reveal({ children, delay = 0, className = "" }) {
  return <motion.div initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5, delay }} className={className}>{children}</motion.div>;
}

function PillCard({ icon: Icon, title, text, to = "/about", dark = false }) {
  return (
    <Link to={to} className={`group block rounded-[28px] border p-6 shadow-[0_22px_70px_rgba(15,23,42,0.10)] transition hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-blue-200 ${dark ? "border-white/10 bg-white/8" : "border-white/70 bg-white/82"}`}>
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 p-3 text-white shadow-lg shadow-blue-700/20"><Icon className="h-6 w-6" /></div>
      <h3 className="text-xl font-black">{title}</h3>
      <p className={`mt-3 text-sm leading-7 ${dark ? "text-slate-300" : "text-slate-600"}`}>{text}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-blue-600">Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
    </Link>
  );
}

function Admissions() {
  return (
    <Shell accent="emerald">
      <section className="mx-auto grid max-w-7xl items-center gap-10 py-20 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div initial={{ opacity: 0, x: -32 }} animate={{ opacity: 1, x: 0 }}>
          <Eyebrow>Admissions 2026</Eyebrow>
          <h1 className="text-4xl font-black leading-[1.04] tracking-tight sm:text-5xl md:text-6xl">A clear path from applicant to enrolled student.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">Admission planning, eligibility, fee visibility and application steps in one premium admissions desk.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/signup/student" className="rounded-[20px] bg-emerald-600 px-7 py-4 text-sm font-black text-white shadow-lg shadow-emerald-600/20">Apply now</Link>
            <Link to="/scholarships" className="rounded-[20px] border border-slate-200 bg-white px-7 py-4 text-sm font-black text-slate-800">Scholarships</Link>
          </div>
        </motion.div>
        <Reveal className="rounded-[40px] border border-white/70 bg-white/82 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.14)]">
          {["Register online", "Upload documents", "Merit verification", "Fee confirmation"].map((step, i) => (
            <Link to={i === 3 ? "/signup/student" : "/admissions"} key={step} className="mb-4 flex items-center gap-4 rounded-[24px] bg-emerald-50 p-5 transition hover:-translate-y-1">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-600 font-black text-white">{i + 1}</span>
              <div><p className="font-black">{step}</p><p className="text-sm text-slate-600">Admissions milestone with guided support.</p></div>
            </Link>
          ))}
        </Reveal>
      </section>
      <section className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
        {["Eligibility: 10+2 or equivalent", "Important dates: July admissions cycle", "Fee structure: transparent semester slabs"].map((x) => <Reveal key={x}><PillCard icon={CheckCircle2} title={x.split(":")[0]} text={x.split(":")[1]} to="/signup/student" /></Reveal>)}
      </section>
    </Shell>
  );
}

function Academics() {
  const courses = ["Computer Science", "Commerce", "Physics", "Economics", "English", "Management"];
  return (
    <Shell accent="violet">
      <section className="mx-auto max-w-7xl py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div><Eyebrow>Academics</Eyebrow><h1 className="text-4xl font-black leading-[1.04] sm:text-5xl md:text-6xl">Course explorer built for serious academic choice.</h1></div>
          <div className="rounded-[36px] bg-slate-950 p-6 text-white shadow-2xl"><p className="text-sm uppercase tracking-[0.18em] text-cyan-200">Curriculum depth</p><p className="mt-4 text-3xl font-black">UG, PG and research pathways connected through departments.</p></div>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {courses.map((course, i) => <Reveal key={course} delay={i * 0.04}><PillCard icon={BookOpen} title={course} text="Program structure, curriculum cards, outcomes and department details." to="/departments" /></Reveal>)}
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
        <PillCard icon={GraduationCap} title="Undergraduate" text="Foundation programs with strong academic mentoring." to="/admissions" />
        <PillCard icon={LibraryBig} title="Postgraduate" text="Advanced specializations and research preparation." to="/research" />
        <PillCard icon={Users} title="Faculty Showcase" text="Mentors, chairs and academic coordinators." to="/login/faculty" />
      </section>
    </Shell>
  );
}

function PortalPage({ faculty = false }) {
  const tools = faculty
    ? [[BookOpen, "Course management"], [Users, "Student records"], [FlaskConical, "Research projects"], [ClipboardList, "Internal notices"]]
    : [[Award, "Results"], [CalendarDays, "Attendance"], [ClipboardList, "Assignments"], [Download, "Downloads"], [Receipt, "Fee payment"], [BookOpen, "Timetable"]];
  return (
    <Shell accent={faculty ? "slate" : "blue"} dark={faculty}>
      <section className="mx-auto grid max-w-7xl items-center gap-8 py-20 lg:grid-cols-[0.8fr_1.2fr]">
        <div><Eyebrow dark={faculty}>{faculty ? "Faculty Portal" : "Student Portal"}</Eyebrow><h1 className="text-4xl font-black leading-[1.04] sm:text-5xl md:text-6xl">{faculty ? "A command center for academic teams." : "A student dashboard that feels calm and useful."}</h1><p className={`mt-6 text-lg leading-8 ${faculty ? "text-slate-300" : "text-slate-600"}`}>{faculty ? "Courses, attendance, student records and research coordination in one secure faculty workspace." : "Attendance, results, notices, assignments, fee payment, timetable and downloads previewed before login."}</p></div>
        <div className={`grid gap-4 rounded-[40px] p-5 shadow-2xl ${faculty ? "bg-white/8" : "bg-white/82"}`}>
          {tools.map(([Icon, title]) => <Link to={faculty ? "/login/faculty" : "/login/student"} key={title} className={`flex items-center gap-4 rounded-[24px] p-5 transition hover:-translate-y-1 ${faculty ? "bg-white/10" : "bg-blue-50"}`}><Icon className="h-6 w-6 text-blue-500" /><span className="font-black">{title}</span><ArrowRight className="ml-auto h-4 w-4" /></Link>)}
        </div>
      </section>
    </Shell>
  );
}

function Departments() {
  const depts = ["Computer Science", "Business School", "Physics Labs", "Civil Infrastructure", "Humanities", "Life Sciences"];
  return (
    <Shell accent="amber">
      <section className="mx-auto max-w-7xl py-20">
        <Eyebrow>Departments</Eyebrow>
        <h1 className="max-w-4xl text-4xl font-black leading-[1.04] sm:text-5xl md:text-6xl">Academic homes with labs, faculty and programs.</h1>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {depts.map((d, i) => <Reveal key={d} delay={i * 0.04}><PillCard icon={Building2} title={d} text="Programs offered, faculty, labs, infrastructure and gallery." to="/academics" /></Reveal>)}
        </div>
      </section>
    </Shell>
  );
}

function Research() {
  return (
    <Shell accent="violet" dark>
      <section className="mx-auto grid max-w-7xl gap-10 py-20 lg:grid-cols-[1fr_1fr]">
        <div><Eyebrow dark>Research</Eyebrow><h1 className="text-4xl font-black leading-[1.04] sm:text-5xl md:text-6xl">Labs, patents and innovation with regional purpose.</h1></div>
        <div className="grid gap-4">
          {[[Microscope, "Research labs"], [FileSearch, "Publications"], [BadgeCheck, "Patents"], [Award, "Achievements"]].map(([Icon, title]) => <PillCard key={title} icon={Icon} title={title} text="Active research streams, ongoing projects and measurable outcomes." to="/departments" dark />)}
        </div>
      </section>
    </Shell>
  );
}

function Placements() {
  const stats = [["₹18L", "Highest package"], ["₹6.2L", "Average package"], ["300+", "Drives"], ["80+", "Recruiters"]];
  return (
    <Shell accent="blue">
      <section className="mx-auto max-w-7xl py-20">
        <Eyebrow>Placements</Eyebrow><h1 className="max-w-4xl text-4xl font-black leading-[1.04] sm:text-5xl md:text-6xl">Career outcomes designed with industry momentum.</h1>
        <div className="mt-10 grid gap-5 md:grid-cols-4">{stats.map(([n, l]) => <Link to="/login/student" key={l} className="rounded-[30px] bg-slate-950 p-7 text-white shadow-2xl transition hover:-translate-y-2"><p className="text-4xl font-black">{n}</p><p className="mt-2 text-sm text-slate-300">{l}</p></Link>)}</div>
        <div className="mt-8 grid gap-4 md:grid-cols-4">{["TCS", "Infosys", "Deloitte", "IBM", "Accenture", "HCLTech", "Wipro", "Tech Mahindra"].map((x) => <Link to="/placements" key={x} className="rounded-[24px] border border-slate-200 bg-white p-6 text-center text-xl font-black shadow-lg transition hover:-translate-y-1">{x}</Link>)}</div>
      </section>
    </Shell>
  );
}

function Scholarships() {
  return (
    <Shell accent="emerald">
      <section className="mx-auto grid max-w-7xl gap-8 py-20 lg:grid-cols-[1fr_1fr]">
        <div><Eyebrow>Scholarships</Eyebrow><h1 className="text-4xl font-black leading-[1.04] sm:text-5xl md:text-6xl">Merit, access and support for every deserving learner.</h1></div>
        <div className="grid gap-4">{["Merit scholarships", "Need-based aid", "Category support", "Research fellowships"].map((x) => <PillCard key={x} icon={ShieldCheck} title={x} text="Eligibility, benefits, application process and deadlines." to="/admissions" />)}</div>
      </section>
    </Shell>
  );
}

function Results() {
  return (
    <Shell accent="rose">
      <section className="mx-auto grid max-w-7xl items-center gap-8 py-20 lg:grid-cols-[1fr_1fr]">
        <div><Eyebrow>Results</Eyebrow><h1 className="text-4xl font-black leading-[1.04] sm:text-5xl md:text-6xl">Academic records, notifications and previous results.</h1><p className="mt-6 text-lg text-slate-600">Search preview, secure login and verified marksheets for enrolled students.</p></div>
        <div className="rounded-[40px] border border-white/70 bg-white/85 p-6 shadow-2xl">
          <div className="flex flex-col gap-3 sm:flex-row"><input className="min-h-14 flex-1 rounded-2xl border border-slate-200 bg-white px-4 font-bold text-slate-900" placeholder="Enter roll number" /><Link to="/login/student" className="grid min-h-14 place-items-center rounded-2xl bg-rose-600 px-6 font-black text-white"><Search className="h-5 w-5" /></Link></div>
          <div className="mt-5 grid gap-3">{["Semester result notification", "Previous result archive", "Academic records"].map((x) => <Link to="/login/student" key={x} className="rounded-2xl bg-rose-50 p-4 font-black text-rose-800">{x}</Link>)}</div>
        </div>
      </section>
    </Shell>
  );
}

function About() {
  return (
    <Shell accent="blue">
      <section className="mx-auto grid max-w-7xl items-center gap-10 py-20 lg:grid-cols-[1fr_1fr]">
        <div><Eyebrow>About University</Eyebrow><h1 className="text-4xl font-black leading-[1.04] sm:text-5xl md:text-6xl">A flagship university shaped by place, purpose and progress.</h1></div>
        <img src={juLibrary} alt="Dhanvantri Library and campus lawns at the University of Jammu" className="h-[340px] w-full rounded-[32px] object-cover shadow-2xl md:h-[460px] md:rounded-[40px]" />
      </section>
      <section className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3"><PillCard icon={Award} title="NAAC A+" text="Accredited academic quality." to="/academics" /><PillCard icon={Landmark} title="Regional impact" text="Serving Jammu and beyond." to="/contact" /><PillCard icon={ShieldCheck} title="Digital governance" text="Modern records and services." to="/student-portal" /></section>
    </Shell>
  );
}

function CampusLife() {
  return (
    <Shell accent="amber">
      <section className="mx-auto max-w-7xl py-20">
        <Eyebrow>Campus Life</Eyebrow><h1 className="max-w-4xl text-4xl font-black leading-[1.04] sm:text-5xl md:text-6xl">Learning spaces, culture and student belonging.</h1>
        <div className="mt-10 grid gap-5 md:grid-cols-4"><img src={juFoundationDay} className="h-80 w-full rounded-[32px] object-cover shadow-2xl md:col-span-2 md:h-96 md:rounded-[36px]" alt="Foundation Day cultural event at the University of Jammu" />{["Clubs", "Events", "Learning Commons", "Student Support"].map((x) => <PillCard key={x} icon={Users} title={x} text="Campus life resources and experiences." to="/contact" />)}</div>
      </section>
    </Shell>
  );
}

function Contact() {
  return (
    <Shell accent="blue">
      <section className="mx-auto grid max-w-7xl gap-8 py-20 lg:grid-cols-[0.9fr_1.1fr]">
        <div><Eyebrow>Contact</Eyebrow><h1 className="text-4xl font-black leading-[1.04] sm:text-5xl md:text-6xl">Reach the right university office quickly.</h1><div className="mt-8 grid gap-4"><a href="tel:+911912435243" className="rounded-2xl bg-white p-5 font-black shadow-lg">Phone: +91 191 243 5243</a><a href="mailto:coe@jammuuniversity.ac.in" className="rounded-2xl bg-white p-5 font-black shadow-lg">Email: coe@jammuuniversity.ac.in</a></div></div>
        <div className="rounded-[32px] bg-slate-950 p-6 text-white shadow-2xl md:rounded-[40px]"><MapPin className="mb-4 h-10 w-10 text-cyan-300" /><p className="text-2xl font-black sm:text-3xl">University of Jammu</p><p className="mt-3 text-slate-300">Baba Saheb Ambedkar Road, Jammu</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href="https://maps.google.com/?q=University%20of%20Jammu" target="_blank" rel="noreferrer" className="inline-flex justify-center rounded-2xl bg-white px-6 py-4 font-black text-slate-950">Open map</a><a href="mailto:helpdesk@jammuuniversity.ac.in?subject=University%20Website%20Contact" className="inline-flex justify-center rounded-2xl border border-white/20 px-6 py-4 font-black text-white">Contact form</a></div></div>
      </section>
    </Shell>
  );
}

export function UniversityInfoPage() {
  const { pathname } = useLocation();
  if (pathname === "/admissions") return <Admissions />;
  if (pathname === "/academics") return <Academics />;
  if (pathname === "/student-portal") return <PortalPage />;
  if (pathname === "/faculty-portal") return <PortalPage faculty />;
  if (pathname === "/departments") return <Departments />;
  if (pathname === "/research") return <Research />;
  if (pathname === "/placements") return <Placements />;
  if (pathname === "/scholarships") return <Scholarships />;
  if (pathname === "/results") return <Results />;
  if (pathname === "/campus-life") return <CampusLife />;
  if (pathname === "/contact") return <Contact />;
  return <About />;
}
