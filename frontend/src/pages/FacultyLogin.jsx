import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Mail, ShieldCheck } from "lucide-react";

export function FacultyLogin() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_18%_8%,rgba(147,197,253,0.45),transparent_28rem),linear-gradient(135deg,#f8fbff_0%,#eff6ff_50%,#ffffff_100%)] px-4 py-8 text-slate-950">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-[28px] border border-white/70 bg-white/86 px-4 py-3 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
        <Link to="/" className="flex items-center gap-3" aria-label="Jammu University home">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-cyan-500 text-sm font-black text-white">
            JU
          </div>
          <div>
            <p className="text-sm font-black">Jammu University</p>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700">Faculty Portal</p>
          </div>
        </Link>
        <Link to="/" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:text-blue-700">
          Home
        </Link>
      </nav>

      <section className="mx-auto grid max-w-6xl items-center gap-10 py-20 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
            <ShieldCheck className="h-4 w-4" />
            Faculty Access
          </div>
          <h1 className="text-5xl font-black leading-tight tracking-tight md:text-7xl">Faculty portal access is being prepared.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            This professional gateway is reserved for teaching staff, course coordination, attendance and academic workflows.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[40px] border border-white/70 bg-white/82 p-8 shadow-[0_30px_100px_rgba(15,23,42,0.14)] backdrop-blur-2xl">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-[24px] bg-blue-700 text-white">
            <BookOpen className="h-8 w-8" />
          </div>
          <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
            <label className="block text-sm font-black text-slate-700">
              Faculty Email
              <input type="email" placeholder="faculty@jammuuniversity.ac.in" className="mt-2 min-h-[54px] w-full rounded-[18px] border border-slate-200 bg-white px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            </label>
            <label className="block text-sm font-black text-slate-700">
              Password
              <input type="password" placeholder="Secure password" className="mt-2 min-h-[54px] w-full rounded-[18px] border border-slate-200 bg-white px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            </label>
            <a href="mailto:helpdesk@jammuuniversity.ac.in?subject=Faculty%20Portal%20Access%20Request" className="flex w-full items-center justify-center gap-2 rounded-[20px] bg-blue-700 px-7 py-4 text-sm font-black text-white shadow-[0_22px_60px_rgba(37,99,235,0.24)] transition hover:-translate-y-1 hover:bg-blue-800">
              Request faculty access
              <ArrowRight className="h-5 w-5" />
            </a>
          </form>
          <a href="mailto:helpdesk@jammuuniversity.ac.in" className="mt-6 flex items-center gap-2 rounded-2xl bg-blue-50 p-4 text-sm font-black text-blue-800">
            <Mail className="h-4 w-4" /> Contact helpdesk for credentials
          </a>
        </motion.div>
      </section>
    </main>
  );
}
