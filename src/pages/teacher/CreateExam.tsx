import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import { api } from "../../services/api";

export default function CreateExam() {
  const nav = useNavigate();
  const [form, setForm] = useState<any>({
    title: "",
    instructions: "",
    mode: "MANUAL",
    provider: "NONE",
    durationMinutes: 60,
    accessType: "BOTH",
  });
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    setErr(null);
    try {
      const res = await api.post("/exams", form); // teacher create exam endpoint
      const examId = res.data.exam.id;
      alert("Exam created. Add questions from backend endpoints now.");
      nav(`/t/exams/${examId}/submissions`);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Create failed");
    }
  };

  return (
    <>
      <PageHeader
        title="Create Exam"
        subtitle="Manual / AI / Hybrid exam creation."
      />
      {err && <div className="alert alert-danger">{err}</div>}

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Title</label>
              <input
                className="form-control"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">Duration (minutes)</label>
              <input
                type="number"
                className="form-control"
                value={form.durationMinutes}
                onChange={(e) =>
                  setForm({ ...form, durationMinutes: Number(e.target.value) })
                }
              />
            </div>

            <div className="col-12">
              <label className="form-label">Instructions</label>
              <textarea
                className="form-control"
                rows={3}
                value={form.instructions}
                onChange={(e) =>
                  setForm({ ...form, instructions: e.target.value })
                }
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Mode</label>
              <select
                className="form-select"
                value={form.mode}
                onChange={(e) => setForm({ ...form, mode: e.target.value })}
              >
                <option value="MANUAL">Manual</option>
                <option value="AI">AI</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">AI Provider</label>
              <select
                className="form-select"
                value={form.provider}
                onChange={(e) => setForm({ ...form, provider: e.target.value })}
              >
                <option value="NONE">None</option>
                <option value="OPENAI">ChatGPT</option>
                <option value="GEMINI">Gemini</option>
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Access Type</label>
              <select
                className="form-select"
                value={form.accessType}
                onChange={(e) =>
                  setForm({ ...form, accessType: e.target.value })
                }
              >
                <option value="BOTH">Both</option>
                <option value="LINK">Link</option>
                <option value="SECRET">Secret</option>
              </select>
            </div>
          </div>

          <div className="mt-3 d-flex gap-2">
            <button className="btn btn-primary" onClick={submit}>
              Create
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => nav("/t/exams")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
