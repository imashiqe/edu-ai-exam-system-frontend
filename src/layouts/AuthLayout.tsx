import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-vh-100 d-flex align-items-center auth-bg">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-7 col-lg-5">
            {/* Brand */}
            <div className="text-center mb-4">
              <Link to="/" className="text-decoration-none">
                <div className="d-inline-flex align-items-center gap-2">
                  <div className="logo-circle" />
                  <div>
                    <div className="fw-bold fs-4 text-dark">
                      Edu Exam System
                    </div>
                    <div className="text-muted small">
                      AI + Manual Exam Platform
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Card */}
            <div className="card border-0 shadow-lg">
              <div className="card-body p-4 p-md-5">
                <Outlet />
              </div>
            </div>

            {/* Footer note */}
            <div className="text-center text-muted small mt-4">
              Final Year Thesis Project • Secure • Role Based • AI Powered
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
