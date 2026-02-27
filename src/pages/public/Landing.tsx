import React, { useEffect } from "react";
import "./landing.css";
import { Link } from "react-router-dom";
import heroImage from "../../assets/banner.jpg";

// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBrain,
  faChartLine,
  faUserShield,
  faBolt,
  faGraduationCap,
  faClock,
  faCheckCircle,
  faEnvelope,
  faArrowRight,
  faShieldHalved,
  faWandMagicSparkles,
  faFileLines,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faLinkedin,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

// AOS
import AOS from "aos";
import "aos/dist/aos.css";

const Landing = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
    });
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
  ];

  const topFeatures = [
    {
      icon: faWandMagicSparkles,
      title: "Create Exam (Manual / AI)",
      desc: "Teachers can create exams manually or generate using AI.",
    },
    {
      icon: faUserShield,
      title: "Role-Based Dashboard",
      desc: "Separate dashboards for Super Admin, Teacher & Student.",
    },
    {
      icon: faBolt,
      title: "Auto Evaluation",
      desc: "MCQ auto grading with real-time scoring.",
    },
    {
      icon: faChartLine,
      title: "Performance Analytics",
      desc: "Track student progress and exam statistics.",
    },
  ];

  const coreFeatures = [
    {
      icon: faBrain,
      title: "AI Question Generation",
      desc: "Generate MCQ, short, and descriptive questions via AI.",
    },
    {
      icon: faFileLines,
      title: "Manual Exam Builder",
      desc: "Build structured exams with categories and marks.",
    },
    {
      icon: faShieldHalved,
      title: "Secure Online Exam",
      desc: "Time controls + anti-cheat ready exam flow.",
    },
    {
      icon: faCheckCircle,
      title: "Instant Result System",
      desc: "Auto results for MCQ with real-time scoring.",
    },
    {
      icon: faGraduationCap,
      title: "Teacher Tools",
      desc: "Assign exams, monitor submissions, export reports.",
    },
    {
      icon: faChartLine,
      title: "Reports & Insights",
      desc: "Analytics dashboards for students & institutions.",
    },
  ];

  const trustedBy = ["School", "College", "University", "Coaching", "EdTech"];

  const howItWorks = [
    {
      icon: faWandMagicSparkles,
      title: "Step 1: Create Exam",
      desc: "Teacher creates exam manually or using AI.",
    },
    {
      icon: faUserShield,
      title: "Step 2: Assign to Students",
      desc: "Students receive exam via their dashboard.",
    },
    {
      icon: faClock,
      title: "Step 3: Attempt Online",
      desc: "Students attempt within a set time limit.",
    },
    {
      icon: faCircleCheck,
      title: "Step 4: Instant Result",
      desc: "System evaluates and publishes results instantly.",
    },
  ];

  const testimonials = [
    {
      name: "Professor Rahman",
      role: "University Teacher",
      text: "AI question generation saves me hours of preparation time.",
    },
    {
      name: "Nusrat Ahmed",
      role: "School Principal",
      text: "Instant results and analytics improved our exam process significantly.",
    },
    {
      name: "Tanvir Hasan",
      role: "Student",
      text: "Online exams are smooth and results are immediate.",
    },
  ];

  const faqs = [
    {
      q: "Can teachers generate questions using AI?",
      a: "Yes. Teachers can generate MCQ, short, and descriptive questions using AI integration.",
    },
    {
      q: "Does the system support role-based access?",
      a: "Yes. Separate dashboards for Superadmin, Teacher, and Student.",
    },
    {
      q: "Are results generated automatically?",
      a: "MCQ exams are automatically graded and results are shown instantly.",
    },
    {
      q: "Is the exam time controlled?",
      a: "Yes. Each exam can have a specific time limit and submission control.",
    },
  ];

  return (
    <div className="lp">
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg lp-nav">
        <div className="container">
          <a className="navbar-brand fw-bold lp-logo" href="#!">
            <span className="lp-logo-dot" /> Edu AI Exam
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#lpNav"
            aria-controls="lpNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="lpNav">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-2">
              {navLinks.map((l) => (
                <li className="nav-item" key={l.href}>
                  <a className="nav-link lp-navlink" href={l.href}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="d-flex gap-2">
              <Link to="/login" className="btn lp-btn-ghost">
                Sign in
              </Link>

              <Link to="/register/teacher" className="btn lp-btn-primary">
                Teacher Apply{" "}
                <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="lp-hero">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6" data-aos="fade-right">
              <p className="lp-badge">
                <span className="lp-badge-dot" />
                AI Exam • Instant Evaluation • Role-Based Access
              </p>

              <h1 className="lp-title">
                Smart AI-Powered <br />
                Exam Management System <br />
                <span>Instant Results. Zero Hassle.</span>
              </h1>

              <p className="lp-subtitle">
                Create exams manually or using AI (ChatGPT / Gemini), evaluate
                instantly, and manage students, teachers, and admins in one
                powerful platform.
              </p>

              <div className="d-flex flex-wrap gap-2 mt-4">
                <Link
                  to="/register/student"
                  className="btn lp-btn-primary px-4"
                >
                  Get started{" "}
                  <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                </Link>

                <a className="btn lp-btn-outline px-4" href="#how">
                  How it works
                </a>
              </div>

              <div className="lp-hero-meta mt-4">
                <div
                  className="lp-meta-item"
                  data-aos="zoom-in"
                  data-aos-delay="100"
                >
                  <div className="lp-meta-ico">
                    <FontAwesomeIcon icon={faBrain} />
                  </div>
                  <div>
                    <div className="fw-semibold">AI Question Generator</div>
                    <div className="text-muted small">
                      Generate MCQ, short & descriptive
                    </div>
                  </div>
                </div>

                <div
                  className="lp-meta-item"
                  data-aos="zoom-in"
                  data-aos-delay="180"
                >
                  <div className="lp-meta-ico">
                    <FontAwesomeIcon icon={faBolt} />
                  </div>
                  <div>
                    <div className="fw-semibold">Instant Auto Result</div>
                    <div className="text-muted small">
                      Students get results immediately
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* HERO IMAGE */}
            <div className="col-lg-6" data-aos="fade-left">
              <div className="lp-hero-art">
                <div className="lp-hero-art-inner">
                  <img
                    src={heroImage}
                    alt="Edu AI Exam System"
                    className="lp-hero-img img-fluid"
                  />
                </div>

                <div
                  className="lp-float-card lp-float-1"
                  data-aos="zoom-in"
                  data-aos-delay="200"
                >
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="me-2 lp-float-ico"
                  />
                  <span>Instant Result</span>
                </div>

                <div
                  className="lp-float-card lp-float-2"
                  data-aos="zoom-in"
                  data-aos-delay="300"
                >
                  <FontAwesomeIcon
                    icon={faUserShield}
                    className="me-2 lp-float-ico"
                  />
                  <span>Role Based</span>
                </div>
              </div>
            </div>
          </div>

          {/* TOP FEATURES */}
          <section id="features" className="lp-feature-row">
            <div className="row g-3">
              {topFeatures.map((f, i) => (
                <div
                  className="col-12 col-md-6 col-lg-3"
                  key={i}
                  data-aos="fade-up"
                  data-aos-delay={i * 90}
                >
                  <div className="lp-card lp-hover-card">
                    <div className="lp-icon lp-icon-animated">
                      <FontAwesomeIcon icon={f.icon} />
                    </div>
                    <h6 className="mt-3 mb-1 fw-semibold">{f.title}</h6>
                    <p className="mb-0 text-muted small">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </header>

      {/* CORE FEATURES */}
      <section className="lp-section">
        <div className="container">
          <div className="text-center mb-4" data-aos="fade-up">
            <h2 className="lp-h2">Our Core Features</h2>
            <p className="text-muted mb-0">
              Everything you need to manage exams digitally.
            </p>
          </div>

          <div
            className="lp-services-wrap"
            data-aos="fade-up"
            data-aos-delay="120"
          >
            <div className="row g-3">
              {coreFeatures.map((s, i) => (
                <div
                  className="col-12 col-md-6 col-lg-4"
                  key={i}
                  data-aos="fade-up"
                  data-aos-delay={i * 70}
                >
                  <div className="lp-service-card lp-hover-card">
                    <div className="lp-service-icon lp-icon-animated">
                      <FontAwesomeIcon icon={s.icon} />
                    </div>
                    <h6 className="mt-3 mb-1 fw-semibold">{s.title}</h6>
                    <p className="mb-0 text-muted small">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TRUSTED */}
          <div className="lp-trusted mt-5" data-aos="fade-up">
            <p className="text-muted small mb-2 text-center">
              Built for Schools, Colleges & Universities
            </p>
            <div className="lp-logos">
              {trustedBy.map((x, idx) => (
                <div
                  className="lp-logo-pill"
                  key={x}
                  data-aos="zoom-in"
                  data-aos-delay={idx * 70}
                >
                  {x}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="lp-section lp-soft">
        <div className="container">
          <div className="text-center mb-4" data-aos="fade-up">
            <h2 className="lp-h2">How Edu AI Exam Works</h2>
            <p className="text-muted mb-0">
              Create, Assign, Attempt, and Evaluate in Minutes.
            </p>
          </div>

          <div className="row g-3">
            {howItWorks.map((t, i) => (
              <div
                className="col-12 col-lg-6"
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 80}
              >
                <div className="lp-step-card lp-hover-card">
                  <div className="lp-step-illu lp-icon-animated">
                    <FontAwesomeIcon icon={t.icon} />
                  </div>
                  <div>
                    <h6 className="mb-1 fw-semibold">{t.title}</h6>
                    <p className="mb-0 text-muted small">{t.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA STRIP */}
          <div className="lp-cta mt-5" data-aos="zoom-in">
            <div>
              <h3 className="mb-1">
                Transform Your Institution with AI-Based Exams
              </h3>
              <p className="mb-0">
                Save time, reduce manual grading, and improve accuracy.
              </p>
            </div>
            <Link to="/register/teacher" className="btn lp-btn-primary px-4">
              Start Free Demo{" "}
              <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="lp-section">
        <div className="container">
          <div className="text-center mb-4" data-aos="fade-up">
            <h2 className="lp-h2">What people are saying</h2>
            <p className="text-muted mb-0">
              Feedback from teachers, institutions, and students.
            </p>
          </div>

          <div className="row g-3">
            {testimonials.map((r, i) => (
              <div
                className="col-12 col-md-6 col-lg-4"
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 90}
              >
                <div className="lp-testimonial lp-hover-card">
                  <div className="lp-avatar">
                    <span>{r.name?.slice(0, 1) || "U"}</span>
                  </div>
                  <div>
                    <p className="mb-2">{r.text}</p>
                    <div className="fw-semibold">{r.name}</div>
                    <div className="text-muted small">{r.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="lp-section lp-soft">
        <div className="container">
          <div className="text-center mb-4" data-aos="fade-up">
            <h2 className="lp-h2">Frequently Asked Questions</h2>
            <p className="text-muted mb-0">
              Quick answers to common questions.
            </p>
          </div>

          <div className="lp-faq" data-aos="fade-up" data-aos-delay="120">
            <div className="accordion lp-accordion" id="lpFaq">
              {faqs.map((item, idx) => (
                <div className="accordion-item" key={idx}>
                  <h2 className="accordion-header" id={`h${idx}`}>
                    <button
                      className={`accordion-button ${idx !== 0 ? "collapsed" : ""}`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#c${idx}`}
                      aria-expanded={idx === 0 ? "true" : "false"}
                      aria-controls={`c${idx}`}
                    >
                      {item.q}
                    </button>
                  </h2>
                  <div
                    id={`c${idx}`}
                    className={`accordion-collapse collapse ${idx === 0 ? "show" : ""}`}
                    aria-labelledby={`h${idx}`}
                    data-bs-parent="#lpFaq"
                  >
                    <div className="accordion-body text-muted">{item.a}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-center mt-3">
              <Link to="/register/student" className="btn lp-btn-primary px-4">
                Get Started{" "}
                <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4" data-aos="fade-up">
              <div className="fw-bold mb-2">Edu AI Exam System</div>
              <p className="lp-footer-text">
                A modern AI-powered exam management system built with React,
                Node.js, TypeScript, PostgreSQL & Prisma.
              </p>

              <div className="lp-mini-list">
                <div className="lp-mini">
                  <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                  AI + Manual Exam Builder
                </div>
                <div className="lp-mini">
                  <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                  Role-Based Dashboard
                </div>
                <div className="lp-mini">
                  <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                  Instant Result & Analytics
                </div>
              </div>
            </div>

            <div
              className="col-6 col-lg-2"
              data-aos="fade-up"
              data-aos-delay="80"
            >
              <div className="fw-semibold mb-2">Company</div>
              <ul className="lp-footer-links">
                <li>
                  <a href="#!">About</a>
                </li>
                <li>
                  <a href="#!">Contact</a>
                </li>
                <li>
                  <a href="#!">Support</a>
                </li>
              </ul>
            </div>

            <div
              className="col-6 col-lg-2"
              data-aos="fade-up"
              data-aos-delay="140"
            >
              <div className="fw-semibold mb-2">Product</div>
              <ul className="lp-footer-links">
                <li>
                  <a href="#features">Features</a>
                </li>
                <li>
                  <a href="#how">How it works</a>
                </li>
                <li>
                  <a href="#faq">FAQ</a>
                </li>
              </ul>
            </div>

            <div className="col-lg-4" data-aos="fade-up" data-aos-delay="200">
              <div className="fw-semibold mb-2">Stay updated</div>
              <div className="d-flex gap-2">
                <div className="lp-input-icon">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <input
                  className="form-control lp-input"
                  placeholder="Email address"
                />
                <button className="btn lp-btn-primary">Join</button>
              </div>

              <div className="lp-social mt-3">
                <a href="#!" aria-label="Facebook">
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
                <a href="#!" aria-label="Twitter">
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a href="#!" aria-label="LinkedIn">
                  <FontAwesomeIcon icon={faLinkedin} />
                </a>
                <a href="#!" aria-label="GitHub">
                  <FontAwesomeIcon icon={faGithub} />
                </a>
              </div>
            </div>
          </div>

          <hr className="lp-hr" />
          <div className="d-flex flex-wrap justify-content-between text-muted small">
            <span>
              © {new Date().getFullYear()} Edu AI Exam System. All rights
              reserved.
            </span>
            <span>Privacy • Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
