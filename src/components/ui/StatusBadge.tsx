export default function StatusBadge({ value }: { value: string }) {
  const cls =
    value === "ACTIVE"
      ? "bg-success"
      : value === "PENDING"
        ? "bg-warning text-dark"
        : "bg-secondary";
  return <span className={`badge ${cls}`}>{value}</span>;
}
