# CareerConnect AI - AI-Powered Job Portal & ATS

CareerConnect AI is a realistic, production-style MERN (MongoDB, Express, React, Node.js) web application and Applicant Tracking System (ATS). It connects Job Seekers, Recruiters, and Administrators with custom workspaces and features a deterministic, explainable AI-assisted skill-matching algorithm that scores and ranks job openings.

---

## 🌐 Live Deployments & Instant Access

The project is fully deployed, synchronized, and operational online:

- 🚀 **Live Production Frontend (Vercel)**: [https://frontend-gamma-umber-42.vercel.app](https://frontend-gamma-umber-42.vercel.app)
- ⚙️ **Live Cloud API Backend (Render)**: [https://career-connect-t2k4.onrender.com](https://career-connect-t2k4.onrender.com)
- 🐙 **Official GitHub Repository**: [https://github.com/syamayyappa/Career-connect](https://github.com/syamayyappa/Career-connect)

### 🔑 Demo Accounts (Pre-Seeded & Ready to Use Anywhere)

| Role | Email | Password | Access Details |
| :--- | :--- | :--- | :--- |
| **Job Seeker** | `alex.turner@example.com` | `password123` | AI resume matching, dedicated application flow, job search |
| **Recruiter** | `sarah@stripe.com` | `password123` | Stripe employer portal, job posting, applicant ATS review |
| **Admin** | `admin@careerconnect.ai` | `password123` | Platform analytics, user audit, content moderation |

---

## 🚀 Key Features

### 👤 Job Seekers
- **Authentication**: JWT login, secure password encryption.
- **Dynamic Profile**: Manage location, contact, educational records, work experience, and core skills.
- **Dedicated Application Page**: Select Fresher vs Experienced, input current employer details (company, role, notice period, current CTC), qualifications, and skills.
- **Direct Resume Upload**: Drag-and-drop or file picker with instant attachment and ATS parsing.
- **AI Recommendation**: Displays ranked job lists with a match percentage (e.g., "85% Match") based on skill intersections.
- **Job Tracker**: Track applications across statuses (Applied, Under Review, Shortlisted, Selected, Rejected).

### 🏢 Recruiters
- **Company Branding**: Build company workspace profiles.
- **Job Publishing**: Publish job vacancies detailing types (Remote/Hybrid/etc.), salary range, and required skills list.
- **ATS Management**: Manage applicants, view candidate details/resumes, download resumes, and update application status (Applied, Under Review, Shortlisted, Selected, Rejected).
- **Consolidated Analytics**: Track totals for jobs posted, applications, shortlisted pools, and hires.

### 👑 Administrators
- **Platform Analytics**: Audit platform statistics (users count, applications ledger, jobs total).
- **System Deletions**: Moderate job postings or delete user registrations.

---

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite), Tailwind CSS v4, Axios, React Router DOM, Lucide Icons.
- **Backend**: Node.js, Express.js, JWT, bcryptjs, Multer, `pdf-parse`, dotenv, CORS.
- **Database**: MongoDB & Mongoose.

---

## 📁 Directory Structure

```text
careerconnect-ai/
├── backend/
│   ├── config/             # Database connection
│   ├── controllers/        # Route controllers (auth, job, application, company, ai, admin)
│   ├── middleware/         # Auth guards, file uploads, error handlers
│   ├── models/             # Mongoose schemas (User, Job, Company, Application)
│   ├── routes/             # API route files
│   ├── uploads/            # Local resume documents storage
│   ├── utils/              # Token signing, normalization helpers
│   ├── .env
│   └── server.js           # Server entrypoint
└── frontend/
    ├── src/
    │   ├── components/     # Navbar, Footer, Protected Route guards
    │   ├── context/        # Global Auth provider state
    │   ├── layouts/        # Layout wrappers
    │   ├── pages/          # Full page views (Home, Jobs, Dashboards, Profiles)
    │   ├── services/       # Axios API client
    │   └── App.jsx         # App router configuration
```

---

## 💻 Local Setup & Installation (Windows)

### Prerequisites
Make sure you have Node.js (version 16 or higher) and MongoDB running locally on your computer.

### Step 1: Clone the repository & Navigate
```powershell
git clone https://github.com/syamayyappa/Career-connect.git
cd Career-connect
```

### Option A: 1-Click Launch (Recommended for Windows)
Simply double-click:
```powershell
.\start_project.bat
```
This automatically boots both the backend API (port 5000) and frontend client (port 5173).

### Option B: Manual Launch
1. **Start Backend**:
   ```powershell
   cd backend
   npm install
   npm run dev
   ```
   The backend runs on `http://localhost:5000` (auto-connects to MongoDB or starts in-memory MongoDB).

2. **Start Frontend**:
   In a separate terminal:
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
   The client will open on `http://localhost:5173`. Open your web browser to start exploring!

---

## 🤖 Explainable AI Skill-Matching Logic
Rather than claiming complex black-box deep learning models are used, this project implements a deterministic, interview-friendly **Normalized Skill Intersection Algorithm**:
1. **Normalization**: Trims spaces, converts text to lowercase, and standardizes synonyms (e.g. `react.js`, `react-js`, `react js` -> `reactjs`).
2. **Intersection**: Performs a mathematical intersection of candidate skills set and job required skills.
3. **Score calculation**:
   $$\text{Score} = \left( \frac{\text{Skills Match Count}}{\text{Total Job Required Skills}} \right) \times 100$$
4. **Ranking**: Returns vacancies sorted in descending order by match percentage.

---

## 🐙 Git Workflow Guide
Initialize and sync your codebase to GitHub using these commands:

1. **Initialize Git Repository**
   ```bash
   git init
   ```
2. **Create .gitignore File**
   Add a `.gitignore` to prevent uploading secrets (`.env`) or large folders (`node_modules`, `uploads`):
   ```text
   # Backend
   node_modules/
   .env
   uploads/*
   !uploads/.gitkeep

   # Frontend
   dist/
   node_modules/
   ```
3. **Stage Your Code**
   ```bash
   git add .
   ```
4. **Commit Locally**
   ```bash
   git commit -m "feat: complete CareerConnect AI MERN ATS portal and AI skill recommendation matching"
   ```
5. **Set Default Branch & Remote Host**
   ```bash
   git branch -M main
   git remote add origin https://github.com/your-username/careerconnect-ai.git
   ```
6. **Push to GitHub**
   ```bash
   git push -u origin main
   ```
