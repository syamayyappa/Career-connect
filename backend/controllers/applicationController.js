const fs = require('fs');
const path = require('path');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Seeker only)
const applyForJob = async (req, res, next) => {
  const {
    jobId,
    coverLetter,
    fullName,
    email,
    phone,
    location,
    experienceLevel,
    yearsOfExperience,
    currentlyWorking,
    currentCompany,
    currentRole,
    noticePeriod,
    expectedSalary,
    skills,
    highestEducation,
    college,
    graduationYear,
    linkedinUrl,
    portfolioUrl
  } = req.body;

  try {
    // 1. Verify Job exists
    const job = await Job.findById(jobId).populate('company', 'name logo');
    if (!job) {
      res.status(404);
      return next(new Error('Job not found'));
    }

    // 2. Fetch User Profile
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }

    // 3. Check if applicant has already applied (Duplicate prevention)
    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: req.user._id
    });

    if (alreadyApplied) {
      res.status(400);
      return next(new Error('You have already applied for this job'));
    }

    // 4. Handle Resume File (Uploaded now or existing in profile)
    let resumePath = user.resume || '';

    if (req.file) {
      resumePath = `/uploads/${req.file.filename}`;
      user.resume = resumePath;

      // Extract skills if PDF
      if (req.file.mimetype === 'application/pdf') {
        try {
          const dataBuffer = fs.readFileSync(req.file.path);
          let extractedText = '';
          const pdfModule = require('pdf-parse');
          if (typeof pdfModule === 'function') {
            const parsedPdf = await pdfModule(dataBuffer);
            extractedText = parsedPdf.text || '';
          } else if (pdfModule.PDFParse) {
            const parser = new pdfModule.PDFParse({ data: dataBuffer });
            const result = await parser.getText();
            extractedText = result.text || '';
          }

          const { extractSkillsFromText } = require('./userController');
          if (typeof extractSkillsFromText === 'function') {
            const extracted = extractSkillsFromText(extractedText);
            if (extracted && extracted.length > 0) {
              user.skills = Array.from(new Set([...(user.skills || []), ...extracted]));
            }
          }
        } catch (pdfErr) {
          console.warn('Application resume parsing note:', pdfErr.message);
        }
      }
    } else if (req.body.resume) {
      resumePath = req.body.resume;
    }

    // 5. Parse Skills
    let parsedSkills = [];
    if (Array.isArray(skills)) {
      parsedSkills = skills;
    } else if (typeof skills === 'string' && skills.trim()) {
      try {
        parsedSkills = JSON.parse(skills);
      } catch (e) {
        parsedSkills = skills.split(',').map(s => s.trim()).filter(Boolean);
      }
    } else if (user.skills && user.skills.length > 0) {
      parsedSkills = user.skills;
    }

    // Update user profile with latest phone / location / skills if not set
    if (phone && !user.phone) user.phone = phone;
    if (location && !user.location) user.location = location;
    if (parsedSkills.length > 0) {
      user.skills = Array.from(new Set([...(user.skills || []), ...parsedSkills]));
    }
    await user.save();

    const isCurrentlyWorking = currentlyWorking === 'true' || currentlyWorking === true;

    // 6. Create application
    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      recruiter: job.recruiter,
      resume: resumePath,
      coverLetter: coverLetter || '',
      fullName: fullName || user.name,
      email: email || user.email,
      phone: phone || user.phone || '',
      location: location || user.location || '',
      experienceLevel: experienceLevel || 'Fresher',
      yearsOfExperience: yearsOfExperience || '0',
      currentlyWorking: isCurrentlyWorking,
      currentCompany: isCurrentlyWorking ? (currentCompany || '') : '',
      currentRole: isCurrentlyWorking ? (currentRole || '') : '',
      noticePeriod: noticePeriod || 'Immediate',
      expectedSalary: expectedSalary || '',
      skills: parsedSkills,
      highestEducation: highestEducation || '',
      college: college || '',
      graduationYear: graduationYear || '',
      linkedinUrl: linkedinUrl || '',
      portfolioUrl: portfolioUrl || '',
      status: 'Applied'
    });

    // 7. Notification for Job Seeker
    try {
      await Notification.create({
        user: req.user._id,
        title: 'Application Submitted Successfully',
        message: `You applied for ${job.title} at ${job.company?.name || 'Company'}. Recruiter will review your profile.`,
        type: 'success'
      });
    } catch (nErr) {
      console.warn('Applicant notification note:', nErr.message);
    }

    // 8. Notification for Recruiter
    try {
      await Notification.create({
        user: job.recruiter,
        title: 'New Candidate Applied',
        message: `${user.name} applied for ${job.title} (${experienceLevel || 'Fresher'}).`,
        type: 'info'
      });
    } catch (rErr) {
      console.warn('Recruiter notification note:', rErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! Recruiter has been notified.',
      data: application
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400);
      return next(new Error('You have already applied for this job'));
    }
    next(error);
  }
};

