export const DEMO_USERS = {
  candidate: {
    _id: "6acc614a73cdf6979d5a201e",
    name: "Alex Turner",
    email: "alex.turner@example.com",
    role: "seeker",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    headline: "Full Stack MERN Developer | React, Node.js, Express & AI enthusiast",
    about: "Passionate full-stack developer specializing in scalable web architectures, modern JavaScript / TypeScript ecosystems, and ATS-optimized career tools.",
    skills: ["React", "Node.js", "Express", "MongoDB", "JavaScript", "HTML", "CSS", "Git", "TypeScript", "Tailwind CSS"],
    education: [
      {
        school: "University of California, Berkeley",
        degree: "Bachelor of Science",
        fieldOfStudy: "Computer Science",
        from: "2019-09-01",
        to: "2023-06-01",
        current: false,
        description: "Graduated with honors. Coursework in Distributed Systems, Algorithms, and UI Engineering."
      }
    ],
    experience: [
      {
        title: "Full Stack Developer Intern",
        company: "CloudScale Technologies",
        location: "San Francisco, CA",
        from: "2023-07-01",
        current: true,
        description: "Engineered high-performance REST APIs with Node.js, built responsive React interfaces, and improved search latency."
      }
    ],
    preferredJobType: "Full-time",
    preferredLocation: "San Francisco, CA",
    token: "demo-jwt-token-alex-turner-candidate"
  },
  recruiter: {
    _id: "6acc62330d1ee4d41e54e38c",
    name: "Sarah Jenkins",
    email: "sarah@stripe.com",
    role: "recruiter",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    company: "Stripe",
    token: "demo-jwt-token-sarah-jenkins-recruiter"
  },
  admin: {
    _id: "6acc62330d1ee4d41e54e38b",
    name: "System Administrator",
    email: "admin@careerconnect.ai",
    role: "admin",
    phone: "+1 (555) 999-0000",
    location: "New York, NY",
    token: "demo-jwt-token-admin-system"
  }
};

export const DEMO_JOBS = [
  {
    _id: "job-101",
    title: "Full Stack Engineer",
    company: { _id: "comp-1", name: "Stripe", location: "San Francisco, CA" },
    location: "San Francisco, CA",
    jobType: "Full-time",
    experience: "Entry-level",
    salary: 110000,
    skills: ["React", "Node.js", "Express", "MongoDB", "JavaScript"],
    description: "Join Stripe's developer tools squad building financial infrastructure and developer-first web services.",
    responsibilities: ["Design robust endpoints", "Optimize database query performance", "Deploy full-stack modules"],
    qualifications: ["Familiarity with MERN stack", "Strong JavaScript knowledge"],
    benefits: ["Full Health Cover", "Flexible PTO", "401k match"],
    createdAt: new Date().toISOString()
  },
  {
    _id: "job-102",
    title: "Backend Cloud Architect",
    company: { _id: "comp-2", name: "Google", location: "Mountain View, CA" },
    location: "Mountain View, CA",
    jobType: "Full-time",
    experience: "Senior",
    salary: 180000,
    skills: ["Java", "Spring Boot", "Docker", "Kubernetes", "GCP"],
    description: "Architect mission-critical distributed cloud services serving millions of worldwide queries.",
    responsibilities: ["Lead cloud architecture", "Implement zero-downtime deployments"],
    qualifications: ["5+ years distributed systems", "Kubernetes mastery"],
    benefits: ["World-class meals", "Equity compensation", "Health coverage"],
    createdAt: new Date().toISOString()
  },
  {
    _id: "job-103",
    title: "React UI Developer",
    company: { _id: "comp-3", name: "Atlassian", location: "Sydney, Australia" },
    location: "Sydney, Australia",
    jobType: "Full-time",
    experience: "Mid-level",
    salary: 125000,
    skills: ["React", "TypeScript", "Tailwind CSS", "Redux", "Git"],
    description: "Design slick collaborative tools for Jira and Confluence used by thousands of engineering teams.",
    responsibilities: ["Build accessible React components", "Manage client-side state with Redux"],
    qualifications: ["Proficiency in modern TypeScript", "Design system enthusiasm"],
    benefits: ["Remote work budget", "Global transfers", "Learning stipends"],
    createdAt: new Date().toISOString()
  },
  {
    _id: "job-104",
    title: "Data Scientist / ML Engineer",
    company: { _id: "comp-4", name: "Netflix", location: "Los Gatos, CA" },
    location: "Los Gatos, CA",
    jobType: "Full-time",
    experience: "Senior",
    salary: 195000,
    skills: ["Python", "Machine Learning", "SQL", "Pandas", "Numpy"],
    description: "Develop personalized content ranking algorithms using machine learning pipelines and vector search.",
    responsibilities: ["Train deep recommendation models", "Optimize inference latency"],
    qualifications: ["Strong Python ML skills", "Experience with PyTorch or TensorFlow"],
    benefits: ["Top of market salary", "Unlimited vacation"],
    createdAt: new Date().toISOString()
  },
  {
    _id: "job-105",
    title: "Frontend Deployment Engineer",
    company: { _id: "comp-5", name: "Vercel", location: "Remote" },
    location: "Remote",
    jobType: "Remote",
    experience: "Mid-level",
    salary: 140000,
    skills: ["Next.js", "React", "TypeScript", "HTML", "CSS"],
    description: "Push the boundaries of web performance, edge server rendering, and modern developer experience.",
    responsibilities: ["Build developer dashboards", "Speed up Core Web Vitals"],
    qualifications: ["Mastery of Next.js & React", "Deep edge compute understanding"],
    benefits: ["100% Remote everywhere", "Generous hardware stipend"],
    createdAt: new Date().toISOString()
  }
];

export const DEMO_APPLICATIONS = [
  {
    _id: "app-201",
    job: DEMO_JOBS[0],
    applicant: DEMO_USERS.candidate,
    status: "Shortlisted",
    matchScore: 92,
    appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    coverLetter: "Excited to apply for Full Stack Engineer at Stripe. My MERN experience directly matches your core technical requirements."
  },
  {
    _id: "app-202",
    job: DEMO_JOBS[2],
    applicant: DEMO_USERS.candidate,
    status: "Under Review",
    matchScore: 88,
    appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    coverLetter: "Passionate about building intuitive UI components and accessible design systems at Atlassian."
  },
  {
    _id: "app-203",
    job: DEMO_JOBS[4],
    applicant: DEMO_USERS.candidate,
    status: "Applied",
    matchScore: 85,
    appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    coverLetter: "Keen to engineer modern Next.js edge web experiences with Vercel's product team."
  }
];

export const DEMO_ADMIN_STATS = {
  totalUsers: 22,
  totalCandidates: 16,
  totalRecruiters: 5,
  totalJobs: 21,
  totalApplications: 12,
  totalCompanies: 10
};
