import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Search, MapPin, Briefcase, Award, Users, ShieldCheck, ArrowRight, Zap } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  // Search parameters to pass to jobs view
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${searchQuery}&location=${locationQuery}`);
  };

  // Fetch recent jobs
  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        const { data } = await API.get('/jobs');
        if (data.success) {
          // Display top 3 latest jobs
          setJobs(data.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching jobs for Home view:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentJobs();
  }, []);

  return (
    <div className="bg-gray-50/50 dark:bg-gray-950/20 min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-white py-20 px-4 dark:bg-gray-950">
        {/* Subtle decorative background gradients */}
        <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-900/10"></div>
        <div className="absolute bottom-0 left-0 -z-10 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl dark:bg-violet-900/10"></div>

        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-gray-900 dark:text-white leading-none">
            Find the Right <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">Opportunity</span> <br />
            For Your Career
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 dark:text-gray-400">
            Search jobs, upload your resume, and let our explainable AI-assisted skill-matching algorithm guide you to the jobs where you fit best.
          </p>

          {/* Search Form */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="mx-auto mt-10 max-w-4xl bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-3 rounded-2xl shadow-xl flex flex-col md:flex-row gap-2"
          >
            <div className="flex-1 flex items-center px-3 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800 py-2">
              <Search className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Job Title, Skills (e.g. React, Python)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-0 focus:ring-0 text-gray-700 dark:text-gray-200 placeholder-gray-400 text-sm focus:outline-none"
              />
            </div>
            <div className="flex-1 flex items-center px-3 py-2">
              <MapPin className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Location (e.g. Remote, Mumbai)"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="w-full bg-transparent border-0 focus:ring-0 text-gray-700 dark:text-gray-200 placeholder-gray-400 text-sm focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full md:w-auto bg-indigo-600 text-white font-semibold rounded-xl px-8 py-3.5 hover:bg-indigo-500 transition shadow-md shadow-indigo-100 dark:shadow-none hover:shadow-lg text-sm flex items-center justify-center gap-1.5"
            >
              Search Jobs
            </button>
          </form>
        </div>
      </section>

      {/* 2. Platform Statistics */}
      <section className="bg-indigo-900 text-white py-12 px-4 shadow-inner">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-extrabold">12,000+</div>
            <div className="text-indigo-200 text-sm mt-1">Active Job Listings</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold">4,500+</div>
            <div className="text-indigo-200 text-sm mt-1">Hired Candidates</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold">850+</div>
            <div className="text-indigo-200 text-sm mt-1">Top-tier Recruiters</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold">95.4%</div>
            <div className="text-indigo-200 text-sm mt-1">AI Recommendation Precision</div>
          </div>
        </div>
      </section>

      {/* 3. Latest Jobs Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Opportunities</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Recently posted vacancies looking for matching applicants</p>
          </div>
          <Link to="/jobs" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1 text-sm font-semibold transition">
            See all jobs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-6 rounded-xl animate-pulse h-48"></div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-12 rounded-xl">
            <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No jobs listed yet</h3>
            <p className="text-gray-400 mt-1">Check back later or register as a Recruiter to post a job!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-6 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-indigo-55 text-indigo-700 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-300">
                      {job.jobType}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1 hover:text-indigo-600 transition">
                    <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                  </h3>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1 mb-3">
                    {job.company?.name || 'Company Registered'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                    {job.description}
                  </p>
                </div>

                <div className="border-t border-gray-50 dark:border-gray-800 pt-4 mt-auto">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{job.location}</span>
                    </div>
                    <div className="font-semibold text-gray-700 dark:text-gray-300">
                      ${job.salary.toLocaleString()}/yr
                    </div>
                  </div>
                  <Link 
                    to={`/jobs/${job._id}`}
                    className="w-full mt-4 flex items-center justify-center gap-1 px-4 py-2.5 bg-gray-50 hover:bg-indigo-600 hover:text-white dark:bg-gray-800 dark:hover:bg-indigo-600 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold transition duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. How It Works Section */}
      <section className="bg-white dark:bg-gray-950 border-t border-gray-50 dark:border-gray-800 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">How It Works</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Smooth three-step pipeline designed for modern candidates & companies</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center bg-gray-50/50 dark:bg-gray-900 p-8 rounded-2xl">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 mb-6 shadow">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">1. Register Profile</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Create a candidate or recruiter profile. Input your details, location, and key technical skills.
              </p>
            </div>
            <div className="text-center bg-gray-50/50 dark:bg-gray-900 p-8 rounded-2xl">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 mb-6 shadow">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">2. Get AI Match Score</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Our algorithm processes skills automatically, giving you a matching percentage score on every job card.
              </p>
            </div>
            <div className="text-center bg-gray-50/50 dark:bg-gray-900 p-8 rounded-2xl">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 mb-6 shadow">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">3. Apply & Track Status</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Submit your resume and cover letter. Monitor real-time status updates directly on your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Call To Action (CTA) */}
      <section className="bg-indigo-600 py-16 px-4 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-4">Start Recruiting or Applying Today</h2>
          <p className="text-indigo-100 mb-8 max-w-xl mx-auto">
            Get instant match metrics, complete ATS application status flow, and modern interfaces built with maximum clarity.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register?role=seeker" className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-gray-100 transition shadow">
              Apply as Seeker
            </Link>
            <Link to="/register?role=recruiter" className="px-6 py-3 bg-indigo-900 text-white font-semibold rounded-xl hover:bg-indigo-950 transition border border-indigo-500 shadow">
              Hire as Recruiter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
