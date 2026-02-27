import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import { api } from "../../services/api";

type Exam = {
  id: string;
  title: string;
  instructions?: string | null;
  durationMinutes: number;
  teacher?: {
    name?: string;
    institute?: string;
  };
};

export default function ExamDetails() {
  const { examId } = useParams();
  const nav = useNavigate();

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!examId) return;

      setLoading(true);
      setErr(null);

      try {
        const res = await api.get(`/student/exams/${examId}`);
        if (mounted) setExam(res.data.exam as Exam);
      } catch (e: any) {
        if (mounted)
          setErr(
            e?.response?.data?.message || e?.message || "Failed to load exam",
          );
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [examId]);

  return (
    <>
      <PageHeader
        title="Exam Details"
        subtitle="Read instructions and start exam."
      />

      {loading && (
        <div className="card shadow-sm">
          <div className="card-body text-muted">Loading exam...</div>
        </div>
      )}

      {!loading && err && (
        <>
          <div className="alert alert-danger">{err}</div>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => nav("/st/exams")}
          >
            Back to Exams
          </button>
        </>
      )}

      {!loading && !err && (
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="fw-bold">{exam?.title || "-"}</div>

            <div className="text-muted small">
              Teacher: {exam?.teacher?.name || "-"}
              {exam?.teacher?.institute ? ` • ${exam.teacher.institute}` : ""}
            </div>

            <div className="mt-2">
              Duration: {exam?.durationMinutes ?? "-"} minutes
            </div>

            {exam?.instructions && (
              <div className="alert alert-info mt-3 mb-0">
                <div className="fw-semibold">Instructions</div>
                <div>{exam.instructions}</div>
              </div>
            )}

            <div className="mt-3 d-flex gap-2">
              <Link
                to={`/st/exams/${examId}/start`}
                className="btn btn-primary btn-sm"
              >
                Start Exam
              </Link>

              <Link to="/st/exams" className="btn btn-outline-secondary btn-sm">
                Back
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
