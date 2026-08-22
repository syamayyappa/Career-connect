import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { Calendar, Video, Clock, User, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const RecruiterInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInterviews = async () => {
    try {
      const { data } = await API.get('/interviews/my');
      if (data.success) {
        setInterviews(data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load interview records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { data } = await API.put(`/interviews/${id}`, { status: newStatus });
      if (data.success) {
        toast.success(`Interview status updated to ${newStatus}`);
        setInterviews(list => list.map(item => item._id === id ? { ...item, status: newStatus } : item));
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Calendar className="h-6 w-6 text-indigo-650" /> Interviews Console
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Monitor your scheduled meetings, technical testings, and update feedback statuses
        </p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-32 bg-white rounded-3xl border border-gray-50"></div>
          <div className="h-32 bg-white rounded-3xl border border-gray-50"></div>
        </div>
      ) : interviews.length === 0 ? (
        <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl p-16 text-center shadow-sm">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No interviews scheduled yet</h3>
          <p className="text-sm text-gray-450 mt-1">
            Visit your active vacancy applicants management tables to schedule candidate assessments.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 font-semibold">
                <th className="pb-3">Candidate</th>
                <th className="pb-3">Job Posting</th>
                <th className="pb-3">Date & Time</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((item) => (
                <tr key={item._id} className="border-b border-gray-50 dark:border-gray-850 hover:bg-gray-50/50 transition">
                  <td className="py-4">
                    <div className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                      <User className="h-4 w-4 text-gray-400" />
                      {item.candidate?.name || 'Candidate Deleted'}
                    </div>
                    <span className="text-[10px] text-gray-450">{item.candidate?.email}</span>
                  </td>
                  <td className="py-4 text-gray-500 font-semibold">{item.job?.title || 'Job Deleted'}</td>
                  <td className="py-4 font-medium text-gray-650">
                    <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {new Date(item.date).toLocaleDateString()}</div>
                    <span className="text-[10px] text-gray-450 ml-4.5">{item.time}</span>
                  </td>
                  <td className="py-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.status === 'Completed' 
                        ? 'bg-green-50 text-green-700 border border-green-150' 
                        : item.status === 'Cancelled' 
                          ? 'bg-red-50 text-red-700 border border-red-150' 
                          : 'bg-indigo-50/50 text-indigo-650'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item._id, e.target.value)}
                      className="text-xs rounded-lg border border-gray-200 dark:border-gray-850 dark:bg-gray-950 px-2 py-1.5 focus:outline-none focus:border-indigo-600"
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default RecruiterInterviews;
