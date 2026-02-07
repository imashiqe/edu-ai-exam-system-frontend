import { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import { api } from "../../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data.stats);
      } catch (e: any) {
        setErr(e?.response?.data?.message || "Failed to load stats");
      }
    })();
  }, []);

  return (
    <>
      <PageHeader
        title="Super Admin Dashboard"
        subtitle="System overview and controls."
      />
      {err && <div className="alert alert-danger">{err}</div>}

      <div className="row g-3">
        <div className="col-12 col-md-3">
          <StatCard label="Students" value={stats?.students ?? "-"} />
        </div>
        <div className="col-12 col-md-3">
          <StatCard label="Teachers" value={stats?.teachers ?? "-"} />
        </div>
        <div className="col-12 col-md-3">
          <StatCard
            label="Pending Teachers"
            value={stats?.pendingTeachers ?? "-"}
          />
        </div>
        <div className="col-12 col-md-3">
          <StatCard label="Active Exams" value={stats?.activeExams ?? "-"} />
        </div>
      </div>
    </>
  );
}
