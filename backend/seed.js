const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Import models
const User = require('./models/User');
const Company = require('./models/Company');
const Job = require('./models/Job');
const Application = require('./models/Application');
const SavedJob = require('./models/SavedJob');
const Interview = require('./models/Interview');
const Notification = require('./models/Notification');
const Report = require('./models/Report');

// Load environment variables
dotenv.config();

const encryptPassword = async (pass) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(pass, salt);
};

const runSeeding = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected successfully.');

    // 1. Clear existing database collections
    console.log('Clearing database collections...');
    await User.deleteMany();
    await Company.deleteMany();
    await Job.deleteMany();
    await Application.deleteMany();
    await SavedJob.deleteMany();
    await Interview.deleteMany();
    await Notification.deleteMany();
    await Report.deleteMany();
    console.log('Database cleared.');

    // 2. Generate Admin
    const hashedPassword = await encryptPassword('password123');
    console.log('Seeding admin accounts...');
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@careerconnect.ai',
      password: hashedPassword,
      role: 'admin',
      phone: '+1 (555) 999-0000',
      location: 'New York, NY'
    });

    // 3. Generate Recruiters
    console.log('Seeding recruiter accounts...');
    const recruitersData = [
      { name: 'Sarah Jenkins', email: 'sarah@stripe.com', companyName: 'Stripe' },
      { name: 'David Miller', email: 'david@google.com', companyName: 'Google' },
      { name: 'Elena Rostova', email: 'elena@atlassian.com', companyName: 'Atlassian' },
      { name: 'Marcus Chen', email: 'marcus@netflix.com', companyName: 'Netflix' },
      { name: 'Aisha Rahman', email: 'aisha@shopify.com', companyName: 'Shopify' }
    ];

    const recruiters = [];
    for (const r of recruitersData) {
      const userRec = await User.create({
        name: r.name,
        email: r.email,
        password: hashedPassword,
        role: 'recruiter',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA'
      });
      recruiters.push(userRec);
    }

    // 4. Generate Companies
    console.log('Seeding company workspaces...');
    const companiesData = [
      { name: 'Stripe', description: 'Financial infrastructure for the internet.', website: 'https://stripe.com', location: 'San Francisco, CA', industry: 'Fintech', employees: 8000, foundedYear: 2010, recruiterIndex: 0 },
      { name: 'Google', description: 'Search engine and cloud compute ecosystem.', website: 'https://google.com', location: 'Mountain View, CA', industry: 'Tech / Cloud', employees: 150000, foundedYear: 1998, recruiterIndex: 1 },
      { name: 'Atlassian', description: 'Tools like Jira and Confluence built for teamwork.', website: 'https://atlassian.com', location: 'Sydney, Australia', industry: 'Software Collaboration', employees: 10000, foundedYear: 2002, recruiterIndex: 2 },
      { name: 'Netflix', description: 'Subscription-based streaming service provider.', website: 'https://netflix.com', location: 'Los Gatos, CA', industry: 'Entertainment / Streaming', employees: 12000, foundedYear: 1997, recruiterIndex: 3 },
      { name: 'Shopify', description: 'E-commerce platform for retail stores and merchants.', website: 'https://shopify.com', location: 'Ottawa, Canada', industry: 'E-Commerce', employees: 9000, foundedYear: 2006, recruiterIndex: 4 },
      { name: 'Slack', description: 'Instant messaging app and workspace collaboration platform.', website: 'https://slack.com', location: 'San Francisco, CA', industry: 'Workspace Chat', employees: 3000, foundedYear: 2009, recruiterIndex: 2 },
      { name: 'Vercel', description: 'Frontend deployment and serverless cloud solutions.', website: 'https://vercel.com', location: 'Remote', industry: 'Cloud Frontend', employees: 500, foundedYear: 2015, recruiterIndex: 0 },
      { name: 'Infosys Hyderabad', description: 'Global consulting and IT services corporation.', website: 'https://infosys.com', location: 'Hyderabad, India', industry: 'IT Services', employees: 300000, foundedYear: 1981, recruiterIndex: 1 },
      { name: 'Zoom', description: 'Video communication suite and virtual meetings.', website: 'https://zoom.us', location: 'San Jose, CA', industry: 'Telecommunications', employees: 6000, foundedYear: 2011, recruiterIndex: 1 },
      { name: 'Tech Mahindra Hyderabad', description: 'Digital transformation, consulting and business re-engineering services.', website: 'https://techmahindra.com', location: 'Hyderabad, India', industry: 'IT Consulting', employees: 120000, foundedYear: 1986, recruiterIndex: 3 }
    ];

    const companies = [];
    for (const c of companiesData) {
      const comp = await Company.create({
        name: c.name,
        description: c.description,
        website: c.website,
        location: c.location,
        industry: c.industry,
        employees: c.employees,
        foundedYear: c.foundedYear,
        recruiter: recruiters[c.recruiterIndex]._id
      });
      companies.push(comp);
    }

    // 5. Generate Candidates
    console.log('Seeding job seeker candidate profiles...');
    const skillsList = [
      ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'HTML', 'CSS', 'Git'],
      ['Python', 'Django', 'SQL', 'PostgreSQL', 'AWS', 'Docker', 'Git'],
      ['Java', 'Spring Boot', 'SQL', 'MySQL', 'Docker', 'Kubernetes', 'GCP'],
      ['TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Redux', 'Git'],
      ['Python', 'Machine Learning', 'SQL', 'Data Science', 'Pandas', 'Numpy'],
      ['C#', 'ASP.NET', 'SQL Server', 'Azure', 'Angular', 'Git'],
      ['Go', 'Kubernetes', 'Docker', 'GCP', 'REST API', 'Redis'],
      ['React Native', 'Swift', 'Kotlin', 'JavaScript', 'Git', 'Firebase'],
      ['PHP', 'Laravel', 'MySQL', 'HTML', 'CSS', 'JavaScript', 'Bootstrap'],
      ['Python', 'FastAPI', 'MongoDB', 'React', 'Docker', 'CI/CD']
    ];

    const seekers = [];
    for (let i = 1; i <= 15; i++) {
      const skills = skillsList[(i - 1) % skillsList.length];
      const seeker = await User.create({
        name: `Candidate ${i}`,
        email: `seeker${i}@gmail.com`,
        password: hashedPassword,
        role: 'seeker',
        phone: `+1 (555) 234-567${i % 10}`,
        location: i % 2 === 0 ? 'San Francisco, CA' : 'Remote',
        headline: `Software Engineer | Specialties: ${skills.slice(0, 3).join(', ')}`,
        about: `Hi, I am Candidate ${i}. A passionate software developer with core industry focus in modern web stacks and clean code principles.`,
        skills: skills,
        education: [
          {
            school: 'State Technical University',
            degree: 'Bachelor of Science',
            fieldOfStudy: 'Computer Science',
            from: new Date('2018-09-01'),
            to: new Date('2022-06-01'),
            current: false,
            description: 'Focused on algorithms, databases, and network architectures.'
          }
        ],
        experience: [
          {
            title: 'Junior Software Engineer',
            company: i % 2 === 0 ? 'Local Dev Hub' : 'ByteScale Corp',
            location: 'Remote',
            from: new Date('2022-07-01'),
            current: true,
            description: 'Assisted in building REST APIs, resolved database query bottlenecks, and authored component tests.'
          }
        ],
        preferredJobType: i % 3 === 0 ? 'Remote' : 'Full-time',
        preferredLocation: 'San Francisco, CA',
        resume: '/uploads/sample-resume.pdf' // Placeholder path
      });
      seekers.push(seeker);
    }

    // 6. Generate Jobs (20+ listings)
    console.log('Seeding job postings (20+ listings)...');
    const jobsData = [
      { title: 'Full Stack Engineer', companyName: 'Stripe', jobType: 'Full-time', experience: 'Entry-level', salary: 110000, skills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript'], recruiterIndex: 0 },
      { title: 'Backend Cloud Architect', companyName: 'Google', jobType: 'Full-time', experience: 'Senior', salary: 180000, skills: ['Java', 'Spring Boot', 'Docker', 'Kubernetes', 'GCP'], recruiterIndex: 1 },
      { title: 'React UI Developer', companyName: 'Atlassian', jobType: 'Full-time', experience: 'Mid-level', salary: 125000, skills: ['React', 'TypeScript', 'Tailwind CSS', 'Redux', 'Git'], recruiterIndex: 2 },
      { title: 'Data Scientist / ML Engineer', companyName: 'Netflix', jobType: 'Full-time', experience: 'Senior', salary: 195000, skills: ['Python', 'Machine Learning', 'SQL', 'Pandas', 'Numpy'], recruiterIndex: 3 },
      { title: 'E-Commerce Platform Engineer', companyName: 'Shopify', jobType: 'Full-time', experience: 'Mid-level', salary: 130000, skills: ['Ruby', 'Rails', 'React', 'GraphQL', 'MySQL'], recruiterIndex: 4 },
      
      { title: 'Node.js API Lead', companyName: 'Slack', jobType: 'Full-time', experience: 'Senior', salary: 165000, skills: ['Node.js', 'Express', 'Redis', 'SQL', 'Docker'], recruiterIndex: 2 },
      { title: 'Frontend Deployment Engineer', companyName: 'Vercel', jobType: 'Remote', experience: 'Mid-level', salary: 140000, skills: ['Next.js', 'React', 'TypeScript', 'HTML', 'CSS'], recruiterIndex: 0 },
      { title: 'Senior Software Engineer', companyName: 'Infosys Hyderabad', jobType: 'Full-time', experience: 'Senior', salary: 170000, skills: ['Java', 'React', 'AWS', 'MySQL', 'Git'], recruiterIndex: 1 },
      { title: 'Video Infrastructure dev', companyName: 'Zoom', jobType: 'Full-time', experience: 'Mid-level', salary: 135000, skills: ['Go', 'C++', 'Docker', 'REST API', 'Redis'], recruiterIndex: 1 },
      { title: 'Senior Node Platform dev', companyName: 'Tech Mahindra Hyderabad', jobType: 'Remote', experience: 'Senior', salary: 160000, skills: ['Node.js', 'Express', 'MongoDB', 'Kafka', 'Docker'], recruiterIndex: 3 },
 
      { title: 'Junior Frontend Developer', companyName: 'Stripe', jobType: 'Internship', experience: 'Entry-level', salary: 65000, skills: ['JavaScript', 'React', 'HTML', 'CSS', 'Git'], recruiterIndex: 0 },
      { title: 'Systems Engineer', companyName: 'Google', jobType: 'Full-time', experience: 'Mid-level', salary: 150000, skills: ['Go', 'Docker', 'Kubernetes', 'Linux', 'SQL'], recruiterIndex: 1 },
      { title: 'Technical Support Developer', companyName: 'Atlassian', jobType: 'Part-time', experience: 'Entry-level', salary: 50000, skills: ['JavaScript', 'HTML', 'CSS', 'SQL', 'Git'], recruiterIndex: 2 },
      { title: 'Software Engineer - API Team', companyName: 'Tech Mahindra Hyderabad', jobType: 'Full-time', experience: 'Mid-level', salary: 145000, skills: ['Python', 'FastAPI', 'MongoDB', 'Docker', 'REST API'], recruiterIndex: 3 },
      { title: 'Ruby on Rails Developer', companyName: 'Shopify', jobType: 'Full-time', experience: 'Entry-level', salary: 90000, skills: ['Ruby', 'Rails', 'SQL', 'HTML', 'CSS'], recruiterIndex: 4 },
 
      { title: 'Product UI Engineer', companyName: 'Slack', jobType: 'Hybrid', experience: 'Entry-level', salary: 95000, skills: ['React', 'JavaScript', 'CSS', 'Git', 'Bootstrap'], recruiterIndex: 2 },
      { title: 'Next.js Frontend intern', companyName: 'Vercel', jobType: 'Internship', experience: 'Entry-level', salary: 45000, skills: ['React', 'Next.js', 'CSS', 'Git'], recruiterIndex: 0 },
      { title: 'DevOps Cloud Specialist', companyName: 'Infosys Hyderabad', jobType: 'Full-time', experience: 'Senior', salary: 175000, skills: ['AWS', 'Terraform', 'Docker', 'CI/CD', 'Jenkins'], recruiterIndex: 1 },
      { title: 'Security Developer', companyName: 'Zoom', jobType: 'Full-time', experience: 'Senior', salary: 180000, skills: ['Go', 'Python', 'C++', 'Cryptography', 'Linux'], recruiterIndex: 1 },
      { title: 'Community Tools dev', companyName: 'Tech Mahindra Hyderabad', jobType: 'Part-time', experience: 'Entry-level', salary: 55000, skills: ['Python', 'Django', 'SQL', 'Git'], recruiterIndex: 3 },
      { title: 'Solutions Architect', companyName: 'Stripe', jobType: 'Full-time', experience: 'Senior', salary: 170000, skills: ['Node.js', 'React', 'AWS', 'SQL', 'REST API'], recruiterIndex: 0 }
    ];

    const jobs = [];
    for (const j of jobsData) {
      const company = companies.find(c => c.name === j.companyName);
      const job = await Job.create({
        title: j.title,
        description: `This is a premium vacancy for a ${j.title} at ${j.companyName}. Join our fast-paced product engineering squad to deploy high scale tools and maintain robust systems.`,
        company: company._id,
        recruiter: recruiters[j.recruiterIndex]._id,
        location: company.location,
        jobType: j.jobType === 'Hybrid' || j.jobType === 'Remote' ? 'Remote' : 'Full-time', // Norm standard
        experience: j.experience,
        salary: j.salary,
        skills: j.skills,
        responsibilities: [
          'Design robust backend endpoints and frontend components',
          'Optimize database queries and clean cache indexes',
          'Deploy code changes to development staging environments'
        ],
        qualifications: [
          `Familiarity with the stack: ${j.skills.join(', ')}`,
          'Strong command over software engineering principles',
          'Ability to collaborate closely with product management teams'
        ],
        benefits: ['Premium Health Insurance', 'Generous Equity Packages', 'Flexible PTO / Annual Leave', 'Remote Work Allowances'],
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      });
      jobs.push(job);
    }

    // 7. Seed Applications (Apply some seekers to jobs)
    console.log('Seeding job application submissions...');
    const applications = [];
    for (let i = 0; i < 8; i++) {
      const seekerIndex = i;
      const jobIndex = i % jobs.length;
      
      const app = await Application.create({
        job: jobs[jobIndex]._id,
        applicant: seekers[seekerIndex]._id,
        recruiter: jobs[jobIndex].recruiter,
        resume: seekers[seekerIndex].resume,
        coverLetter: `Hi, I am Candidate ${seekerIndex + 1}. I would love to join your engineering team as a ${jobs[jobIndex].title}. I have strong background matching your requirements.`,
        status: i % 4 === 0 ? 'Shortlisted' : i % 4 === 1 ? 'Under Review' : i % 4 === 2 ? 'Rejected' : 'Applied'
      });
      applications.push(app);
    }

    // 8. Seed Interviews (Schedule meetings)
    console.log('Seeding scheduled recruiter interviews...');
    for (let i = 0; i < 3; i++) {
      const app = applications.find(a => a.status === 'Shortlisted');
      if (app) {
        await Interview.create({
          candidate: app.applicant,
          recruiter: app.recruiter,
          job: app.job,
          date: new Date(Date.now() + (i + 1) * 2 * 24 * 60 * 60 * 1000), // In a few days
          time: '14:30',
          type: i === 0 ? 'Technical' : i === 1 ? 'HR' : 'Behavioral',
          meetingLink: `https://zoom.us/j/999123456${i}`,
          notes: 'Prepare to discuss MERN architecture foundations and database queries optimization.',
          status: 'Scheduled'
        });
      }
    }

    // 9. Seed Notifications
    console.log('Seeding system alert notifications...');
    for (let i = 0; i < 5; i++) {
      await Notification.create({
        user: seekers[i]._id,
        title: 'Application Shortlisted',
        message: `Congratulations! Your profile has been shortlisted for the role of '${jobs[i].title}' at Stripe.`,
        type: 'success',
        read: false
      });
    }

    console.log('=========================================');
    console.log('DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log(`Generated Admin: ${admin.email}`);
    console.log(`Generated Recruiters: ${recruiters.length}`);
    console.log(`Generated Companies: ${companies.length}`);
    console.log(`Generated Candidates: ${seekers.length}`);
    console.log(`Generated Job Openings: ${jobs.length}`);
    console.log(`Generated Applications: ${applications.length}`);
    console.log('=========================================');

    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Seeding process failed with error:', err);
    process.exit(1);
  }
};

runSeeding();
