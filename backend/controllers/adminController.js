const User = require('../models/User');
const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');

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

    res.status(200).json({
      success: true,
      message: 'Admin stats retrieved successfully',
      data: {
        seekersCount,
        recruitersCount,
        jobsCount,
        companiesCount,
        applicationsCount
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

module.exports = {
  getAdminStats,
  getAllUsers,
  deleteUser,
  getAllApplications
};
