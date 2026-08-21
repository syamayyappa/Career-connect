import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';
import { Briefcase, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';

const CreateJob = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [experience, setExperience] = useState('Entry-level');
  const [salary, setSalary] = useState('');
  const [skills, setSkills] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [deadline, setDeadline] = useState('');

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRecruiterCompany = async () => {
      try {
        const { data } = await API.get('/companies/recruiter/my');
        if (data.success && data.data.length > 0) {
          setCompany(data.data[0]); // Associate with the first registered company
        }
      } catch (err) {
        console.error('Error fetching recruiter company:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecruiterCompany();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!company) {
      setErrorMsg('You must register a Company Profile first.');
      return;
    }

    if (!title || !description || !location || !salary) {
      setErrorMsg('Please fill in all required fields marked with *');
      return;
    }

    setIsSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const { data } = await API.post('/jobs', {
        title,
        description,
        companyId: company._id,
        location,
        jobType,
        experience,
        salary: Number(salary),
        skills,
        responsibilities,
        qualifications,
        deadline
      });

      if (data.success) {
        setSuccessMsg('Job post created successfully! Redirecting...');
        setTimeout(() => {
          navigate('/recruiter/dashboard');
        }, 1500);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to post job. Please check inputs.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80svh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Post a Job Opening</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Register a new vacancy workspace to start receiving applications</p>
      </div>

      {/* Warning if no Company registered */}
      {!company ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-6 rounded-2xl text-center space-y-4 shadow-inner">
          <AlertTriangle className="h-10 w-10 text-amber-600 mx-auto" />
          <h3 className="text-base font-bold">No Company Profile Associated</h3>
          <p className="text-xs text-amber-650 max-w-md mx-auto">
            You must register your company profile with descriptive branding details before you can post active jobs under their name.
          </p>
          <Link to="/recruiter/company" className="inline-block px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition">
            Register Company Profile
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Alerts */}
          {successMsg && (
            <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-sm">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
              <AlertTriangle className="h-5 w-5 text-red-650 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-850 dark:bg-gray-950 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-650"
                    placeholder="e.g. Senior Full Stack React Developer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Associated Workspace</label>
                  <input
                    type="text"
                    disabled
                    value={company.name}
                    className="w-full rounded-xl border border-gray-100 dark:border-gray-800 dark:bg-gray-800 px-4 py-2.5 text-sm font-semibold text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Job Location *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-850 dark:bg-gray-950 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-650"
                    placeholder="e.g. Remote, NY"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Job Type *</label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-850 dark:bg-gray-950 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-650"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Experience level *</label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-850 dark:bg-gray-950 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-650"
                  >
                    <option value="Entry-level">Entry-level (0-2 years)</option>
                    <option value="Mid-level">Mid-level (2-5 years)</option>
                    <option value="Senior">Senior (5+ years)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Annual Salary ($) *</label>
                  <input
                    type="number"
                    required
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-850 dark:bg-gray-950 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-650"
                    placeholder="e.g. 95000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Required Skills *</label>
                <p className="text-[10px] text-gray-450 mb-2">Comma separated list. Will match with seeker profiles (e.g. Python, SQL, Git)</p>
                <input
                  type="text"
                  required
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-850 dark:bg-gray-950 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-650"
                  placeholder="e.g. Node.js, Express, MongoDB, JWT"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Job Description *</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-850 dark:bg-gray-950 px-4 py-3 text-sm focus:outline-none focus:border-indigo-650"
                  placeholder="Describe the overall mission of the team, tasks, and tech stack details..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Key Responsibilities (One per line)</label>
                  <textarea
                    rows={4}
                    value={responsibilities}
                    onChange={(e) => setResponsibilities(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-850 dark:bg-gray-950 px-4 py-3 text-sm focus:outline-none focus:border-indigo-650"
                    placeholder="e.g. Build REST APIs&#10;Optimize database indexes&#10;Write clean Jest tests"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Qualifications & Requirements (One per line)</label>
                  <textarea
                    rows={4}
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-850 dark:bg-gray-950 px-4 py-3 text-sm focus:outline-none focus:border-indigo-650"
                    placeholder="e.g. 2+ years of experience with MERN&#10;Degree in Computer Science or similar&#10;Strong understanding of REST APIs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Application Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full md:w-fit rounded-xl border border-gray-200 dark:border-gray-855 dark:bg-gray-955 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-650"
                />
              </div>

              <div className="flex justify-end pt-4 gap-2">
                <Link to="/recruiter/dashboard" className="px-5 py-2.5 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-sm font-semibold transition">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition shadow shadow-indigo-150"
                >
                  {isSubmitting ? (
                    <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin block"></span>
                  ) : 'Publish Job Listing'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CreateJob;
