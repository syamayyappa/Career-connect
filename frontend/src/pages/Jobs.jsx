import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Search, MapPin, Briefcase, DollarSign, Calendar, SlidersHorizontal, ShieldAlert, Sparkles } from 'lucide-react';

const Jobs = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter Form State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || '');
  const [experience, setExperience] = useState(searchParams.get('experience') || '');
  const [minSalary, setMinSalary] = useState(searchParams.get('minSalary') || '');

  // Fetch jobs from server
  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    
    // Construct query parameters
    const params = {};
    if (search) params.search = search;
    if (location) params.location = location;
    if (jobType) params.jobType = jobType;
    if (experience) params.experience = experience;
    if (minSalary) params.minSalary = minSalary;

    try {
      const { data } = await API.get('/jobs', { params });
      if (data.success) {
        setJobs(data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch jobs. Please try reloading the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchParams]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const newParams = {};
    if (search) newParams.search = search;
    if (location) newParams.location = location;
    if (jobType) newParams.jobType = jobType;
    if (experience) newParams.experience = experience;
    if (minSalary) newParams.minSalary = minSalary;

    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearch('');
    setLocation('');
    setJobType('');
    setExperience('');
    setMinSalary('');
    setSearchParams({});
  };

  // Client-side AI Match Score calculation to display inline
  const calculateMatchScore = (jobRequiredSkills) => {
    if (!user || user.role !== 'seeker') return null;
    if (!user.skills || user.skills.length === 0) return 0;
    if (!jobRequiredSkills || jobRequiredSkills.length === 0) return 0;

    const userSkillsSet = new Set(user.skills.map(s => s.toLowerCase().trim()));
    const jobSkillsList = jobRequiredSkills.map(s => s.toLowerCase().trim());
    
    let matchesCount = 0;
    jobSkillsList.forEach(skill => {
      if (userSkillsSet.has(skill)) {
        matchesCount++;
      }
    });

    return Math.round((matchesCount / jobSkillsList.length) * 100);
  };

  const getMatchScoreBadge = (score) => {
    if (score === null) return null;
    let color = 'bg-gray-100 text-gray-700';
    if (score >= 80) color = 'bg-emerald-50 text-emerald-700 border border-emerald-150';
    else if (score >= 50) color = 'bg-indigo-50 text-indigo-700 border border-indigo-150';
    else if (score > 0) color = 'bg-amber-50 text-amber-700 border border-amber-150';

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg ${color}`}>
        <Sparkles className="h-3 w-3" />
        {score}% Skill Match
      </span>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Explore Career Opportunities</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Search through thousands of curated developer openings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Panel: Filter Form */}
        <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl p-6 shadow-sm h-fit">
          <div className="flex justify-between items-center mb-6 border-b border-gray-55 pb-3">
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-indigo-650" /> Filter Options
            </h2>
            <button
              onClick={handleClearFilters}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
            >
              Reset
            </button>
          </div>

          <form onSubmit={handleFilterSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Search Query</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-600"
                placeholder="Keywords or Skills"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-600"
                placeholder="e.g. Remote, San Jose"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-3 py-2 text-xs focus:outline-none focus:border-indigo-600"
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Experience level</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-3 py-2 text-xs focus:outline-none focus:border-indigo-600"
              >
                <option value="">All Experience Levels</option>
                <option value="Entry-level">Entry-level (0-2 years)</option>
                <option value="Mid-level">Mid-level (2-5 years)</option>
                <option value="Senior">Senior (5+ years)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Minimum Salary ($/yr)</label>
              <input
                type="number"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-600"
                placeholder="e.g. 80000"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow shadow-indigo-150"
            >
              Apply Filters
            </button>
          </form>
        </div>

        {/* Right Panel: Job Cards Feed */}
        <div className="lg:col-span-3 space-y-4">
          
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map(n => (
                <div key={n} className="h-32 bg-white border border-gray-100 dark:border-gray-800 rounded-2xl"></div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 border border-red-100 p-6 rounded-2xl flex items-center gap-3 text-sm">
              <ShieldAlert className="h-6 w-6 text-red-650" />
              <span>{error}</span>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl p-12 text-center shadow-sm">
              <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No jobs match your search</h3>
              <p className="text-sm text-gray-450 mt-1">Try resetting filters or using a broader query parameter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => {
                const matchScore = calculateMatchScore(job.skills);
                return (
                  <div key={job._id} className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-6 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                          {job.jobType}
                        </span>
                        {matchScore !== null && getMatchScoreBadge(matchScore)}
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white hover:text-indigo-600 transition">
                        <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
                        <span className="text-gray-900 dark:text-gray-200 font-bold">{job.company?.name || 'Company Details'}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-gray-400" /> {job.location}</span>
                        <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5 text-gray-400" /> {job.salary.toLocaleString()}/yr</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-gray-400" /> Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}</span>
                      </div>

                      {/* Display tags for required skills */}
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {job.skills.map((skill, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-gray-50 border border-gray-150 text-gray-600 rounded-md text-[10px] dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="w-full md:w-auto flex-shrink-0">
                      <Link
                        to={`/jobs/${job._id}`}
                        className="w-full md:w-auto text-center block px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow shadow-indigo-150"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Jobs;
