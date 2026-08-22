import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { User, Phone, MapPin, Award, BookOpen, Briefcase, Plus, Trash2, CheckCircle, FileUp, Download, FileText, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfileState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Resume Upload State
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Core Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    headline: '',
    about: '',
    skills: '', // Keep as comma-separated string for editing
    preferredJobType: '',
    preferredLocation: '',
    education: [],
    experience: []
  });

  // Load user data into form
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        location: user.location || '',
        headline: user.headline || '',
        about: user.about || '',
        skills: user.skills ? user.skills.join(', ') : '',
        preferredJobType: user.preferredJobType || '',
        preferredLocation: user.preferredLocation || '',
        education: user.education || [],
        experience: user.experience || []
      });
    }
  }, [user]);

  // Handle standard input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Resume Upload handler ---
  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.error('Please select a file to upload first.');
      return;
    }

    setUploading(true);
    const form = new FormData();
    form.append('resume', resumeFile);

    try {
      const { data } = await API.post('/users/resume', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (data.success) {
        toast.success(data.message || 'Resume uploaded successfully!');
        // Update user state with new resume and skills
        updateProfileState({ 
          ...user, 
          resume: data.data.resumeUrl,
          skills: data.data.skills
        });
        
        // Update local skills text box to show new parsed skills
        setFormData(prev => ({
          ...prev,
          skills: data.data.skills.join(', ')
        }));

        setResumeFile(null);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to upload resume.');
    } finally {
      setUploading(false);
    }
  };

  // --- Dynamic Education Blocks ---
  const handleEducationChange = (index, e) => {
    const updated = [...formData.education];
    updated[index][e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, education: updated });
  };

  const addEducationBlock = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        { school: '', degree: '', fieldOfStudy: '', from: '', to: '', current: false, description: '' }
      ]
    });
  };

  const removeEducationBlock = (index) => {
    const updated = formData.education.filter((_, idx) => idx !== index);
    setFormData({ ...formData, education: updated });
  };

  // --- Dynamic Experience Blocks ---
  const handleExperienceChange = (index, e) => {
    const updated = [...formData.experience];
    updated[index][e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, experience: updated });
  };

  const addExperienceBlock = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        { title: '', company: '', location: '', from: '', to: '', current: false, description: '' }
      ]
    });
  };

  const removeExperienceBlock = (index) => {
    const updated = formData.experience.filter((_, idx) => idx !== index);
    setFormData({ ...formData, experience: updated });
  };

  // Submit profile edits
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    // Format skills back into array
    const skillsArray = formData.skills
      ? formData.skills.split(',').map(s => s.trim()).filter(s => s !== '')
      : [];

    try {
      const { data } = await API.put('/users/profile', {
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        headline: formData.headline,
        about: formData.about,
        skills: skillsArray,
        preferredJobType: formData.preferredJobType,
        preferredLocation: formData.preferredLocation,
        education: formData.education,
        experience: formData.experience
      });

      if (data.success) {
        setSuccessMsg('Profile updated successfully!');
        toast.success('Profile saved successfully!');
        updateProfileState(data.data);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile. Please check inputs.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        <p className="text-sm text-gray-550 dark:text-gray-400 mt-1">Configure your personal information, upload your resume, and detail your work history</p>
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
          <Trash2 className="h-5 w-5 text-red-650 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Resume Document Management Section */}
      <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl p-6 shadow-sm mb-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-600" /> Resume Management
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            {user?.resume ? (
              <div className="p-4 bg-green-50/50 dark:bg-green-950/10 border border-green-150 rounded-2xl flex items-center justify-between text-xs text-green-700 dark:text-green-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <span className="font-bold">Active Resume Saved</span>
                    <p className="text-[10px] text-green-500 mt-0.5">Ready to auto-fill applications</p>
                  </div>
                </div>
                <a
                  href={`http://localhost:5000${user.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white hover:bg-green-50 rounded-lg shadow-sm border border-green-200 text-green-700 transition"
                  title="Download File"
                >
                  <Download className="h-4 w-4" />
                </a>
              </div>
            ) : (
              <div className="p-4 bg-amber-50/50 border border-amber-150 rounded-2xl text-xs text-amber-700 flex items-start gap-2.5">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <div>
                  <span className="font-bold">No Resume Found</span>
                  <p className="text-[10px] text-amber-600 mt-0.5">Please upload a resume to receive AI matching recommendations.</p>
                </div>
              </div>
            )}
            
            <p className="text-[10px] text-gray-450 mt-3 leading-relaxed">
              * Uploading a new PDF/DOC resume replaces your previous one. CareerConnect AI automatically parses new resumes to extract technical keywords and merges them into your profile skills chips.
            </p>
          </div>

          <form onSubmit={handleResumeUpload} className="space-y-3.5">
            <div className="border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-4 text-center hover:border-indigo-400 transition cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <FileUp className="h-7 w-7 text-gray-400 mx-auto mb-1.5" />
              <span className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                {resumeFile ? resumeFile.name : 'Choose new PDF, DOC, or DOCX'}
              </span>
              <span className="block text-[10px] text-gray-400 mt-0.5">Max size: 5MB</span>
            </div>

            <button
              type="submit"
              disabled={uploading || !resumeFile}
              className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              {uploading ? (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : 'Upload & Replace Resume'}
            </button>
          </form>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Basic Info */}
        <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <User className="h-5 w-5 text-indigo-600" /> Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-450 uppercase mb-2 dark:text-gray-300">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-250 dark:border-gray-800 dark:bg-gray-950 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-600 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-450 uppercase mb-2 dark:text-gray-300">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-250 dark:border-gray-800 dark:bg-gray-950 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-600 transition"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-450 uppercase mb-2 dark:text-gray-300">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-250 dark:border-gray-800 dark:bg-gray-950 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-600 transition"
                placeholder="e.g. San Francisco, CA"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Headline & Preferences */}
        <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-600" /> Headline & Preferences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-gray-455 uppercase mb-2">Headline</label>
              <input
                type="text"
                name="headline"
                value={formData.headline}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-250 dark:border-gray-800 dark:bg-gray-950 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-600 transition"
                placeholder="e.g. Full Stack Engineer | React, Node.js, Express & MongoDB"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-gray-455 uppercase mb-2">About Me</label>
              <textarea
                rows={3}
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-250 dark:border-gray-800 dark:bg-gray-950 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-600 transition"
                placeholder="Tell recruiters about your goals, background, and what you excel at."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-455 uppercase mb-2">Job Type Preference</label>
              <select
                name="preferredJobType"
                value={formData.preferredJobType}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-250 dark:border-gray-800 dark:bg-gray-950 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-600 transition"
              >
                <option value="">Any Job Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-455 uppercase mb-2">Preferred Location</label>
              <input
                type="text"
                name="preferredLocation"
                value={formData.preferredLocation}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-250 dark:border-gray-800 dark:bg-gray-950 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-600 transition"
                placeholder="e.g. Remote, San Francisco, New York"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Skills */}
        <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-600" /> Technical Skills
          </h2>
          <p className="text-xs text-gray-400 mb-6">Enter your skills separated by commas (e.g. React, Node.js, Python, SQL)</p>
          
          <div>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-gray-250 dark:border-gray-800 dark:bg-gray-950 px-4 py-3 text-sm focus:outline-none focus:border-indigo-600 transition"
              placeholder="e.g. React, Node.js, Express, MongoDB, JavaScript"
            />
          </div>
        </div>

        {/* Section 4: Education History */}
        <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-600" /> Education History
            </h2>
            <button
              type="button"
              onClick={addEducationBlock}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Education
            </button>
          </div>

          {formData.education.length === 0 ? (
            <p className="text-xs text-gray-400 italic text-center py-4">No education records added yet.</p>
          ) : (
            <div className="space-y-6">
              {formData.education.map((edu, index) => (
                <div key={index} className="p-4 bg-gray-50/50 dark:bg-gray-850/50 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-indigo-600">Record #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeEducationBlock(index)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-0.5"
                    >
                      <Trash2 className="h-4 w-4" /> Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1">School / University</label>
                      <input
                        type="text"
                        name="school"
                        required
                        value={edu.school}
                        onChange={(e) => handleEducationChange(index, e)}
                        className="w-full rounded-lg border border-gray-250 dark:border-gray-800 dark:bg-gray-950 px-3 py-2 text-xs focus:outline-none focus:border-indigo-650"
                        placeholder="e.g. Stanford University"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1">Degree</label>
                      <input
                        type="text"
                        name="degree"
                        required
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, e)}
                        className="w-full rounded-lg border border-gray-255 dark:border-gray-800 dark:bg-gray-950 px-3 py-2 text-xs focus:outline-none focus:border-indigo-650"
                        placeholder="e.g. Bachelor of Science"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1">Field of Study</label>
                      <input
                        type="text"
                        name="fieldOfStudy"
                        value={edu.fieldOfStudy}
                        onChange={(e) => handleEducationChange(index, e)}
                        className="w-full rounded-lg border border-gray-250 dark:border-gray-800 dark:bg-gray-950 px-3 py-2 text-xs focus:outline-none focus:border-indigo-650"
                        placeholder="e.g. Computer Science"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1">From Date</label>
                      <input
                        type="date"
                        name="from"
                        value={edu.from ? edu.from.substring(0, 10) : ''}
                        onChange={(e) => handleEducationChange(index, e)}
                        className="w-full rounded-lg border border-gray-250 dark:border-gray-800 dark:bg-gray-950 px-3 py-2 text-xs focus:outline-none focus:border-indigo-650"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1">To Date</label>
                      <input
                        type="date"
                        name="to"
                        disabled={edu.current}
                        value={edu.to ? edu.to.substring(0, 10) : ''}
                        onChange={(e) => handleEducationChange(index, e)}
                        className="w-full rounded-lg border border-gray-250 dark:border-gray-800 dark:bg-gray-950 px-3 py-2 text-xs focus:outline-none focus:border-indigo-650 disabled:bg-gray-100"
                      />
                    </div>
                    <div className="flex items-center mt-4">
                      <input
                        type="checkbox"
                        name="current"
                        id={`edu-curr-${index}`}
                        checked={edu.current}
                        onChange={(e) => handleEducationChange(index, e)}
                        className="rounded border-gray-305 text-indigo-600 focus:ring-indigo-500 h-4 w-4 mr-2"
                      />
                      <label htmlFor={`edu-curr-${index}`} className="text-xs font-bold text-gray-505">Currently studying here</label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 5: Work Experience */}
        <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-indigo-600" /> Work History
            </h2>
            <button
              type="button"
              onClick={addExperienceBlock}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Work History
            </button>
          </div>

          {formData.experience.length === 0 ? (
            <p className="text-xs text-gray-455 italic text-center py-4">No work experience records added yet.</p>
          ) : (
            <div className="space-y-6">
              {formData.experience.map((exp, index) => (
                <div key={index} className="p-4 bg-gray-50/50 dark:bg-gray-850/50 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-indigo-600">Record #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeExperienceBlock(index)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-0.5"
                    >
                      <Trash2 className="h-4 w-4" /> Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1">Job Title</label>
                      <input
                        type="text"
                        name="title"
                        required
                        value={exp.title}
                        onChange={(e) => handleExperienceChange(index, e)}
                        className="w-full rounded-lg border border-gray-250 dark:border-gray-800 dark:bg-gray-950 px-3 py-2 text-xs focus:outline-none focus:border-indigo-650"
                        placeholder="e.g. Software Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1">Company</label>
                      <input
                        type="text"
                        name="company"
                        required
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(index, e)}
                        className="w-full rounded-lg border border-gray-255 dark:border-gray-800 dark:bg-gray-950 px-3 py-2 text-xs focus:outline-none focus:border-indigo-650"
                        placeholder="e.g. Stripe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={exp.location}
                        onChange={(e) => handleExperienceChange(index, e)}
                        className="w-full rounded-lg border border-gray-250 dark:border-gray-800 dark:bg-gray-950 px-3 py-2 text-xs focus:outline-none focus:border-indigo-650"
                        placeholder="e.g. Remote"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1">From Date</label>
                      <input
                        type="date"
                        name="from"
                        value={exp.from ? exp.from.substring(0, 10) : ''}
                        onChange={(e) => handleExperienceChange(index, e)}
                        className="w-full rounded-lg border border-gray-250 dark:border-gray-800 dark:bg-gray-950 px-3 py-2 text-xs focus:outline-none focus:border-indigo-650"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1">To Date</label>
                      <input
                        type="date"
                        name="to"
                        disabled={exp.current}
                        value={exp.to ? exp.to.substring(0, 10) : ''}
                        onChange={(e) => handleExperienceChange(index, e)}
                        className="w-full rounded-lg border border-gray-250 dark:border-gray-800 dark:bg-gray-950 px-3 py-2 text-xs focus:outline-none focus:border-indigo-650 disabled:bg-gray-100"
                      />
                    </div>
                    <div className="flex items-center mt-4">
                      <input
                        type="checkbox"
                        name="current"
                        id={`exp-curr-${index}`}
                        checked={exp.current}
                        onChange={(e) => handleExperienceChange(index, e)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 mr-2"
                      />
                      <label htmlFor={`exp-curr-${index}`} className="text-xs font-bold text-gray-500">I currently work here</label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pb-12">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition shadow shadow-indigo-150 disabled:opacity-50"
          >
            {loading ? (
              <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin block"></span>
            ) : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
