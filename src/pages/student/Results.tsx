import { useEffect, useState } from "react";
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
        title="Results"
        subtitle="Published results only."
        right={
          <button className="btn btn-outline-primary btn-sm" onClick={load}>
            Refresh
          </button>
        }
      />

      <div className="card shadow-sm">
        <div className="card-body">
          {loading ? (
            <div className="text-muted">Loading...</div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Exam</th>
                    <th>Score</th>
                    <th>Teacher</th>
                    <th>Retake</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((r) => (
                    <tr key={r.id}>
                      <td>{r.exam?.title || "-"}</td>
                      <td>{r.score ?? "-"}</td>
                      <td>{r.exam?.teacher?.name ?? "-"}</td>
                      <td>{r.retakeNo ?? 1}</td>
                    </tr>
                  ))}

                  {items.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-muted text-center py-4">
                        No published results
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
