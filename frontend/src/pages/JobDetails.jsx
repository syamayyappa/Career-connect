import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { MapPin, Briefcase, DollarSign, Calendar, Sparkles, Check, CheckCircle2, ChevronRight, FileText, Send, AlertTriangle } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [appliedStatus, setAppliedStatus] = useState(null); // 'Applied', 'Selected' etc or null if not applied

  // Application Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitMsg, setSubmitMsg] = useState({ type: '', text: '' });

  // Fetch job details and check if user has already applied
  const loadJobData = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await API.get(`/jobs/${id}`);
      if (data.success) {
        setJob(data.data);
      }

      // Check application status if user is a seeker
      if (user && user.role === 'seeker') {
        const appRes = await API.get('/applications/my');
        if (appRes.data.success) {
          const applied = appRes.data.data.find(app => app.job?._id === id);
          if (applied) {
            setAppliedStatus(applied.status);
          }
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

  // Skill match analysis
  const analyzeSkills = () => {
    if (!user || user.role !== 'seeker' || !user.skills || !job || !job.skills) {
      return { matches: [], missing: [], score: 0 };
    }

    const userSkillsSet = new Set(user.skills.map(s => s.toLowerCase().trim()));
    const jobSkillsList = job.skills.map(s => s.toLowerCase().trim());
    
    const matches = [];
    const missing = [];

    job.skills.forEach(skill => {
      if (userSkillsSet.has(skill.toLowerCase().trim())) {
        matches.push(skill);
      } else {
        missing.push(skill);
      }
    });

    const score = Math.round((matches.length / job.skills.length) * 100);
    return { matches, missing, score };
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

  const { matches, missing, score } = analyzeSkills();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back button */}
      <div className="mb-6">
        <Link to="/jobs" className="text-sm font-semibold text-gray-500 hover:text-indigo-600 flex items-center gap-1">
          &larr; Back to Listings
        </Link>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Job Information Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header Card */}
          <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-8 rounded-3xl shadow-sm space-y-4">
            <span className="inline-block px-3 py-1 bg-indigo-55 text-indigo-700 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-300 rounded-md text-xs font-bold">
              {job.jobType}
            </span>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
              {job.title}
            </h1>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              {job.company?.name || 'Company Registered'} &bull; {job.location}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-gray-50 dark:border-gray-800 pt-6 text-sm">
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
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
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
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {job.qualifications.map((qual, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <span>{qual}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: AI Recommendations & Apply Actions */}
        <div className="space-y-6">
          
          {/* AI Score Box */}
          {user && user.role === 'seeker' && (
            <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-6 rounded-3xl shadow-sm space-y-6">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="h-5 w-5 text-indigo-650" /> AI Skill-Matching
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
                      strokeDashoffset={289 - (289 * score) / 100} 
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <span className="absolute text-xl font-extrabold text-indigo-700 dark:text-indigo-400">{score}%</span>
                </div>
                <div className="text-xs font-semibold text-gray-500">Matching required skills</div>
              </div>

              {/* Skills Breakdown */}
              <div className="space-y-3.5 pt-2 text-xs">
                <div>
                  <div className="font-bold text-green-700 dark:text-green-450 mb-1.5 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-green-600" /> Matches ({matches.length})
                  </div>
                  {matches.length === 0 ? (
                    <span className="text-gray-400 italic">None of your listed profile skills overlap.</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {matches.map((sk, index) => (
                        <span key={index} className="px-2 py-0.5 bg-green-50 text-green-700 rounded-md font-semibold border border-green-100">
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="font-bold text-amber-700 mb-1.5 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4 text-amber-600" /> Missing Required ({missing.length})
                  </div>
                  {missing.length === 0 ? (
                    <span className="text-green-600 font-semibold italic">You match all requirements!</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {missing.map((sk, index) => (
                        <span key={index} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md font-semibold border border-amber-100">
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
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
                    onClick={() => setIsOpen(true)}
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
                  className="w-full text-center block py-3 bg-indigo-650 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition"
                >
                  Sign In to Apply
                </Link>
                <div className="text-[10px] text-center text-gray-400">Sign up or sign in as a job seeker to calculate matching scores.</div>
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
                <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <div>
                  <span className="font-bold">No Resume Found!</span>
                  <p className="text-[10px] text-red-650 mt-1">
                    You cannot apply without a resume. Please close this modal, visit your Profile, upload your resume, and return.
                  </p>
                </div>
              </div>
            )}

            {/* Submit message alerts */}
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
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-4 py-3 text-sm focus:outline-none focus:border-indigo-650 placeholder-gray-450"
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

    </div>
  );
};

export default JobDetails;
