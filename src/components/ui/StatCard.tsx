export default function StatCard({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="text-muted small">{label}</div>
        <div className="fs-3 fw-bold">{value}</div>
      </div>
    </div>
  );
}
