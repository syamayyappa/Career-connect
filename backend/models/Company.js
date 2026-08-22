const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  logo: {
    type: String
  },
  // Expanded fields from the master specification
  industry: {
    type: String,
    trim: true
  },
  employees: {
    type: Number,
    default: 1
  },
  foundedYear: {
    type: Number
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Company', CompanySchema);
