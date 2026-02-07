import { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import { api } from "../../services/api";

export default function Approvals() {
  const [items, setItems] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await api.get("/admin/users?role=TEACHER&status=PENDING");
      setItems(res.data.users || []);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Failed to load pending teachers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id: string) => {
    try {
      await api.patch(`/admin/teachers/${id}/approve`);
      await load();
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Approve failed");
    }
  };

  return (
    <>
      <PageHeader
        title="Teacher Approvals"
        subtitle="Approve teacher accounts."
      />
      {err && <div className="alert alert-danger">{err}</div>}

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Institute</th>
                  <th>Status</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.institute || "-"}</td>
                    <td>
                      <StatusBadge value={u.status} />
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => approve(u.id)}
                        disabled={loading}
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}

                {items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-muted text-center py-4">
                      No pending teachers
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
