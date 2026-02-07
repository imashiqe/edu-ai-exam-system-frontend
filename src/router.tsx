// src/router.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./guards/ProtectedRoute";
import RoleRoute from "./guards/RoleRoute";

// Auth pages
import Login from "./pages/auth/Login";
import RegisterStudent from "./pages/auth/RegisterStudent";
import RegisterTeacher from "./pages/auth/RegisterTeacher";
import PendingApproval from "./pages/auth/PendingApproval";

// System pages
import Forbidden from "./pages/system/Forbidden";
import NotFound from "./pages/system/NotFound";

// Super Admin pages
import SADashboard from "./pages/superadmin/Dashboard";
import SAApprovals from "./pages/superadmin/Approvals";
import SAUsers from "./pages/superadmin/Users";
import SASettings from "./pages/superadmin/Settings";

// Teacher pages
import TDashboard from "./pages/teacher/Dashboard";
import TExams from "./pages/teacher/Exams";
import TCreateExam from "./pages/teacher/CreateExam";
import TExamDetails from "./pages/teacher/ExamDetails";
import TSubmissions from "./pages/teacher/Submissions";
import TGradeAttempt from "./pages/teacher/GradeAttempt";
import TSendExam from "./pages/teacher/SendExam";
import ExamAI from "./pages/teacher/ExamAI";

// Student pages
import STDashboard from "./pages/student/Dashboard";
import STExams from "./pages/student/Exams";
import STJoin from "./pages/student/Join";
import STExamDetails from "./pages/student/ExamDetails";
import STStartExam from "./pages/student/StartExam";
import STAttempts from "./pages/student/Attempts";
import STResults from "./pages/student/Results";
import Landing from "./pages/public/Landing";

export const router = createBrowserRouter([
  /**
   * Public/Auth area
   */
  { path: "/", element: <Landing /> },
  {
    element: <AuthLayout />,
    children: [
      // ✅ Home redirect (prevents "/" showing 404)

      //   { path: "/", element: <Navigate to="/login" replace /> },

      { path: "/login", element: <Login /> },
      { path: "/register/student", element: <RegisterStudent /> },
      { path: "/register/teacher", element: <RegisterTeacher /> },
      { path: "/pending-approval", element: <PendingApproval /> },

      // system
      { path: "/403", element: <Forbidden /> },
    ],
  },

  /**
   * Protected Dashboard area
   */
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          // ✅ If someone goes to "/" while logged in, redirect to role home
          // (Optional but very useful)
          {
            path: "/home",
            element: <RoleHomeRedirect />,
          },

          /**
           * Super Admin
           */
          {
            element: <RoleRoute roles={["SUPER_ADMIN"]} />,
            children: [
              { path: "/sa", element: <SADashboard /> },
              { path: "/sa/approvals", element: <SAApprovals /> },
              { path: "/sa/users", element: <SAUsers /> },
              { path: "/sa/settings", element: <SASettings /> },
            ],
          },

          /**
           * Teacher
           */
          {
            element: <RoleRoute roles={["TEACHER"]} />,
            children: [
              { path: "/t", element: <TDashboard /> },
              { path: "/t/exams", element: <TExams /> },
              { path: "/t/exams/new", element: <TCreateExam /> },
              { path: "/t/exams/:examId/ai", element: <ExamAI /> },
              { path: "/t/exams/:examId", element: <TExamDetails /> },

              {
                path: "/t/exams/:examId/submissions",
                element: <TSubmissions />,
              },
              {
                path: "/t/attempts/:attemptId/grade",
                element: <TGradeAttempt />,
              },
              { path: "/t/exams/:examId/send", element: <TSendExam /> },
            ],
          },

          /**
           * Student
           */
          {
            element: <RoleRoute roles={["STUDENT"]} />,
            children: [
              { path: "/st", element: <STDashboard /> },
              { path: "/st/exams", element: <STExams /> },
              { path: "/st/join", element: <STJoin /> },
              { path: "/st/exams/:examId", element: <STExamDetails /> },
              { path: "/st/exams/:examId/start", element: <STStartExam /> },
              { path: "/st/attempts", element: <STAttempts /> },
              { path: "/st/results", element: <STResults /> },
            ],
          },

          // fallback inside dashboard
          { path: "*", element: <NotFound /> },
        ],
      },
    ],
  },

  // global fallback
  { path: "*", element: <NotFound /> },
]);

/**
 * Helper component: Redirect logged-in users to their default dashboard
 * You can navigate to "/home" after login instead of role checking.
 */
function RoleHomeRedirect() {
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "SUPER_ADMIN") return <Navigate to="/sa" replace />;
  if (user.role === "TEACHER") {
    if (user.status === "PENDING")
      return <Navigate to="/pending-approval" replace />;
    return <Navigate to="/t" replace />;
  }
  return <Navigate to="/st" replace />;
}
