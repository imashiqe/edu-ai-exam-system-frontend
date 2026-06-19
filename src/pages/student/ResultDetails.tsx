// src/pages/student/ResultDetails.tsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import { api } from "../../services/api";
import { toast } from "react-toastify";

export default function ResultDetails() {
  const { attemptId } = useParams();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);

  const load = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/student/results/${attemptId}`);

      setResult(res.data.result);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to load result");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [attemptId]);

  const totalMarks =
    result?.answers?.reduce(
      (sum: number, a: any) => sum + (a.question?.marks || 0),
      0,
    ) || 0;

  const percentage =
    totalMarks > 0 ? Math.round(((result?.score || 0) / totalMarks) * 100) : 0;

  return (
    <>
      <PageHeader
        title="Result Details"
        subtitle="Review your answers and score"
      />

      {loading ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        </div>
      ) : !result ? (
        <div className="alert alert-danger">Result not found</div>
      ) : (
        <>
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <h6>Total Score</h6>
                  <h2 className="text-success">{result.score ?? 0}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <h6>Total Marks</h6>
                  <h2 className="text-primary">{totalMarks}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <h6>Percentage</h6>
                  <h2 className="text-warning">{percentage}%</h2>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <h6>Status</h6>
                  <span className="badge bg-success fs-6">{result.status}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="mb-1">{result.exam?.title}</h5>

              <div className="text-muted">
                Teacher: {result.exam?.teacher?.name || "-"}
              </div>
            </div>
          </div>

          {result.answers?.map((answer: any, index: number) => {
            const q = answer.question;

            const studentAnswer =
              typeof answer.response === "object"
                ? JSON.stringify(answer.response)
                : answer.response;

            const correctAnswer =
              typeof q.correctAnswer === "object"
                ? JSON.stringify(q.correctAnswer)
                : q.correctAnswer;

            const isCorrect =
              JSON.stringify(answer.response) ===
              JSON.stringify(q.correctAnswer);

            return (
              <div key={answer.id} className="card shadow-sm mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <h6>Question {index + 1}</h6>

                    <span
                      className={`badge ${
                        q.type === "MCQ"
                          ? "bg-primary"
                          : q.type === "SHORT"
                            ? "bg-success"
                            : "bg-warning text-dark"
                      }`}
                    >
                      {q.type}
                    </span>
                  </div>

                  <div className="fw-semibold mb-3">{q.prompt}</div>

                  {q.options && q.type === "MCQ" && (
                    <div className="mb-3">
                      {Object.entries(q.options).map(([key, value]) => (
                        <div key={key}>
                          <b>{key}</b>. {String(value)}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mb-2">
                    <strong>Your Answer:</strong>

                    <div className="alert alert-secondary mt-1">
                      {studentAnswer || "No answer"}
                    </div>
                  </div>

                  <div className="mb-2">
                    <strong>Correct Answer:</strong>

                    <div className="alert alert-success mt-1">
                      {correctAnswer}
                    </div>
                  </div>

                  <div className="d-flex gap-2 flex-wrap">
                    <span className="badge bg-dark">Marks: {q.marks}</span>

                    {q.type === "MCQ" ? (
                      <span
                        className={`badge ${
                          isCorrect ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {isCorrect ? "Correct" : "Wrong"}
                      </span>
                    ) : (
                      <span className="badge bg-info text-dark">
                        Teacher / AI Evaluated
                      </span>
                    )}
                  </div>

                  {answer.feedback && (
                    <div className="alert alert-info mt-3">
                      <strong>Feedback:</strong>
                      <br />
                      {answer.feedback}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div className="d-flex gap-2 mt-4">
            <button className="btn btn-success" onClick={() => window.print()}>
              Print Result
            </button>

            <Link to="/st/results" className="btn btn-outline-secondary">
              Back
            </Link>
          </div>
        </>
      )}
    </>
  );
}
