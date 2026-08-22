const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');

// @desc    Toggle save/bookmark status on a job
// @route   POST /api/saved-jobs
// @access  Private (Seeker only)
const toggleSavedJob = async (req, res, next) => {
  const { jobId } = req.body;

  if (!jobId) {
    res.status(400);
    return next(new Error('Please provide a jobId'));
  }

  try {
    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404);
      return next(new Error('Job not found'));
    }

    // Check if already bookmarked
    const existing = await SavedJob.findOne({ user: req.user._id, job: jobId });

    if (existing) {
      // If bookmarked, remove bookmark
      await existing.deleteOne();
      return res.status(200).json({
        success: true,
        message: 'Job removed from saved bookmarks',
        saved: false
      });
    } else {
      // If not bookmarked, add bookmark
      const bookmark = await SavedJob.create({
        user: req.user._id,
        job: jobId
      });
      return res.status(201).json({
        success: true,
        message: 'Job added to saved bookmarks successfully',
        saved: true,
        data: bookmark
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get seeker's bookmarked saved jobs
// @route   GET /api/saved-jobs
// @access  Private (Seeker only)
const getMySavedJobs = async (req, res, next) => {
  try {
    const savedJobs = await SavedJob.find({ user: req.user._id })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name logo location' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: savedJobs.length,
      message: 'Bookmarked saved jobs fetched successfully',
      data: savedJobs
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  toggleSavedJob,
  getMySavedJobs
};
