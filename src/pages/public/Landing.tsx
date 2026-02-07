// src/pages/public/Home.tsx
import { Link } from "react-router-dom";
import "./landing.css";
const heroTiles = [
  {
    title: "AI Exam Generator",
    desc: "Generate MCQ + Short questions from syllabus using ChatGPT or Gemini — switchable provider.",
    color: "bg-indigo",
    img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=60",
    icon: "🤖",
  },
  {
    title: "Manual Question Builder",
    desc: "Create questions manually with answers, marks, and publish rules — perfect for real classroom control.",
    color: "bg-orange",
    img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1400&q=60",
    icon: "✍️",
  },
  {
    title: "Instant & Review Results",
    desc: "MCQ auto grading, short answer teacher grading — publish when ready. Retake & time control supported.",
    color: "bg-teal",
    img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=60",
    icon: "📊",
  },
];

const features = [
  {
    title: "Role-based System",
    icon: "🧩",
    desc: "Super Admin, Teacher, Student modules with permissions & approvals.",
  },
  {
    title: "Teacher Approval",
    icon: "✅",
    desc: "Teacher accounts require Super Admin approval before access.",
  },
  {
    title: "Exam Access Control",
    icon: "🔐",
    desc: "Access via Link, Secret Key, or both. Activate/Deactivate anytime.",
  },
  {
    title: "Timer & Expiry",
    icon: "⏱️",
    desc: "20 min, 1 hour or custom duration. Starts/Ends time window supported.",
  },
  {
    title: "Retake Option",
    icon: "🔁",
    desc: "Teacher can allow retake and re-activate exam for selected students.",
  },
  {
    title: "Email Delivery",
    icon: "✉️",
    desc: "Send exam link to students via Nodemailer directly from dashboard.",
  },
];

const workflowSteps = [
  {
    n: "01",
    title: "Create Exam",
    desc: "Teacher creates exam with mode: Manual / AI / Hybrid and duration settings.",
  },
  {
    n: "02",
    title: "Add Questions",
    desc: "Manual builder or AI generation from syllabus. Edit before publishing.",
  },
  {
    n: "03",
    title: "Publish & Share",
    desc: "Enable active link + secret key. Send to students by email.",
  },
  {
    n: "04",
    title: "Attempt & Results",
    desc: "Students attempt with timer. MCQ auto result, manual grading for short.",
  },
];

const modules = [
  {
    title: "Super Admin",
    points: [
      "Approve teachers",
      "Activate/deactivate users",
      "Settings (AI provider default)",
      "System monitoring",
    ],
  },
  {
    title: "Teacher",
    points: [
      "Create exams",
      "Generate questions (AI/manual)",
      "Review submissions",
      "Manual grading & publish result",
    ],
  },
  {
    title: "Student",
    points: [
      "Join exam by link/secret",
      "Attempt with timer",
      "Instant MCQ result",
      "View previous attempts & results",
    ],
  },
];

const tech = [
  { k: "Backend", v: "Node.js + Express + TypeScript" },
  { k: "Database", v: "PostgreSQL + Prisma ORM" },
  { k: "Frontend", v: "React + Bootstrap/Tabler UI" },
  { k: "AI", v: "ChatGPT / Gemini (switchable)" },
  { k: "Mobile", v: "Flutter app uses same REST API" },
  { k: "Email", v: "Nodemailer" },
];

