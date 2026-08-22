import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../services/api';
import { Users, FileText, CheckCircle2, ChevronRight, Download, Mail, Phone, MapPin, Award, Trash2, ArrowLeft, Sparkles, Calendar, Video, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const JobApplicants = () => {
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Interview Schedule Modal State
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [targetApplicant, setTargetApplicant] = useState(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  
  // Schedule Form Fields
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewType, setInterviewType] = useState('Technical');
  const [meetingLink, setMeetingLink] = useState('');
  const [notes, setNotes] = useState('');

  const fetchApplicantsData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const jobRes = await API.get(`/jobs/${jobId}`);
      if (jobRes.data.success) {
        setJob(jobRes.data.data);
      }

      const appRes = await API.get(`/applications/job/${jobId}`);
      if (appRes.data.success) {
        setApplicants(appRes.data.data);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load applicant list. Please verify access rights.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicantsData();
  }, [jobId]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const { data } = await API.put(`/applications/${appId}/status`, { status: newStatus });
      if (data.success) {
        toast.success(`Application status updated to ${newStatus}`);
        setApplicants(apps => apps.map(app => app._id === appId ? { ...app, status: newStatus } : app));
      }
    } catch (err) {
      toast.error('Failed to update application status');
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!interviewDate || !interviewTime) {
      toast.error('Please enter interview date and time');
      return;
    }

    setScheduleLoading(true);
    try {
      const { data } = await API.post('/interviews', {
        candidateId: targetApplicant._id,
        jobId: job._id,
        date: interviewDate,
        time: interviewTime,
        type: interviewType,
        meetingLink,
        notes
      });
      if (data.success) {
        toast.success('Interview scheduled successfully! Notification sent.');
        setIsScheduleOpen(false);
        // Reset form
        setInterviewDate('');
        setInterviewTime('');
        setInterviewType('Technical');
        setMeetingLink('');
        setNotes('');
        setTargetApplicant(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule interview');
    } finally {
      setScheduleLoading(false);
    }
  };

  const calculateMatchScore = (applicantSkills) => {
    if (!job || !job.skills || job.skills.length === 0) return 0;
    if (!applicantSkills || applicantSkills.length === 0) return 0;

    const appSkillsList = applicantSkills.map(s => s.toLowerCase().trim());
    
    let matchesCount = 0;
    job.skills.forEach(skill => {
      if (appSkillsList.includes(skill.toLowerCase().trim())) {
        matchesCount++;
      }
    });

    return Math.round((matchesCount / job.skills.length) * 100);
  };

  const getScoreBadgeColor = (score) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-100';
    if (score >= 50) return 'text-indigo-750 bg-indigo-50 border-indigo-100';
    return 'text-amber-700 bg-amber-50 border-amber-100';
  };

  if (loading) {
    return (
      <div className="flex h-[80svh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (errorMsg || !job) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800">{errorMsg || 'Job data unavailable.'}</h2>
        <Link to="/recruiter/dashboard" className="mt-4 inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back link */}
      <div className="mb-6">
        <Link to="/recruiter/dashboard" className="text-sm font-semibold text-gray-500 hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Applicants for: "{job.title}"</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
          <Users className="h-4 w-4 text-indigo-600" /> Review candidate profiles and update hiring progress
        </p>
      </div>

      {applicants.length === 0 ? (
        <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl p-16 text-center shadow-sm">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No applicants yet</h3>
          <p className="text-sm text-gray-450 mt-1">Job applications will show up here as soon as seekers submit their profiles.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {applicants.map((app) => {
            const applicant = app.applicant;
            const score = calculateMatchScore(applicant?.skills);
            return (
              <div 
                key={app._id} 
                className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl p-6 shadow-sm space-y-6"
              >
                
                {/* Header Profile Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-50 dark:border-gray-800 pb-5 gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      {applicant?.name || 'Applicant Profile'}
                      <span className={`inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-lg border text-xs font-bold ${getScoreBadgeColor(score)}`}>
                        <Sparkles className="h-3.5 w-3.5" />
                        {score}% Skill Match
                      </span>
                    </h2>
                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-450 font-semibold">
                      <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {applicant?.email}</span>
                      {applicant?.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {applicant.phone}</span>}
                      {applicant?.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {applicant.location}</span>}
                    </div>
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-xs">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Screening status</label>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className="rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-3 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 focus:outline-none focus:border-indigo-600"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Selected">Selected</option>
                      </select>
                    </div>

                    {app.status === 'Shortlisted' && (
                      <div className="pt-4">
                        <button
                          onClick={() => {
                            setTargetApplicant(applicant);
                            setIsScheduleOpen(true);
                          }}
                          className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition flex items-center gap-1"
                        >
                          <Calendar className="h-3.5 w-3.5" /> Schedule Interview
                        </button>
                      </div>
                    )}

                    {app.resume && (
                      <div className="pt-4">
                        <a
                          href={`http://localhost:5000${app.resume}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                          title="View resume file"
                        >
                          <Download className="h-3.5 w-3.5" /> Resume
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Candidate details: Skills, Experience, Education */}
                <div className="space-y-4">
                  {/* Skills tags */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Candidate Skills</h3>
                    {applicant?.skills && applicant.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {applicant.skills.map((skill, idx) => (
                          <span 
                            key={idx} 
                            className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold border ${
                              job.skills.map(s => s.toLowerCase().trim()).includes(skill.toLowerCase().trim())
                                ? 'bg-green-50 text-green-700 border-green-150'
                                : 'bg-gray-50 text-gray-650 border-gray-150 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">No skills listed in profile</span>
                    )}
                  </div>

                  {/* Cover Letter if provided */}
                  {app.coverLetter && (
                    <div className="bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl text-xs">
                      <div className="font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1">
                        <FileText className="h-4 w-4 text-indigo-500" /> Submitted Cover Letter:
                      </div>
                      <p className="text-gray-650 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{app.coverLetter}</p>
                    </div>
                  )}

                  {/* Education & Experience Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    
                    {/* Experience list */}
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2.5">Work History</h3>
                      {applicant?.experience && applicant.experience.length > 0 ? (
                        <div className="space-y-2">
                          {applicant.experience.map((exp, idx) => (
                            <div key={idx} className="border-l-2 border-indigo-100 pl-3 py-0.5 text-xs">
                              <div className="font-bold text-gray-800 dark:text-gray-250">{exp.title} at {exp.company}</div>
                              <div className="text-[10px] text-gray-450 mt-0.5">
                                {exp.from ? new Date(exp.from).toLocaleDateString() : ''} - {exp.current ? 'Present' : exp.to ? new Date(exp.to).toLocaleDateString() : ''}
                              </div>
                              {exp.description && <p className="text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{exp.description}</p>}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No work history listed</span>
                      )}
                    </div>

                    {/* Education list */}
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2.5">Education</h3>
                      {applicant?.education && applicant.education.length > 0 ? (
                        <div className="space-y-2">
                          {applicant.education.map((edu, idx) => (
                            <div key={idx} className="border-l-2 border-violet-100 pl-3 py-0.5 text-xs">
                              <div className="font-bold text-gray-800 dark:text-gray-250">{edu.degree} &bull; {edu.school}</div>
                              <div className="text-[10px] text-gray-450 mt-0.5">
                                {edu.from ? new Date(edu.from).getFullYear() : ''} - {edu.current ? 'Present' : edu.to ? new Date(edu.to).getFullYear() : ''}
                              </div>
                              {edu.fieldOfStudy && <p className="text-gray-500 mt-0.5">{edu.fieldOfStudy}</p>}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No education history listed</span>
                      )}
                    </div>

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Schedule Interview Modal */}
      {isScheduleOpen && targetApplicant && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-md w-full shadow-2xl relative border border-gray-150 dark:border-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-1.5 text-indigo-650">
              <Calendar className="h-5 w-5" /> Schedule Interview
            </h2>
            <p className="text-xs text-gray-400 mb-6">Schedule assessment with {targetApplicant.name} for "{job.title}"</p>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-3 py-2 text-sm focus:outline-none focus:border-indigo-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:30 AM"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-3 py-2 text-sm focus:outline-none focus:border-indigo-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Interview Type</label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-3 py-2 text-sm focus:outline-none focus:border-indigo-600 font-semibold"
                >
                  <option value="Technical">Technical Round</option>
                  <option value="HR">HR Screen</option>
                  <option value="Behavioral">Behavioral Round</option>
                  <option value="Managerial">Managerial Round</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Meeting Link (e.g. Zoom/Google Meet)</label>
                <input
                  type="url"
                  placeholder="https://zoom.us/j/..."
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-3 py-2 text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Organizer Notes</label>
                <textarea
                  rows={3}
                  placeholder="Describe technical focus topics, documents to bring..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-3 py-2 text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsScheduleOpen(false);
                    setTargetApplicant(null);
                  }}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 rounded-xl text-xs font-bold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={scheduleLoading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition"
                >
                  {scheduleLoading ? 'Scheduling...' : 'Schedule Assessment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default JobApplicants;
