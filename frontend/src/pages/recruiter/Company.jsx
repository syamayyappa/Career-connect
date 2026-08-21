import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { Building, MapPin, Globe, CheckCircle, AlertCircle, FileText } from 'lucide-react';

const CompanyProfile = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [logo, setLogo] = useState('');

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch recruiter's company profile
  const fetchCompany = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/companies/recruiter/my');
      if (data.success && data.data.length > 0) {
        const comp = data.data[0]; // Fetch the first registered company
        setCompany(comp);
        setName(comp.name);
        setDescription(comp.description || '');
        setWebsite(comp.website || '');
        setLocation(comp.location || '');
        setLogo(comp.logo || '');
      }
    } catch (err) {
      console.error('Error fetching company details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      setErrorMsg('Company Name is required.');
      return;
    }

    setIsSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      if (company) {
        // Edit existing company profile
        const { data } = await API.put(`/companies/${company._id}`, {
          name,
          description,
          website,
          location,
          logo
        });
        if (data.success) {
          setSuccessMsg('Company profile updated successfully!');
          setCompany(data.data);
        }
      } else {
        // Register new company profile
        const { data } = await API.post('/companies', {
          name,
          description,
          website,
          location,
          logo
        });
        if (data.success) {
          setSuccessMsg('Company profile registered successfully!');
          setCompany(data.data);
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save company profile. Make sure the name is unique.';
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Company Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {company 
            ? 'Manage and edit your registered company workspace branding' 
            : 'Register your company profile to start posting active developer jobs'}
        </p>
      </div>

      {/* Success/Error Alerts */}
      {successMsg && (
        <div className="mb-6 flex items-center gap-2.5 bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-sm">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="mb-6 flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
          <AlertCircle className="h-5 w-5 text-red-650 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Company Name *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Building className="h-4.5 w-4.5" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 rounded-xl border border-gray-200 dark:border-gray-850 dark:bg-gray-950 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-600"
                  placeholder="e.g. Acme Tech Solutions"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Company Location</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 rounded-xl border border-gray-200 dark:border-gray-850 dark:bg-gray-950 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-600"
                  placeholder="e.g. San Francisco, CA or Remote"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Website URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Globe className="h-4.5 w-4.5" />
                </div>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full pl-10 rounded-xl border border-gray-200 dark:border-gray-850 dark:bg-gray-950 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-600"
                  placeholder="e.g. https://acme.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Logo Path / URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <FileText className="h-4.5 w-4.5" />
                </div>
                <input
                  type="text"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  className="w-full pl-10 rounded-xl border border-gray-200 dark:border-gray-850 dark:bg-gray-950 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-600"
                  placeholder="e.g. /uploads/logo.png"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Company Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-850 dark:bg-gray-950 px-4 py-3 text-sm focus:outline-none focus:border-indigo-600"
              placeholder="Tell applicants about your company products, team size, and values..."
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition shadow shadow-indigo-150"
            >
              {isSubmitting ? (
                <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin block"></span>
              ) : company ? 'Update Company Details' : 'Register Company Profile'}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default CompanyProfile;
