import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import CopyButton from "../../components/ui/CopyButton";
import { api } from "../../services/api";

export default function Exams() {
  const [items, setItems] = useState<any[]>([]);

  // const load = async () => {
  //   const res = await api.get("/teacher/exams");
  //   setItems(res.data?.data?.exams || []);
  // };
  // useEffect(() => {
  //   load();
  // }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/teacher/exams");
        setItems(res.data.exams || []);
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <PageHeader
        title="My Exams"
        right={
          <Link to="/t/exams/new" className="btn btn-primary btn-sm">
            Create Exam
          </Link>
        }
      />

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Mode</th>
                  <th>Duration</th>
                  <th>Secret</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((e) => (
                  <tr key={e.id}>
                    <td>{e.title}</td>
                    <td>{e.mode}</td>
                    <td>{e.durationMinutes}m</td>
                    <td className="d-flex gap-2 align-items-center">
                      <code>{e.secretKey}</code>
                      <CopyButton text={e.secretKey} />
                    </td>
                    <td className="text-end">
                      <Link
                        className="btn btn-outline-primary btn-sm me-2"
                        to={`/t/exams/${e.id}`}
                      >
                        Manual
                      </Link>
                      <Link
                        className="btn btn-outline-info btn-sm me-2"
                        to={`/t/exams/${e.id}/ai`}
                      >
                        AI Generator
                      </Link>
                      <Link
                        className="btn btn-outline-primary btn-sm me-2"
                        to={`/t/exams/${e.id}/submissions`}
                      >
                        Submissions
                      </Link>
                      <Link
                        className="btn btn-outline-secondary btn-sm"
                        to={`/t/exams/${e.id}/send`}
                      >
                        Send
                      </Link>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-muted text-center py-4">
                      No exams created
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
