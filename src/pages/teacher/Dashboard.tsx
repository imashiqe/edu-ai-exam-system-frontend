import { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import { api } from "../../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const res = await api.get("/teacher/stats");
      setStats(res.data.stats);
    })();
  }, []);

  return (
    <>
      <PageHeader
        title="Teacher Overview"
        subtitle="Create exams, review attempts, publish results."
      />
      <div className="row g-3">
        <div className="col-12 col-md-4">
          <StatCard label="Total Exams" value={stats?.exams ?? "-"} />
        </div>
        <div className="col-12 col-md-4">
          <StatCard
            label="Pending Reviews"
            value={stats?.submissionsPending ?? "-"}
          />
        </div>
        <div className="col-12 col-md-4">
          <StatCard label="Published Results" value={stats?.published ?? "-"} />
        </div>
      </div>
    </>
  );
}
