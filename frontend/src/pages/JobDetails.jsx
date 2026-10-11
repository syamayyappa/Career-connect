import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  ChevronRight, 
  FileText, 
  Send, 
  AlertTriangle, 
  Bookmark, 
  BookmarkCheck,
  ArrowLeft,
  Building2,
  Share2
} from 'lucide-react';
import toast from 'react-hot-toast';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [appliedStatus, setAppliedStatus] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  // Application Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitMsg, setSubmitMsg] = useState({ type: '', text: '' });

  // Report Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportLoading, setReportLoading] = useState(false);

  // Fetch job details and check application + saved status
  const loadJobData = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await API.get(`/jobs/${id}`);
      if (data.success) {
        setJob(data.data);
      }

      if (user && user.role === 'seeker') {
        const appRes = await API.get('/applications/my');
        if (appRes.data.success) {
          const applied = appRes.data.data.find(app => app.job?._id === id);
          if (applied) {
            setAppliedStatus(applied.status);
          }
        }

        const savedRes = await API.get('/saved-jobs');
        if (savedRes.data.success) {
          const bookmarked = savedRes.data.data.some(item => item.job?._id === id);
          setIsSaved(bookmarked);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Job not found or failed to load. Please return to jobs feed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobData();
  }, [id, user]);

  const handleToggleSave = async () => {
    if (!user) {
      toast.error('Please login as a seeker to bookmark this job');
      return;
    }
    if (user.role !== 'seeker') {
      toast.error('Only job seekers can bookmark job listings');
      return;
    }

    try {
      const { data } = await API.post('/saved-jobs', { jobId: id });
      if (data.success) {
        setIsSaved(data.saved);
        toast.success(data.message);
      }
    } catch (err) {
      toast.error('Failed to update bookmark');
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportReason.trim()) {
      toast.error('Please enter a reason for reporting');
      return;
    }

    setReportLoading(true);
    try {
      const { data } = await API.post('/admin/reports', {
        targetType: 'Job',
        targetId: id,
        reason: reportReason
      });
      if (data.success) {
        toast.success('Report submitted for administrative review.');
        setIsReportModalOpen(false);
        setReportReason('');
      }
    } catch (err) {
      toast.error('Failed to submit report');
    } finally {
      setReportLoading(false);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!user?.resume) {
      setSubmitMsg({ type: 'error', text: 'You do not have a resume uploaded. Please update your profile first.' });
      return;
    }

    setSubmitLoading(true);
    setSubmitMsg({ type: '', text: '' });

    try {
      const { data } = await API.post('/applications', {
        jobId: job._id,
        coverLetter
      });

      if (data.success) {
        setSubmitMsg({ type: 'success', text: 'Application submitted successfully!' });
        setAppliedStatus('Applied');
        toast.success('Application submitted successfully!');
        setTimeout(() => {
          setIsModalOpen(false);
          setCoverLetter('');
          setSubmitMsg({ type: '', text: '' });
        }, 1800);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit application. Try again.';
      setSubmitMsg({ type: 'error', text: msg });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80svh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <AlertTriangle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">{error || 'Job details unavailable.'}</h2>
        <Link to="/jobs" className="mt-5 inline-block px-6 py-2.5 btn-primary-gradient text-white rounded-xl text-xs font-bold shadow-md">
          Back to Openings
        </Link>
      </div>
    );
  }

  const matchDetails = job.matchDetails || null;
  const matchScore = job.matchScore || 0;

  return (
    <div className="bg-slate-50/50 dark:bg-slate-950 min-h-screen py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Navigation Row */}
        <div className="mb-6 flex justify-between items-center">
          <Link 
            to="/jobs" 
            className="text-xs sm:text-sm font-bold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300 flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Listings
          </Link>

          {user && (
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="text-xs font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-1 border border-rose-200/80 px-3 py-1.5 rounded-xl hover:bg-rose-50 transition cursor-pointer"
            >
              <AlertTriangle className="h-3.5 w-3.5" /> Report Posting
            </button>
          )}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Overview, Description, Requirements */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header Card */}
            <div className="glass-panel p-8 rounded-3xl shadow-sm space-y-5">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-black text-lg shadow-sm shadow-indigo-500/25">
                    {job.company?.name ? job.company.name[0] : 'C'}
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-300 rounded-lg text-xs font-extrabold text-indigo-700 border border-indigo-200/80">
                      {job.jobType}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1.5">
                      {job.title}
                    </h1>
                  </div>
                </div>

                {user && user.role === 'seeker' && (
                  <button
                    onClick={handleToggleSave}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                      isSaved 
                        ? 'border-indigo-300 text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 shadow-xs' 
                        : 'border-slate-200 text-slate-400 hover:text-indigo-600 hover:bg-slate-50'
                    }`}
                    title={isSaved ? 'Remove Bookmark' : 'Bookmark Job'}
                  >
                    {isSaved ? <BookmarkCheck className="h-5 w-5 fill-indigo-600 text-indigo-600" /> : <Bookmark className="h-5 w-5" />}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                <Building2 className="h-4 w-4 text-indigo-600" />
                <span>{job.company?.name || 'Company Registered'}</span>
                <span className="text-slate-400">&bull;</span>
                <span className="text-slate-500 font-normal">{job.location}</span>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800 pt-5 text-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Location</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">{job.location}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Compensation</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">${job.salary.toLocaleString()}/yr</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
                  <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-300">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Seniority</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">{job.experience}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Responsibilities */}
            <div className="glass-panel p-8 rounded-3xl shadow-sm space-y-6">
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white mb-3">Position Overview</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-normal">
                  {job.description}
                </p>
              </div>

              {job.skills && job.skills.length > 0 && (
                <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
                  <h2 className="text-sm font-black text-slate-900 dark:text-white mb-3">Required Technical Stack</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1 bg-indigo-50/70 border border-indigo-200/60 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 rounded-lg text-xs font-bold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {job.responsibilities && job.responsibilities.length > 0 && (
                <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
                  <h2 className="text-base font-black text-slate-900 dark:text-white mb-3">Core Responsibilities</h2>
                  <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                    {job.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <ChevronRight className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" />
                        <span className="leading-normal">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.qualifications && job.qualifications.length > 0 && (
                <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
                  <h2 className="text-base font-black text-slate-900 dark:text-white mb-3">Qualifications & Experience</h2>
                  <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                    {job.qualifications.map((qual, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <ChevronRight className="h-4 w-4 text-violet-600 mt-0.5 shrink-0" />
                        <span className="leading-normal">{qual}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.benefits && job.benefits.length > 0 && (
                <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
                  <h2 className="text-base font-black text-slate-900 dark:text-white mb-3">Total Rewards & Benefits</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.benefits.map((benefit, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1 bg-emerald-50/70 border border-emerald-200/60 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-semibold rounded-lg"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: AI Match & Application Action */}
          <div className="space-y-6">
            
            {/* AI Score Widget */}
            {user && user.role === 'seeker' && matchScore > 0 && (
              <div className="glass-panel p-6 rounded-3xl shadow-sm space-y-5">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="h-5 w-5" />
                  <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    AI Match Analysis
                  </h2>
                </div>

                <div className="text-center py-2">
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="h-28 w-28 transform -rotate-90">
                      <circle cx="56" cy="56" r="46" stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
                      <circle 
                        cx="56" 
                        cy="56" 
                        r="46" 
                        stroke="#4f46e5" 
                        strokeWidth="8" 
                        fill="transparent" 
                        strokeDasharray="289" 
                        strokeDashoffset={289 - (289 * matchScore) / 100} 
                        className="transition-all duration-1000 ease-out stroke-indigo-600"
                      />
                    </svg>
                    <span className="absolute text-2xl font-black text-slate-900 dark:text-white">{matchScore}%</span>
                  </div>
                  <div className="text-xs font-bold text-slate-400 mt-1">Skill Intersection Match</div>
                </div>

                {matchDetails && (
                  <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Core Skills (60%)</span>
                      <span className="font-bold text-slate-900 dark:text-white">{matchDetails.skillMatch}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Experience Level (20%)</span>
                      <span className="font-bold text-slate-900 dark:text-white">{matchDetails.experienceMatch}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Location Fit (10%)</span>
                      <span className="font-bold text-slate-900 dark:text-white">{matchDetails.locationMatch}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Job Preference (10%)</span>
                      <span className="font-bold text-slate-900 dark:text-white">{matchDetails.preferenceMatch}%</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Application Action Card */}
            <div className="glass-panel p-6 rounded-3xl shadow-sm space-y-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Application Status</h2>
              
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Calendar className="h-4 w-4 text-indigo-600" />
                <span>Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Continuous review'}</span>
              </div>

              {user ? (
                user.role === 'seeker' ? (
                  appliedStatus ? (
                    <div className="w-full bg-indigo-50/70 border border-indigo-200/80 dark:bg-indigo-950/50 dark:border-indigo-800 p-4 rounded-2xl text-center">
                      <div className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide">Current Pipeline Stage</div>
                      <span className="inline-block mt-2 px-3.5 py-1 bg-white text-indigo-700 shadow-xs text-xs font-extrabold rounded-lg">
                        {appliedStatus}
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
                        Your application is active and stored in the ATS ledger.
                      </p>
                    </div>
                  ) : (
                    <Link
                      to={`/jobs/${job._id || id}/apply`}
                      className="w-full py-3.5 btn-primary-gradient text-white font-bold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 cursor-pointer text-center"
                    >
                      <Send className="h-4 w-4" /> Apply for Vacancy
                    </Link>
                  )
                ) : (
                  <div className="p-3.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl text-xs text-center font-medium dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800">
                    Logged in as <strong>{user.role}</strong>. Applications are reserved for Job Seekers.
                  </div>
                )
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    className="w-full text-center block py-3 btn-primary-gradient text-white font-bold rounded-xl text-xs shadow transition"
                  >
                    Sign In to Apply
                  </Link>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Apply Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">Submit Application</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Applying to <strong className="text-indigo-600">{job.title}</strong> at {job.company?.name}
              </p>

              {user?.resume ? (
                <div className="mb-6 p-4 bg-emerald-50/70 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-5 w-5 text-emerald-600" />
                    <div>
                      <span className="font-bold">Resume Attached</span>
                      <p className="text-[10px] text-emerald-600 mt-0.5">Profile resume will be sent to recruiter ATS</p>
                    </div>
                  </div>
                  <a 
                    href={`http://localhost:5000${user.resume}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[11px] text-indigo-600 underline font-bold hover:text-indigo-700"
                  >
                    View File
                  </a>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-indigo-50/70 border border-indigo-200/80 dark:bg-indigo-950/40 dark:border-indigo-800 rounded-2xl text-xs flex items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">Complete Application Page</span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Provide experience, current work status, skills, and upload your resume directly.
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/jobs/${job._id || id}/apply`}
                    className="shrink-0 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-xs"
                  >
                    Open Form
                  </Link>
                </div>
              )}

              {submitMsg.text && (
                <div className={`mb-6 p-3 rounded-xl text-xs font-semibold border ${
                  submitMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'
                }`}>
                  {submitMsg.text}
                </div>
              )}

              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Cover Letter / Statement (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 px-4 py-3 text-xs focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/10 font-medium"
                    placeholder="Briefly explain your relevant experience and enthusiasm for this role."
                  />
                </div>

                <div className="flex gap-2 justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setSubmitMsg({ type: '', text: '' });
                    }}
                    className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Link
                    to={`/jobs/${job._id || id}/apply`}
                    className="px-6 py-2.5 btn-primary-gradient text-white font-bold rounded-xl text-xs shadow flex items-center gap-1.5 transition cursor-pointer"
                  >
                    Continue to Application Page
                  </Link>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Report Modal */}
        {isReportModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2 text-rose-600">
                <AlertTriangle className="h-5 w-5" /> Report Job Posting
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Provide details on policy violation or inaccurate details.</p>

              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <textarea
                    rows={4}
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 px-4 py-3 text-xs focus:outline-none focus:border-rose-600 font-medium"
                    placeholder="Describe the issue (scam, expired, misleading stack requirements)..."
                    required
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsReportModalOpen(false);
                      setReportReason('');
                    }}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reportLoading}
                    className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    {reportLoading ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default JobDetails;