// @desc    Get seeker's submitted applications
// @route   GET /api/applications/my
// @access  Private (Seeker only)
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: 'job',
        select: 'title location jobType salary skills experience deadline',
        populate: {
          path: 'company',
          select: 'name logo location website'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      message: 'Submitted applications fetched successfully',
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications for a specific job post
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter only)
const getJobApplications = async (req, res, next) => {
  try {
    // 1. Verify Job exists and belongs to this recruiter
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      res.status(404);
      return next(new Error('Job not found'));
    }

    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      return next(new Error('You are not authorized to view applications for this job'));
    }

    // 2. Fetch applications
    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email phone skills education experience location profileImage resume')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      message: 'Job applications retrieved successfully',
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Shortlist, Reject, Select, etc.)
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter/Admin only)
const updateApplicationStatus = async (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    res.status(400);
    return next(new Error('Please provide status update'));
  }

  const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Selected'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    return next(new Error('Invalid application status value'));
  }

  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      res.status(404);
      return next(new Error('Application not found'));
    }

    // Verify authorized recruiter (the one who posted the job or admin)
    if (application.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      return next(new Error('You are not authorized to modify this application status'));
    }

    application.status = status;
    await application.save();

    // Automatically trigger notification for candidate
    try {
      const Notification = require('../models/Notification');
      const job = await Job.findById(application.job);
      let notifType = 'info';
      if (status === 'Shortlisted' || status === 'Selected') notifType = 'success';
      else if (status === 'Rejected') notifType = 'error';
      else if (status === 'Under Review') notifType = 'warning';

      await Notification.create({
        user: application.applicant,
        title: `Application ${status}`,
        message: `Your application for '${job?.title || 'Job'}' has been updated to '${status}'.`,
        type: notifType
      });
    } catch (notifErr) {
      console.warn('Candidate notification note:', notifErr.message);
    }

    res.status(200).json({
      success: true,
      message: `Application status updated to '${status}' successfully`,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recruiter dashboard statistics
// @route   GET /api/applications/recruiter/stats
// @access  Private (Recruiter only)
const getRecruiterStats = async (req, res, next) => {
  try {
    // Total jobs posted by recruiter
    const totalJobs = await Job.countDocuments({ recruiter: req.user._id });

    // Applications received for all jobs posted by recruiter
    const applications = await Application.find({ recruiter: req.user._id });

    const totalApplications = applications.length;
    const shortlistedCount = applications.filter(a => a.status === 'Shortlisted').length;
    const selectedCount = applications.filter(a => a.status === 'Selected').length;
    const reviewCount = applications.filter(a => a.status === 'Under Review').length;
    const rejectedCount = applications.filter(a => a.status === 'Rejected').length;

    res.status(200).json({
      success: true,
      message: 'Recruiter statistics retrieved successfully',
      data: {
        totalJobs,
        totalApplications,
        shortlistedCount,
        selectedCount,
        reviewCount,
        rejectedCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications for the recruiter's jobs
// @route   GET /api/applications/recruiter
// @access  Private (Recruiter only)
const getRecruiterApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ recruiter: req.user._id })
      .populate({
        path: 'job',
        select: 'title location jobType salary skills experience deadline',
        populate: {
          path: 'company',
          select: 'name logo'
        }
      })
      .populate('applicant', 'name email phone skills education experience location profileImage resume')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      message: 'Recruiter applications retrieved successfully',
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplications,
  getRecruiterApplications,
  updateApplicationStatus,
  getRecruiterStats
};
