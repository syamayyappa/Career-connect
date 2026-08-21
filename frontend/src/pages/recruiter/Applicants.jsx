import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../services/api';
import { Users, FileText, CheckCircle2, ChevronRight, Download, Mail, Phone, MapPin, Award, Trash2, ArrowLeft, Sparkles } from 'lucide-react';

const JobApplicants = () => {
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [updateMsg, setUpdateMsg] = useState({ id: '', text: '', type: '' });

  const fetchApplicantsData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // 1. Fetch Job details
      const jobRes = await API.get(`/jobs/${jobId}`);
      if (jobRes.data.success) {
        setJob(jobRes.data.data);
      }

      // 2. Fetch Job applications
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

  // Handle status update change on dropdown
  const handleStatusChange = async (appId, newStatus) => {
    setUpdateMsg({ id: appId, text: 'Saving...', type: 'info' });
    try {
      const { data } = await API.put(`/applications/${appId}/status`, { status: newStatus });
      if (data.success) {
        setUpdateMsg({ id: appId, text: `Saved: ${newStatus}`, type: 'success' });
        // Update state list
        setApplicants(apps => apps.map(app => app._id === appId ? { ...app, status: newStatus } : app));
      }
    } catch (err) {
      console.error(err);
      setUpdateMsg({ id: appId, text: 'Update failed', type: 'error' });
    }
  };

  // Skill match score calculated client-side (to double-check/show recruiter)
  const calculateMatchScore = (applicantSkills) => {
    if (!job || !job.skills || job.skills.length === 0) return 0;
    if (!applicantSkills || applicantSkills.length === 0) return 0;

    const jobSkillsSet = new Set(job.skills.map(s => s.toLowerCase().trim()));
    const appSkillsList = applicantSkills.map(s => s.toLowerCase().trim());
    
    let matchesCount = 0;
    job.skills.forEach(skill => {
      const trimmed = skill.toLowerCase().trim();
      // Check if candidate has the required skill
      if (appSkillsList.includes(trimmed)) {
        matchesCount++;
      }
    });

    return Math.round((matchesCount / job.skills.length) * 100);
  };

  const getScoreBadgeColor = (score) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-250';
    if (score >= 50) return 'text-indigo-750 bg-indigo-50 border-indigo-250';
    return 'text-amber-700 bg-amber-50 border-amber-250';
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
        <p className="text-sm text-gray-550 dark:text-gray-400 mt-1">Review candidate details, skill matches, and update screening status</p>
      </div>

      {applicants.length === 0 ? (
        <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl p-16 text-center shadow-sm">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No applicants yet</h3>
          <p className="text-sm text-gray-450 mt-1">Applicants will show up here as soon as they submit their resume profile.</p>
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
                      {applicant?.name || 'Applicant profile unregistered'}
                      <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg border text-xs font-bold ${getScoreBadgeColor(score)}`}>
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
                        className="rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-3 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 focus:outline-none focus:border-indigo-650"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Selected">Selected (Hire)</option>
                      </select>
                      {updateMsg.id === app._id && (
                        <span className={`block text-[10px] mt-1 font-bold ${
                          updateMsg.type === 'success' ? 'text-green-600' : updateMsg.type === 'error' ? 'text-red-650' : 'text-gray-400'
                        }`}>
                          {updateMsg.text}
                        </span>
                      )}
                    </div>

                    {app.resume && (
                      <div className="pt-4">
                        <a
                          href={`http://localhost:5000${app.resume}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
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
                                : 'bg-gray-50 text-gray-650 border-gray-150 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-750'
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
                      <div className="font-bold text-gray-700 dark:text-gray-350 mb-1.5 flex items-center gap-1">
                        <FileText className="h-4 w-4 text-indigo-500" /> Submitted Cover Letter:
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{app.coverLetter}</p>
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
                              {exp.description && <p className="text-gray-550 dark:text-gray-450 mt-1 line-clamp-2">{exp.description}</p>}
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
                              {edu.fieldOfStudy && <p className="text-gray-550 mt-0.5">{edu.fieldOfStudy}</p>}
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

    </div>
  );
};

export default JobApplicants;
