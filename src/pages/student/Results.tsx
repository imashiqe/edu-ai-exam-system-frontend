import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import { api } from "../../services/api";
import { toast } from "react-toastify";

export default function Results() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);

    try {
      const res = await api.get("/student/results");
      setItems(res.data.results || []);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <PageHeader
        title="My Results"
        subtitle="Published exam results"
        right={
          <button className="btn btn-outline-primary btn-sm" onClick={load}>
            Refresh
          </button>
        }
      />

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Exam</th>
                    <th>Teacher</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th>Retake</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <div className="fw-semibold">
                          {r.exam?.title || "-"}
                        </div>
                      </td>

                      <td>{r.exam?.teacher?.name || "-"}</td>

                      <td>
                        <span className="badge bg-success fs-6">
                          {r.score ?? 0}
                        </span>
                      </td>

                      <td>
                        <span className="badge bg-primary">Published</span>
                      </td>

                      <td>
                        <span className="badge bg-secondary">
                          #{r.retakeNo ?? 1}
                        </span>
                      </td>

                      <td>
                        <Link
                          to={`/st/results/${r.id}`}
                          className="btn btn-sm btn-primary"
                        >
                          View Result
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {items.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-5 text-muted">
                        No published results found
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
