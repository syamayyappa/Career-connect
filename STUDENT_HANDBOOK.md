# CareerConnect AI - Student Project Handbook & Interview Prep

This handbook compiles all the documentation, resume text, presentation outlines, and technical interview questions for your college project viva.

---

## 🗄️ 1. Database Schema Explanation

CareerConnect AI uses **MongoDB** as its database, modeled with **Mongoose** schemas. The database contains four core collections:

### A. Users Collection (`User` Model)
Represents seekers, recruiters, and admins.
- `name` (String, required): Full name.
- `email` (String, required, unique): Standard email address.
- `password` (String, required): Cryptographically hashed password (bcryptjs).
- `role` (String, required): Account role (`seeker`, `recruiter`, `admin`).
- `phone` / `location` (String, optional): Profile contact info.
- `skills` (Array of Strings): Key technical skills.
- `education` (Array of subdocuments): Contains `school`, `degree`, `fieldOfStudy`, `from`, `to`, `current`, `description`.
- `experience` (Array of subdocuments): Contains `title`, `company`, `location`, `from`, `to`, `current`, `description`.
- `resume` (String, path): Stored PDF/DOC file route.
- `profileImage` (String, path): Stored avatar image.

### B. Companies Collection (`Company` Model)
Represents recruiter companies.
- `name` (String, required, unique): Unique workspace name.
- `description` / `website` / `location` (String): Business settings.
- `logo` (String, path): Stored avatar image.
- `recruiter` (ObjectId, ref User): Reference to the creator user profile.

### C. Jobs Collection (`Job` Model)
Represents vacancy openings published by recruiters.
- `title` / `description` (String, required): Vacancy info.
- `company` (ObjectId, ref Company): Associated company entity.
- `recruiter` (ObjectId, ref User): Posting recruiter.
- `location` (String): Workspace city/remote configuration.
- `jobType` (String): Enum `['Full-time', 'Part-time', 'Internship', 'Remote', 'Hybrid']`.
- `experience` (String): Required experience tier.
- `salary` (Number): Annual salary details.
- `skills` (Array of Strings): Required technologies tags.
- `responsibilities` / `qualifications` (Array of Strings): Breakdown requirements.
- `deadline` (Date): Expire threshold.

### D. Applications Collection (`Application` Model)
Tracks candidate submissions to job postings.
- `job` (ObjectId, ref Job): Associated opening.
- `applicant` (ObjectId, ref User): Candidate seeker.
- `recruiter` (ObjectId, ref User): Associated hiring recruiter.
- `resume` (String): Captured resume path copy.
- `coverLetter` (String): Candidate notes.
- `status` (String): Enum `['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Selected']`.
- **Compound Index**: `{ job: 1, applicant: 1 }` set to `{ unique: true }` to enforce single submissions.

---

## 🔌 2. REST API Documentation

Base URL: `/api`

### Auth Endpoints
- `POST /auth/register` - Create user. Request body: `name, email, password, role, phone, location`.
- `POST /auth/login` - Validate credentials. Request body: `email, password`. Returns JWT.
- `GET /auth/me` - Fetch profile metadata based on Bearer token.

### User Endpoints
- `GET /users/profile` - Retrieves detail stats.
- `PUT /users/profile` - Updates skills chips, educational history, work experience list.
- `POST /users/resume` - Uploads PDF resume (Multer multipart form). Returns extracted skills.

### Jobs Endpoints
- `GET /jobs` - Public list. Query params: `search, location, jobType, minSalary, experience`.
- `GET /jobs/:id` - Fetch single vacancy detail.
- `POST /jobs` - Create listing (Recruiter). Request body: `title, description, companyId, location, jobType, experience, salary, skills, responsibilities, qualifications, deadline`.
- `DELETE /jobs/:id` - Delete job post (Recruiter owner or Admin).

### Application Endpoints
- `POST /applications` - Apply. Request body: `jobId, coverLetter`.
- `GET /applications/my` - Seeker's submission list.
- `GET /applications/job/:jobId` - Retrieve applicants for job post.
- `PUT /applications/:id/status` - Update candidate status. Request body: `status`.

### AI Recommendation Endpoints
- `GET /recommendations/jobs` - Return jobs matching seeker's profile skills.

---

## 📄 3. Resume Project Description (ATS-Friendly)

**Project Title**: CareerConnect AI — AI-Powered Job Portal & ATS
**Technologies**: MERN Stack (React.js, Node.js, Express.js, MongoDB), REST APIs, JWT, bcryptjs, Multer, pdf-parse, Tailwind CSS v4, Lucide Icons.

