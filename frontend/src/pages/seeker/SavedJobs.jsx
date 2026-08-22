import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { Bookmark, Trash2, MapPin, Briefcase, Calendar, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const SavedJobs = () => {
  const [savedList, setSavedList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = async () => {
    try {
      const { data } = await API.get('/saved-jobs');
      if (data.success) {
        setSavedList(data.data);
      }
    } catch (err) {
      console.error('Error fetching saved jobs:', err);
      toast.error('Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleRemove = async (jobId) => {
    try {
      const { data } = await API.post('/saved-jobs', { jobId });
      if (data.success) {
        toast.success(data.message);
        setSavedList(list => list.filter(item => item.job?._id !== jobId));
      }
    } catch (err) {
      toast.error('Failed to remove bookmark');
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Bookmark className="h-6 w-6 text-indigo-600 fill-indigo-600" /> Saved Jobs
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Keep track of job openings you want to apply for later
        </p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map(n => (
            <div key={n} className="h-32 bg-white border border-gray-100 rounded-3xl"></div>
          ))}
        </div>
      ) : savedList.length === 0 ? (
        <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl p-16 text-center shadow-sm">
          <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No saved jobs</h3>
          <p className="text-sm text-gray-450 mt-1">
            Bookmark interesting jobs while browsing to see them here later.
          </p>
          <Link to="/jobs" className="mt-5 inline-block px-5 py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold shadow transition">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {savedList.map((item) => {
            const job = item.job;
            if (!job) return null;
            return (
              <div 
                key={item._id} 
                className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl p-5 shadow-sm hover:shadow-md transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="space-y-1.5">
                  <h2 className="text-base font-bold text-gray-900 dark:text-white hover:text-indigo-600 transition">
                    <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    <span className="text-gray-850 dark:text-gray-300 font-bold">{job.company?.name || 'Registered Company'}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {job.jobType}</span>
                    <span className="flex items-center gap-1 text-[11px]"><Calendar className="h-3.5 w-3.5" /> Bookmarked: {new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={() => handleRemove(job._id)}
                    className="p-2.5 border border-red-100 text-red-650 hover:bg-red-50 rounded-xl transition flex-shrink-0"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                  <Link
                    to={`/jobs/${job._id}`}
                    className="flex-grow md:flex-grow-0 text-center px-5 py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold shadow transition flex items-center justify-center gap-1"
                  >
                    View Details <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default SavedJobs;
