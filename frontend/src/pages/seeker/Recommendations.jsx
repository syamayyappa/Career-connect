import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { Sparkles, MapPin, DollarSign, Calendar, ChevronRight, Briefcase, Award } from 'lucide-react';

const Recommendations = () => {
  const { user } = useAuth();
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user || !user.skills || user.skills.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMsg('');

      try {
        const { data } = await API.get('/recommendations/jobs');
        if (data.success) {
          setRecommendedJobs(data.data);
        }
      } catch (err) {
        console.error('Error fetching job recommendations:', err);
        setErrorMsg('Failed to load recommended jobs. Try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-100';
    if (score >= 50) return 'text-indigo-750 bg-indigo-50 border-indigo-100';
    return 'text-amber-700 bg-amber-50 border-amber-100';
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="h-6 w-6 text-indigo-600" /> Recommended for You
          </h1>
          <p className="text-sm text-gray-550 dark:text-gray-400 mt-1">
            AI-assisted job recommendations based on normalized skill matching
          </p>
        </div>
      </div>

      {/* Warning if user has no skills */}
      {user && (!user.skills || user.skills.length === 0) ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-6 rounded-2xl text-center space-y-4">
          <Award className="h-10 w-10 text-amber-600 mx-auto" />
          <h3 className="text-base font-bold">No Profile Skills Found</h3>
          <p className="text-xs text-amber-650 max-w-md mx-auto">
            You haven't listed any skills in your profile! Add technical skills (e.g. Python, React) to get automatic match recommendations.
          </p>
          <Link to="/seeker/profile" className="inline-block px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition">
            Add Skills Now
          </Link>
        </div>
      ) : loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map(n => (
            <div key={n} className="h-44 bg-white border border-gray-100 rounded-3xl"></div>
          ))}
        </div>
      ) : errorMsg ? (
        <div className="bg-red-50 text-red-700 border border-red-100 p-4 rounded-xl text-sm">
          {errorMsg}
        </div>
      ) : recommendedJobs.length === 0 ? (
        <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl p-16 text-center shadow-sm">
          <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No matching jobs found</h3>
          <p className="text-sm text-gray-455 mt-1">
            None of our currently listed jobs match the skills in your profile ({user.skills?.join(', ')}). Add more skills or check back later!
          </p>
          <Link to="/seeker/profile" className="mt-5 inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow transition">
            Update Profile Skills
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {recommendedJobs.map((job) => (
            <div 
              key={job._id} 
              className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {/* Highlight bar matching the score color */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                job.matchScore >= 80 ? 'bg-emerald-500' : job.matchScore >= 50 ? 'bg-indigo-500' : 'bg-amber-500'
              }`}></div>

              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                
                {/* Job Info */}
                <div className="space-y-2 flex-grow">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg border ${getScoreColor(job.matchScore)}`}>
                      <Sparkles className="h-3 w-3" />
                      {job.matchScore}% Match
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-gray-50 border border-gray-150 text-gray-650 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
                      {job.jobType}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-gray-900 dark:text-white hover:text-indigo-600 transition">
                    <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                  </h2>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    <span className="text-gray-900 dark:text-gray-250 font-bold">{job.company?.name || 'Registered Company'}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                    <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> ${job.salary.toLocaleString()}/yr</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}</span>
                  </div>

                  {/* Skills breakdowns */}
                  <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="font-bold text-green-700 dark:text-green-400 mb-1 flex items-center gap-1">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500"></span> Matches ({job.matchedSkills?.length || 0}):
                      </div>
                      <span className="text-gray-650 dark:text-gray-400">{job.matchedSkills?.join(', ') || 'No overlaps'}</span>
                    </div>
                    {job.missingSkills && job.missingSkills.length > 0 && (
                      <div>
                        <div className="font-bold text-amber-700 mb-1 flex items-center gap-1">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500"></span> Missing ({job.missingSkills.length}):
                        </div>
                        <span className="text-gray-650 dark:text-gray-400">{job.missingSkills.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* View/Apply Action */}
                <div className="w-full md:w-auto flex-shrink-0">
                  <Link
                    to={`/jobs/${job._id}`}
                    className="w-full md:w-auto text-center block px-6 py-2.5 bg-indigo-650 bg-indigo-650 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow shadow-indigo-150"
                  >
                    View & Apply
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Recommendations;
