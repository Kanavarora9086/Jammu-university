import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./lib/auth.jsx";
import { Landing } from "./pages/Landing";
import { StudentLogin } from "./pages/StudentLogin";
import { StudentSignup } from "./pages/StudentSignup";
import { StudentForgotPassword } from "./pages/StudentForgotPassword";
import { AdminLogin } from "./pages/AdminLogin";
import { StudentDashboard } from "./pages/StudentDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminResultUpload } from "./pages/AdminResultUpload";

function ProtectedRoute({ allow, children }) {
  const { accessToken, role } = useAuth();
  if (!accessToken) return <Navigate to="/" replace />;
  if (allow && role !== allow) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login/student" element={<StudentLogin />} />
      <Route path="/signup/student" element={<StudentSignup />} />
      <Route path="/forgot-password/student" element={<StudentForgotPassword />} />
      <Route path="/login/admin" element={<AdminLogin />} />

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
  );
}
