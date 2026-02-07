import { Navigate, Outlet } from "react-router-dom";
import { getUser } from "../utils/storage";

export default function RoleRoute({ roles }: { roles: string[] }) {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;

  // If teacher pending -> special page
  if (user.role === "TEACHER" && user.status === "PENDING") {
    return <Navigate to="/pending-approval" replace />;
  }

  if (!roles.includes(user.role)) return <Navigate to="/403" replace />;
  if (user.status !== "ACTIVE") return <Navigate to="/403" replace />;

  return <Outlet />;
}
