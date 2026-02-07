import PageHeader from "../../components/ui/PageHeader";

export default function Dashboard() {
  return (
    <>
      <PageHeader
        title="Student Overview"
        subtitle="Join exams, attempt, and view results."
      />
      <div className="alert alert-info">
        Go to <b>Available Exams</b> or <b>Join by Key</b>.
      </div>
    </>
  );
}
