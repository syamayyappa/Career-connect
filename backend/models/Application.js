const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resume: {
    type: String, // Store resume file path or URL
    default: ''
  },
  coverLetter: {
    type: String,
    trim: true,
    default: ''
  },
  // Candidate Profile Snapshot & Application Details
  fullName: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  experienceLevel: {
    type: String,
    enum: ['Fresher', 'Experienced'],
    default: 'Fresher'
  },
  yearsOfExperience: {
    type: String,
    default: '0'
  },
  currentlyWorking: {
    type: Boolean,
    default: false
  },
  currentCompany: {
    type: String,
    default: ''
  },
  currentRole: {
    type: String,
    default: ''
  },
  noticePeriod: {
    type: String,
    default: 'Immediate'
  },
  expectedSalary: {
    type: String,
    default: ''
  },
  skills: [{
    type: String
  }],
  highestEducation: {
    type: String,
    default: ''
  },
  college: {
    type: String,
    default: ''
  },
  graduationYear: {
    type: String,
    default: ''
  },
  linkedinUrl: {
    type: String,
    default: ''
  },
  portfolioUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Selected'],
    default: 'Applied'
  }
}, {
  timestamps: { createdAt: 'appliedAt', updatedAt: true }
});

// Compound unique index to prevent the same user from applying to the same job multiple times
ApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);

