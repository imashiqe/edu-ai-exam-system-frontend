import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import { api } from "../../services/api";

export default function ExamDetails() {
  const { examId } = useParams();
  const [exam, setExam] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const res = await api.get(`/student/exams/${examId}`);
      setExam(res.data.exam);
    })();
  }, [examId]);

  return (
    <>
      <PageHeader
        title="Exam Details"
        subtitle="Read instructions and start exam."
      />
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="fw-bold">{exam?.title || "-"}</div>
          <div className="text-muted small">
            Teacher: {exam?.teacher?.name || "-"}
          </div>
          <div className="mt-2">
            Duration: {exam?.durationMinutes || "-"} minutes
          </div>
          <div className="mt-3">
            <Link
              to={`/st/exams/${examId}/start`}
              className="btn btn-primary btn-sm"
            >
              Start Exam
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
