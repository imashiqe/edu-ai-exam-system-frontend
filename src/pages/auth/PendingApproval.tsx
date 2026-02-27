import { Link } from "react-router-dom";

export default function PendingApproval() {
  return (
    <div>
      <div className="fw-bold fs-5 mb-2">Approval Pending</div>
      <div className="text-muted mb-3">
        Your teacher account is waiting for Super Admin approval.
      </div>
      <Link to="/login" className="btn lp-btn-primary btn-sm">
        Back to Login
      </Link>
    </div>
  );
}
