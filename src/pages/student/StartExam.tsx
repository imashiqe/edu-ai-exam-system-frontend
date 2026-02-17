// src/pages/student/StartExam.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import { api } from "../../services/api";
import { getUser } from "../../utils/storage";
import { toast } from "react-toastify";

type Question = {
  id: string;
  type: "MCQ" | "SHORT";
  prompt: string;
  options?: any; // JSON object like {A:"..",B:".."} OR array
  marks: number;
};

type Exam = {
  id: string;
  title: string;
  instructions?: string | null;
  durationMinutes: number;
  questions: Question[];
  teacher?: { name?: string; institute?: string };
};

type AnswerMap = Record<string, any>;

function formatTime(sec: number) {
  const s = Math.max(0, sec);
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return hh > 0 ? `${pad(hh)}:${pad(mm)}:${pad(ss)}` : `${pad(mm)}:${pad(ss)}`;
}

export default function StartExam() {
  const { examId } = useParams();
  const nav = useNavigate();
  const user = getUser();

  const [exam, setExam] = useState<Exam | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<Date | null>(null);

  const [answers, setAnswers] = useState<AnswerMap>({});
  const [activeQ, setActiveQ] = useState<string | null>(null);

  const [remainingSec, setRemainingSec] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // UX / security
  const [tabWarnings, setTabWarnings] = useState(0);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isFs, setIsFs] = useState<boolean>(!!document.fullscreenElement);

  const tickRef = useRef<number | null>(null);
  const autosaveQueueRef = useRef<Array<{ at: number; answers: any[] }>>([]);
  const lowTimeWarnedRef = useRef(false);
  const last10BeepRef = useRef<number>(-1);

  const storageKey = useMemo(() => {
    const uid = user?.id || "anon";
    return `exam_attempt:${uid}:${examId}`;
  }, [user?.id, examId]);

  const saveDraft = (draft: {
    attemptId?: string;
    startedAt?: string;
    answers?: AnswerMap;
    tabWarnings?: number;
  }) => {
    try {
      const prev = localStorage.getItem(storageKey);
      const prevObj = prev ? JSON.parse(prev) : {};
      localStorage.setItem(
        storageKey,
        JSON.stringify({ ...prevObj, ...draft }),
      );
    } catch {
      // ignore
    }
  };

  const loadDraft = (): {
    attemptId?: string;
    startedAt?: string;
    answers?: AnswerMap;
    tabWarnings?: number;
  } | null => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const clearDraft = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  };

  // ---------- audio beep ----------
  const beep = () => {
    try {
      const AudioCtx = (window.AudioContext ||
        (window as any).webkitAudioContext) as any;
      const ctx = new AudioCtx();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 880;
      o.connect(g);
      g.connect(ctx.destination);
      g.gain.setValueAtTime(0.06, ctx.currentTime);
      o.start();
      o.stop(ctx.currentTime + 0.14);
    } catch {
      // browser may block; ignore
    }
  };

  // ---------- build payload ----------
  const questions = exam?.questions || [];

  const buildPayload = () => {
    return questions.map((q) => ({
      questionId: q.id,
      response: answers[q.id] ?? null,
    }));
  };

  const progress = useMemo(() => {
    const total = questions.length || 0;
    const answered = questions.reduce((acc, q) => {
      const v = answers[q.id];
      const ok =
        q.type === "MCQ"
          ? !!v
          : typeof v === "string"
            ? v.trim().length > 0
            : !!v;
      return acc + (ok ? 1 : 0);
    }, 0);
    return { total, answered };
  }, [questions, answers]);

  const activeQuestion = useMemo(
    () => questions.find((q) => q.id === activeQ) || null,
    [questions, activeQ],
  );

  const setMCQ = (qid: string, choice: string) =>
    setAnswers((p) => ({ ...p, [qid]: choice }));
  const setShort = (qid: string, text: string) =>
    setAnswers((p) => ({ ...p, [qid]: text }));

  // ---------- fullscreen helpers ----------
  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      toast.info("Fullscreen enabled");
    } catch {
      toast.warn("Fullscreen not allowed by browser");
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const onFs = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  // ---------- 1) Load exam + restore draft + start attempt ----------
  useEffect(() => {
    (async () => {
      if (!examId) return;
      setLoading(true);
      setErr(null);

      try {
        const examRes = await api.get(`/student/exams/${examId}`);
        const e: Exam = examRes.data.exam;

        setExam(e);
        if (e.questions?.length)
          setActiveQ((prev) => prev || e.questions[0].id);

        // restore draft
        const draft = loadDraft();
        if (draft?.answers) setAnswers(draft.answers);
        if (typeof draft?.tabWarnings === "number")
          setTabWarnings(draft.tabWarnings);

        // reuse attempt if present
        if (draft?.attemptId && draft?.startedAt) {
          setAttemptId(draft.attemptId);
          setStartedAt(new Date(draft.startedAt));
        } else {
          const startRes = await api.post(`/attempts/start/${examId}`);
          const id =
            startRes.data.attemptId ||
            startRes.data.id ||
            startRes.data.attempt?.id ||
            startRes.data.attempt?.attemptId;

          const sAt =
            startRes.data.startedAt ||
            startRes.data.attempt?.startedAt ||
            new Date().toISOString();

          if (!id) throw new Error("Attempt start response missing attemptId");

          setAttemptId(id);
          setStartedAt(new Date(sAt));
          saveDraft({ attemptId: id, startedAt: sAt });
        }
      } catch (e: any) {
        setErr(
          e?.response?.data?.message || e?.message || "Failed to start exam",
        );
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  // ---------- 2) Timer loop ----------
  useEffect(() => {
    if (!exam || !startedAt) return;

    const endAt = new Date(
      startedAt.getTime() + exam.durationMinutes * 60 * 1000,
    );

    const update = () => {
      const now = new Date();
      const diffSec = Math.floor((endAt.getTime() - now.getTime()) / 1000);
      setRemainingSec(diffSec);

      // low time warning (60s)
      if (diffSec <= 60 && diffSec > 58 && !lowTimeWarnedRef.current) {
        lowTimeWarnedRef.current = true;
        beep();
        toast.warn("⏱ Less than 1 minute remaining!");
      }

      // last 10 seconds beep each second
      if (diffSec <= 10 && diffSec >= 1) {
        if (last10BeepRef.current !== diffSec) {
          last10BeepRef.current = diffSec;
          beep();
        }
      }

      // Auto-submit when time ends
      if (diffSec <= 0) {
        if (tickRef.current) window.clearInterval(tickRef.current);
        tickRef.current = null;
        if (!submitting) handleSubmit(true);
      }
    };

    update();
    tickRef.current = window.setInterval(update, 1000);

    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
      tickRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam?.id, startedAt?.toISOString()]);

  // reset warning refs when attempt changes
  useEffect(() => {
    lowTimeWarnedRef.current = false;
    last10BeepRef.current = -1;
  }, [attemptId]);

  // ---------- 3) Autosave draft locally ----------
  useEffect(() => {
    const t = window.setTimeout(() => {
      saveDraft({ answers, tabWarnings });
    }, 400);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, tabWarnings]);

  // ---------- 4) Warn when leaving page ----------
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!attemptId) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [attemptId]);

  // ---------- 5) Anti-cheat tab switch warning ----------
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        setTabWarnings((c) => {
          const next = c + 1;
          toast.warn("⚠️ Tab switch detected. Please stay on the exam screen.");
          return next;
        });
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // ---------- 6) Online/offline recovery ----------
  useEffect(() => {
    const on = () => {
      setIsOnline(true);
      toast.success("✅ Back online");
    };
    const off = () => {
      setIsOnline(false);
      toast.error("❌ You are offline. Answers will sync when online.");
    };
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  // ---------- 7) Autosave to backend every 20s ----------
  const autosaveToServer = async () => {
    if (!attemptId) return;
    const payload = buildPayload();

    try {
      await api.patch(`/attempts/${attemptId}/autosave`, {
        answers: payload,
        remainingSec,
        tabWarnings,
      });
      // optional: toast only rarely (avoid spam)
      // toast.info("Saved");
    } catch {
      // queue for later
      autosaveQueueRef.current.push({ at: Date.now(), answers: payload });
    }
  };

  useEffect(() => {
    if (!attemptId) return;
    const t = window.setInterval(() => {
      if (navigator.onLine && !submitting) autosaveToServer();
    }, 20000);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId, submitting, remainingSec, tabWarnings, answers]);

  // flush queued autosaves when back online
  useEffect(() => {
    if (!isOnline || !attemptId) return;

    (async () => {
      while (autosaveQueueRef.current.length) {
        const last = autosaveQueueRef.current.pop();
        if (!last) break;
        try {
          await api.patch(`/attempts/${attemptId}/autosave`, {
            answers: last.answers,
          });
        } catch {
          autosaveQueueRef.current.push(last);
          break;
        }
      }
    })();
  }, [isOnline, attemptId]);

  // ---------- submit ----------
  // const handleSubmit = async (auto = false) => {
  //   if (!attemptId) return;
  //   if (submitting) return;

  //   setSubmitting(true);
  //   setErr(null);

  //   try {
  //     const payload = buildPayload();

  //     // await api.post(`/attempts/submit/${attemptId}`, {
  //     await api.post(`/attempts/submit/${attemptId}`, { answers: payload });

  //     clearDraft();
  //     await exitFullscreen();

  //     toast.success(
  //       auto
  //         ? "⏱ Time ended. Exam submitted."
  //         : "Exam submitted successfully 🎉",
  //     );

  //     setTimeout(() => nav("/st/attempts"), 800);
  //   } catch (e: any) {
  //     toast.error(e?.response?.data?.message || "Submit failed ❌");
  //     setErr(e?.response?.data?.message || "Submit failed");
  //   } finally {
  //     setSubmitting(false);
  //     setShowSubmitConfirm(false);
  //   }
  // };
  const handleSubmit = async (auto = false) => {
    if (!attemptId) return;

    setSubmitting(true);
    setErr(null);

    try {
      const payload = buildPayload();

      await api.post(`/attempts/submit/${attemptId}`, {
        answers: payload,
      });

      toast.success(
        auto ? "Time ended. Exam submitted." : "Exam submitted successfully 🎉",
      );

      setTimeout(() => {
        nav("/st/attempts");
      }, 800);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Submit failed ❌");
      setErr(e?.response?.data?.message || "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- ui states ----------
  if (loading) {
    return (
      <>
        <PageHeader title="Exam Attempt" subtitle="Loading..." />
        <div className="card shadow-sm">
          <div className="card-body text-muted">Preparing exam...</div>
        </div>
      </>
    );
  }

  if (err && !exam) {
    return (
      <>
        <PageHeader title="Exam Attempt" subtitle="Error" />
        <div className="alert alert-danger">{err}</div>
        <button
          className="btn btn-outline-secondary"
          onClick={() => nav("/st/exams")}
        >
          Back to Exams
        </button>
      </>
    );
  }

  const danger = remainingSec <= 60;

  return (
    <>
      {/* tiny inline animation style (no css file) */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <PageHeader
        title={exam?.title ? `Exam Attempt: ${exam.title}` : "Exam Attempt"}
        subtitle={`Answered ${progress.answered}/${progress.total} • Warnings: ${tabWarnings} • Attempt: ${
          attemptId?.slice(0, 8) || "-"
        }`}
        right={
          <div className="d-flex gap-2 align-items-center">
            <span
              className={`badge ${danger ? "bg-danger" : "bg-primary"}`}
              style={{ fontSize: 14 }}
            >
              ⏱ {formatTime(remainingSec)}
            </span>

            <div
              className={`badge ${danger ? "bg-danger" : "bg-primary"}`}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <ProgressCircle
                answered={progress.answered}
                total={progress.total}
              />
            </div>

            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => (isFs ? exitFullscreen() : enterFullscreen())}
              disabled={submitting}
            >
              {isFs ? "Exit FS" : "Fullscreen"}
            </button>

            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setShowSubmitConfirm(true)}
              disabled={submitting}
            >
              Submit
            </button>
          </div>
        }
      />

      {!isOnline && (
        <div className="alert alert-warning">
          You are offline. Keep answering — we’ll sync automatically when back
          online.
        </div>
      )}

      {exam?.instructions && (
        <div className="alert alert-info">
          <div className="fw-semibold">Instructions</div>
          <div>{exam.instructions}</div>
        </div>
      )}

      <div className="row g-3">
        {/* Question Navigator */}
        <div className="col-12 col-lg-4 col-xl-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="fw-semibold mb-2">Questions</div>

              <div
                className="d-grid gap-2"
                style={{ maxHeight: "70vh", overflow: "auto" }}
              >
                {questions.map((q, idx) => {
                  const v = answers[q.id];
                  const done =
                    q.type === "MCQ"
                      ? !!v
                      : typeof v === "string"
                        ? v.trim().length > 0
                        : !!v;

                  const isActive = q.id === activeQ;

                  const btnClass = isActive
                    ? "btn-primary"
                    : done
                      ? "btn-success"
                      : "btn-outline-secondary";

                  return (
                    <button
                      key={q.id}
                      className={`btn text-start btn-sm ${btnClass}`}
                      onClick={() => setActiveQ(q.id)}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <span>
                          Q{idx + 1} • {q.type}
                        </span>
                        {done ? (
                          <span className="badge bg-light text-dark">
                            Answered
                          </span>
                        ) : (
                          <span className="badge bg-light text-dark">
                            Pending
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 text-muted small">
                Tip: Autosave runs locally + to server every 20 seconds.
              </div>
            </div>
          </div>
        </div>

        {/* Active Question */}
        <div className="col-12 col-lg-8 col-xl-9">
          <div className="card shadow-sm">
            <div className="card-body">
              {!activeQuestion ? (
                <div className="text-muted">Select a question.</div>
              ) : (
                <div
                  key={activeQuestion.id}
                  style={{ animation: "fadeSlideIn .18s ease" }}
                >
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <div className="fw-bold">
                      {activeQuestion.prompt}
                      <div className="text-muted small">
                        Marks: {activeQuestion.marks}
                      </div>
                    </div>
                    <span className="badge bg-light text-dark">
                      {activeQuestion.type}
                    </span>
                  </div>

                  <hr />

                  {activeQuestion.type === "MCQ" ? (
                    <MCQBlock
                      question={activeQuestion}
                      value={answers[activeQuestion.id] ?? ""}
                      onChange={(v) => setMCQ(activeQuestion.id, v)}
                    />
                  ) : (
                    <ShortBlock
                      value={
                        typeof answers[activeQuestion.id] === "string"
                          ? answers[activeQuestion.id]
                          : ""
                      }
                      onChange={(v) => setShort(activeQuestion.id, v)}
                    />
                  )}

                  <div className="mt-3 d-flex justify-content-between">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => {
                        const idx = questions.findIndex(
                          (q) => q.id === activeQuestion.id,
                        );
                        if (idx > 0) setActiveQ(questions[idx - 1].id);
                      }}
                    >
                      ← Previous
                    </button>

                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => {
                        const idx = questions.findIndex(
                          (q) => q.id === activeQuestion.id,
                        );
                        if (idx < questions.length - 1)
                          setActiveQ(questions[idx + 1].id);
                      }}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {danger && (
            <div className="alert alert-danger mt-3">
              <b>Hurry up!</b> Less than 1 minute remaining.
            </div>
          )}
        </div>
      </div>

      {/* Submit Confirm Modal */}
      {showSubmitConfirm && (
        <div
          className="modal d-block"
          tabIndex={-1}
          role="dialog"
          style={{ background: "rgba(0,0,0,0.4)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Submit Exam?</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowSubmitConfirm(false)}
                />
              </div>
              <div className="modal-body">
                <div>
                  You answered <b>{progress.answered}</b> out of{" "}
                  <b>{progress.total}</b> questions.
                </div>
                <div className="text-muted small mt-2">
                  After submit, you cannot edit your answers. (If retake is
                  allowed, your teacher can reopen.)
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowSubmitConfirm(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleSubmit(false)}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------------- components ---------------- */

function ProgressCircle({
  answered,
  total,
  size = 34,
}: {
  answered: number;
  total: number;
  size?: number;
}) {
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;
  const stroke = 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;

  return (
    <div className="d-inline-flex align-items-center gap-2">
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="white"
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${c - dash}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="small text-white opacity-75">{pct}%</span>
    </div>
  );
}

function MCQBlock({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: string;
  onChange: (v: string) => void;
}) {
  const entries: Array<{ key: string; label: string }> = useMemo(() => {
    const opt = question.options;
    if (!opt) return [];
    if (Array.isArray(opt)) {
      return opt.map((label: any, idx: number) => ({
        key: String(idx + 1),
        label: String(label),
      }));
    }
    if (typeof opt === "object") {
      return Object.entries(opt).map(([k, v]) => ({
        key: k,
        label: String(v),
      }));
    }
    return [];
  }, [question.options]);

  if (!entries.length) {
    return <div className="text-muted">No options provided for this MCQ.</div>;
  }

  return (
    <div className="d-grid gap-2">
      {entries.map((o) => (
        <label
          key={o.key}
          className="border rounded p-2 d-flex align-items-center gap-2"
          style={{ cursor: "pointer" }}
        >
          <input
            className="form-check-input"
            type="radio"
            name={`mcq-${question.id}`}
            checked={value === o.key}
            onChange={() => onChange(o.key)}
          />
          <div>
            <b className="me-2">{o.key}.</b>
            {o.label}
          </div>
        </label>
      ))}
    </div>
  );
}

function ShortBlock({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="form-label">Your Answer</label>
      <textarea
        className="form-control"
        rows={6}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="text-muted small mt-1">
        Write a short answer. Keep it clear and concise.
      </div>
    </div>
  );
}
