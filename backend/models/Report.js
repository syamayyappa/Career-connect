const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetType: {
    type: String,
    required: true,
    enum: ['Job', 'User']
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  reason: {
    type: String,
    required: [true, 'Reason for report is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Resolved', 'Dismissed'],
    default: 'Pending'
  }
}, {
  timestamps: { createdAt: true, updatedAt: true }
});

module.exports = mongoose.model('Report', ReportSchema);
