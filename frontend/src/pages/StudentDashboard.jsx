import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth.jsx";

export function StudentDashboard() {
  const { logout } = useAuth();
  const nav = useNavigate();
  
  // Dashboard navigation state
  const [activeTab, setActiveTab] = useState("profile"); // profile, results, attendance, assignments, notices
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Student profile and results state
  const [studentData, setStudentData] = useState(null);
  const [resultsError, setResultsError] = useState("");

  // Attendance state
  const [attendance, setAttendance] = useState([]);
  const [attendanceError, setAttendanceError] = useState("");

  // Assignments state
  const [assignments, setAssignments] = useState([]);
  const [assignmentError, setAssignmentError] = useState("");
  const [submissionUrls, setSubmissionUrls] = useState({}); // { [assignmentId]: url }
  const [submittingId, setSubmittingId] = useState(null);

  // Notices state
  const [notices, setNotices] = useState([]);

  // Fetch all student details
  useEffect(() => {
    let alive = true;
    
    // 1. Profile and Results
    api.get("/student/results/me")
      .then((r) => {
        if (!alive) return;
        setStudentData(r.data?.data);
      })
      .catch((e) => {
        if (!alive) return;
        setResultsError(e?.response?.data?.error?.message || "Failed to load academic records");
      });

    // 2. Attendance
    api.get("/attendance/me")
      .then((r) => {
        if (!alive) return;
        setAttendance(r.data?.data || []);
      })
      .catch((e) => {
        if (!alive) return;
        setAttendanceError(e?.response?.data?.error?.message || "Failed to load attendance logs");
      });

    // 3. Assignments
    api.get("/assignments/me")
      .then((r) => {
        if (!alive) return;
        setAssignments(r.data?.data || []);
      })
      .catch((e) => {
        if (!alive) return;
        setAssignmentError(e?.response?.data?.error?.message || "Failed to load assignments");
      });

    // 4. Notices
    api.get("/notices")
      .then((r) => {
        if (!alive) return;
        // filter notices relevant to students
        const allNotices = r.data?.data?.notices || [];
        setNotices(allNotices.filter(n => n.audience === "all" || n.audience === "students"));
      })
      .catch((err) => {
        console.error("Failed to load notices", err);
      });

    return () => {
      alive = false;
    };
  }, []);

  const latestResult = useMemo(() => {
    const results = studentData?.results || [];
    return results.length ? results[results.length - 1] : null;
  }, [studentData]);

  // Overall Attendance calculation
  const overallAttendance = useMemo(() => {
    if (attendance.length === 0) return 0;
    const totals = attendance.reduce(
      (acc, curr) => {
        acc.present += curr.presentClasses || 0;
        acc.total += curr.totalClasses || 0;
        return acc;
      },
      { present: 0, total: 0 }
    );
    if (totals.total === 0) return 0;
    return Number(((totals.present / totals.total) * 100).toFixed(1));
  }, [attendance]);

  // Handle assignment submission
  async function handleSubmitAssignment(id) {
    const url = submissionUrls[id];
    if (!url || !url.trim()) return;
    setSubmittingId(id);
    
    try {
      await api.post(`/assignments/me/${id}/submit`, { submissionUrl: url });
      
      // refresh assignments list
      const r = await api.get("/assignments/me");
      setAssignments(r.data?.data || []);
      
      // clear submission input field
      setSubmissionUrls(prev => ({ ...prev, [id]: "" }));
      alert("Assignment submitted successfully!");
    } catch (e) {
      alert(e?.response?.data?.error?.message || "Failed to submit assignment");
    } finally {
      setSubmittingId(null);
    }
  }

  function handleLogout() {
    logout();
    nav("/");
  }

  // Visual Gauge percentage offset
  const dashArray = 2 * Math.PI * 40; // r=40
  const dashOffset = dashArray - (overallAttendance / 100) * dashArray;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* MOBILE HEADER */}
      <div className="md:hidden flex items-center justify-between bg-academic-navydark border-b border-academic-gold/20 p-4 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-academic-navy border border-academic-gold flex items-center justify-center rounded-full">
            <span className="font-serif-academic font-bold text-xs text-academic-gold">JU</span>
          </div>
          <span className="font-serif-academic font-bold text-sm tracking-wide text-white">Student Dashboard</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-slate-400 hover:text-white focus:outline-none p-1 rounded hover:bg-slate-800"
        >
          <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* SIDEBAR NAVIGATION (Desktop & Mobile Drawer) */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static inset-y-0 left-0 w-64 bg-academic-navydark border-r border-slate-800 flex flex-col justify-between z-50 transition-transform duration-200 ease-in-out`}
      >
        <div>
          {/* Header branding */}
          <div className="p-6 border-b border-slate-800 hidden md:flex items-center gap-3">
            <div className="h-10 w-10 bg-academic-navy border border-academic-gold flex items-center justify-center rounded-full">
              <span className="font-serif-academic font-bold text-sm text-academic-gold">JU</span>
            </div>
            <div>
              <h2 className="font-serif-academic font-bold text-white tracking-wider text-sm">JAMMU UNIVERSITY</h2>
              <span className="text-[10px] text-academic-gold tracking-widest block uppercase">Student Portal</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {[
              { id: "profile", label: "Profile Overview", icon: "👤" },
              { id: "results", label: "Academic Results", icon: "📊" },
              { id: "attendance", label: "Attendance Tracker", icon: "📅" },
              { id: "assignments", label: "Assignments", icon: "📝" },
              { id: "notices", label: "University Notices", icon: "📢" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-academic-gold text-academic-navy shadow-md shadow-academic-gold/10"
                    : "text-slate-300 hover:bg-slate-900/60 hover:text-white"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* User profile footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white uppercase">
              {studentData?.name?.[0] || "S"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{studentData?.name || "Student"}</p>
              <p className="text-[10px] text-slate-400 truncate">{studentData?.rollNumber || "—"}</p>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Link
              to="/"
              className="flex-1 text-center py-2 rounded border border-slate-800 hover:bg-slate-900 text-xs font-medium text-slate-300"
            >
              Home
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 py-2 rounded bg-red-950/40 border border-red-900 text-red-200 hover:bg-red-900/40 text-xs font-medium cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content body */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-900/30">
        
        {/* Alerts if any errors */}
        {resultsError && (
          <div className="mb-6 rounded-lg border border-red-900 bg-red-950/40 p-4 text-sm text-red-200">
            {resultsError}
          </div>
        )}

        {/* TAB CONTENTS */}

        {/* 1. PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-academic-gold font-semibold uppercase tracking-wider">My Profile</span>
                <h3 className="text-2xl font-bold font-serif-academic text-white">Student Information</h3>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="md:col-span-1 bg-slate-950 border border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center shadow-xl">
                <div className="relative">
                  <div className="h-28 w-28 rounded-full bg-academic-navy border-2 border-academic-gold flex items-center justify-center font-bold text-5xl text-academic-gold uppercase shadow-2xl">
                    {studentData?.name?.[0] || "S"}
                  </div>
                </div>
                <h4 className="mt-4 text-lg font-bold text-white">{studentData?.name || "Loading..."}</h4>
                <p className="text-xs text-academic-gold font-semibold mt-1 tracking-wider uppercase">
                  {studentData?.branch || "Department"}
                </p>
                <div className="mt-6 pt-6 border-t border-slate-800/80 w-full grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Roll Number</span>
                    <span className="text-sm font-semibold text-white">{studentData?.rollNumber || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Semester</span>
                    <span className="text-sm font-semibold text-white">Sem {studentData?.semester || "—"}</span>
                  </div>
                </div>
              </div>

              {/* General details and academic card */}
              <div className="md:col-span-2 space-y-6">
                <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
                  <h4 className="text-sm font-bold font-serif-academic text-white border-b border-slate-800 pb-3">
                    Contact & Registry Info
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-xs text-slate-400">Official Email:</span>
                      <p className="font-semibold text-white mt-0.5">{studentData?.email || "—"}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">Institutional Registry:</span>
                      <p className="font-semibold text-white mt-0.5">University of Jammu, Main Campus</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl shadow-md">
                    <span className="text-xs text-slate-400 block">Latest Semester SGPA</span>
                    <span className="text-2xl font-extrabold text-academic-gold mt-1 block">
                      {latestResult?.sgpa ?? "—"}
                    </span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl shadow-md">
                    <span className="text-xs text-slate-400 block">Current Cumulative CGPA</span>
                    <span className="text-2xl font-extrabold text-academic-gold mt-1 block">
                      {latestResult?.cgpa ?? "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. RESULTS TAB */}
        {activeTab === "results" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-academic-gold font-semibold uppercase tracking-wider">Examinations</span>
                <h3 className="text-2xl font-bold font-serif-academic text-white">Result Sheet Portal</h3>
              </div>
              {studentData?.results?.length > 0 && (
                <button
                  onClick={() => window.print()}
                  className="rounded-lg bg-academic-gold hover:bg-academic-goldhover text-academic-navy px-4 py-2 text-xs font-bold transition cursor-pointer"
                >
                  🖨️ Print Marksheets
                </button>
              )}
            </div>

            {studentData?.results && studentData.results.length > 0 ? (
              <div className="space-y-6">
                {studentData.results.map((r) => (
                  <div key={r.semester} className="bg-slate-950 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h4 className="font-bold text-lg text-white font-serif-academic">Semester {r.semester}</h4>
                      <div className="text-xs bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                        SGPA: <span className="font-bold text-academic-gold mr-3">{r.sgpa}</span>
                        CGPA: <span className="font-bold text-academic-gold">{r.cgpa}</span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-slate-400 border-b border-slate-800">
                            <th className="pb-3 pr-4">Subject Code</th>
                            <th className="pb-3 pr-4">Course Name</th>
                            <th className="pb-3 pr-4 text-center">Credits</th>
                            <th className="pb-3 pr-4 text-center">Marks Obtd.</th>
                            <th className="pb-3 text-center">Letter Grade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {r.subjects.map((s) => {
                            // Quick grading letter simulation
                            let grade = "F";
                            if (s.marks >= 90) grade = "O";
                            else if (s.marks >= 80) grade = "A+";
                            else if (s.marks >= 70) grade = "A";
                            else if (s.marks >= 60) grade = "B+";
                            else if (s.marks >= 50) grade = "B";
                            else if (s.marks >= 40) grade = "C";

                            return (
                              <tr key={s.subjectCode} className="border-b border-slate-800/40 text-slate-200">
                                <td className="py-3 pr-4 font-mono font-semibold">{s.subjectCode}</td>
                                <td className="py-3 pr-4">{s.subjectName}</td>
                                <td className="py-3 pr-4 text-center">{s.credits}</td>
                                <td className="py-3 pr-4 text-center font-bold">{s.marks}</td>
                                <td className="py-3 text-center font-bold text-academic-gold">{grade}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-950 border border-slate-800 p-10 rounded-2xl text-center text-slate-400">
                📭 No examination results published for your roll number yet.
              </div>
            )}
          </div>
        )}

        {/* 3. ATTENDANCE TAB */}
        {activeTab === "attendance" && (
          <div className="space-y-6">
            <div>
              <span className="text-xs text-academic-gold font-semibold uppercase tracking-wider">Logs</span>
              <h3 className="text-2xl font-bold font-serif-academic text-white">Daily Lecture Attendance</h3>
            </div>

            {attendanceError && (
              <div className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-sm text-red-200">
                {attendanceError}
              </div>
            )}

            {attendance.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                
                {/* Circular statistics card */}
                <div className="md:col-span-1 bg-slate-950 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-xl">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Cumulative Attendance</h4>
                  
                  {/* Gauge */}
                  <div className="relative flex items-center justify-center">
                    <svg className="w-36 h-36 transform -rotate-90">
                      {/* background circle */}
                      <circle cx="72" cy="72" r="40" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                      {/* progress circle */}
                      <circle
                        cx="72"
                        cy="72"
                        r="40"
                        stroke={overallAttendance >= 75 ? "#d4af37" : "#ef4444"}
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={dashArray}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-2xl font-extrabold text-white">{overallAttendance}%</span>
                      <span className="text-[10px] text-slate-400 block">Overall Status</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mt-6 leading-relaxed">
                    {overallAttendance >= 75
                      ? "🟢 Your overall attendance meets the required 75% examination eligibility threshold."
                      : "🔴 Alert: Your attendance is below the 75% academic requirements."}
                  </p>
                </div>

                {/* Course details progress bars */}
                <div className="md:col-span-2 bg-slate-950 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
                  <h4 className="text-sm font-bold font-serif-academic text-white border-b border-slate-800 pb-3">
                    Course-wise Attendance Logs
                  </h4>
                  
                  <div className="space-y-4">
                    {attendance.map((att) => {
                      const perc = att.totalClasses === 0 ? 0 : Math.round((att.presentClasses / att.totalClasses) * 100);
                      return (
                        <div key={att.subjectCode} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-white">{att.subjectName} ({att.subjectCode})</span>
                            <span className={`${perc >= 75 ? "text-academic-gold" : "text-red-400"}`}>
                              {att.presentClasses} / {att.totalClasses} lectures ({perc}%)
                            </span>
                          </div>
                          {/* Progress bar background */}
                          <div className="w-full bg-slate-800 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${perc >= 75 ? "bg-academic-gold" : "bg-red-500"}`}
                              style={{ width: `${perc}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950 border border-slate-800 p-10 rounded-2xl text-center text-slate-400">
                📅 Attendance logs have not been registered by course teachers yet.
              </div>
            )}
          </div>
        )}

        {/* 4. ASSIGNMENTS TAB */}
        {activeTab === "assignments" && (
          <div className="space-y-6">
            <div>
              <span className="text-xs text-academic-gold font-semibold uppercase tracking-wider">Submissions</span>
              <h3 className="text-2xl font-bold font-serif-academic text-white">Course Assignments Manager</h3>
            </div>

            {assignmentError && (
              <div className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-sm text-red-200">
                {assignmentError}
              </div>
            )}

            {assignments.length > 0 ? (
              <div className="grid gap-6">
                {assignments.map((asg) => (
                  <div
                    key={asg._id}
                    className="bg-slate-950 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between gap-6"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-400">
                          {asg.subjectCode}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border tracking-wider ${
                          asg.status === "graded"
                            ? "bg-emerald-950/40 border-emerald-900 text-emerald-400"
                            : asg.status === "submitted"
                            ? "bg-blue-950/40 border-blue-900 text-blue-400"
                            : "bg-amber-950/40 border-amber-900 text-amber-400"
                        }`}>
                          {asg.status}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white">{asg.title}</h4>
                      <p className="text-xs text-slate-400">Course: {asg.subjectName}</p>
                      <p className="text-xs text-slate-500">
                        Due Date: <span className="font-semibold text-slate-300">{new Date(asg.dueDate).toLocaleDateString()}</span>
                      </p>
                    </div>

                    <div className="flex flex-col justify-center min-w-[280px]">
                      {asg.status === "graded" ? (
                        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-sm">
                          <span className="text-slate-400">Score Received:</span>
                          <span className="text-base font-bold text-academic-gold">
                            {asg.marksObtained} / {asg.totalMarks}
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold text-slate-400 block">
                            Submission URL (Google Drive / GitHub)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="url"
                              placeholder="https://drive.google.com/file/..."
                              value={submissionUrls[asg._id] || ""}
                              onChange={(e) =>
                                setSubmissionUrls((prev) => ({
                                  ...prev,
                                  [asg._id]: e.target.value
                                }))
                              }
                              className="flex-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-academic-gold outline-none"
                            />
                            <button
                              disabled={submittingId === asg._id || !submissionUrls[asg._id]?.trim()}
                              onClick={() => handleSubmitAssignment(asg._id)}
                              className="rounded-lg bg-academic-gold hover:bg-academic-goldhover text-academic-navy px-4 py-1.5 text-xs font-bold transition disabled:opacity-50 cursor-pointer"
                            >
                              Submit
                            </button>
                          </div>
                          {asg.submissionUrl && (
                            <p className="text-[10px] text-slate-500 truncate max-w-[280px]">
                              Submitted Link: <a href={asg.submissionUrl} target="_blank" rel="noreferrer" className="text-blue-400 underline hover:text-blue-300">{asg.submissionUrl}</a>
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-950 border border-slate-800 p-10 rounded-2xl text-center text-slate-400">
                📝 No class assignments issued for your semester yet.
              </div>
            )}
          </div>
        )}

        {/* 5. NOTICES TAB */}
        {activeTab === "notices" && (
          <div className="space-y-6">
            <div>
              <span className="text-xs text-academic-gold font-semibold uppercase tracking-wider">Announcements</span>
              <h3 className="text-2xl font-bold font-serif-academic text-white">Student Circular Feed</h3>
            </div>

            <div className="space-y-4">
              {notices.length > 0 ? (
                notices.map((n) => (
                  <div key={n._id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl shadow-xl">
                    <div className="flex items-center gap-2 mb-2 text-xs text-slate-500">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 text-academic-gold">
                        Student Circular
                      </span>
                      <span>•</span>
                      <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">{n.title}</h4>
                    <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">{n.body}</p>
                  </div>
                ))
              ) : (
                <div className="bg-slate-950 border border-slate-800 p-10 rounded-2xl text-center text-slate-400">
                  📢 No active circular announcements available for students.
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

