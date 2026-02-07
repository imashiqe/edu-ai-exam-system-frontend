import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerStudent } from "../../services/auth";

export default function RegisterStudent() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    institute: "",
    phone: "",
    email: "",
    password: "",
  });
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const submit = async (e: any) => {
    e.preventDefault();
    setErr(null);
    setOk(null);
    try {
      await registerStudent(form);
      setOk("Student registered. Now login.");
      setTimeout(() => nav("/login"), 600);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Failed");
    }
  };

  return (
    <>
      <div className="fw-bold fs-5 mb-2">Register Student</div>
      {err && <div className="alert alert-danger">{err}</div>}
      {ok && <div className="alert alert-success">{ok}</div>}

      <form onSubmit={submit} className="d-grid gap-2">
        <input
          className="form-control"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
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
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="form-control"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="btn btn-primary">Create account</button>
      </form>

      <div className="mt-3 small">
        <Link to="/login">Back to login</Link>
      </div>
    </>
  );
}
