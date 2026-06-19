import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import CopyButton from "../../components/ui/CopyButton";
import { api } from "../../services/api";

export default function Exams() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      setLoading(true);

      const res = await api.get("/teacher/exams");

      setItems(res.data?.exams || res.data?.data?.exams || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const deleteExam = async (id: string) => {
    const ok = window.confirm("Are you sure you want to delete this exam?");

    if (!ok) return;

    try {
      await api.delete(`/teacher/exams/${id}`);

      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete exam");
    }
  };

  const filtered = useMemo(() => {
    return items.filter((item) =>
      item.title?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [items, search]);

  return (
    <>
      <PageHeader
        title="My Exams"
        right={
          <Link to="/t/exams/new" className="btn btn-primary">
            Create Exam
          </Link>
        }
      />

      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search exam..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-md-6 text-md-end">
              <span className="badge bg-primary fs-6">
                Total Exams: {items.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">Loading...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Mode</th>
                    <th>Duration</th>
                    <th>Questions</th>
                    <th>Attempts</th>
                    <th>Status</th>
                    <th>Secret</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((e) => {
                    const examLink = `${window.location.origin}/exam/${e.id}`;

                    return (
                      <tr key={e.id}>
                        <td>
                          <div className="fw-semibold">{e.title}</div>
                        </td>

                        <td>
                          <span className="badge bg-info text-dark">
                            {e.mode}
                          </span>
                        </td>

                        <td>{e.durationMinutes} min</td>

                        <td>{e._count?.questions ?? 0}</td>

                        <td>{e._count?.attempts ?? 0}</td>

                        <td>
                          {e.isActiveLink ? (
                            <span className="badge bg-success">Active</span>
                          ) : (
                            <span className="badge bg-danger">Inactive</span>
                          )}
                        </td>

                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <code>{e.secretKey}</code>

                            <CopyButton text={e.secretKey} />
                          </div>
                        </td>

                        <td>
                          <div className="d-flex flex-wrap gap-1">
                            <Link
                              className="btn btn-outline-primary btn-sm"
                              to={`/t/exams/${e.id}`}
                            >
                              Manual
                            </Link>

                            <Link
                              className="btn btn-outline-info btn-sm"
                              to={`/t/exams/${e.id}/ai`}
                            >
                              AI
                            </Link>

                            <Link
                              className="btn btn-outline-success btn-sm"
                              to={`/t/exams/${e.id}/submissions`}
                            >
                              Submissions
                            </Link>

                            <Link
                              className="btn btn-outline-dark btn-sm"
                              to={`/t/exams/${e.id}/analytics`}
                            >
                              Analytics
                            </Link>

                            <Link
                              className="btn btn-outline-warning btn-sm"
                              to={`/t/exams/${e.id}/edit`}
                            >
                              Edit
                            </Link>

                            <Link
                              className="btn btn-outline-secondary btn-sm"
                              to={`/t/exams/${e.id}/send`}
                            >
                              Send
                            </Link>

                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() =>
                                navigator.clipboard.writeText(examLink)
                              }
                            >
                              Copy Link
                            </button>

                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => deleteExam(e.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center text-muted py-5">
                        No exams found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
