import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import { api } from "../../services/api";

type GenQ = {
  type: "MCQ" | "SHORT";
  prompt: string;
  options?: any;
  correctAnswer: any;
  marks: number;
  source: "AI";
};

export default function ExamAI() {
  const { examId } = useParams();
  const [provider, setProvider] = useState<"GEMINI" | "OPENAI">("GEMINI");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">(
    "MEDIUM",
  );
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [types, setTypes] = useState<{ MCQ: boolean; SHORT: boolean }>({
    MCQ: true,
    SHORT: false,
  });

  const [syllabusText, setSyllabusText] = useState("");
  const [syllabusFile, setSyllabusFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const [generated, setGenerated] = useState<GenQ[]>([]);
  const selectedTypes = useMemo(
    () =>
      Object.entries(types)
        .filter(([, v]) => v)
        .map(([k]) => k),
    [types],
  );

  const generate = async () => {
    if (!examId) return;
    setErr(null);
    setOk(null);
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("provider", provider);
      fd.append("difficulty", difficulty);
      fd.append("totalQuestions", String(totalQuestions));
      selectedTypes.forEach((t) => fd.append("types[]", t));

      if (syllabusFile) fd.append("syllabus", syllabusFile);
      if (syllabusText.trim()) fd.append("syllabusText", syllabusText.trim());

      const res = await api.post(`/exams/${examId}/ai-generate`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const qs: GenQ[] = res.data.questions || res.data?.data?.questions || [];
      setGenerated(qs);
      setOk(`Generated ${qs.length} questions.`);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  const addToExam = async () => {
    if (!examId) return;
    if (generated.length === 0) return setErr("Generate questions first.");

    setSaving(true);
    setErr(null);
    setOk(null);

    try {
      await api.post(`/exams/${examId}/questions/bulk`, {
        questions: generated.map((q) => ({
          type: q.type,
          prompt: q.prompt,
          options: q.options ?? null,
          correctAnswer: q.correctAnswer ?? null,
          marks: q.marks ?? 1,
          source: "AI",
        })),
      });

      setOk("AI questions added to exam.");
      setGenerated([]);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Failed to add to exam");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="AI Generator"
        subtitle="Upload syllabus → generate questions → add to exam"
      />

      {err && <div className="alert alert-danger">{err}</div>}
      {ok && <div className="alert alert-success">{ok}</div>}

      <div className="row g-3">
        {/* Left settings */}
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="fw-bold mb-2">Generator Settings</div>

              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label">Provider</label>
                  <select
                    className="form-select"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value as any)}
                  >
                    <option value="GEMINI">Gemini</option>
                    <option value="OPENAI">ChatGPT</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label">Difficulty</label>
                  <select
                    className="form-select"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label">Total Questions</label>
                  <input
                    type="number"
                    className="form-control"
                    min={1}
                    max={50}
                    value={totalQuestions}
                    onChange={(e) => setTotalQuestions(Number(e.target.value))}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">Types</label>
                  <div className="d-flex gap-2">
                    <label className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={types.MCQ}
                        onChange={(e) =>
                          setTypes((p) => ({ ...p, MCQ: e.target.checked }))
                        }
                      />
                      <span className="form-check-label">MCQ</span>
                    </label>
                    <label className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={types.SHORT}
                        onChange={(e) =>
                          setTypes((p) => ({ ...p, SHORT: e.target.checked }))
                        }
                      />
                      <span className="form-check-label">Short</span>
                    </label>
                  </div>
                </div>
              </div>

              <hr />

              <div className="fw-semibold mb-2">Syllabus Input</div>

              <label className="form-label">Upload PDF (optional)</label>
              <input
                type="file"
                className="form-control"
                accept=".pdf"
                onChange={(e) => setSyllabusFile(e.target.files?.[0] || null)}
              />

              <div className="text-muted small my-2 text-center">— or —</div>

              <label className="form-label">Paste Syllabus Text</label>
              <textarea
                className="form-control"
                rows={7}
                value={syllabusText}
                onChange={(e) => setSyllabusText(e.target.value)}
                placeholder="Paste chapters/topics here..."
              />

              <div className="d-flex gap-2 mt-3">
                <button
                  className="btn btn-primary"
                  onClick={generate}
                  disabled={loading || selectedTypes.length === 0}
                >
                  {loading ? "Generating..." : "Generate Draft"}
                </button>
                <button
                  className="btn btn-success"
                  onClick={addToExam}
                  disabled={saving || generated.length === 0}
                >
                  {saving ? "Saving..." : "Add to Exam"}
                </button>
              </div>

              <div className="text-muted small mt-2">
                Tip: After adding, go back to <b>Manage Exam</b> to publish.
              </div>
            </div>
          </div>
        </div>

        {/* Right preview */}
        <div className="col-12 col-lg-7">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="fw-bold">Generated Preview</div>
                <span className="text-muted small">
                  {generated.length} items
                </span>
              </div>

              {generated.length === 0 ? (
                <div className="text-muted">No generated questions yet.</div>
              ) : (
                <div className="d-grid gap-3">
                  {generated.map((q, idx) => (
                    <div key={idx} className="border rounded p-3">
                      <div className="d-flex justify-content-between">
                        <div className="fw-semibold">
                          Q{idx + 1}{" "}
                          <span className="badge bg-light text-dark ms-2">
                            {q.type}
                          </span>
                        </div>
                        <span className="badge bg-info text-dark">AI</span>
                      </div>

                      <textarea
                        className="form-control mt-2"
                        rows={3}
                        value={q.prompt}
                        onChange={(e) => {
                          const v = e.target.value;
                          setGenerated((p) =>
                            p.map((x, i) =>
                              i === idx ? { ...x, prompt: v } : x,
                            ),
                          );
                        }}
                      />

                      <div className="row g-2 mt-2">
                        <div className="col-6 col-md-3">
                          <label className="form-label">Marks</label>
                          <input
                            type="number"
                            className="form-control"
                            value={q.marks}
                            min={1}
                            onChange={(e) => {
                              const v = Number(e.target.value);
                              setGenerated((p) =>
                                p.map((x, i) =>
                                  i === idx ? { ...x, marks: v } : x,
                                ),
                              );
                            }}
                          />
                        </div>
                      </div>

                      {q.type === "MCQ" && (
                        <div className="row g-2 mt-2">
                          {(["A", "B", "C", "D"] as const).map((k) => (
                            <div key={k} className="col-12 col-md-6">
                              <label className="form-label">Option {k}</label>
                              <input
                                className="form-control"
                                value={q.options?.[k] || ""}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setGenerated((p) =>
                                    p.map((x, i) =>
                                      i === idx
                                        ? {
                                            ...x,
                                            options: {
                                              ...(x.options || {}),
                                              [k]: v,
                                            },
                                          }
                                        : x,
                                    ),
                                  );
                                }}
                              />
                            </div>
                          ))}

                          <div className="col-12 col-md-4">
                            <label className="form-label">Correct</label>
                            <select
                              className="form-select"
                              value={q.correctAnswer?.key || "A"}
                              onChange={(e) => {
                                const v = e.target.value;
                                setGenerated((p) =>
                                  p.map((x, i) =>
                                    i === idx
                                      ? { ...x, correctAnswer: { key: v } }
                                      : x,
                                  ),
                                );
                              }}
                            >
                              <option value="A">A</option>
                              <option value="B">B</option>
                              <option value="C">C</option>
                              <option value="D">D</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {q.type === "SHORT" && (
                        <div className="mt-2">
                          <label className="form-label">Model Answer</label>
                          <textarea
                            className="form-control"
                            rows={2}
                            value={q.correctAnswer?.text || ""}
                            onChange={(e) => {
                              const v = e.target.value;
                              setGenerated((p) =>
                                p.map((x, i) =>
                                  i === idx
                                    ? { ...x, correctAnswer: { text: v } }
                                    : x,
                                ),
                              );
                            }}
                          />
                        </div>
                      )}

                      <div className="text-end mt-2">
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() =>
                            setGenerated((p) => p.filter((_, i) => i !== idx))
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
