import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Send,
  Sparkles,
  Plus,
  X,
  GraduationCap,
  Clock,
  Phone,
  Mail,
  User as UserIcon,
  Globe,
  Link2,
  Check,
  ChevronRight,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  // Experience State
  const [experienceLevel, setExperienceLevel] = useState('Fresher'); // 'Fresher' or 'Experienced'
  const [yearsOfExperience, setYearsOfExperience] = useState('0');
  const [currentlyWorking, setCurrentlyWorking] = useState(false);
  const [currentCompany, setCurrentCompany] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('Immediate');
  const [expectedSalary, setExpectedSalary] = useState('');

  // Education State
  const [highestEducation, setHighestEducation] = useState('B.Tech / B.E.');
  const [college, setCollege] = useState('');
  const [graduationYear, setGraduationYear] = useState(new Date().getFullYear().toString());

  // Skills State
  const [skills, setSkills] = useState([]);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Resume State
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileName, setResumeFileName] = useState('');
  const [useProfileResume, setUseProfileResume] = useState(false);

  // Cover Letter State
  const [coverLetter, setCoverLetter] = useState('');
  const [confirmedAccuracy, setConfirmedAccuracy] = useState(true);

  // Check if candidate already applied
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    const fetchJobAndUserData = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/jobs/${id}`);
        if (data.success) {
          setJob(data.data);
        }

        // Check applications to see if already applied
        try {
          const appRes = await API.get('/applications/my');
          if (appRes.data.success) {
            const hasApplied = appRes.data.data.some((a) => (a.job?._id || a.job) === id);
            if (hasApplied) {
              setAlreadyApplied(true);
            }
          }
        } catch (e) {
          console.warn('Check application error:', e);
        }

        // Pre-fill user data
        if (user) {
          setFullName(user.name || '');
          setEmail(user.email || '');
          setPhone(user.phone || '');
          setLocation(user.location || '');
          if (user.skills && Array.isArray(user.skills) && user.skills.length > 0) {
            setSkills([...user.skills]);
          }
          if (user.education && user.education.length > 0) {
            setCollege(user.education[0].school || '');
            setHighestEducation(user.education[0].degree || 'B.Tech / B.E.');
          }
          if (user.experience && user.experience.length > 0) {
            setExperienceLevel('Experienced');
            setCurrentlyWorking(user.experience[0].current || false);
            setCurrentCompany(user.experience[0].company || '');
            setCurrentRole(user.experience[0].title || '');
          }
          if (user.resume) {
            setUseProfileResume(true);
          }
        }
      } catch (err) {
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndUserData();
  }, [id, user]);

  const handleAddSkill = (e) => {
    e?.preventDefault();
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;
    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      toast('Skill already added', { icon: 'ℹ️' });
      return;
    }
    setSkills([...skills, trimmed]);
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAddJobSkill = (jobSkill) => {
    if (!skills.some((s) => s.toLowerCase() === jobSkill.toLowerCase())) {
      setSkills([...skills, jobSkill]);
      toast.success(`Added ${jobSkill} to your application skills!`);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(file.mimetype) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      toast.error('Invalid format. Please upload PDF, DOC, or DOCX resume.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit.');
      return;
    }

    setResumeFile(file);
    setResumeFileName(file.name);
    setUseProfileResume(false);
    toast.success(`Resume "${file.name}" attached!`);
  };

  const applyCoverLetterTemplate = (type) => {
    if (type === 'fresher') {
      setCoverLetter(
        `Dear Hiring Team at ${job?.company?.name || 'Company'},\n\nI am writing to express my strong interest in the ${job?.title || 'position'}. As a recent graduate with hands-on foundational skills in ${skills.slice(0, 3).join(', ') || 'modern software engineering'}, I am eager to contribute my problem-solving ability, fast-learning mindset, and fresh energy to your team.\n\nThank you for considering my application. I look forward to the possibility of discussing this opportunity with you.`
      );
    } else if (type === 'experienced') {
      setCoverLetter(
        `Dear Hiring Manager,\n\nI am excited to apply for the ${job?.title || 'role'} at ${job?.company?.name || 'your organization'}. With practical industry experience in ${skills.slice(0, 4).join(', ') || 'software development'} and delivering quality results, I am confident in my ability to make an immediate impact on your upcoming goals.\n\nI welcome the opportunity to connect and discuss how my background aligns with your team's mission.`
      );
    }
  };

  // Skill intersection match calculation
  const jobSkills = job?.skills || [];
  const matchedSkillsCount = jobSkills.filter((js) =>
    skills.some((s) => s.toLowerCase().trim() === js.toLowerCase().trim())
  ).length;
  const matchPercentage = jobSkills.length > 0 ? Math.round((matchedSkillsCount / jobSkills.length) * 100) : 100;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!phone.trim()) {
      toast.error('Please provide a contact phone number');
      return;
    }
    if (!location.trim()) {
      toast.error('Please provide your current location');
      return;
    }
    if (experienceLevel === 'Experienced' && currentlyWorking && !currentCompany.trim()) {
      toast.error('Please specify your current company');
      return;
    }
    if (!useProfileResume && !resumeFile && !user?.resume) {
      toast.error('Please upload your resume file to submit the application');
      return;
    }
    if (!confirmedAccuracy) {
      toast.error('Please confirm the accuracy of your details');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('jobId', id);
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('location', location);
      formData.append('experienceLevel', experienceLevel);
      formData.append('yearsOfExperience', experienceLevel === 'Experienced' ? yearsOfExperience : '0');
      formData.append('currentlyWorking', experienceLevel === 'Experienced' ? currentlyWorking : false);
      formData.append('currentCompany', experienceLevel === 'Experienced' && currentlyWorking ? currentCompany : '');
      formData.append('currentRole', experienceLevel === 'Experienced' && currentlyWorking ? currentRole : '');
      formData.append('noticePeriod', noticePeriod);
      formData.append('expectedSalary', expectedSalary);
      formData.append('highestEducation', highestEducation);
      formData.append('college', college);
      formData.append('graduationYear', graduationYear);
      formData.append('skills', JSON.stringify(skills));
      formData.append('linkedinUrl', linkedinUrl);
      formData.append('portfolioUrl', portfolioUrl);
      formData.append('coverLetter', coverLetter);

      if (resumeFile) {
        formData.append('resume', resumeFile);
      } else if (useProfileResume && user?.resume) {
        formData.append('resume', user.resume);
      }

      const res = await API.post('/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        toast.success('Application submitted successfully!');
        setSubmittedApp(res.data.data);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit application. Please try again.';
      toast.error(msg);
      if (msg.toLowerCase().includes('already applied')) {
        setAlreadyApplied(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        <p className="text-xs font-semibold text-slate-500">Loading application details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-xl mx-auto my-16 text-center p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Job Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">The vacancy you are applying for is no longer active.</p>
        <Link to="/jobs" className="px-5 py-2.5 btn-primary-gradient text-white rounded-xl text-xs font-bold shadow">
          Browse Active Jobs
        </Link>
      </div>
    );
  }

  // Already Applied Notice State
  if (alreadyApplied && !submittedApp) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 sm:p-10 bg-white dark:bg-slate-900 rounded-3xl border border-indigo-100 dark:border-slate-800 shadow-xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center mx-auto mb-4 text-indigo-600">
          <FileCheck className="h-9 w-9" />
        </div>
        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 rounded-full text-[11px] font-extrabold uppercase tracking-wide">
          Application Already Submitted
        </span>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-3">
          You Have Already Applied for This Position
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
          Your profile and credentials have been submitted for <strong>{job.title}</strong> at {job.company?.name}. You can track your real-time recruitment pipeline stage anytime.
        </p>
        <div className="flex flex-wrap gap-3 justify-center mt-8">
          <Link
            to="/seeker/applications"
            className="px-6 py-3 btn-primary-gradient text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2"
          >
            <Briefcase className="h-4 w-4" /> View My Applications
          </Link>
          <Link
            to={`/jobs/${id}`}
            className="px-5 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            Back to Job Details
          </Link>
        </div>
      </div>
    );
  }

  // Submission Success View
  if (submittedApp) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 sm:p-12 bg-white dark:bg-slate-900 rounded-3xl border border-emerald-100 dark:border-emerald-900/40 shadow-2xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600"></div>
        <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center mx-auto mb-5 text-emerald-600 dark:text-emerald-400 shadow-inner">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <span className="px-3.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-extrabold tracking-wide uppercase">
          Application Successfully Sent
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-3">
          Congratulations, {fullName || 'Candidate'}!
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto mt-2 leading-relaxed">
          Your job application for <strong className="text-indigo-600 dark:text-indigo-400">{job.title}</strong> at{' '}
          <strong>{job.company?.name}</strong> has been transmitted directly to the recruiter's ATS dashboard.
        </p>

        {/* Application Summary Card */}
        <div className="mt-8 p-5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl text-left text-xs space-y-2.5 max-w-md mx-auto">
          <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700">
            <span className="text-slate-500">Applicant</span>
            <span className="font-bold text-slate-900 dark:text-white">{fullName}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700">
            <span className="text-slate-500">Experience Profile</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {experienceLevel} {experienceLevel === 'Experienced' ? `(${yearsOfExperience} yrs)` : ''}
            </span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700">
            <span className="text-slate-500">Resume Status</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <Check className="h-3.5 w-3.5" /> Attached to Application
            </span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-500">Current Status</span>
            <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 rounded font-bold">
              Applied (Under Review)
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mt-8">
          <Link
            to="/seeker/applications"
            className="px-6 py-3 btn-primary-gradient text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-2"
          >
            <Briefcase className="h-4 w-4" /> Go to My Applications
          </Link>
          <Link
            to="/jobs"
            className="px-5 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            Explore More Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Breadcrumb & Return Link */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-6">
        <Link to="/jobs" className="hover:text-indigo-600 transition flex items-center gap-1">
          <Briefcase className="h-3.5 w-3.5" /> Jobs
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={`/jobs/${id}`} className="hover:text-indigo-600 transition truncate max-w-[200px]">
          {job.title}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-indigo-600 dark:text-indigo-400 font-bold">Apply</span>
      </div>

      {/* Target Job Header Card */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 mb-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center text-indigo-600 font-black text-xl shrink-0">
              {job.company?.name ? job.company.name.charAt(0) : 'C'}
            </div>
            <div>
              <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 rounded-md text-[10px] font-bold uppercase tracking-wider">
                {job.jobType || 'Full-Time'}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-indigo-500" /> {job.company?.name}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" /> {job.location}
                </span>
                {job.salary && (
                  <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                    <DollarSign className="h-3.5 w-3.5" /> {job.salary}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* AI Match Badge */}
          {matchPercentage > 0 && (
            <div className="sm:text-right shrink-0 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 p-3.5 rounded-2xl flex sm:flex-col items-center sm:items-end justify-between">
              <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                <Sparkles className="h-4 w-4" /> AI Skill Match
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                {matchPercentage}%
              </div>
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                {matchedSkillsCount} of {jobSkills.length} job skills
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Application Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: Personal & Contact Information */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 rounded-xl">
              <UserIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">1. Candidate Information</h2>
              <p className="text-xs text-slate-500">Recruiters will use these details to contact you</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Turner"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 pl-10 pr-4 py-3 text-xs font-medium focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 pl-10 pr-4 py-3 text-xs font-medium focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210 / +1 (555) 000-0000"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 pl-10 pr-4 py-3 text-xs font-medium focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Current Location (City, Country) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Hyderabad, India or San Francisco, CA"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 pl-10 pr-4 py-3 text-xs font-medium focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                LinkedIn Profile URL (Optional)
              </label>
              <div className="relative">
                <Link2 className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 pl-10 pr-4 py-3 text-xs font-medium focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Portfolio / GitHub URL (Optional)
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://github.com/username or yoursite.dev"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 pl-10 pr-4 py-3 text-xs font-medium focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Experience & Current Employment Status */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 rounded-xl">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">2. Experience & Work Status</h2>
              <p className="text-xs text-slate-500">Specify whether you are applying as a Fresher or Experienced professional</p>
            </div>
          </div>

          {/* Fresher vs Experienced Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
              Experience Level <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setExperienceLevel('Fresher');
                  setCurrentlyWorking(false);
                  setCurrentCompany('');
                  setCurrentRole('');
                  setYearsOfExperience('0');
                }}
                className={`p-4 rounded-2xl border text-left transition flex items-start gap-3.5 cursor-pointer ${
                  experienceLevel === 'Fresher'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    experienceLevel === 'Fresher'
                      ? 'bg-indigo-600 text-white'
                      : 'border-2 border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {experienceLevel === 'Fresher' && <Check className="h-3.5 w-3.5" />}
                </div>
                <div>
                  <span className="font-bold text-sm block">🎓 Fresher / Graduate</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Recent graduate, student, or starting my career with no prior full-time corporate experience.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setExperienceLevel('Experienced');
                  if (yearsOfExperience === '0') setYearsOfExperience('1');
                }}
                className={`p-4 rounded-2xl border text-left transition flex items-start gap-3.5 cursor-pointer ${
                  experienceLevel === 'Experienced'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    experienceLevel === 'Experienced'
                      ? 'bg-indigo-600 text-white'
                      : 'border-2 border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {experienceLevel === 'Experienced' && <Check className="h-3.5 w-3.5" />}
                </div>
                <div>
                  <span className="font-bold text-sm block">💼 Experienced Professional</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    I have relevant industry / professional working experience.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Conditional fields for Experienced */}
          {experienceLevel === 'Experienced' && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-5 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Total Years of Experience <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 px-4 py-3 text-xs font-medium focus:outline-none focus:border-indigo-600"
                  >
                    <option value="1">1 Year</option>
                    <option value="2">2 Years</option>
                    <option value="3">3 Years</option>
                    <option value="4">4 Years</option>
                    <option value="5">5 Years</option>
                    <option value="6-8">6 to 8 Years</option>
                    <option value="8+">8+ Years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Notice Period <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={noticePeriod}
                    onChange={(e) => setNoticePeriod(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 px-4 py-3 text-xs font-medium focus:outline-none focus:border-indigo-600"
                  >
                    <option value="Immediate">Immediate Joiner (0 days)</option>
                    <option value="15 Days">15 Days</option>
                    <option value="30 Days">30 Days (1 Month)</option>
                    <option value="60 Days">60 Days (2 Months)</option>
                    <option value="90 Days">90 Days (3 Months)</option>
                    <option value="Serving Notice">Currently Serving Notice</option>
                  </select>
                </div>
              </div>

              {/* Are you currently working? */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Are you currently employed / working?
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Toggle if you have an active employer
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentlyWorking}
                      onChange={(e) => setCurrentlyWorking(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {currentlyWorking && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-700 animate-in fade-in duration-200">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Current Company Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required={currentlyWorking}
                        value={currentCompany}
                        onChange={(e) => setCurrentCompany(e.target.value)}
                        placeholder="e.g. Infosys, TCS, Stripe"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Current Job Title / Designation
                      </label>
                      <input
                        type="text"
                        value={currentRole}
                        onChange={(e) => setCurrentRole(e.target.value)}
                        placeholder="e.g. Software Engineer, Frontend Dev"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Compensation Expectation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Expected CTC / Salary (Optional)
                  </label>
                  <input
                    type="text"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
                    placeholder="e.g. ₹8,00,000 / $75,000"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 px-4 py-3 text-xs font-medium focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: Education & Academic Records */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 rounded-xl">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">3. Education & Qualification</h2>
              <p className="text-xs text-slate-500">Highest completed or pursuing degree</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Highest Degree / Qualification
              </label>
              <select
                value={highestEducation}
                onChange={(e) => setHighestEducation(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 px-4 py-3 text-xs font-medium focus:outline-none focus:border-indigo-600"
              >
                <option value="B.Tech / B.E.">B.Tech / B.E.</option>
                <option value="M.Tech / M.E.">M.Tech / M.E.</option>
                <option value="BCA">BCA</option>
                <option value="MCA">MCA</option>
                <option value="B.Sc / M.Sc">B.Sc / M.Sc</option>
                <option value="MBA">MBA</option>
                <option value="Diploma">Diploma</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                College / University Name
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. JNTU Hyderabad / UC Berkeley"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 px-4 py-3 text-xs font-medium focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Passing / Graduation Year
              </label>
              <select
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 px-4 py-3 text-xs font-medium focus:outline-none focus:border-indigo-600"
              >
                {[2027, 2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 4: Relevant Skills & Matching Analysis */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 rounded-xl">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">4. Relevant Skills & Match Analysis</h2>
              <p className="text-xs text-slate-500">Highlight your skills that match this role's requirements</p>
            </div>
          </div>

          {/* Job Requirements vs Candidate Skills */}
          {jobSkills.length > 0 && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Job Required Skills (Click any skill to add to your application):
              </span>
              <div className="flex flex-wrap gap-2">
                {jobSkills.map((reqSkill, idx) => {
                  const hasSkill = skills.some(
                    (s) => s.toLowerCase().trim() === reqSkill.toLowerCase().trim()
                  );
                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => !hasSkill && handleAddJobSkill(reqSkill)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                        hasSkill
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-dashed border-indigo-300 hover:border-indigo-600 hover:text-indigo-600'
                      }`}
                    >
                      {hasSkill ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Plus className="h-3.5 w-3.5 text-indigo-500" />}
                      <span>{reqSkill}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Attached Application Skills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Your Application Skills ({skills.length})
            </label>
            <div className="flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl min-h-[50px] items-center mb-3">
              {skills.length > 0 ? (
                skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-bold shadow-xs"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-rose-500 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No skills added yet. Add your key skills below.</span>
              )}
            </div>

            {/* Add Custom Skill Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Type skill (e.g. React, Node.js, Docker, Python) and press Enter"
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-600"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" /> Add Skill
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 5: Resume Attachment */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 rounded-xl">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">5. Resume Upload</h2>
              <p className="text-xs text-slate-500">Upload your resume directly right here for this vacancy</p>
            </div>
          </div>

          {/* Option: Profile Resume Available */}
          {user?.resume && (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 dark:bg-emerald-950/30 dark:border-emerald-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <FileCheck className="h-6 w-6 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 text-xs">
                    Existing Resume Available on Profile
                  </span>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                    You can use your saved profile resume or upload a customized one below.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => {
                    setUseProfileResume(true);
                    setResumeFile(null);
                    setResumeFileName('');
                    toast.success('Using your saved profile resume!');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    useProfileResume && !resumeFile
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'border border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  {useProfileResume && !resumeFile ? '✓ Selected' : 'Use Profile Resume'}
                </button>
              </div>
            </div>
          )}

          {/* Direct File Upload Area */}
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl p-6 sm:p-8 text-center transition bg-slate-50/50 dark:bg-slate-950/50 relative">
            <input
              type="file"
              id="resume-upload"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            {resumeFileName ? (
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 rounded-2xl">
                  <FileText className="h-8 w-8" />
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {resumeFileName}
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Ready for submission
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setResumeFile(null);
                    setResumeFileName('');
                  }}
                  className="mt-2 text-xs font-bold text-rose-500 hover:underline z-10"
                >
                  Remove & Choose Another File
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded-2xl">
                  <UploadCloud className="h-8 w-8" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Click or drag and drop your resume here
                </h3>
                <p className="text-[11px] text-slate-500">
                  Accepted formats: PDF, DOC, DOCX (Max size: 5MB)
                </p>
                <div className="mt-2 inline-block px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-xs">
                  Browse Files
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 6: Statement / Cover Letter */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">6. Cover Letter / Statement (Optional)</h2>
              <p className="text-xs text-slate-500">Introduce yourself and summarize why you are an ideal match</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => applyCoverLetterTemplate('fresher')}
                className="px-2.5 py-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
              >
                + Fresher Note
              </button>
              <button
                type="button"
                onClick={() => applyCoverLetterTemplate('experienced')}
                className="px-2.5 py-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
              >
                + Specialist Note
              </button>
            </div>
          </div>

          <textarea
            rows={5}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Introduce yourself, explain your relevant projects, and tell the hiring team why you are enthusiastic about this position..."
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 p-4 text-xs font-medium focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/10 leading-relaxed"
          />
        </div>

        {/* SECTION 7: Review & Submission Actions */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-5">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={confirmedAccuracy}
              onChange={(e) => setConfirmedAccuracy(e.target.checked)}
              className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              I certify that all the experience, educational credentials, and details supplied in this application are authentic and accurate.
            </span>
          </label>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <Link
              to={`/jobs/${id}`}
              className="w-full sm:w-auto px-5 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-center transition"
            >
              Cancel & Return to Job
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3.5 btn-primary-gradient text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition disabled:opacity-60 cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                  Submitting Application...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> Submit Application
                </>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default ApplyJob;
