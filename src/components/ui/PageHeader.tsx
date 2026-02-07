export default function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="d-flex align-items-start justify-content-between mb-3">
      <div>
        <div className="fw-bold fs-4">{title}</div>
        {subtitle && <div className="text-muted">{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}
