import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { User, Phone, MapPin, Award, BookOpen, Briefcase, Plus, Trash2, CheckCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateProfileState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Core Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    skills: '', // Keep as comma-separated string for editing
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
        skills: user.skills ? user.skills.join(', ') : '',
        education: user.education || [],
        experience: user.experience || []
      });
    }
  }, [user]);

  // Handle standard input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        skills: skillsArray,
        education: formData.education,
        experience: formData.experience
      });

      if (data.success) {
        setSuccessMsg('Profile updated successfully!');
        updateProfileState(data.data);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile. Please check inputs.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure your personal information, skills, and background</p>
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
          <Trash2 className="h-5 w-5 text-red-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

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
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-650"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-450 uppercase mb-2 dark:text-gray-300">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-650"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-450 uppercase mb-2 dark:text-gray-300">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-650"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Skills */}
        <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-600" /> Key Skills
          </h2>
          <p className="text-xs text-gray-400 mb-6">
            Input skills separated by commas. These will be normalized and used to calculate your AI recommendation match score.
          </p>
          <div>
            <textarea
              name="skills"
              rows={2}
              value={formData.skills}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-4 py-3 text-sm focus:outline-none focus:border-indigo-650"
              placeholder="e.g. Python, SQL, JavaScript, React, Node.js"
            />
            {formData.skills && (
              <div className="flex flex-wrap gap-2 mt-4">
                {formData.skills.split(',').map((skill, index) => {
                  const trimmed = skill.trim();
                  if (!trimmed) return null;
                  return (
                    <span key={index} className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold">
                      {trimmed}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Education History */}
        <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-600" /> Education History
            </h2>
            <button
              type="button"
              onClick={addEducationBlock}
              className="px-3 py-1.5 bg-indigo-50 border border-indigo-150 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Education
            </button>
          </div>

          {formData.education.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-gray-100 rounded-2xl text-gray-400 text-xs">
              No education history added yet. Click above to add your school credentials.
            </div>
          ) : (
            <div className="space-y-6">
              {formData.education.map((edu, index) => (
                <div key={index} className="p-4 border border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50/20 relative space-y-4">
                  <button
                    type="button"
                    onClick={() => removeEducationBlock(index)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition"
                    title="Remove Section"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1">School/University</label>
                      <input
                        type="text"
                        name="school"
                        required
                        value={edu.school}
                        onChange={(e) => handleEducationChange(index, e)}
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-3 py-2 text-xs focus:outline-none focus:border-indigo-650"
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
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-3 py-2 text-xs focus:outline-none focus:border-indigo-650"
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
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-3 py-2 text-xs focus:outline-none focus:border-indigo-650"
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
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-3 py-2 text-xs focus:outline-none focus:border-indigo-650"
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
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-3 py-2 text-xs focus:outline-none focus:border-indigo-650 disabled:bg-gray-100"
                      />
                    </div>
                    <div className="flex items-center mt-4">
                      <input
                        type="checkbox"
                        name="current"
                        id={`edu-curr-${index}`}
                        checked={edu.current}
                        onChange={(e) => handleEducationChange(index, e)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 mr-2"
                      />
                      <label htmlFor={`edu-curr-${index}`} className="text-xs font-bold text-gray-500">I am currently studying here</label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 4: Work Experience */}
        <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-indigo-600" /> Work Experience
            </h2>
            <button
              type="button"
              onClick={addExperienceBlock}
              className="px-3 py-1.5 bg-indigo-50 border border-indigo-150 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Experience
            </button>
          </div>

          {formData.experience.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-gray-100 rounded-2xl text-gray-400 text-xs">
              No work experience added yet. Click above to add past roles.
            </div>
          ) : (
            <div className="space-y-6">
              {formData.experience.map((exp, index) => (
                <div key={index} className="p-4 border border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50/20 relative space-y-4">
                  <button
                    type="button"
                    onClick={() => removeExperienceBlock(index)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition"
                    title="Remove Section"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1">Job Title</label>
                      <input
                        type="text"
                        name="title"
                        required
                        value={exp.title}
                        onChange={(e) => handleExperienceChange(index, e)}
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-3 py-2 text-xs focus:outline-none focus:border-indigo-650"
                        placeholder="e.g. Frontend Engineer"
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
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-3 py-2 text-xs focus:outline-none focus:border-indigo-650"
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
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-3 py-2 text-xs focus:outline-none focus:border-indigo-650"
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
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-3 py-2 text-xs focus:outline-none focus:border-indigo-650"
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
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-3 py-2 text-xs focus:outline-none focus:border-indigo-650 disabled:bg-gray-100"
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
