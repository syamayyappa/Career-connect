const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Seeker only)
const applyForJob = async (req, res, next) => {
  const { jobId, coverLetter } = req.body;

  try {
    // 1. Verify Job exists
    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404);
      return next(new Error('Job not found'));
    }

    // 2. Fetch User Profile to get their default resume
    const user = await User.findById(req.user._id);
    if (!user || !user.resume) {
      res.status(400);
      return next(new Error('Please upload a resume to your profile before applying for jobs'));
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

    // 4. Create application
    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      recruiter: job.recruiter,
      resume: user.resume, // Save a copy of current resume URL
      coverLetter,
      status: 'Applied'
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    // Catch Mongoose duplicate key error index if hit concurrently
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

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  getRecruiterStats
};
