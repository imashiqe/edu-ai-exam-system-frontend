import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearAuth, getUser } from "../utils/storage";

function SidebarLinks() {
  const u = getUser();
  if (!u) return null;

  const link = (to: string, label: string) => (
    <NavLink
      to={to}
      end={to === "/sa" || to === "/t" || to === "/st"}
      className={({ isActive }) =>
        `d-block px-3 py-2 text-decoration-none rounded ${
          isActive ? "bg-primary text-white" : "text-dark"
        }`
      }
    >
      {label}
    </NavLink>
  );

  if (u.role === "SUPER_ADMIN") {
    return (
      <>
        {link("/sa", "Overview")}
        {link("/sa/approvals", "Teacher Approvals")}
        {link("/sa/users", "Users")}
        {link("/sa/settings", "Settings")}
      </>
    );
  }

  if (u.role === "TEACHER") {
    return (
      <>
        {link("/t", "Overview")}
        {link("/t/exams", "Exams")}
        {link("/t/exams/new", "Create Exam")}
      </>
    );
  }

  return (
    <>
      {link("/st", "Overview")}
      {link("/st/exams", "Available Exams")}
      {link("/st/join", "Join by Key")}
      {link("/st/attempts", "My Attempts")}
      {link("/st/results", "Results")}
    </>
  );
}

export default function DashboardLayout() {
  const nav = useNavigate();
  const user = getUser();

  const logout = () => {
    clearAuth();
    nav("/login");
  };

  return (
    <div className="d-flex">
      <aside
        className="border-end bg-white"
        style={{ width: 260, minHeight: "100vh" }}
      >
        <div className="p-3 border-bottom">
          <div className="fw-bold">Edu Ai Exam System</div>
          <div className="text-muted small">
            {user?.role} • {user?.status}
          </div>
        </div>
        <div className="p-2">
          <div className="text-uppercase text-muted small px-2 mt-2 mb-2">
            Menu
          </div>
          <SidebarLinks />
        </div>
      </aside>

      <main className="flex-grow-1 bg-light">
        <header className="border-bottom bg-white">
          <div className="d-flex align-items-center justify-content-between p-3">
            <div className="fw-semibold">Dashboard</div>
            <div className="d-flex gap-2 align-items-center">
              <div className="text-muted small">{user?.email}</div>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="container-fluid p-3 p-md-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
