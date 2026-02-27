import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerStudent } from "../../services/auth";
import { toast } from "react-toastify";

export default function RegisterStudent() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    institute: "",
    phone: "",
    email: "",
    password: "",
  });

  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerStudent(form);
      toast.success("Account created successfully ");

      setTimeout(() => nav("/login"), 800);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Registration failed ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fw-bold fs-5 mb-2">Register Student</div>

      <form onSubmit={submit} className="d-grid gap-2">
        <input
          className="form-control"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="form-control"
          placeholder="Institute"
          value={form.institute}
          onChange={(e) => setForm({ ...form, institute: e.target.value })}
        />
        <input
          className="form-control"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          className="form-control"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="form-control"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button className="btn lp-btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>

      <div className="mt-3 small">
        <Link to="/login">Back to login</Link>
      </div>
    </>
  );
}
