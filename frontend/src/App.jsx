import { AnimatePresence, motion } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./lib/auth.jsx";
import { Landing } from "./pages/Landing";
import { StudentLogin } from "./pages/StudentLogin";
import { StudentSignup } from "./pages/StudentSignup";
import { StudentForgotPassword } from "./pages/StudentForgotPassword";
import { AdminLogin } from "./pages/AdminLogin";
import { FacultyLogin } from "./pages/FacultyLogin";
import { StudentDashboard } from "./pages/StudentDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminResultUpload } from "./pages/AdminResultUpload";
import { UniversityInfoPage } from "./pages/UniversityInfoPage";

function ProtectedRoute({ allow, children }) {
  const { accessToken, role } = useAuth();
  if (!accessToken) return <Navigate to="/" replace />;
  if (allow && role !== allow) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
        transition={{ duration: 0.28, ease: "easeOut" }}
      >
        <Routes location={location}>
          <Route path="/" element={<Landing />} />
          <Route path="/login/student" element={<StudentLogin />} />
          <Route path="/signup/student" element={<StudentSignup />} />
          <Route path="/forgot-password/student" element={<StudentForgotPassword />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/login/faculty" element={<FacultyLogin />} />
          <Route path="/admissions" element={<UniversityInfoPage />} />
          <Route path="/results" element={<UniversityInfoPage />} />
          <Route path="/departments" element={<UniversityInfoPage />} />
          <Route path="/research" element={<UniversityInfoPage />} />
          <Route path="/scholarships" element={<UniversityInfoPage />} />
          <Route path="/placements" element={<UniversityInfoPage />} />
          <Route path="/student-portal" element={<UniversityInfoPage />} />
          <Route path="/faculty-portal" element={<UniversityInfoPage />} />
          <Route path="/about" element={<UniversityInfoPage />} />
          <Route path="/academics" element={<UniversityInfoPage />} />
          <Route path="/campus-life" element={<UniversityInfoPage />} />
          <Route path="/contact" element={<UniversityInfoPage />} />

          <Route
            path="/student"
            element={
              <ProtectedRoute allow="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allow="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/results/upload"
            element={
              <ProtectedRoute allow="admin">
                <AdminResultUpload />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
