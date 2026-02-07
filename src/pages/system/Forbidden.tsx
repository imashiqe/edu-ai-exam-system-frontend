import { Link } from "react-router-dom";

export default function Forbidden() {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="fw-bold fs-4">403 Forbidden</div>
        <div className="text-muted mb-3">
          You don’t have permission to access this page.
        </div>
        <Link to="/login" className="btn btn-outline-primary btn-sm">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
