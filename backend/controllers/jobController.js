const Job = require('../models/Job');
const Company = require('../models/Company');

// @desc    Create a new job post
// @route   POST /api/jobs
// @access  Private (Recruiter only)
const createJob = async (req, res, next) => {
  const {
    title,
    description,
    companyId,
    location,
    jobType,
    experience,
    salary,
    skills,
    responsibilities,
    qualifications,
    deadline
  } = req.body;

  try {
    // Verify company exists
    const company = await Company.findById(companyId);
    if (!company) {
      res.status(404);
      return next(new Error('Company not found'));
    }

    // Verify company belongs to this recruiter
    if (company.recruiter.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('You can only post jobs for companies you own'));
    }

    // Process skills into array of strings (trimming spaces)
    const skillsArray = Array.isArray(skills)
      ? skills.map(s => s.trim())
      : typeof skills === 'string'
        ? skills.split(',').map(s => s.trim()).filter(s => s !== '')
        : [];

    const job = await Job.create({
      title,
      description,
      company: companyId,
      recruiter: req.user._id,
      location,
      jobType,
      experience,
      salary,
      skills: skillsArray,
      responsibilities: Array.isArray(responsibilities) ? responsibilities : responsibilities?.split('\n').filter(r => r.trim() !== '') || [],
      qualifications: Array.isArray(qualifications) ? qualifications : qualifications?.split('\n').filter(q => q.trim() !== '') || [],
      deadline
    });

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs (with search & filters)
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res, next) => {
  try {
    const { search, location, jobType, minSalary, experience } = req.query;
    
    // Build query filters using soft OR matching so partial matches are displayed
    let queryFilters = {};
    let orConditions = [];

    if (search) {
      orConditions.push({ title: { $regex: search, $options: 'i' } });
      orConditions.push({ skills: { $regex: search, $options: 'i' } });
    }
    if (location) {
      orConditions.push({ location: { $regex: location, $options: 'i' } });
    }
    if (jobType) {
      orConditions.push({ jobType: { $regex: jobType, $options: 'i' } });
    }
    if (experience) {
      orConditions.push({ experience: { $regex: experience, $options: 'i' } });
    }
    if (minSalary) {
      orConditions.push({ salary: { $gte: Number(minSalary) } });
    }

    if (orConditions.length > 0) {
      queryFilters.$or = orConditions;
    }

    // Find and populate company details
    const jobs = await Job.find(queryFilters)
      .populate('company', 'name description logo website location')
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      success: true,
      count: jobs.length,
      message: 'Jobs fetched successfully',
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single job details
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company', 'name description logo website location')
      .populate('recruiter', 'name email phone');

    if (!job) {
      res.status(404);
      return next(new Error('Job not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Job details retrieved successfully',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a job post
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter only)
const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404);
      return next(new Error('Job not found'));
    }

    // Authorize: Only the owner (recruiter) can modify
    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      return next(new Error('You are not authorized to update this job'));
    }

    // Process skills if updated
    if (req.body.skills) {
      req.body.skills = Array.isArray(req.body.skills)
        ? req.body.skills.map(s => s.trim())
        : req.body.skills.split(',').map(s => s.trim()).filter(s => s !== '');
    }

    // Update job in DB
    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a job post
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter/Admin only)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404);
      return next(new Error('Job not found'));
    }

    // Authorize: Recruiter owner or Admin
    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      return next(new Error('You are not authorized to delete this job'));
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs posted by the logged-in recruiter
// @route   GET /api/jobs/recruiter/my
// @access  Private (Recruiter only)
const getRecruiterJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id })
      .populate('company', 'name logo')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      message: 'Recruiter jobs fetched successfully',
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getRecruiterJobs
};
