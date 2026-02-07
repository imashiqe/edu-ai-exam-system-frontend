import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import { api } from "../../services/api";

type AttemptAnswer = {
  id: string;
  response: any;
  autoScore: number | null;
  teacherScore: number | null;
  feedback: string | null;
  question: {
    id: string;
    type: "MCQ" | "SHORT";
    prompt: string;
    options?: any;
    correctAnswer?: any;
    marks: number;
  };
};

type AttemptDetails = {
  id: string;
  status: string;
  score: number | null;
  submittedAt: string | null;
  startedAt: string;
  timeTakenSec: number;
  retakeNo: number;
  isInstant: boolean;
  exam: { id: string; title: string };
  student: {
    id: string;
    name: string;
    email: string;
    institute?: string | null;
  };
  answers: AttemptAnswer[];
};

const API = {
  getAttempt: (attemptId: string) => `/teacher/attempts/${attemptId}`,
  saveGrade: (attemptId: string) => `/teacher/attempts/${attemptId}/grade`,
  publish: (attemptId: string) => `/teacher/attempts/${attemptId}/publish`,
};

// If your backend uses non-teacher routes, switch to this:
// const API = {
//   getAttempt: (attemptId: string) => `/attempts/${attemptId}`,
//   saveGrade: (attemptId: string) => `/attempts/${attemptId}/grade`,
//   publish: (attemptId: string) => `/attempts/${attemptId}/publish`,
// };

type EditRow = { teacherScore: string; feedback: string };

