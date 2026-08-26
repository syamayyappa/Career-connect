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
    let color = 'bg-slate-100 text-slate-700 border-slate-200';
    if (score >= 80) color = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300';
    else if (score >= 50) color = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300';
    else if (score > 0) color = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300';

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold rounded-md border ${color}`}>
        <Sparkles className="h-3 w-3" />
        {score}% Match
      </span>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Explore Career Opportunities</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Search through verified high-growth technology job openings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Panel: Filter Form */}
        <div className="bg-white border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900 rounded-3xl p-6 shadow-xs h-fit">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
            <h2 className="text-xs font-bold text-slate-700 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-blue-600" /> Filter Options
            </h2>
            <button
              onClick={handleClearFilters}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 transition cursor-pointer"
            >
              Reset
            </button>
          </div>

          <form onSubmit={handleFilterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Search Query</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-250 dark:border-slate-800 dark:bg-slate-950 px-3.5 py-2 text-xs focus:outline-none focus:border-blue-600 font-medium"
                placeholder="Keywords or Skills"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-slate-250 dark:border-slate-800 dark:bg-slate-950 px-3.5 py-2 text-xs focus:outline-none focus:border-blue-600 font-medium"
                placeholder="e.g. Remote, San Francisco"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full rounded-xl border border-slate-250 dark:border-slate-800 dark:bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:border-blue-600 font-medium"
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
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Experience Level</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full rounded-xl border border-slate-250 dark:border-slate-800 dark:bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:border-blue-600 font-medium"
              >
                <option value="">All Levels</option>
                <option value="Entry-level">Entry-level (0-2 yrs)</option>
                <option value="Mid-level">Mid-level (2-5 yrs)</option>
                <option value="Senior">Senior (5+ yrs)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Min Salary ($/yr)</label>
              <input
                type="number"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                className="w-full rounded-xl border border-slate-250 dark:border-slate-800 dark:bg-slate-950 px-3.5 py-2 text-xs focus:outline-none focus:border-blue-600 font-medium"
                placeholder="e.g. 90000"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/20 cursor-pointer"
            >
              Apply Filters
            </button>
          </form>
        </div>

        {/* Right Panel: Job Cards Feed */}
        <div className="lg:col-span-3 space-y-4">
          
          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3].map(n => (
                <div key={n} className="h-36 bg-white border border-slate-200/80 rounded-2xl"></div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-rose-50 text-rose-800 border border-rose-200 p-6 rounded-2xl flex items-center gap-3 text-xs font-semibold">
              <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900 rounded-3xl p-12 text-center shadow-xs">
              <Briefcase className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No jobs match your query</h3>
              <p className="text-xs text-slate-400 mt-1">Try clearing or adjusting your search keywords.</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {jobs.map((job) => {
                const matchScore = calculateMatchScore(job.skills);
                return (
                  <div key={job._id} className="bg-white border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900 p-6 rounded-2xl shadow-xs hover:shadow-lg hover:border-blue-200 transition duration-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-blue-50 text-blue-700 border border-blue-200/60 dark:bg-blue-950/50 dark:text-blue-300">
                          {job.jobType}
                        </span>
                        {matchScore !== null && getMatchScoreBadge(matchScore)}
                      </div>
                      
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white hover:text-blue-600 transition">
                        <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span className="text-slate-800 dark:text-slate-200 font-bold">{job.company?.name || 'Company Details'}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-slate-400" /> {job.location}</span>
                        <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5 text-slate-400" /> ${job.salary.toLocaleString()}/yr</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-slate-400" /> Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Continuous'}</span>
                      </div>

                      {/* Display tags for required skills */}
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {job.skills.map((skill, idx) => (
                            <span key={idx} className="px-2.5 py-0.5 bg-slate-100 border border-slate-200/70 text-slate-700 rounded-md text-[10px] font-medium dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="w-full md:w-auto shrink-0">
                      <Link
                        to={`/jobs/${job._id}`}
                        className="w-full md:w-auto text-center block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/20"
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
