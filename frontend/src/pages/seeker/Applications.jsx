import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { Briefcase, Calendar, MapPin, DollarSign, Award, Clock } from 'lucide-react';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const { data } = await API.get('/applications/my');
        if (data.success) {
          setApplications(data.data);
        }
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const getStatusBadge = (status) => {
    const base = 'inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full ';
    switch (status) {
      case 'Selected':
        return base + 'bg-green-50 text-green-700 border border-green-100';
      case 'Shortlisted':
        return base + 'bg-indigo-50 text-indigo-700 border border-indigo-100';
      case 'Under Review':
        return base + 'bg-amber-50 text-amber-700 border border-amber-100';
      case 'Rejected':
        return base + 'bg-red-50 text-red-700 border border-red-100';
      default:
        return base + 'bg-gray-50 text-gray-700 border border-gray-150';
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Applications</h1>
        <p className="text-sm text-gray-550 dark:text-gray-400 mt-1">Track the screening status of your submitted job profiles</p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map(n => (
            <div key={n} className="h-32 bg-white border border-gray-100 rounded-3xl"></div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl p-16 text-center shadow-sm">
          <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No applications submitted</h3>
          <p className="text-sm text-gray-450 mt-1">You haven't applied to any job listings yet. Start searching!</p>
          <Link to="/jobs" className="mt-5 inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow transition">
            Find Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-6 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50">
                    {app.job?.jobType || 'Full-time'}
                  </span>
                  <span className={getStatusBadge(app.status)}>
                    {app.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white hover:text-indigo-650 transition">
                  <Link to={`/jobs/${app.job?._id}`}>{app.job?.title || 'Job Listing Deleted'}</Link>
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  <span className="text-gray-900 dark:text-gray-200 font-bold">{app.job?.company?.name || 'Registered Recruiter'}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-gray-400" /> {app.job?.location}</span>
                  <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5 text-gray-400" /> ${app.job?.salary?.toLocaleString()}/yr</span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-400"><Clock className="h-3.5 w-3.5" /> Applied on: {new Date(app.appliedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="w-full md:w-auto flex-shrink-0 flex gap-2">
                <Link
                  to={`/jobs/${app.job?._id}`}
                  className="flex-1 md:flex-initial text-center block px-5 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-750 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold transition"
                >
                  View Job Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;
