import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import { api } from "../../services/api";

export default function Join() {
  const nav = useNavigate();
  const [secretKey, setSecretKey] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const join = async () => {
    setErr(null);
    try {
      const res = await api.post("/student/join-secret", { secretKey });
      nav(`/st/exams/${res.data.examId}`);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Invalid key");
    }
  };

  return (
    <>
      <PageHeader
        title="Join by Secret Key"
        subtitle="Enter exam key from teacher."
      />
      {err && <div className="alert alert-danger">{err}</div>}
      <div className="card shadow-sm">
        <div className="card-body d-grid gap-2">
          <input
            className="form-control"
            placeholder="Secret Key"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
          />
          <button className="btn btn-primary" onClick={join}>
            Join
          </button>
        </div>
      </div>
    </>
  );
}
