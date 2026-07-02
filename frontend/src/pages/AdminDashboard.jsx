import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth.jsx";

export function AdminDashboard() {
  const { logout } = useAuth();
  const nav = useNavigate();

  // Navigation tabs
  const [activeTab, setActiveTab] = useState("students"); // students, results, attendance, assignments, notices
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // General Loading & Errors
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ==========================================
  // TAB 1: STUDENT DIRECTORY (CRUD)
  // ==========================================
  const [students, setStudents] = useState([]);
  const [studentTotal, setStudentTotal] = useState(0);
  const [editingStudent, setEditingStudent] = useState(null); // student being edited
  const [showAddForm, setShowAddForm] = useState(false);
  const [studentForm, setStudentForm] = useState({
    rollNumber: "",
    name: "",
    email: "",
    branch: "",
    semester: 1,
    password: ""
  });

  // Fetch students
  async function fetchStudents() {
    setLoading(true);
    try {
      const res = await api.get("/admin/students?limit=200");
      setStudents(res.data?.data?.items || []);
      setStudentTotal(res.data?.data?.total || 0);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load students directory.");
    } finally {
      setLoading(false);
    }
  }

  // Add Student
  async function handleAddStudent(e) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await api.post("/admin/students", studentForm);
      setSuccessMsg("Student registered successfully.");
      setShowAddForm(false);
      setStudentForm({ rollNumber: "", name: "", email: "", branch: "", semester: 1, password: "" });
      fetchStudents();
    } catch (err) {
      setErrorMsg(err?.response?.data?.error?.message || "Failed to add student.");
    }
  }

  // Patch Student
  async function handleEditStudent(e) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await api.patch(`/admin/students/${editingStudent._id}`, {
        name: editingStudent.name,
        email: editingStudent.email,
        branch: editingStudent.branch,
        semester: editingStudent.semester
      });
      setSuccessMsg("Student profile updated.");
      setEditingStudent(null);
      fetchStudents();
    } catch (err) {
      setErrorMsg(err?.response?.data?.error?.message || "Failed to update student.");
    }
  }

  // Delete Student
  async function handleDeleteStudent(id) {
    if (!window.confirm("Are you sure you want to delete this student record?")) return;
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await api.delete(`/admin/students/${id}`);
      setSuccessMsg("Student deleted.");
      fetchStudents();
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to delete student.");
    }
  }

  // ==========================================
  // TAB 2: EXCEL RESULTS
  // ==========================================
  const [resultFile, setResultFile] = useState(null);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [uploadStats, setUploadStats] = useState(null);

  async function handleExcelUpload(e) {
    e.preventDefault();
    if (!resultFile) return;
    setUploadBusy(true);
    setErrorMsg("");
    setUploadStats(null);
    try {
      const form = new FormData();
      form.append("file", resultFile);
      const res = await api.post("/admin/results/upload-excel", form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setUploadStats(res.data?.data || null);
      setSuccessMsg("Excel results sheet uploaded and validated.");
      setResultFile(null);
    } catch (err) {
      setErrorMsg(err?.response?.data?.error?.message || "Failed to upload result sheet.");
    } finally {
      setUploadBusy(false);
    }
  }

  // ==========================================
  // TAB 3: ATTENDANCE MANAGER
  // ==========================================
  const [activeStudentRoll, setActiveStudentRoll] = useState("");
  const [studentAttendance, setStudentAttendance] = useState([]);
  const [attendanceForm, setAttendanceForm] = useState({
    subjectCode: "",
    subjectName: "",
    totalClasses: "",
    presentClasses: ""
  });

  async function fetchStudentAttendance(roll) {
    if (!roll) return;
    try {
      const res = await api.get(`/attendance/student/${roll}`);
      setStudentAttendance(res.data?.data || []);
    } catch (err) {
      console.error(err);
      setStudentAttendance([]);
    }
  }

  async function handleUpsertAttendance(e) {
    e.preventDefault();
    if (!activeStudentRoll) return;
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await api.post("/attendance", {
        rollNumber: activeStudentRoll,
        subjectCode: attendanceForm.subjectCode,
        subjectName: attendanceForm.subjectName,
        totalClasses: Number(attendanceForm.totalClasses),
        presentClasses: Number(attendanceForm.presentClasses)
      });
      setSuccessMsg("Attendance log updated.");
      setAttendanceForm({ subjectCode: "", subjectName: "", totalClasses: "", presentClasses: "" });
      fetchStudentAttendance(activeStudentRoll);
    } catch (err) {
      setErrorMsg(err?.response?.data?.error?.message || "Failed to update attendance.");
    }
  }

  async function handleDeleteAttendance(subjectCode) {
    if (!window.confirm("Remove this attendance record?")) return;
    try {
      await api.delete(`/attendance/${activeStudentRoll}/${subjectCode}`);
      setSuccessMsg("Attendance deleted.");
      fetchStudentAttendance(activeStudentRoll);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to delete attendance.");
    }
  }

  // ==========================================
  // TAB 4: ASSIGNMENTS
  // ==========================================
  const [studentAssignments, setStudentAssignments] = useState([]);
  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    subjectCode: "",
    subjectName: "",
    dueDate: "",
    totalMarks: ""
  });
  const [gradingForm, setGradingForm] = useState({
    assignmentId: "",
    marksObtained: ""
  });

  async function fetchStudentAssignments(roll) {
    if (!roll) return;
    try {
      const res = await api.get(`/assignments/student/${roll}`);
      setStudentAssignments(res.data?.data || []);
    } catch (err) {
      console.error(err);
      setStudentAssignments([]);
    }
  }

  async function handleIssueAssignment(e) {
    e.preventDefault();
    if (!activeStudentRoll) return;
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await api.post("/assignments", {
        rollNumber: activeStudentRoll,
        title: assignmentForm.title,
        subjectCode: assignmentForm.subjectCode,
        subjectName: assignmentForm.subjectName,
        dueDate: assignmentForm.dueDate,
        totalMarks: Number(assignmentForm.totalMarks)
      });
      setSuccessMsg("Assignment issued successfully.");
      setAssignmentForm({ title: "", subjectCode: "", subjectName: "", dueDate: "", totalMarks: "" });
      fetchStudentAssignments(activeStudentRoll);
    } catch (err) {
      setErrorMsg(err?.response?.data?.error?.message || "Failed to issue assignment.");
    }
  }

  async function handleGradeSubmission(e) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await api.patch(`/assignments/${gradingForm.assignmentId}/grade`, {
        marksObtained: Number(gradingForm.marksObtained)
      });
      setSuccessMsg("Submission graded successfully.");
      setGradingForm({ assignmentId: "", marksObtained: "" });
      fetchStudentAssignments(activeStudentRoll);
    } catch (err) {
      setErrorMsg(err?.response?.data?.error?.message || "Failed to grade assignment.");
    }
  }

  async function handleDeleteAssignment(id) {
    if (!window.confirm("Delete this assignment?")) return;
    try {
      await api.delete(`/assignments/${id}`);
      setSuccessMsg("Assignment deleted.");
      fetchStudentAssignments(activeStudentRoll);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to delete assignment.");
    }
  }

  // ==========================================
  // TAB 5: NOTICES MANAGER
  // ==========================================
  const [notices, setNotices] = useState([]);
  const [noticeForm, setNoticeForm] = useState({
    title: "",
    body: "",
    audience: "all"
  });

  async function fetchNotices() {
    try {
      const res = await api.get("/notices");
      setNotices(res.data?.data?.notices || []);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load notices.");
    }
  }

  async function handleCreateNotice(e) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await api.post("/notices", noticeForm);
      setSuccessMsg("Notice published to feed.");
      setNoticeForm({ title: "", body: "", audience: "all" });
      fetchNotices();
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to create notice.");
    }
  }

  async function handleDeleteNotice(id) {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    try {
      await api.delete(`/notices/${id}`);
      setSuccessMsg("Notice deleted.");
      fetchNotices();
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to delete notice.");
    }
  }

  // Global router triggers per tab
  useEffect(() => {
    Promise.resolve().then(() => {
      if (activeTab === "students") {
        fetchStudents();
      } else if (activeTab === "attendance" || activeTab === "assignments") {
        fetchStudents(); // needs students lists for roll search
      } else if (activeTab === "notices") {
        fetchNotices();
      }
    });
  }, [activeTab]);

  function handleLogout() {
    logout();
    nav("/");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* MOBILE HEADER */}
      <div className="md:hidden flex items-center justify-between bg-academic-navydark border-b border-academic-gold/20 p-4 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-academic-navy border border-academic-gold flex items-center justify-center rounded-full">
            <span className="font-serif-academic font-bold text-xs text-academic-gold">JU</span>
          </div>
          <span className="font-serif-academic font-bold text-sm tracking-wide text-white">Admin Dashboard</span>
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

      {/* SIDEBAR NAVIGATION */}
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
              <span className="text-[10px] text-academic-gold tracking-widest block uppercase">Admin Panel</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {[
              { id: "students", label: "Student Registry", icon: "👥" },
              { id: "results", label: "Upload Results", icon: "📁" },
              { id: "attendance", label: "Attendance Manager", icon: "📅" },
              { id: "assignments", label: "Assignments issuer", icon: "📝" },
              { id: "notices", label: "Publish Notice", icon: "📢" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setErrorMsg("");
                  setSuccessMsg("");
                  setActiveTab(tab.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-academic-gold text-academic-navy shadow-md shadow-academic-gold/10"
                    : "text-slate-350 hover:bg-slate-900/60 hover:text-white"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Admin Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <div className="flex gap-2">
            <Link
              to="/"
              className="flex-1 text-center py-2 rounded border border-slate-800 hover:bg-slate-900 text-xs font-medium text-slate-300"
            >
              Home
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 py-2 rounded bg-red-950/40 border border-red-900 text-red-205 hover:bg-red-900/40 text-xs font-medium cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content body */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-900/30">
        
        {/* Global Notifications */}
        {errorMsg && (
          <div className="mb-6 rounded-lg border border-red-900 bg-red-950/40 p-3 text-xs text-red-200">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 rounded-lg border border-emerald-900 bg-emerald-950/30 p-3 text-xs text-emerald-200">
            {successMsg}
          </div>
        )}

        {/* TAB 1: STUDENT DIRECTORY */}
        {activeTab === "students" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs text-academic-gold font-semibold uppercase tracking-wider">Directory</span>
                <h3 className="text-2xl font-bold font-serif-academic text-white">Student Registry ({studentTotal})</h3>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="rounded-lg bg-academic-gold text-academic-navy px-4 py-2 text-xs font-bold transition cursor-pointer hover:bg-academic-goldhover"
              >
                {showAddForm ? "Close Form" : "➕ Add New Student"}
              </button>
            </div>

            {/* ADD STUDENT FORM */}
            {showAddForm && (
              <form onSubmit={handleAddStudent} className="bg-slate-950 border border-slate-850 p-6 rounded-2xl shadow-xl grid md:grid-cols-3 gap-4">
                <div className="md:col-span-3 pb-2 border-b border-slate-900">
                  <h4 className="text-sm font-bold text-white font-serif-academic">Register Student Record</h4>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Roll Number</label>
                  <input
                    type="text"
                    required
                    value={studentForm.rollNumber}
                    onChange={(e) => setStudentForm({ ...studentForm, rollNumber: e.target.value })}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-academic-gold outline-none"
                    placeholder="22CS001"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-academic-gold outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-academic-gold outline-none"
                    placeholder="john@email.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Branch / Course</label>
                  <input
                    type="text"
                    required
                    value={studentForm.branch}
                    onChange={(e) => setStudentForm({ ...studentForm, branch: e.target.value })}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-academic-gold outline-none"
                    placeholder="Computer Science"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Semester</label>
                  <select
                    value={studentForm.semester}
                    onChange={(e) => setStudentForm({ ...studentForm, semester: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-academic-gold outline-none"
                  >
                    {[...Array(8)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>Semester {i + 1}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={studentForm.password}
                    onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-academic-gold outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <div className="md:col-span-3 pt-2 text-right">
                  <button
                    type="submit"
                    className="rounded-lg bg-academic-navy border border-academic-gold hover:bg-academic-navy/70 text-white px-4 py-2 text-xs font-bold transition cursor-pointer"
                  >
                    Save Student Registry
                  </button>
                </div>
              </form>
            )}

            {/* EDIT STUDENT MODAL/SECTION */}
            {editingStudent && (
              <form onSubmit={handleEditStudent} className="bg-slate-950 border border-slate-850 p-6 rounded-2xl shadow-xl grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2 pb-2 border-b border-slate-900 flex justify-between items-center">
                  <h4 className="text-sm font-bold text-white font-serif-academic">Edit Student Profile ({editingStudent.rollNumber})</h4>
                  <button type="button" onClick={() => setEditingStudent(null)} className="text-xs text-slate-400 hover:text-white">Cancel</button>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-academic-gold outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editingStudent.email}
                    onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-academic-gold outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Branch</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.branch}
                    onChange={(e) => setEditingStudent({ ...editingStudent, branch: e.target.value })}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-academic-gold outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Semester</label>
                  <select
                    value={editingStudent.semester}
                    onChange={(e) => setEditingStudent({ ...editingStudent, semester: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-academic-gold outline-none"
                  >
                    {[...Array(8)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>Semester {i + 1}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2 pt-2 text-right">
                  <button
                    type="submit"
                    className="rounded-lg bg-academic-gold text-academic-navy px-4 py-2 text-xs font-bold transition hover:bg-academic-goldhover cursor-pointer"
                  >
                    Update Profile Details
                  </button>
                </div>
              </form>
            )}

            {/* STUDENTS DIRECTORY TABLE */}
            <div className="bg-slate-950 border border-slate-850 rounded-2xl shadow-xl overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-slate-400 text-sm">Querying database...</div>
              ) : students.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">No student accounts registered in the database.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-800 bg-slate-900/60">
                        <th className="p-4">Roll Number</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Course Branch</th>
                        <th className="p-4 text-center">Semester</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((st) => (
                        <tr key={st._id} className="border-b border-slate-900 hover:bg-slate-900/20 text-slate-200">
                          <td className="p-4 font-mono font-semibold">{st.rollNumber}</td>
                          <td className="p-4 font-bold">{st.name}</td>
                          <td className="p-4">{st.email}</td>
                          <td className="p-4">{st.branch}</td>
                          <td className="p-4 text-center">Sem {st.semester}</td>
                          <td className="p-4 text-center space-x-2">
                            <button
                              onClick={() => setEditingStudent(st)}
                              className="text-xs text-academic-gold hover:underline cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(st._id)}
                              className="text-xs text-red-400 hover:underline cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: UPLOAD RESULTS */}
        {activeTab === "results" && (
          <div className="space-y-6">
            <div>
              <span className="text-xs text-academic-gold font-semibold uppercase tracking-wider">Academics</span>
              <h3 className="text-2xl font-bold font-serif-academic text-white">Excel Results Portal</h3>
            </div>

            <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl shadow-xl space-y-4">
              <h4 className="text-sm font-bold text-white font-serif-academic">Expected Sheet Layout</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload result tables in `.xlsx` format. Each row represents a single subject mark record:
              </p>
              <div className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 font-mono text-[11px] text-slate-350">
                rollNumber, semester, subjectCode, subjectName, credits, marks
              </div>
              <p className="text-[10px] text-slate-450 italic mt-1 leading-relaxed">
                💡 E.g. Row: <code className="text-slate-300">22CS001, 1, CSC101, Data Structures, 4, 88</code>
              </p>
            </div>

            <form onSubmit={handleExcelUpload} className="bg-slate-950 border border-slate-850 p-6 rounded-2xl shadow-xl space-y-4">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setResultFile(e.target.files?.[0] || null)}
                className="block w-full text-xs text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-academic-gold file:px-4 file:py-2 file:text-xs file:font-semibold file:text-academic-navy hover:file:bg-academic-goldhover cursor-pointer"
              />

              {uploadStats && (
                <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-900 text-xs space-y-1">
                  <p className="font-bold text-white">Upload Statistics:</p>
                  <p className="text-slate-305">Parsed Sheets: {uploadStats.sheets?.join(", ")}</p>
                  <p className="text-slate-305">Rows Handled: {uploadStats.rows}</p>
                  <p className="text-slate-305">Result sheets upserted: {uploadStats.resultDocumentsTouched}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!resultFile || uploadBusy}
                className="rounded-lg bg-academic-gold hover:bg-academic-goldhover text-academic-navy px-4 py-2 text-xs font-bold transition disabled:opacity-50 cursor-pointer"
              >
                {uploadBusy ? "Uploading Results..." : "Publish Results File"}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: ATTENDANCE MANAGER */}
        {activeTab === "attendance" && (
          <div className="space-y-6">
            <div>
              <span className="text-xs text-academic-gold font-semibold uppercase tracking-wider">Attendance Logs</span>
              <h3 className="text-2xl font-bold font-serif-academic text-white">Course Attendance Modifiers</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              
              {/* Select Student Selector */}
              <div className="md:col-span-1 bg-slate-950 border border-slate-850 p-5 rounded-2xl shadow-xl space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-900 pb-2">Select Student</h4>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {students.map((st) => (
                    <button
                      key={st._id}
                      onClick={() => {
                        setActiveStudentRoll(st.rollNumber);
                        fetchStudentAttendance(st.rollNumber);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold border transition ${
                        activeStudentRoll === st.rollNumber
                          ? "bg-academic-gold border-academic-gold text-academic-navy"
                          : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850"
                      }`}
                    >
                      <div className="truncate">{st.name}</div>
                      <div className={`text-[10px] ${activeStudentRoll === st.rollNumber ? "text-academic-navy/70" : "text-slate-500"}`}>
                        Roll: {st.rollNumber}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Attendance Editor & Logs */}
              <div className="md:col-span-2 space-y-6">
                {activeStudentRoll ? (
                  <>
                    {/* Add/Upsert Form */}
                    <form onSubmit={handleUpsertAttendance} className="bg-slate-950 border border-slate-850 p-6 rounded-2xl shadow-xl grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 pb-2 border-b border-slate-900">
                        <h4 className="text-sm font-bold text-white font-serif-academic">Update Subject Logs for {activeStudentRoll}</h4>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">Subject Code</label>
                        <input
                          type="text"
                          required
                          value={attendanceForm.subjectCode}
                          onChange={(e) => setAttendanceForm({ ...attendanceForm, subjectCode: e.target.value.toUpperCase() })}
                          className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-academic-gold outline-none"
                          placeholder="CSC101"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">Subject Name</label>
                        <input
                          type="text"
                          required
                          value={attendanceForm.subjectName}
                          onChange={(e) => setAttendanceForm({ ...attendanceForm, subjectName: e.target.value })}
                          className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-academic-gold outline-none"
                          placeholder="Data Structures"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">Total Classes Conducted</label>
                        <input
                          type="number"
                          required
                          value={attendanceForm.totalClasses}
                          onChange={(e) => setAttendanceForm({ ...attendanceForm, totalClasses: e.target.value })}
                          className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-academic-gold outline-none"
                          placeholder="40"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">Present Classes Count</label>
                        <input
                          type="number"
                          required
                          value={attendanceForm.presentClasses}
                          onChange={(e) => setAttendanceForm({ ...attendanceForm, presentClasses: e.target.value })}
                          className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-academic-gold outline-none"
                          placeholder="32"
                        />
                      </div>
                      <div className="md:col-span-2 pt-2 text-right">
                        <button
                          type="submit"
                          className="rounded-lg bg-academic-gold text-academic-navy px-4 py-2 text-xs font-bold transition hover:bg-academic-goldhover cursor-pointer"
                        >
                          Save Log
                        </button>
                      </div>
                    </form>

                    {/* Display existing records */}
                    <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl shadow-xl space-y-4">
                      <h4 className="text-sm font-bold text-white font-serif-academic border-b border-slate-900 pb-3">
                        Active Logs for {activeStudentRoll}
                      </h4>
                      {studentAttendance.length === 0 ? (
                        <p className="text-xs text-slate-400">No active attendance logs configured for this student.</p>
                      ) : (
                        <div className="space-y-3">
                          {studentAttendance.map((att) => {
                            const perc = att.totalClasses === 0 ? 0 : Math.round((att.presentClasses / att.totalClasses) * 100);
                            return (
                              <div key={att.subjectCode} className="flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-slate-850 text-xs">
                                <div>
                                  <p className="font-semibold text-white">{att.subjectName} ({att.subjectCode})</p>
                                  <p className="text-slate-405 mt-0.5">Lectures: {att.presentClasses} of {att.totalClasses} ({perc}%)</p>
                                </div>
                                <button
                                  onClick={() => handleDeleteAttendance(att.subjectCode)}
                                  className="text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="bg-slate-950 border border-slate-850 p-10 rounded-2xl text-center text-slate-400 text-sm">
                    Select a student from the registry sidebar to view/manage attendance.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ASSIGNMENTS ISSUER & GRADER */}
        {activeTab === "assignments" && (
          <div className="space-y-6">
            <div>
              <span className="text-xs text-academic-gold font-semibold uppercase tracking-wider">Assignments</span>
              <h3 className="text-2xl font-bold font-serif-academic text-white">Course Assignments Manager</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              
              {/* Select Student Selector */}
              <div className="md:col-span-1 bg-slate-950 border border-slate-850 p-5 rounded-2xl shadow-xl space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-900 pb-2">Select Student</h4>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {students.map((st) => (
                    <button
                      key={st._id}
                      onClick={() => {
                        setActiveStudentRoll(st.rollNumber);
                        fetchStudentAssignments(st.rollNumber);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold border transition ${
                        activeStudentRoll === st.rollNumber
                          ? "bg-academic-gold border-academic-gold text-academic-navy"
                          : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850"
                      }`}
                    >
                      <div className="truncate">{st.name}</div>
                      <div className={`text-[10px] ${activeStudentRoll === st.rollNumber ? "text-academic-navy/70" : "text-slate-500"}`}>
                        Roll: {st.rollNumber}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Assignment Issue Form & Grading lists */}
              <div className="md:col-span-2 space-y-6">
                {activeStudentRoll ? (
                  <>
                    {/* Add Assignment form */}
                    <form onSubmit={handleIssueAssignment} className="bg-slate-950 border border-slate-850 p-6 rounded-2xl shadow-xl grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 pb-2 border-b border-slate-900">
                        <h4 className="text-sm font-bold text-white font-serif-academic">Issue Assignment to {activeStudentRoll}</h4>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-semibold text-slate-400 block mb-1">Assignment Title</label>
                        <input
                          type="text"
                          required
                          value={assignmentForm.title}
                          onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                          className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-academic-gold outline-none"
                          placeholder="CSC101 lab submission"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">Subject Code</label>
                        <input
                          type="text"
                          required
                          value={assignmentForm.subjectCode}
                          onChange={(e) => setAssignmentForm({ ...assignmentForm, subjectCode: e.target.value.toUpperCase() })}
                          className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-academic-gold outline-none"
                          placeholder="CSC101"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">Subject Name</label>
                        <input
                          type="text"
                          required
                          value={assignmentForm.subjectName}
                          onChange={(e) => setAssignmentForm({ ...assignmentForm, subjectName: e.target.value })}
                          className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-academic-gold outline-none"
                          placeholder="Data Structures"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">Due Date</label>
                        <input
                          type="date"
                          required
                          value={assignmentForm.dueDate}
                          onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                          className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-academic-gold outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">Total Marks</label>
                        <input
                          type="number"
                          required
                          value={assignmentForm.totalMarks}
                          onChange={(e) => setAssignmentForm({ ...assignmentForm, totalMarks: e.target.value })}
                          className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-academic-gold outline-none"
                          placeholder="10"
                        />
                      </div>
                      <div className="md:col-span-2 pt-2 text-right">
                        <button
                          type="submit"
                          className="rounded-lg bg-academic-navy border border-academic-gold hover:bg-academic-navy/70 text-white px-4 py-2 text-xs font-bold transition cursor-pointer"
                        >
                          Issue Assignment
                        </button>
                      </div>
                    </form>

                    {/* Grading Form Modal/View if selected */}
                    {gradingForm.assignmentId && (
                      <form onSubmit={handleGradeSubmission} className="bg-slate-950 border border-slate-850 p-6 rounded-2xl shadow-xl flex items-end gap-4">
                        <div className="flex-1">
                          <label className="text-xs font-semibold text-slate-400 block mb-1">Grade Marks Obtained</label>
                          <input
                            type="number"
                            required
                            value={gradingForm.marksObtained}
                            onChange={(e) => setGradingForm({ ...gradingForm, marksObtained: e.target.value })}
                            className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-academic-gold outline-none"
                            placeholder="e.g. 8"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="rounded-lg bg-academic-gold text-academic-navy px-4 py-1.5 text-xs font-bold transition hover:bg-academic-goldhover cursor-pointer"
                          >
                            Save Score
                          </button>
                          <button
                            type="button"
                            onClick={() => setGradingForm({ assignmentId: "", marksObtained: "" })}
                            className="rounded-lg border border-slate-800 px-4 py-1.5 text-xs text-slate-300 hover:bg-slate-900 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Display existing assignments */}
                    <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl shadow-xl space-y-4">
                      <h4 className="text-sm font-bold text-white font-serif-academic border-b border-slate-900 pb-3">
                        Assignments Issued to {activeStudentRoll}
                      </h4>
                      {studentAssignments.length === 0 ? (
                        <p className="text-xs text-slate-400">No course assignments have been issued to this student yet.</p>
                      ) : (
                        <div className="space-y-4">
                          {studentAssignments.map((asg) => (
                            <div key={asg._id} className="bg-slate-900 p-4 rounded-xl border border-slate-850 text-xs flex flex-col md:flex-row justify-between gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-white">{asg.title}</p>
                                  <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold border ${
                                    asg.status === "graded" ? "bg-emerald-950/40 border-emerald-900 text-emerald-400" :
                                    asg.status === "submitted" ? "bg-blue-950/40 border-blue-900 text-blue-400" : "bg-amber-950/40 border-amber-900 text-amber-400"
                                  }`}>
                                    {asg.status}
                                  </span>
                                </div>
                                <p className="text-slate-400">Course: {asg.subjectName} ({asg.subjectCode})</p>
                                <p className="text-slate-500">Due: {new Date(asg.dueDate).toLocaleDateString()}</p>
                                {asg.submissionUrl && (
                                  <p className="text-blue-400 truncate max-w-xs mt-1">
                                    Link: <a href={asg.submissionUrl} target="_blank" rel="noreferrer" className="underline">{asg.submissionUrl}</a>
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col justify-center items-end gap-2">
                                {asg.status === "graded" ? (
                                  <span className="font-bold text-academic-gold">{asg.marksObtained} / {asg.totalMarks} Marks</span>
                                ) : (
                                  <div className="flex gap-2">
                                    {asg.status === "submitted" && (
                                      <button
                                        onClick={() => setGradingForm({ assignmentId: asg._id, marksObtained: "" })}
                                        className="rounded bg-academic-gold text-academic-navy px-3 py-1 font-bold transition hover:bg-academic-goldhover cursor-pointer"
                                      >
                                        Grade
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleDeleteAssignment(asg._id)}
                                      className="text-red-400 hover:text-red-300 font-semibold px-2 cursor-pointer"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="bg-slate-950 border border-slate-850 p-10 rounded-2xl text-center text-slate-400 text-sm">
                    Select a student from the registry sidebar to view/manage assignments.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: NOTICE PUBLISHER */}
        {activeTab === "notices" && (
          <div className="space-y-6">
            <div>
              <span className="text-xs text-academic-gold font-semibold uppercase tracking-wider">Circular System</span>
              <h3 className="text-2xl font-bold font-serif-academic text-white">Publish Notice Board Announcements</h3>
            </div>

            {/* Create notice form */}
            <form onSubmit={handleCreateNotice} className="bg-slate-950 border border-slate-850 p-6 rounded-2xl shadow-xl space-y-4">
              <h4 className="text-sm font-bold text-white font-serif-academic border-b border-slate-900 pb-2">Publish New Announcement</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Notice Title</label>
                  <input
                    type="text"
                    required
                    value={noticeForm.title}
                    onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-academic-gold outline-none"
                    placeholder="e.g. End Semester Theory Examination Form Dates"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Target Audience</label>
                  <select
                    value={noticeForm.audience}
                    onChange={(e) => setNoticeForm({ ...noticeForm, audience: e.target.value })}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-academic-gold outline-none"
                  >
                    <option value="all">Everyone (Public & Portal)</option>
                    <option value="students">Students Portal Only</option>
                    <option value="admins">Administrators Portal Only</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Detailed Notice Content</label>
                <textarea
                  required
                  rows="4"
                  value={noticeForm.body}
                  onChange={(e) => setNoticeForm({ ...noticeForm, body: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-academic-gold outline-none"
                  placeholder="Provide precise dates, details, links, or syllabus information..."
                ></textarea>
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  className="rounded-lg bg-academic-gold text-academic-navy px-4 py-2 text-xs font-bold transition hover:bg-academic-goldhover cursor-pointer"
                >
                  Publish Announcement
                </button>
              </div>
            </form>

            {/* Display active notices */}
            <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl shadow-xl space-y-4">
              <h4 className="text-sm font-bold text-white font-serif-academic border-b border-slate-900 pb-3">
                Active Announcements Circular Directory
              </h4>
              {notices.length === 0 ? (
                <p className="text-xs text-slate-400">No active announcements published on notice board.</p>
              ) : (
                <div className="space-y-4">
                  {notices.map((n) => (
                    <div key={n._id} className="bg-slate-900 p-4 rounded-xl border border-slate-850 text-xs flex justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-white">{n.title}</span>
                          <span className="bg-slate-950 border border-slate-850 px-1.5 py-0.5 rounded text-[8px] font-bold text-academic-gold uppercase tracking-wider">
                            Audience: {n.audience}
                          </span>
                        </div>
                        <p className="text-slate-400 mt-1 whitespace-pre-line leading-relaxed">{n.body}</p>
                        <p className="text-slate-500 mt-2 text-[10px]">Published: {new Date(n.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() => handleDeleteNotice(n._id)}
                          className="text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
