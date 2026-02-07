// src/pages/teacher/ExamDetails.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import CopyButton from "../../components/ui/CopyButton";
import { api } from "../../services/api";

type QType = "MCQ" | "SHORT";

export default function ExamDetails() {
  const { examId } = useParams();

  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [savingPublish, setSavingPublish] = useState(false);

  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  // publish
  const [isActiveLink, setIsActiveLink] = useState(true);
  const [allowRetake, setAllowRetake] = useState(false);
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  // question form
  const [qType, setQType] = useState<QType>("MCQ");
  const [prompt, setPrompt] = useState("");
  const [marks, setMarks] = useState(1);

  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [optC, setOptC] = useState("");
  const [optD, setOptD] = useState("");
  const [correct, setCorrect] = useState<"A" | "B" | "C" | "D">("A");

  const [shortAnswer, setShortAnswer] = useState("");

  // ===============================
  // STUDENT LINK
  // ===============================
  const studentLink = useMemo(() => {
    const origin = window.location.origin;
    return examId ? `${origin}/st/exams/${examId}` : "";
  }, [examId]);

  // ===============================
  // LOAD EXAM
  // ===============================
  const load = async () => {
    if (!examId) return;

    setLoading(true);
    setErr(null);

    try {
      const res = await api
        .get(`/teacher/exams/${examId}`)
        .catch(() => api.get(`/exams/${examId}`));

      // supports many response formats
      const data = res.data?.data ?? res.data;
      const e = data?.exam ?? data;

      setExam(e);

      setIsActiveLink(Boolean(e.isActiveLink));
      setAllowRetake(Boolean(e.allowRetake));
      setStartsAt(e.startsAt ? toDatetimeLocal(e.startsAt) : "");
      setEndsAt(e.endsAt ? toDatetimeLocal(e.endsAt) : "");
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Failed to load exam");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [examId]);

  // ===============================
  // RESET
  // ===============================
  const resetForm = () => {
    setQType("MCQ");
    setPrompt("");
    setMarks(1);
    setOptA("");
    setOptB("");
    setOptC("");
    setOptD("");
    setCorrect("A");
    setShortAnswer("");
  };

  // ===============================
  // ADD QUESTION
  // ===============================
  const addQuestion = async () => {
    if (!examId) return;

    setErr(null);
    setOk(null);

    if (!prompt.trim()) {
      setErr("Question prompt is required");
      return;
    }

    const payload: any = {
      type: qType,
      prompt: prompt.trim(),
      marks: Number(marks) || 1,
      source: "MANUAL",
    };

    if (qType === "MCQ") {
      if (!optA || !optB || !optC || !optD) {
        setErr("All options are required");
        return;
      }
      payload.options = { A: optA, B: optB, C: optC, D: optD };
      payload.correctAnswer = correct;
    } else {
      payload.correctAnswer = shortAnswer?.trim() || null;
    }

    try {
      await api
        .post(`/teacher/exams/${examId}/questions`, payload)
        .catch(() => api.post(`/exams/${examId}/questions`, payload));

      setOk("Question added");
      resetForm();
      await load();
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Failed to add question");
    }
  };

  // ===============================
  // DELETE
  // ===============================
  const removeQuestion = async (questionId: string) => {
    if (!examId) return;
    if (!confirm("Delete this question?")) return;

    try {
      await api
        .delete(`/teacher/exams/${examId}/questions/${questionId}`)
        .catch(() => api.delete(`/exams/${examId}/questions/${questionId}`));

      setOk("Question deleted");
      await load();
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Failed");
    }
  };

  // ===============================
  // SAVE PUBLISH
  // ===============================
  const savePublishSettings = async () => {
    if (!examId) return;

    setSavingPublish(true);
    setErr(null);
    setOk(null);

    try {
      await api
        .patch(`/teacher/exams/${examId}`, {
          isActiveLink,
          allowRetake,
          startsAt: startsAt ? new Date(startsAt).toISOString() : null,
          endsAt: endsAt ? new Date(endsAt).toISOString() : null,
        })
        .catch(() =>
          api.patch(`/exams/${examId}`, {
            isActiveLink,
            allowRetake,
            startsAt: startsAt ? new Date(startsAt).toISOString() : null,
            endsAt: endsAt ? new Date(endsAt).toISOString() : null,
          }),
        );

      setOk("Saved");
      await load();
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Failed");
    } finally {
      setSavingPublish(false);
    }
  };

  const questions = exam?.questions || [];

  // ===============================
  // UI
  // ===============================
  return (
    <>
      <PageHeader
        title="Manage Exam"
        subtitle={exam?.title || ""}
        right={
          <div className="d-flex gap-2">
            <Link className="btn btn-outline-secondary btn-sm" to="/t/exams">
              Back
            </Link>
            <Link
              className="btn btn-outline-info btn-sm"
              to={`/t/exams/${examId}/ai`}
            >
              AI Generator
            </Link>
            <Link
              className="btn btn-outline-primary btn-sm"
              to={`/t/exams/${examId}/submissions`}
            >
              Submissions
            </Link>
          </div>
        }
      />

      {err && <div className="alert alert-danger">{err}</div>}
      {ok && <div className="alert alert-success">{ok}</div>}

      {/* ================= Publish ================= */}
      <div className="row g-3 mb-3">
        <div className="col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="fw-semibold mb-2">Access</div>

              <div className="mb-2">
                <div className="small text-muted">Student Link</div>
                <div className="d-flex gap-2">
                  <code className="flex-grow-1">{studentLink}</code>
                  <CopyButton text={studentLink} />
                </div>
              </div>

              <div className="mb-3">
                <div className="small text-muted">Secret Key</div>
                <div className="d-flex gap-2">
                  <code className="flex-grow-1">{exam?.secretKey}</code>
                  {exam?.secretKey && <CopyButton text={exam.secretKey} />}
                </div>
              </div>

              <div className="form-check form-switch">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={isActiveLink}
                  onChange={(e) => setIsActiveLink(e.target.checked)}
                />
                <label className="form-check-label">Active</label>
              </div>

              <div className="form-check form-switch mt-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={allowRetake}
                  onChange={(e) => setAllowRetake(e.target.checked)}
                />
                <label className="form-check-label">Allow Retake</label>
              </div>

              <button
                className="btn btn-primary mt-3"
                onClick={savePublishSettings}
                disabled={savingPublish}
              >
                {savingPublish ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>

        {/* ================= Questions ================= */}
        <div className="col-lg-7">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="fw-semibold mb-2">
                Questions ({questions.length})
              </div>

              <table className="table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Prompt</th>
                    <th>Marks</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((q: any) => (
                    <tr key={q.id}>
                      <td>{q.type}</td>
                      <td className="text-truncate" style={{ maxWidth: 300 }}>
                        {q.prompt}
                      </td>
                      <td>{q.marks}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => removeQuestion(q.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {questions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center text-muted">
                        No questions
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ADD ================= */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="fw-semibold mb-2">Add Question</div>

          <div className="mb-2">
            <select
              className="form-select"
              value={qType}
              onChange={(e) => setQType(e.target.value as QType)}
            >
              <option value="MCQ">MCQ</option>
              <option value="SHORT">SHORT</option>
            </select>
          </div>

          <textarea
            className="form-control mb-2"
            rows={3}
            placeholder="Question..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <input
            type="number"
            className="form-control mb-2"
            value={marks}
            onChange={(e) => setMarks(Number(e.target.value))}
          />

          {qType === "MCQ" ? (
            <>
              <input
                className="form-control mb-2"
                placeholder="Option A"
                value={optA}
                onChange={(e) => setOptA(e.target.value)}
              />
              <input
                className="form-control mb-2"
                placeholder="Option B"
                value={optB}
                onChange={(e) => setOptB(e.target.value)}
              />
              <input
                className="form-control mb-2"
                placeholder="Option C"
                value={optC}
                onChange={(e) => setOptC(e.target.value)}
              />
              <input
                className="form-control mb-2"
                placeholder="Option D"
                value={optD}
                onChange={(e) => setOptD(e.target.value)}
              />

              <select
                className="form-select mb-2"
                value={correct}
                onChange={(e) => setCorrect(e.target.value as any)}
              >
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
              </select>
            </>
          ) : (
            <textarea
              className="form-control mb-2"
              placeholder="Model answer"
              value={shortAnswer}
              onChange={(e) => setShortAnswer(e.target.value)}
            />
          )}

          <div className="d-flex gap-2">
            <button className="btn btn-primary" onClick={addQuestion}>
              Add
            </button>
            <button className="btn btn-outline-secondary" onClick={resetForm}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function toDatetimeLocal(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate(),
  )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
