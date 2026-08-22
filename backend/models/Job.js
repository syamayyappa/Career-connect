const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    trim: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  jobType: {
    type: String,
    required: [true, 'Job type is required'],
    enum: ['Full-time', 'Part-time', 'Internship', 'Remote', 'Hybrid']
  },
  experience: {
    type: String,
    required: [true, 'Experience requirement is required']
  },
  salary: {
    type: Number,
    required: [true, 'Salary is required']
  },
  skills: [{
    type: String,
    trim: true
  }],
  responsibilities: [{
    type: String,
    trim: true
  }],
  qualifications: [{
    type: String,
    trim: true
  }],
  // Expanded fields from the master specification
  benefits: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['Draft', 'Active', 'Closed'],
    default: 'Active'
  },
  deadline: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', JobSchema);
