import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { MapPin, Briefcase, DollarSign, Calendar, Sparkles, Check, CheckCircle2, ChevronRight, FileText, Send, AlertTriangle, Bookmark, BookmarkCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [appliedStatus, setAppliedStatus] = useState(null); // 'Applied', 'Selected' etc or null if not applied
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
        // Check application status
        const appRes = await API.get('/applications/my');
        if (appRes.data.success) {
          const applied = appRes.data.data.find(app => app.job?._id === id);
          if (applied) {
            setAppliedStatus(applied.status);
          }
        }

        // Check bookmark status
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
      toast.error('Only job seekers can save job listings');
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
        toast.success('Job reported successfully. Admins will review it.');
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
      setSubmitMsg({ type: 'error', text: 'You do not have a resume uploaded. Please close this modal and update your profile first.' });
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
        setSubmitMsg({ type: 'success', text: 'Your application has been submitted successfully!' });
        setAppliedStatus('Applied');
        toast.success('Application submitted successfully!');
        setTimeout(() => {
          setIsModalOpen(false);
          setCoverLetter('');
          setSubmitMsg({ type: '', text: '' });
        }, 2000);
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
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800">{error || 'Job details unavailable.'}</h2>
        <Link to="/jobs" className="mt-4 inline-block px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow">
          Back to Listings
        </Link>
      </div>
    );
  }

  // Calculate matching details from backend populated recommendation if available
  const matchDetails = job.matchDetails || null;
  const matchScore = job.matchScore || 0;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back button */}
      <div className="mb-6 flex justify-between items-center">
        <Link to="/jobs" className="text-sm font-semibold text-gray-500 hover:text-indigo-600 flex items-center gap-1">
          &larr; Back to Listings
        </Link>

        {user && (
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1 border border-red-200 px-3 py-1.5 rounded-xl hover:bg-red-50 transition"
          >
            <AlertTriangle className="h-3.5 w-3.5" /> Report Job
          </button>
        )}
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Job Information Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header Card */}
          <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-8 rounded-3xl shadow-sm space-y-4">
            <div className="flex justify-between items-start gap-4">
              <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-300 rounded-md text-xs font-bold text-indigo-700">
                {job.jobType}
              </span>
              {user && user.role === 'seeker' && (
                <button
                  onClick={handleToggleSave}
                  className={`p-2 rounded-xl border transition ${
                    isSaved 
                      ? 'border-indigo-200 text-indigo-650 bg-indigo-50/50' 
                      : 'border-gray-200 text-gray-400 hover:bg-gray-50'
                  }`}
                  title={isSaved ? 'Remove Bookmark' : 'Bookmark Job'}
                >
                  {isSaved ? <BookmarkCheck className="h-5 w-5 fill-indigo-600 text-indigo-650" /> : <Bookmark className="h-5 w-5" />}
                </button>
              )}
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
              {job.title}
            </h1>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              {job.company?.name || 'Company Registered'} &bull; {job.location}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-gray-55 pt-6 text-sm">
              <div className="flex items-center gap-2 text-gray-550 dark:text-gray-400">
                <MapPin className="h-4.5 w-4.5 text-gray-400" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400">Location</div>
                  <div className="font-semibold text-gray-700 dark:text-gray-300">{job.location}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-550 dark:text-gray-400">
                <DollarSign className="h-4.5 w-4.5 text-gray-400" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400">Offered Salary</div>
                  <div className="font-semibold text-gray-700 dark:text-gray-300">${job.salary.toLocaleString()}/yr</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-550 dark:text-gray-400 col-span-2 md:col-span-1">
                <Briefcase className="h-4.5 w-4.5 text-gray-400" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400">Experience</div>
                  <div className="font-semibold text-gray-700 dark:text-gray-300">{job.experience}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Description Card */}
          <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-8 rounded-3xl shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">Job Description</h2>
              <p className="text-sm text-gray-650 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </div>

            {job.responsibilities && job.responsibilities.length > 0 && (
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">Key Responsibilities</h2>
                <ul className="space-y-2 text-sm text-gray-650 dark:text-gray-400">
                  {job.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.qualifications && job.qualifications.length > 0 && (
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">Qualifications & Requirements</h2>
                <ul className="space-y-2 text-sm text-gray-650 dark:text-gray-400">
                  {job.qualifications.map((qual, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <span>{qual}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.benefits && job.benefits.length > 0 && (
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">Benefits & Perks</h2>
                <div className="flex flex-wrap gap-2">
                  {job.benefits.map((benefit, idx) => (
                    <span key={idx} className="px-3 py-1 bg-indigo-50/50 border border-indigo-100 text-indigo-750 text-xs font-semibold rounded-lg">
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: AI Recommendations & Apply Actions */}
        <div className="space-y-6">
          
          {/* AI Score Box (Weighted Match breakdown) */}
          {user && user.role === 'seeker' && matchScore > 0 && (
            <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-6 rounded-3xl shadow-sm space-y-6">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="h-5 w-5 text-indigo-650" /> AI Compatibility Match
              </h2>

              <div className="text-center space-y-2">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="h-28 w-28 transform -rotate-90">
                    <circle cx="56" cy="56" r="46" stroke="#f3f4f6" strokeWidth="8" fill="transparent" />
                    <circle 
                      cx="56" 
                      cy="56" 
                      r="46" 
                      stroke="#4f46e5" 
                      strokeWidth="8" 
                      fill="transparent" 
                      strokeDasharray="289" 
                      strokeDashoffset={289 - (289 * matchScore) / 100} 
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <span className="absolute text-xl font-extrabold text-indigo-750 dark:text-indigo-400">{matchScore}%</span>
                </div>
                <div className="text-xs font-bold text-gray-400">Total Compatibility Score</div>
              </div>

              {/* Match Factors breakdowns */}
              {matchDetails && (
                <div className="space-y-3 pt-3 border-t border-gray-50 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-semibold">Skills Match (60% weight)</span>
                    <span className="font-bold text-gray-900 dark:text-white">{matchDetails.skillMatch}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-semibold">Experience (20% weight)</span>
                    <span className="font-bold text-gray-900 dark:text-white">{matchDetails.experienceMatch}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-semibold">Location (10% weight)</span>
                    <span className="font-bold text-gray-900 dark:text-white">{matchDetails.locationMatch}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-semibold">Job Preference (10% weight)</span>
                    <span className="font-bold text-gray-900 dark:text-white">{matchDetails.preferenceMatch}%</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Box (Apply button etc) */}
          <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-6 rounded-3xl shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Application</h2>
            
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>Apply before: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'No explicit deadline'}</span>
            </div>

            {user ? (
              user.role === 'seeker' ? (
                appliedStatus ? (
                  <div className="w-full bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 p-4 rounded-xl text-center">
                    <div className="text-xs font-bold text-gray-500 uppercase">Application Status</div>
                    <span className="inline-block mt-2 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-150 text-xs font-bold rounded-lg">
                      {appliedStatus}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-2">You have already submitted an application to this job.</p>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-1.5 shadow shadow-indigo-100 dark:shadow-none"
                  >
                    Apply For Job
                  </button>
                )
              ) : (
                <div className="p-3 bg-gray-50 text-gray-500 border border-gray-200 rounded-xl text-xs text-center font-medium dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
                  You are logged in as a {user.role}. Applications are restricted to Job Seekers.
                </div>
              )
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="w-full text-center block py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition"
                >
                  Sign In to Apply
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Apply Form Modal overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative border border-gray-150 dark:border-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Submit Application</h2>
            <p className="text-xs text-gray-400 mb-6">Apply to "{job.title}" at {job.company?.name}</p>

            {/* Resume verification */}
            {user?.resume ? (
              <div className="mb-6 p-4 bg-green-50/50 dark:bg-green-950/10 border border-green-100 dark:border-green-900/30 rounded-xl text-green-700 dark:text-green-300 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <div>
                    <span className="font-bold">Resume Selected</span>
                    <p className="text-[10px] text-green-500 mt-0.5">Your profile resume will be attached to this application</p>
                  </div>
                </div>
                <a 
                  href={`http://localhost:5000${user.resume}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[10px] text-indigo-600 underline font-semibold hover:text-indigo-700"
                >
                  Download File
                </a>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-red-50 text-red-750 border border-red-100 rounded-xl text-xs flex items-start gap-2.5">
                <AlertTriangle className="h-5 w-5 text-red-650 flex-shrink-0" />
                <div>
                  <span className="font-bold">No Resume Found!</span>
                  <p className="text-[10px] text-red-650 mt-1">
                    You cannot apply without a resume. Please close this modal, visit your Profile, upload your resume, and return.
                  </p>
                </div>
              </div>
            )}

            {submitMsg.text && (
              <div className={`mb-6 p-3 rounded-lg text-xs font-semibold border ${
                submitMsg.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-750'
              }`}>
                {submitMsg.text}
              </div>
            )}

            <form onSubmit={handleApplySubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 dark:text-gray-300">Cover Letter (Optional)</label>
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-4 py-3 text-sm focus:outline-none focus:border-indigo-600 placeholder-gray-450"
                  placeholder="Introduce yourself to the recruiter. Explain briefly why you fit the role."
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSubmitMsg({ type: '', text: '' });
                  }}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 rounded-xl text-xs font-bold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading || !user?.resume}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow flex items-center gap-1.5 transition"
                >
                  {submitLoading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Job Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-md w-full shadow-2xl relative border border-gray-150 dark:border-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-1 text-red-650">
              <AlertTriangle className="h-5 w-5" /> Report Job Listing
            </h2>
            <p className="text-xs text-gray-400 mb-6">Explain why this job listing is inappropriate or incorrect.</p>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Reason for Report</label>
                <textarea
                  rows={4}
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-4 py-3 text-sm focus:outline-none focus:border-red-600 placeholder-gray-450"
                  placeholder="e.g. Inappropriate language, scam offer, incorrect stack required details..."
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
                  className="px-4 py-2 border border-gray-200 dark:border-700 dark:hover:bg-gray-850 rounded-xl text-xs font-bold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reportLoading}
                  className="px-5 py-2 bg-red-650 hover:bg-red-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition"
                >
                  {reportLoading ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default JobDetails;
