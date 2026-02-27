import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/auth";
import { setAuth } from "../../utils/storage";
import { toast } from "react-toastify";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@uni.com");
  const [password, setPassword] = useState("Admin@12345");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login(email, password);
      setAuth(res.accessToken, res.user);

      toast.success("Login successful ");

      // redirect by role
      const role = res.user.role;
      if (role === "SUPER_ADMIN") nav("/sa");
      else if (role === "TEACHER") nav("/t");
      else nav("/st");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Login failed ❌");
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

        <button className="btn lp-btn-primary" disabled={loading}>
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