export default function GradeAttempt() {
  const { attemptId } = useParams();

  const [data, setData] = useState<AttemptDetails | null>(null);
  const [edit, setEdit] = useState<Record<string, EditRow>>({}); // answerId -> edits

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const load = async () => {
    if (!attemptId) return;
    setLoading(true);
    setErr(null);
    setOk(null);

    try {
      const res = await api.get(API.getAttempt(attemptId));
      const attempt: AttemptDetails = res.data.attempt || res.data;

      setData(attempt);

      // Build edit state from server values
      const init: Record<string, EditRow> = {};
      for (const a of attempt.answers || []) {
        init[a.id] = {
          teacherScore:
            a.teacherScore !== null && a.teacherScore !== undefined
              ? String(a.teacherScore)
              : "",
          feedback: a.feedback || "",
        };
      }
      setEdit(init);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Failed to load attempt");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId]);

  const maxMarks = useMemo(() => {
    if (!data?.answers) return 0;
    return data.answers.reduce((sum, a) => sum + (a.question?.marks || 0), 0);
  }, [data]);

  const computedTotal = useMemo(() => {
    if (!data?.answers) return 0;

    return data.answers.reduce((sum, a) => {
      const qMarks = a.question?.marks || 0;

      // If teacherScore provided -> use it
      const sRaw = edit[a.id]?.teacherScore ?? "";
      const hasTeacher = sRaw !== "" && sRaw !== null && sRaw !== undefined;

      if (hasTeacher) {
        const n = Number(sRaw);
        if (Number.isFinite(n)) return sum + clamp(n, 0, qMarks);
      }

      // Else fallback to autoScore if exists
      if (a.autoScore !== null && a.autoScore !== undefined) {
        return sum + clamp(a.autoScore, 0, qMarks);
      }

      return sum;
    }, 0);
  }, [data, edit]);

  const buildPayload = () => {
    if (!data?.answers) return [];

    return data.answers.map((a) => {
      const qMarks = a.question?.marks || 0;

      const sRaw = edit[a.id]?.teacherScore ?? "";
      const teacherScore = sRaw === "" ? null : clamp(Number(sRaw), 0, qMarks);

      const feedback = (edit[a.id]?.feedback ?? "").trim() || null;

      return { answerId: a.id, teacherScore, feedback };
    });
  };

  const saveGrade = async () => {
    if (!attemptId || !data) return;

    setSaving(true);
    setErr(null);
    setOk(null);

    try {
      const payload = buildPayload();

      await api.patch(API.saveGrade(attemptId), { answers: payload });
      setOk("Grading saved.");
      await load();
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        JSON.stringify(e?.response?.data || {}) ||
        "Failed to save grade";
      setErr(msg);
    } finally {
      setSaving(false);
    }
  };

  const publish = async () => {
    if (!attemptId) return;
    if (!confirm("Publish this result? Students will see the score.")) return;

    setPublishing(true);
    setErr(null);
    setOk(null);

    try {
      // Best practice: save grade before publish (ensures latest inputs)
      await saveGrade();

      await api.post(API.publish(attemptId), {});
      setOk("Result published.");
      await load();
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        JSON.stringify(e?.response?.data || {}) ||
        "Failed to publish result";
      setErr(msg);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Grade Attempt"
        subtitle={
          data
            ? `${data.exam?.title} • ${data.student?.name} • Retake #${data.retakeNo}`
            : "Loading..."
        }
        right={
          <div className="d-flex gap-2">
            <Link className="btn btn-outline-secondary btn-sm" to="/t/exams">
              Back
            </Link>
            {data?.exam?.id && (
              <Link
                className="btn btn-outline-primary btn-sm"
                to={`/t/exams/${data.exam.id}/submissions`}
              >
                Submissions
              </Link>
            )}
          </div>
        }
      />

      {err && <div className="alert alert-danger">{err}</div>}
      {ok && <div className="alert alert-success">{ok}</div>}

      {/* Top summary */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          {loading && <div className="text-muted">Loading attempt...</div>}

          {data && (
            <div className="row g-3">
              <div className="col-12 col-lg-6">
                <div className="fw-semibold">Student</div>
                <div>{data.student.name}</div>
                <div className="text-muted small">{data.student.email}</div>
                {data.student.institute && (
                  <div className="text-muted small">
                    Institute: {data.student.institute}
                  </div>
                )}
              </div>

              <div className="col-12 col-lg-6">
                <div className="d-flex justify-content-lg-end gap-2 align-items-center">
                  <StatusBadge value={data.status} />
                  <span className="badge bg-light text-dark">
                    Total: {computedTotal}/{maxMarks}
                  </span>
                  <span className="badge bg-light text-dark">
                    Instant: {String(data.isInstant)}
                  </span>
                </div>

                <div className="text-muted small mt-2 text-lg-end">
                  Submitted:{" "}
                  {data.submittedAt
                    ? new Date(data.submittedAt).toLocaleString()
                    : "-"}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-3 d-flex gap-2">
            <button
              className="btn btn-primary"
              onClick={saveGrade}
              disabled={!data || saving || loading}
            >
              {saving ? "Saving..." : "Save Grade"}
            </button>

            <button
              className="btn btn-success"
              onClick={publish}
              disabled={!data || publishing || loading}
            >
              {publishing ? "Publishing..." : "Publish Result"}
            </button>

            <button
              className="btn btn-outline-secondary"
              onClick={load}
              disabled={loading}
            >
              Refresh
            </button>
          </div>

          <div className="text-muted small mt-2">
            Tip: Leave <b>Teacher Score</b> empty to use <b>Auto Score</b>{" "}
            (MCQ).
          </div>
        </div>
      </div>

      {/* Answers grading table */}
      <div className="card shadow-sm">
        <div className="card-body">
          {!data?.answers?.length ? (
            <div className="text-muted">No answers found.</div>
          ) : (
            <div className="d-grid gap-3">
              {data.answers.map((a, idx) => {
                const qMarks = a.question?.marks || 0;
                const teacherScoreRaw = edit[a.id]?.teacherScore ?? "";
                const feedback = edit[a.id]?.feedback ?? "";

                return (
                  <div key={a.id} className="border rounded p-3">
                    <div className="d-flex justify-content-between gap-2">
                      <div className="fw-semibold">
                        Q{idx + 1}: {a.question.prompt}
                        <div className="text-muted small">
                          Type: {a.question.type} • Marks: {qMarks}
                        </div>
                      </div>

                      <div className="text-end">
                        {a.autoScore !== null && a.autoScore !== undefined && (
                          <div className="text-muted small">
                            Auto: <b>{a.autoScore}</b>
                          </div>
                        )}
                        {a.teacherScore !== null &&
                          a.teacherScore !== undefined && (
                            <div className="text-muted small">
                              Saved Teacher: <b>{a.teacherScore}</b>
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Student response */}
                    <div className="mt-2">
                      <div className="text-muted small mb-1">
                        Student Answer
                      </div>
                      <div className="bg-light border rounded p-2">
                        <pre
                          className="mb-0"
                          style={{ whiteSpace: "pre-wrap" }}
                        >
                          {prettyResponse(a)}
                        </pre>
                      </div>
                    </div>

                    {/* If MCQ show options & correct */}
                    {a.question.type === "MCQ" && (
                      <div className="mt-2">
                        <div className="text-muted small mb-1">Options</div>
                        <div className="row g-2">
                          {renderOptions(a.question.options).map((o) => (
                            <div key={o.key} className="col-12 col-md-6">
                              <div className="border rounded p-2">
                                <b className="me-2">{o.key}.</b>
                                {o.label}
                              </div>
                            </div>
                          ))}
                        </div>
                        {a.question.correctAnswer !== null &&
                          a.question.correctAnswer !== undefined && (
                            <div className="text-muted small mt-2">
                              Correct (stored):{" "}
                              <code>
                                {JSON.stringify(a.question.correctAnswer)}
                              </code>
                            </div>
                          )}
                      </div>
                    )}

                    {/* Grading inputs */}
                    <div className="row g-2 mt-3">
                      <div className="col-12 col-md-3">
                        <label className="form-label">Teacher Score</label>
                        <input
                          type="number"
                          className="form-control"
                          min={0}
                          max={qMarks}
                          placeholder={`0 - ${qMarks}`}
                          value={teacherScoreRaw}
                          onChange={(e) => {
                            const v = e.target.value;
                            setEdit((p) => ({
                              ...p,
                              [a.id]: { ...p[a.id], teacherScore: v },
                            }));
                          }}
                        />
                        <div className="text-muted small">
                          Max: {qMarks} (leave empty to use auto)
                        </div>
                      </div>

                      <div className="col-12 col-md-9">
                        <label className="form-label">Feedback</label>
                        <input
                          className="form-control"
                          placeholder="Optional feedback for student..."
                          value={feedback}
                          onChange={(e) => {
                            const v = e.target.value;
                            setEdit((p) => ({
                              ...p,
                              [a.id]: { ...p[a.id], feedback: v },
                            }));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function clamp(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function prettyResponse(a: AttemptAnswer) {
  const r = a.response;
  if (r === null || r === undefined) return "-";
  if (typeof r === "string") return r;
  return JSON.stringify(r, null, 2);
}

function renderOptions(options: any): Array<{ key: string; label: string }> {
  if (!options) return [];
  if (Array.isArray(options)) {
    return options.map((x: any, idx: number) => ({
      key: String(idx + 1),
      label: String(x),
    }));
  }
  if (typeof options === "object") {
    return Object.entries(options).map(([k, v]) => ({
      key: String(k),
      label: String(v),
    }));
  }
  return [];
}