export default function Landing() {
  return (
    <div className="bg-white">
      {/* Top Bar */}
      <div className="border-bottom">
        <div className="container py-2 d-flex align-items-center justify-content-between">
          <div className="small text-muted d-flex flex-wrap gap-3">
            <span>AI Exam System — Final Year Thesis</span>
            <span className="d-none d-md-inline">
              Role-based • AI + Manual • Instant Result
            </span>
          </div>
          <div className="d-flex gap-2">
            <Link to="/login" className="btn btn-outline-primary btn-sm">
              Login
            </Link>
            <Link to="/register/student" className="btn btn-primary btn-sm">
              Register Student
            </Link>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <header className="sticky-top bg-white">
        <div className="container py-3 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded-circle bg-primary"
              style={{ width: 34, height: 34 }}
            />
            <div>
              <div className="fw-bold lh-1">ExamAI</div>
              <div className="text-muted small">AI + Manual Exam Generator</div>
            </div>
          </div>

          <nav className="d-none d-lg-flex gap-4 fw-semibold">
            <a className="text-decoration-none text-dark" href="#features">
              Features
            </a>
            <a className="text-decoration-none text-dark" href="#workflow">
              Workflow
            </a>
            <a className="text-decoration-none text-dark" href="#modules">
              Modules
            </a>
            <a className="text-decoration-none text-dark" href="#tech">
              Tech Stack
            </a>
            <a className="text-decoration-none text-dark" href="#screens">
              Screens
            </a>
          </nav>

          <div className="d-flex gap-2">
            <Link
              to="/register/teacher"
              className="btn btn-outline-secondary btn-sm"
            >
              Teacher Apply
            </Link>
            <a href="#demo" className="btn btn-primary btn-sm">
              View Demo
            </a>
          </div>
        </div>
      </header>

      {/* Hero Tiles like eSmarts */}
      <section className="container-fluid px-0">
        <div className="row g-0">
          {heroTiles.map((t) => (
            <div key={t.title} className="col-12 col-lg-4">
              <div className="d-flex flex-column h-100" style={{ height: 520 }}>
                {/* ========= IMAGE ========= */}
                <div className="flex-shrink-0" style={{ height: "55%" }}>
                  <img
                    src={t.img}
                    alt={t.title}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                </div>

                {/* ========= COLOR PANEL ========= */}
                <div
                  className="flex-grow-1 text-white d-flex align-items-start"
                  style={{ background: "#2845D6" }}
                >
                  <div className="p-5">
                    <div className="d-flex align-items-start gap-3 ">
                      {/* icon */}
                      <div className="fs-1 lh-1">{t.icon}</div>

                      {/* text */}
                      <div>
                        <h2 className="fw-bold mb-3" style={{ fontSize: 36 }}>
                          {t.title}
                        </h2>
                        <p className="mb-0 opacity-75">{t.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container py-5">
        <div className="text-center mb-4">
          <div className="text-muted small">Why This Project</div>
          <div className="display-6 fw-bold">Smart Exam Management with AI</div>
          <p className="text-muted mt-3 mx-auto" style={{ maxWidth: 820 }}>
            This system supports both AI-generated and manual exams, providing
            secure access, timed attempts, instant results for MCQ, and
            teacher-controlled publishing.
          </p>
        </div>

        <div className="row g-4">
          {features.map((f) => (
            <div key={f.title} className="col-12 col-md-6 col-lg-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex gap-3">
                    <div
                      className="rounded-circle border d-flex align-items-center justify-content-center"
                      style={{ width: 46, height: 46 }}
                    >
                      <span style={{ fontSize: 20 }}>{f.icon}</span>
                    </div>
                    <div>
                      <div className="fw-bold">{f.title}</div>
                      <div className="text-muted small mt-1">{f.desc}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow band */}
      <section id="workflow" className="py-5" style={{ background: "#12c6c0" }}>
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-12 col-lg-5 text-white">
              <div className="text-white-50 small">How it Works</div>
              <div className="h2 fw-bold mb-2">
                From Syllabus to Result — End to End
              </div>
              <p className="mb-4 text-white-50">
                Teachers generate exams with AI or manual input, publish links,
                and students attempt with a timer. Manual grading is supported
                for short answers.
              </p>

              <div className="d-flex gap-2">
                <a href="#demo" className="btn btn-light">
                  Watch Demo
                </a>
                <Link to="/login" className="btn btn-outline-light">
                  Open Dashboard
                </Link>
              </div>
            </div>

            <div className="col-12 col-lg-7">
              <div className="row g-3">
                {workflowSteps.map((s) => (
                  <div key={s.n} className="col-12 col-md-6">
                    <div className="bg-white rounded-3 p-3 shadow-sm h-100">
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-primary">{s.n}</span>
                        <div className="fw-bold">{s.title}</div>
                      </div>
                      <div className="text-muted small mt-2">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="container py-5">
        <div className="text-center mb-4">
          <div className="text-muted small">Role Based</div>
          <div className="display-6 fw-bold">Modules</div>
          <p className="text-muted mt-3 mx-auto" style={{ maxWidth: 820 }}>
            Each role has dedicated dashboards and permissions to keep the
            system secure and organized.
          </p>
        </div>

        <div className="row g-4">
          {modules.map((m) => (
            <div key={m.title} className="col-12 col-lg-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="fw-bold h4">{m.title}</div>
                  <ul className="text-muted mt-3 mb-0">
                    {m.points.map((p) => (
                      <li key={p} className="mb-1">
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section id="tech" className="container pb-5">
        <div className="row g-4 align-items-start">
          <div className="col-12 col-lg-6">
            <div className="text-muted small">Implementation</div>
            <div className="h2 fw-bold">Tech Stack</div>
            <p className="text-muted mt-2">
              Built for real deployment: secure auth, PostgreSQL, Prisma, and
              scalable REST APIs usable by Flutter.
            </p>

            <div className="d-flex gap-2 mt-3">
              <a className="btn btn-primary" href="#demo">
                Project Demo
              </a>
              <a className="btn btn-outline-secondary" href="#screens">
                Screenshots
              </a>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="card shadow-sm">
              <div className="card-body">
                {tech.map((t) => (
                  <div
                    key={t.k}
                    className="d-flex justify-content-between py-2 border-bottom"
                  >
                    <div className="fw-semibold">{t.k}</div>
                    <div className="text-muted">{t.v}</div>
                  </div>
                ))}
                <div className="small text-muted mt-3">
                  AI Providers: switch at exam-level or system default.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Screens section */}
      <section id="screens" className="container pb-5">
        <div className="text-center mb-4">
          <div className="text-muted small">UI Preview</div>
          <div className="display-6 fw-bold">Screens</div>
          <p className="text-muted mt-3 mx-auto" style={{ maxWidth: 820 }}>
            Add your real screenshots here (Teacher dashboard, Create exam, AI
            generator, Student attempt, Results).
          </p>
        </div>

        <div className="row g-3">
          {[
            "Teacher Dashboard",
            "Create Exam",
            "AI Generator",
            "Student Attempt",
            "Results",
            "Admin Approvals",
          ].map((title) => (
            <div key={title} className="col-12 col-md-6 col-lg-4">
              <div className="card shadow-sm h-100">
                <div
                  className="bg-light"
                  style={{
                    height: 180,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span className="text-muted small">
                    Screenshot Placeholder
                  </span>
                </div>
                <div className="card-body">
                  <div className="fw-bold">{title}</div>
                  <div className="text-muted small mt-1">
                    Replace with your real UI image from your project.
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Demo / CTA */}
      {/* <section id="demo" className="py-5 border-top">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-12 col-lg-7">
              <div className="h2 fw-bold">
                Ready to Present This Thesis Project?
              </div>
              <p className="text-muted mt-2">
                Use this landing page to explain your project to supervisors,
                judges, or university visitors. Add demo video link and
                screenshots, and you’re ready.
              </p>
            </div>
            <div className="col-12 col-lg-5">
              <div className="d-flex gap-2 justify-content-lg-end">
                <Link to="/login" className="btn btn-primary">
                  Open Dashboard
                </Link>
                <Link
                  to="/register/teacher"
                  className="btn btn-outline-secondary"
                >
                  Teacher Apply
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-dark text-white pt-5 pb-4">
        <div className="container">
          <div className="row g-4">
            <div className="col-12 col-lg-5">
              <div className="fw-bold mb-2">ExamAI — Final Year Thesis</div>
              <p className="text-white-50 small mb-0">
                AI + Manual Exam Generator System with role-based dashboards,
                timed attempts, instant MCQ results and teacher-controlled
                publishing.
              </p>
            </div>

            <div className="col-6 col-lg-3">
              <div className="fw-bold mb-2">Quick Links</div>
              <ul className="list-unstyled small text-white-50 mb-0">
                <li>
                  <a
                    className="text-white-50 text-decoration-none"
                    href="#features"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    className="text-white-50 text-decoration-none"
                    href="#modules"
                  >
                    Modules
                  </a>
                </li>
                <li>
                  <a
                    className="text-white-50 text-decoration-none"
                    href="#tech"
                  >
                    Tech Stack
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-6 col-lg-4">
              <div className="fw-bold mb-2">Contact</div>
              <div className="text-white-50 small">
                Email: yourmail@example.com
              </div>
              <div className="text-white-50 small">
                University: Dhaka International University
              </div>
            </div>
          </div>

          <hr className="border-secondary my-4" />
          <div className="d-flex justify-content-between align-items-center small text-white-50">
            <div>© {new Date().getFullYear()} ExamAI. All rights reserved.</div>
            <div>Built with Node, Prisma, React & AI</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* Minimal theme helpers (same file is ok, but better put in global css) */
