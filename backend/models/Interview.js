const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Interview date is required']
  },
  time: {
    type: String, // e.g. "10:30 AM"
    required: [true, 'Interview time is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Interview type is required'],
    enum: ['Technical', 'HR', 'Behavioral', 'Managerial']
  },
  meetingLink: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Interview', InterviewSchema);
