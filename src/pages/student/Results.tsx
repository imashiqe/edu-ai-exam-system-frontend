import { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import { api } from "../../services/api";

export default function Results() {
  const [items, setItems] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/student/results");
        setItems(res.data.results || []);
      } catch (e: any) {
        setErr(e?.response?.data?.message || "Failed to load results");
      }
    })();
  }, []);

  return (
    <>
      <PageHeader title="Results" subtitle="Published results only." />
      {err && <div className="alert alert-danger">{err}</div>}

      <div className="card shadow-sm">
        <div className="card-body">
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
                    <td>{r.exam?.title}</td>
                    <td>{r.score ?? "-"}</td>
                    <td>{r.exam?.teacher?.name ?? "-"}</td>
                    <td>{r.retakeNo}</td>
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
        </div>
      </div>
    </>
  );
}
