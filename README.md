# Edu AI Exam System — Frontend (React + Bootstrap + Tabler UI)

Frontend dashboard for the Edu AI Exam System (Final Year Thesis Project).  
Supports role-based navigation for **Super Admin / Teacher / Student**.

## Features
- Modern responsive dashboard UI (Bootstrap + Tabler-like layout)
- Role-based protected routing
- Auth pages: login, register student, register teacher, pending approval
- Super Admin:
  - approvals
  - user management
  - settings (AI provider default)
- Teacher:
  - create exam
  - manage exam (manual questions)
  - AI generator page (ChatGPT/Gemini)
  - submissions + grading
  - send exam via email
- Student:
  - join exam via link/secret key
  - start exam with timer UI (scaffold/extendable)
  - previous attempts & results

---

## Tech Stack
- React + TypeScript
- React Router
- Axios
- Bootstrap 5
- Tabler UI styles (optional)

---

## Getting Started

### 1) Install
```bash
npm install
