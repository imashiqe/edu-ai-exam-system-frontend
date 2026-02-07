import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import { api } from "../../services/api";

type AttemptRow = {
  id: string;
  status: string;
  score: number | null;
  retakeNo: number;
  submittedAt: string | null;
  createdAt: string;
  student?: {
    id: string;
    name: string;
    email: string;
    institute?: string | null;
  };
};

export default function Submissions() {
  const { examId } = useParams();
  const [items, setItems] = useState<AttemptRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("ALL");

  const load = async () => {
    if (!examId) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await api.get(`/teacher/exams/${examId}/submissions`);
      setItems(res.data.attempts || []);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return items.filter((a) => {
      const matchStatus = status === "ALL" ? true : a.status === status;
      const matchQuery = !query
        ? true
        : (a.student?.name || "").toLowerCase().includes(query) ||
          (a.student?.email || "").toLowerCase().includes(query) ||
          (a.student?.institute || "").toLowerCase().includes(query);

      return matchStatus && matchQuery;
    });
  }, [items, q, status]);

  return (
    <>
      <PageHeader
        title="Exam Submissions"
        subtitle="View attempts and grade them."
        right={
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={load}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <Link className="btn btn-outline-primary btn-sm" to="/t/exams">
              Back to Exams
            </Link>
          </div>
        }
      />

      {err && <div className="alert alert-danger">{err}</div>}

      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-6">
              <input
                className="form-control"
                placeholder="Search student name/email/institute..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-3">
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="SUBMITTED">SUBMITTED</option>
                <option value="GRADED">GRADED</option>
                <option value="PUBLISHED">PUBLISHED</option>
              </select>
            </div>
            <div className="col-12 col-md-3 text-md-end text-muted small">
              Showing <b>{filtered.length}</b> of {items.length}
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>Retake</th>
                  <th>Submitted</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={6} className="text-muted py-4 text-center">
                      Loading...
                    </td>
                  </tr>
                )}

                {!loading &&
                  filtered.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <div className="fw-semibold">
                          {a.student?.name || "-"}
                        </div>
                        <div className="text-muted small">
                          {a.student?.email || "-"}
                        </div>
                        {a.student?.institute && (
                          <div className="text-muted small">
                            Institute: {a.student.institute}
                          </div>
                        )}
                      </td>

                      <td>
                        <StatusBadge value={a.status} />
                      </td>

                      <td>{a.score ?? "-"}</td>

                      <td>{a.retakeNo}</td>

                      <td className="text-muted small">
                        {a.submittedAt
                          ? new Date(a.submittedAt).toLocaleString()
                          : "-"}
                      </td>

                      <td className="text-end">
                        <Link
                          to={`/t/attempts/${a.id}/grade`}
                          className="btn btn-primary btn-sm"
                        >
                          Grade
                        </Link>
                      </td>
                    </tr>
                  ))}

                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-muted text-center py-4">
                      No submissions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
