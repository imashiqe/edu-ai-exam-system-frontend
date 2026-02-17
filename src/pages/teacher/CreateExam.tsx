import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import { api } from "../../services/api";
import { toast } from "react-toastify";

const MODES = ["MANUAL", "AI", "HYBRID"] as const;
const PROVIDERS = ["NONE", "OPENAI", "GEMINI"] as const;
const ACCESS = ["BOTH", "LINK", "SECRET"] as const;

export default function CreateExam() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    title: "",
    instructions: "",
    mode: "MANUAL" as (typeof MODES)[number],
    provider: "NONE" as (typeof PROVIDERS)[number],
    durationMinutes: 60,
    accessType: "BOTH" as (typeof ACCESS)[number],
  });

  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    setErr(null);

    if (!form.title.trim()) {
      const msg = "Title is required";
      setErr(msg);
      toast.error(msg);
      return;
    }
    if (!form.durationMinutes || form.durationMinutes < 1) {
      const msg = "Duration must be at least 1 minute";
      setErr(msg);
      toast.error(msg);
      return;
    }

    const payload = {
      title: form.title.trim(),
      instructions: form.instructions?.trim() || null,
      mode: form.mode,
      provider: form.mode === "MANUAL" ? "NONE" : form.provider,
      durationMinutes: Number(form.durationMinutes),
      accessType: form.accessType,
    };

    setLoading(true);
    try {
      // ✅ Correct endpoint for teacher create
      const res = await api.post("/teacher/exams", payload);

      const data = res.data;

      const examId =
        data?.exam?.id ||
        data?.data?.exam?.id ||
        data?.id ||
        data?.examId ||
        data?.data?.id;

      if (!examId) {
        console.log("CREATE EXAM RAW RESPONSE:", data);
        throw new Error("Create response missing exam id");
      }

      toast.success("Exam created. Now add questions.");
      nav(`/t/exams/${examId}`);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Create failed";
      setErr(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
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
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Mid Term - CSE 305"
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Duration (minutes)</label>
              <input
                type="number"
                className="form-control"
                value={form.durationMinutes}
                min={1}
                onChange={(e) => set("durationMinutes", Number(e.target.value))}
              />
            </div>

            <div className="col-12">
              <label className="form-label">Instructions</label>
              <textarea
                className="form-control"
                rows={3}
                value={form.instructions}
                onChange={(e) => set("instructions", e.target.value)}
                placeholder="Optional instructions for students"
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Mode</label>
              <select
                className="form-select"
                value={form.mode}
                onChange={(e) => {
                  const mode = e.target.value as any;
                  set("mode", mode);
                  if (mode === "MANUAL") set("provider", "NONE");
                }}
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
                onChange={(e) => set("provider", e.target.value)}
                disabled={form.mode === "MANUAL"}
              >
                <option value="NONE">None</option>
                <option value="OPENAI">ChatGPT</option>
                <option value="GEMINI">Gemini</option>
              </select>
              {form.mode === "MANUAL" && (
                <div className="text-muted small mt-1">
                  Provider disabled in Manual mode.
                </div>
              )}
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Access Type</label>
              <select
                className="form-select"
                value={form.accessType}
                onChange={(e) => set("accessType", e.target.value)}
              >
                <option value="BOTH">Both</option>
                <option value="LINK">Link</option>
                <option value="SECRET">Secret</option>
              </select>
            </div>
          </div>

          <div className="mt-3 d-flex gap-2">
            <button
              className="btn btn-primary"
              onClick={submit}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>

            <button
              className="btn btn-outline-secondary"
              onClick={() => nav("/t/exams")}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