### Bullet Points:
- Designed and built a full-stack job board and Applicant Tracking System (ATS) using React.js and Express.js, enabling secure JWT-based role authorization for Job Seekers, Recruiters, and Admins.
- Engineered an explainable AI-assisted skill-matching algorithm on the backend that standardizes technical skills, parses candidate resumes using pdf-parse, and ranks job listings by percentage score.
- Developed interactive recruiter consoles and seeker dashboards with dynamic application state transitions, Multer file uploading, and Mongoose database compound index constraints to lock duplicate application submissions.

---

## 🐙 4. GitHub Project Metadata
- **Repository Description**: "AI-Powered Job Portal & Applicant Tracking System (ATS) built on the MERN stack. Features local PDF resume parsing, interactive seeker/recruiter dashboards, and explainable AI skill-matching scoring."
- **Topics**: `mern-stack`, `react`, `nodejs`, `express`, `mongodb`, `applicant-tracking-system`, `resume-parser`, `job-portal`, `tailwindcss`.

---

## 📊 5. Presentation Slide Outline

- **Slide 1: Title Slide**: CareerConnect AI — Full-Stack Job Portal & ATS.
- **Slide 2: Problem Statement**: Recruiter exhaustion scanning PDFs; seeker confusion on candidate compatibility.
- **Slide 3: Proposed Solution**: An explainable matching system combining resume parsing and ATS pipelines.
- **Slide 4: Tech Stack**: MERN Stack, Tailwind CSS v4, JWT authentication, `pdf-parse` backend.
- **Slide 5: Architecture**: Client (React) <-> REST API (Express) <-> DB (MongoDB) & Skill-Matcher Engine.
- **Slide 6: Database Models**: Relational mapping between Users, Companies, Jobs, and Applications.
- **Slide 7: AI Skill-Matching Engine**: Deterministic normalization and intersection logic.
- **Slide 8: Key Features Demo**: Resume upload -> Skill extraction -> Ranked Recommended Jobs.
- **Slide 9: Key Takeaways & Future Scope**: Cloudinary file hosting integration, auto email alerts, or NLP matching.

---

## ❓ 6. Core Viva & Interview Questions

### Q1: Why did you choose the MERN Stack?
- **Simple Answer**: MERN lets you write the entire app (frontend and backend) in JavaScript, saving time.
- **Technical Answer**: Using JavaScript throughout avoids context-switching. Node.js provides a non-blocking I/O loop, and MongoDB handles dynamic document data cleanly.
- **Project Example**: Data fetched from the MongoDB server is serialized as JSON on Express and rendered directly on the React client.

### Q2: Why did you choose MongoDB over SQL?
- **Simple Answer**: MongoDB uses document storage which is flexible for varying profile shapes.
- **Technical Answer**: MongoDB stores data as BSON documents. Seekers have dynamic subdocuments like `education` or `experience` arrays, which fit document storage much better than complex multi-table SQL joins.
- **Project Example**: The `education` array in the `User` schema is stored as a subdocument array within a single user record.

### Q3: How does JWT Authentication work?
- **Simple Answer**: JWT acts like a digital badge sent by the client in request headers to prove login.
- **Technical Answer**: On login, the server signs a payload containing the user ID using a secure `JWT_SECRET`. The client stores this token in `localStorage` and attaches it as `Authorization: Bearer <token>` headers. The server verifies the signature to identify the user.
- **Project Example**: Auth is managed by `authMiddleware.js` verifying the header token and loading user profiles into `req.user`.

### Q4: How do you prevent duplicate job applications?
- **Simple Answer**: We enforce a database lock so a candidate cannot apply to the same job twice.
- **Technical Answer**: We define a Mongoose compound index on the `Application` schema combining `job` and `applicant` object IDs and set it to `{ unique: true }`.
- **Project Example**: Declared compound index in `Application.js` throws a database exception on duplicate inserts.

### Q5: Explain the AI skill-matching scoring system.
- **Simple Answer**: We find how many candidate skills match the job requirements and divide by the total required.
- **Technical Answer**: Both candidate and job skills lists are normalized (lowercased, spaces removed, symbols stripped) and stored. We perform an array intersection check to find overlaps. Score is computed as: `(Matches / Job Required Skills) * 100`.
- **Project Example**: Written in `aiController.js` using regular expression matching and standard intersection math.
