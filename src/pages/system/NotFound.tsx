import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="fw-bold fs-4">404 Not Found</div>
        <div className="text-muted mb-3">
          The page you requested does not exist.
        </div>
        <Link to="/login" className="btn btn-outline-primary btn-sm">
          Go to Login
        </Link>
      </div>
    </div>
  );
}
