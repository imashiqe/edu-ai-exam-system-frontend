# 🎓 Edu AI Exam System

AI-Powered Online Examination & Proctoring Platform

A secure, role-based online examination platform built with **React, TypeScript, Express.js, Prisma, PostgreSQL, and AI-assisted evaluation**. The system supports university-level examinations with automated grading, result publication, certificates, attendance tracking, security monitoring, and face verification.

---

## 🚀 Features

### 👨‍🎓 Student Module

* Student Registration
* Face Capture Registration
* Secure Login
* Device Fingerprint Tracking
* Available Exams Dashboard
* Join Exam via Link or Secret Key
* Face Verification Before Exam
* Online Exam Attempt
* Auto Save Answers
* Live Proctor Monitoring
* Result Dashboard
* Certificate Download
* Student Leaderboard

---

### 👨‍🏫 Teacher Module

* Teacher Registration & Verification
* AI-Powered Exam Creation
* Manual Exam Creation
* Question Bank Management
* Exam Scheduling
* Attendance Monitoring
* Live Exam Monitoring
* Submission Review
* AI Evaluation
* Manual Grading
* Result Publishing
* Certificate Generation
* Leaderboard Analytics

---

### 👨‍💼 Super Admin Module

* User Management
* Teacher Approval & Rejection
* Exam Management
* AI Settings Configuration
* Security Event Monitoring
* Login History Tracking
* Audit Logs
* System Statistics Dashboard

---

## 🔐 Security Features

* JWT Authentication
* Role Based Access Control (RBAC)
* Device Fingerprinting
* Face Verification
* Tab Switch Detection
* Copy/Paste Detection
* Suspicious Activity Monitoring
* Login History Tracking
* Audit Logging

---

## 🤖 AI Features

* AI Question Generation
* AI Answer Evaluation
* Automatic Scoring
* Hybrid Examination Mode
* OpenAI Integration
* Google Gemini Integration

---

## 📜 Certificate System

* Automatic Certificate Generation
* Unique Certificate Number
* QR Verification
* Certificate Download
* Verification Page

---

## 📊 Analytics & Reporting

* Student Leaderboard
* Exam Analytics
* Performance Reports
* Teacher Statistics
* Admin Dashboard Metrics

---

## 🏗️ Technology Stack

### Frontend

* React
* TypeScript
* React Router
* Bootstrap 5
* Axios
* React Toastify
* React Webcam
* FingerprintJS

### Backend

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* JWT Authentication
* Multer

### Database

* PostgreSQL

### AI

* OpenAI API
* Google Gemini API

### Other Tools

* PDFKit
* QRCode
* bcrypt
* Zod Validation

---

## 📂 Project Structure

```bash
edu-ai-exam-system
│
├── frontend
│   ├── src
│   ├── pages
│   ├── components
│   ├── services
│   └── routes
│
├── backend
│   ├── src
│   ├── modules
│   │   ├── auth
│   │   ├── admin
│   │   ├── teacher
│   │   ├── student
│   │   ├── attempt
│   │   └── exam
│   │
│   ├── middlewares
│   ├── utils
│   └── prisma
│
└── database
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/edu-ai-exam-system.git

cd edu-ai-exam-system
```

### Backend

```bash
cd backend

npm install

npx prisma generate

npx prisma db push

npm run dev
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## 🔧 Environment Variables

### Backend (.env)

```env
PORT=5000

DATABASE_URL=postgresql://postgres:password@localhost:5432/edu_exam

JWT_ACCESS_SECRET=your_secret

OPENAI_API_KEY=your_key

GEMINI_API_KEY=your_key

APP_BASE_URL=http://localhost:5173
```

---

## 👥 User Roles

### SUPER_ADMIN

* Manage Users
* Approve Teachers
* Monitor Security
* View Analytics

### TEACHER

* Create Exams
* Manage Questions
* Grade Submissions
* Publish Results

### STUDENT

* Join Exams
* Submit Answers
* View Results
* Download Certificates

---

## 📸 Face Verification Workflow

1. Student captures face during registration.
2. Face image is stored securely.
3. Before exam start, student captures live image.
4. Verification process is executed.
5. Student gains access to examination.
6. Proctor events are logged throughout the exam.

---


