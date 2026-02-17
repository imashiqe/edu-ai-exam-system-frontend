// src/pages/student/Exams.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import { api } from "../../services/api";
import { toast } from "react-toastify";

export default function Exams() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await api.get("/student/exams");
      setItems(res.data.exams || []);
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Failed to load exams";
      setErr(msg);
      toast.error(msg);
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
        title="Available Exams"
        subtitle="Active exams you can attempt."
        right={
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={load}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        }
      />

      {err && <div className="alert alert-danger">{err}</div>}

      {loading && items.length === 0 ? (
        <div className="text-muted">Loading exams...</div>
      ) : (
        <div className="row g-3">
          {items.map((e) => (
            <div key={e.id} className="col-12 col-md-6 col-lg-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="fw-bold">{e.title}</div>

                  <div className="text-muted small">
                    Teacher: {e.teacher?.name || "-"}
                  </div>

                  <div className="mt-2 small">
                    Duration: {e.durationMinutes}m
                  </div>

                  <div className="mt-3 d-flex gap-2">
                    <Link
                      to={`/st/exams/${e.id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      Details
                    </Link>

                    <Link
                      to={`/st/exams/${e.id}/start`}
                      className="btn btn-primary btn-sm"
                    >
                      Start
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {items.length === 0 && !loading && (
            <div className="col-12">
              <div className="text-muted">No active exams right now.</div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
