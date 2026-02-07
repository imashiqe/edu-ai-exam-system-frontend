import { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import { api } from "../../services/api";

export default function Users() {
  const [role, setRole] = useState<"STUDENT" | "TEACHER">("STUDENT");
  const [items, setItems] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setErr(null);
    try {
      const res = await api.get(`/admin/users?role=${role}`);
      setItems(res.data.users || []);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Failed to load users");
    }
  };

  useEffect(() => {
    load();
  }, [role]);

  const updateStatus = async (id: string, status: "ACTIVE" | "INACTIVE") => {
    setErr(null);
    try {
      await api.patch(`/admin/users/${id}/status`, { status });
      await load();
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Status update failed");
    }
  };

  return (
    <>
      <PageHeader
        title="User Management"
        subtitle="Activate or deactivate users."
        right={
          <select
            className="form-select form-select-sm"
            style={{ width: 160 }}
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
          >
            <option value="STUDENT">Students</option>
            <option value="TEACHER">Teachers</option>
          </select>
        }
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
                  <th>Status</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <StatusBadge value={u.status} />
                    </td>
                    <td className="text-end">
                      {u.status === "ACTIVE" ? (
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => updateStatus(u.id, "INACTIVE")}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => updateStatus(u.id, "ACTIVE")}
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {items.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-muted text-center py-4">
                      No users
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
