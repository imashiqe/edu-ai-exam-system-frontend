import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import CopyButton from "../../components/ui/CopyButton";
import { api } from "../../services/api";

export default function SendExam() {
  const { examId } = useParams();

  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [emailsText, setEmailsText] = useState("");
  const [message, setMessage] = useState(
    "Please attend the exam using the link or secret key. Submit within the time limit.",
  );

  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const appLink = useMemo(() => {
    // Student exam details page link in frontend
    // If you want link-based access directly to attempt start, change this.
    const origin = window.location.origin;
    return examId ? `${origin}/st/exams/${examId}` : "";
  }, [examId]);

  const parseEmails = (raw: string) => {
    return raw
      .split(/[\n,; ]+/g)
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const loadExam = async () => {
    if (!examId) return;
    setErr(null);
    setLoading(true);
    try {
      // assumes your backend has GET /api/v1/exams/:examId
      const res = await api.get(`/exams/${examId}`);
      setExam(res.data.exam || res.data);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Failed to load exam info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  const send = async () => {
    if (!examId) return;
    setErr(null);
    setOk(null);

    const emails = parseEmails(emailsText);
    if (emails.length === 0) {
      setErr("Please add at least one email.");
      return;
    }

    try {
      // expects POST /api/v1/exams/:examId/send-email
      await api.post(`/exams/${examId}/send-email`, {
        emails,
        message,
        // optional: include link & key (backend can embed)
        link: appLink,
        secretKey: exam?.secretKey,
      });

      setOk(`Sent to ${emails.length} email(s).`);
      setEmailsText("");
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Failed to send email");
    }
  };

  return (
    <>
      <PageHeader
        title="Send Exam"
        subtitle="Send exam link / secret key to students via email."
        right={
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={loadExam}
              disabled={loading}
            >
              {loading ? "Loading..." : "Reload"}
            </button>
            <Link className="btn btn-outline-primary btn-sm" to="/t/exams">
              Back to Exams
            </Link>
          </div>
        }
      />

      {err && <div className="alert alert-danger">{err}</div>}
      {ok && <div className="alert alert-success">{ok}</div>}

      <div className="row g-3">
        {/* Exam info */}
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="fw-bold mb-1">{exam?.title || "Exam"}</div>
              <div className="text-muted small mb-3">
                Exam ID: <code>{examId}</code>
              </div>

              <div className="mb-2">
                <div className="text-muted small">Student Link</div>
                <div className="d-flex gap-2 align-items-center">
                  <code
                    className="flex-grow-1"
                    style={{ wordBreak: "break-all" }}
                  >
                    {appLink || "-"}
                  </code>
                  {appLink && <CopyButton text={appLink} />}
                </div>
              </div>

              <div className="mt-3">
                <div className="text-muted small">Secret Key</div>
                <div className="d-flex gap-2 align-items-center">
                  <code className="flex-grow-1">{exam?.secretKey || "-"}</code>
                  {exam?.secretKey && <CopyButton text={exam.secretKey} />}
                </div>
              </div>

              <div className="mt-3 text-muted small">
                Students can join from <b>Student Dashboard → Join by Key</b>.
              </div>
            </div>
          </div>
        </div>

        {/* Send form */}
        <div className="col-12 col-lg-7">
          <div className="card shadow-sm">
            <div className="card-body">
              <label className="form-label">Student Emails</label>
              <textarea
                className="form-control"
                rows={6}
                placeholder="Paste emails separated by comma, space, or new line..."
                value={emailsText}
                onChange={(e) => setEmailsText(e.target.value)}
              />
              <div className="text-muted small mt-1">
                Example: student1@test.com, student2@test.com
              </div>

              <div className="mt-3">
                <label className="form-label">Message</label>
                <textarea
                  className="form-control"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="mt-3 d-flex gap-2">
                <button className="btn btn-primary" onClick={send}>
                  Send Email
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setEmailsText("");
                    setOk(null);
                    setErr(null);
                  }}
                >
                  Clear
                </button>
              </div>

              <div className="mt-3 text-muted small">
                Backend endpoint used:{" "}
                <code>POST /api/v1/exams/{examId}/send-email</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
