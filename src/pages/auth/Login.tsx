import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/auth";
import { setAuth } from "../../utils/storage";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@uni.com");
  const [password, setPassword] = useState("Admin@12345");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await login(email, password);
      setAuth(res.accessToken, res.user);
      // redirect by role
      const role = res.user.role;
      if (role === "SUPER_ADMIN") nav("/sa");
      else if (role === "TEACHER") nav("/t");
      else nav("/st");
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fw-bold fs-5 mb-2">Login</div>
      <div className="text-muted mb-3">
        Use your account to access dashboard.
      </div>

      {err && <div className="alert alert-danger">{err}</div>}

      <form onSubmit={onSubmit} className="d-grid gap-2">
        <input
          className="form-control"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="form-control"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>

      <div className="d-flex justify-content-between mt-3 small">
        <Link to="/register/student">Register Student</Link>
        <Link to="/register/teacher">Register Teacher</Link>
      </div>
    </>
  );
}
