const User = require('../models/User');
const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');
const Report = require('../models/Report');

// @desc    Get admin statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getAdminStats = async (req, res, next) => {
  try {
    const seekersCount = await User.countDocuments({ role: 'seeker' });
    const recruitersCount = await User.countDocuments({ role: 'recruiter' });
    const jobsCount = await Job.countDocuments();
    const companiesCount = await Company.countDocuments();
    const applicationsCount = await Application.countDocuments();
    const reportsCount = await Report.countDocuments({ status: 'Pending' });

    res.status(200).json({
      success: true,
      message: 'Admin stats retrieved successfully',
      data: {
        seekersCount,
        recruitersCount,
        jobsCount,
        companiesCount,
        applicationsCount,
        reportsCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (seekers and recruiters)
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      message: 'All users retrieved successfully',
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }

    if (user.role === 'admin') {
      res.status(400);
      return next(new Error('Cannot delete admin account'));
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications
// @route   GET /api/admin/applications
// @access  Private (Admin only)
const getAllApplications = async (req, res, next) => {
  try {
    const applications = await Application.find()
      .populate('applicant', 'name email')
      .populate({
        path: 'job',
        select: 'title',
        populate: { path: 'company', select: 'name' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      message: 'All applications retrieved successfully',
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

// --- Moderation Reports (Expanded Features) ---

// @desc    Create a moderation report
// @route   POST /api/admin/reports
// @access  Private (Seeker/Recruiter/Admin)
const createReport = async (req, res, next) => {
  const { targetType, targetId, reason } = req.body;

  if (!targetType || !targetId || !reason) {
    res.status(400);
    return next(new Error('Please fill in targetType, targetId, and reason'));
  }

  try {
    const report = await Report.create({
      reporter: req.user._id,
      targetType,
      targetId,
      reason,
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully. Administrators will review this shortly.',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all moderation reports
// @route   GET /api/admin/reports
// @access  Private (Admin only)
const getAllReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate('reporter', 'name email')
      .sort({ createdAt: -1 });

    // Populate actual target details manually depending on type
    const populatedReports = [];

    for (const rep of reports) {
      const repObj = rep.toObject();
      
      if (rep.targetType === 'Job') {
        const job = await Job.findById(rep.targetId).populate('company', 'name');
        repObj.targetDetails = job ? { title: job.title, company: job.company?.name } : null;
      } else if (rep.targetType === 'User') {
        const user = await User.findById(rep.targetId);
        repObj.targetDetails = user ? { name: user.name, role: user.role } : null;
      }

      populatedReports.push(repObj);
    }

    res.status(200).json({
      success: true,
      count: populatedReports.length,
      message: 'Reports retrieved successfully',
      data: populatedReports
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resolve or dismiss a moderation report
// @route   PUT /api/admin/reports/:id
// @access  Private (Admin only)
const resolveReport = async (req, res, next) => {
  const { status } = req.body; // 'Resolved' or 'Dismissed'

  if (!status || !['Resolved', 'Dismissed'].includes(status)) {
    res.status(400);
    return next(new Error('Please provide status update (Resolved or Dismissed)'));
  }

  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      res.status(404);
      return next(new Error('Report not found'));
    }

    report.status = status;
    await report.save();

    // If report is resolved and targeting a job, set job status to Draft or delete it
    if (status === 'Resolved' && report.targetType === 'Job') {
      const job = await Job.findById(report.targetId);
      if (job) {
        // Change job status to Draft so it won't show in seekers list
        job.status = 'Draft';
        await job.save();
      }
    }

    res.status(200).json({
      success: true,
      message: `Report status updated to '${status}' successfully`,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  deleteUser,
  getAllApplications,
  createReport,
  getAllReports,
  resolveReport
};
