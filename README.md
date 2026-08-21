# CareerConnect AI - AI-Powered Job Portal & ATS

CareerConnect AI is a realistic, production-style MERN (MongoDB, Express, React, Node.js) web application and Applicant Tracking System (ATS). It connects Job Seekers, Recruiters, and Administrators with custom workspaces and features a deterministic, explainable AI-assisted skill-matching algorithm that scores and ranks job openings.

---

## 🚀 Key Features

### 👤 Job Seekers
- **Authentication**: JWT login, secure password encryption.
- **Dynamic Profile**: Manage location, contact, educational records, work experience, and core skills.
- **Resume Upload**: Fast document uploading utilizing Multer.
- **AI Resume Parser**: Automatically extracts skills from uploaded PDF resumes using `pdf-parse` and merges them into the profile skills database.
- **AI Recommendation**: Displays ranked job lists with a match percentage (e.g., "85% Match") based on skill intersections.
- **Job Tracker**: Apply to openings with a cover letter, preventing duplicate applications.

### 🏢 Recruiters
- **Company Branding**: Build company workspace profiles.
- **Job Publishing**: Publish job vacancies detailing types (Remote/Hybrid/etc.), salary range, and required skills list.
- **ATS Management**: Manage applicants, view candidate details/resumes, and update application status (Applied, Under Review, Shortlisted, Selected, Rejected).
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
cd C:\Users\Mahesh\.gemini\antigravity\scratch\careerconnect-ai
```

### Step 2: Configure Backend Environment Variables
Create a file named `.env` inside the `backend` folder:
```text
PORT=5000
MONGO_URI=mongodb://localhost:27017/careerconnect
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### Step 3: Install Backend Dependencies & Start Server
```powershell
cd backend
npm install
npm run dev
```
The server will boot up and connect to MongoDB on `http://localhost:5000`.

### Step 4: Install Frontend Dependencies & Start Client
Open a separate terminal window:
```powershell
cd C:\Users\Mahesh\.gemini\antigravity\scratch\careerconnect-ai\frontend
npm install
npm run dev
```
The client will start on `http://localhost:5173`. Open your web browser to start exploring!

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
