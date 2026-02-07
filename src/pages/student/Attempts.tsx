import { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import { api } from "../../services/api";

export default function Attempts() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const res = await api.get("/student/attempts");
      setItems(res.data.attempts || []);
    })();
  }, []);

  return (
    <>
      <PageHeader
        title="My Attempts"
        subtitle="Attempt history (submitted/graded/published)."
      />
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Exam</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>Retake</th>
                </tr>
              </thead>
              <tbody>
                {items.map((a) => (
                  <tr key={a.id}>
                    <td>{a.exam?.title}</td>
                    <td>{a.status}</td>
                    <td>{a.score ?? "-"}</td>
                    <td>{a.retakeNo}</td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-muted text-center py-4">
                      No attempts yet
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
