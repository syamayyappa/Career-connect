import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  SlidersHorizontal, 
  ShieldAlert, 
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2
} from 'lucide-react';

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
    
    if (score >= 80) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-extrabold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 shadow-xs">
          <Sparkles className="h-3 w-3 text-emerald-500 fill-emerald-500" />
          {score}% AI Match
        </span>
      );
    }
    if (score >= 50) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-extrabold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800 shadow-xs">
          <Sparkles className="h-3 w-3 text-indigo-500" />
          {score}% Match
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300">
        {score}% Match
      </span>
    );
  };

  return (
    <div className="bg-slate-50/50 dark:bg-slate-950 min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-slate-200/70 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider mb-2 border border-indigo-200/60 dark:border-indigo-800/60">
              <Briefcase className="h-3 w-3 text-indigo-600" /> Live ATS Job Directory
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Explore Opportunities
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Deterministic skill-scored openings at high-growth technology companies
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs text-slate-700 dark:text-slate-300">
              <strong className="text-indigo-600 font-extrabold">{jobs.length}</strong> vacancies active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Panel: Executive Filter Form */}
          <div className="glass-panel rounded-3xl p-6 shadow-sm h-fit sticky top-20">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-indigo-600" /> Filter Vacancies
              </h2>
              <button
                onClick={handleClearFilters}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:underline transition cursor-pointer"
              >
                Reset All
              </button>
            </div>

            <form onSubmit={handleFilterSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Keywords / Skills
                </label>
                <div className="relative">
                  <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900/90 px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/10 font-medium transition"
                    placeholder="e.g. React, Python, AWS"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="h-4 w-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-9 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900/90 px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/10 font-medium transition"
                    placeholder="Remote, San Francisco..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Employment Type
                </label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900/90 px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/10 font-medium transition"
                >
                  <option value="">All Employment Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Experience Tier
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900/90 px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/10 font-medium transition"
                >
                  <option value="">All Experience Tiers</option>
                  <option value="Entry-level">Entry-level (0-2 yrs)</option>
                  <option value="Mid-level">Mid-level (2-5 yrs)</option>
                  <option value="Senior">Senior (5+ yrs)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Minimum Base ($/yr)
                </label>
                <div className="relative">
                  <DollarSign className="h-4 w-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="number"
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                    className="w-full pl-9 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900/90 px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/10 font-medium transition"
                    placeholder="e.g. 100000"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-5 py-2.5 btn-primary-gradient text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/25 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Filter className="h-3.5 w-3.5" /> Apply Filters
              </button>
            </form>
          </div>

          {/* Right Panel: Job Cards Feed */}
          <div className="lg:col-span-3 space-y-4">
            
            {loading ? (
              <div className="space-y-3.5 animate-pulse">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="h-40 glass-panel rounded-2xl"></div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-rose-50 text-rose-800 border border-rose-200 p-6 rounded-2xl flex items-center gap-3 text-xs font-semibold">
                <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            ) : jobs.length === 0 ? (
              <div className="glass-panel rounded-3xl p-16 text-center">
                <Briefcase className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No jobs match your filter criteria</h3>
                <p className="text-xs text-slate-400 mt-1">Try broadening your search term or resetting active filters.</p>
                <button 
                  onClick={handleClearFilters}
                  className="mt-4 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => {
                  const matchScore = calculateMatchScore(job.skills);
                  return (
                    <div 
                      key={job._id} 
                      className="glass-panel glass-panel-hover p-6 rounded-2xl shadow-xs transition duration-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 group"
                    >
                      <div className="space-y-2.5 flex-1">
                        
                        {/* Meta Tags Top Row */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/80 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800">
                            {job.jobType}
                          </span>
                          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-slate-100 text-slate-600 border border-slate-200/60 dark:bg-slate-800 dark:text-slate-300">
                            {job.experience}
                          </span>
                          {matchScore !== null && getMatchScoreBadge(matchScore)}
                        </div>
                        
                        {/* Title & Company */}
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition">
                            <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                          </h3>
                          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                            {job.company?.name || 'Company Details'}
                          </div>
                        </div>
                        
                        {/* Specs row */}
                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 pt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" /> {job.location}
                          </span>
                          <span className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                            <DollarSign className="h-3.5 w-3.5 text-slate-400" /> ${job.salary.toLocaleString()}<span className="text-[11px] font-normal text-slate-400">/yr</span>
                          </span>
                          <span className="flex items-center gap-1 text-[11px]">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" /> {job.deadline ? `Deadline: ${new Date(job.deadline).toLocaleDateString()}` : 'Continuous hiring'}
                          </span>
                        </div>

                        {/* Skill Chips */}
                        {job.skills && job.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {job.skills.map((skill, idx) => (
                              <span 
                                key={idx} 
                                className="px-2.5 py-0.5 bg-slate-100/90 border border-slate-200/70 text-slate-700 rounded-md text-[11px] font-medium dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="w-full md:w-auto shrink-0 pt-2 md:pt-0">
                        <Link
                          to={`/jobs/${job._id}`}
                          className="w-full md:w-auto text-center inline-flex items-center justify-center gap-1.5 px-5 py-2.5 btn-primary-gradient text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/20 cursor-pointer"
                        >
                          <span>View Details</span>
                          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
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
    </div>
  );
};

export default Jobs;
