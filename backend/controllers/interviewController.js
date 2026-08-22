const Interview = require('../models/Interview');
const Notification = require('../models/Notification');
const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Schedule an interview with a candidate
// @route   POST /api/interviews
// @access  Private (Recruiter only)
const scheduleInterview = async (req, res, next) => {
  const { candidateId, jobId, date, time, type, meetingLink, notes } = req.body;

  if (!candidateId || !jobId || !date || !time || !type) {
    res.status(400);
    return next(new Error('Please fill in all required fields (candidateId, jobId, date, time, type)'));
  }

  try {
    // Verify job exists
    const job = await Job.findById(jobId).populate('company', 'name');
    if (!job) {
      res.status(404);
      return next(new Error('Job not found'));
    }

    // Verify candidate exists
    const candidate = await User.findById(candidateId);
    if (!candidate) {
      res.status(404);
      return next(new Error('Candidate not found'));
    }

    // Create interview
    const interview = await Interview.create({
      candidate: candidateId,
      recruiter: req.user._id,
      job: jobId,
      date,
      time,
      type,
      meetingLink,
      notes,
      status: 'Scheduled'
    });

    // Create notification for candidate
    await Notification.create({
      user: candidateId,
      title: 'Interview Scheduled',
      message: `You have been scheduled for a ${type} interview for the role '${job.title}' with ${job.company?.name || 'Recruiter'} on ${new Date(date).toLocaleDateString()} at ${time}.`,
      type: 'info'
    });

    res.status(201).json({
      success: true,
      message: 'Interview scheduled successfully',
      data: interview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's interviews
// @route   GET /api/interviews/my
// @access  Private (Seeker/Recruiter)
const getMyInterviews = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'seeker') {
      query.candidate = req.user._id;
    } else if (req.user.role === 'recruiter') {
      query.recruiter = req.user._id;
    }

    const interviews = await Interview.find(query)
      .populate('candidate', 'name email phone location')
      .populate('recruiter', 'name email phone')
      .populate({
        path: 'job',
        select: 'title',
        populate: { path: 'company', select: 'name logo' }
      })
      .sort({ date: 1, time: 1 }); // Sorted by date ascending (soonest first)

    res.status(200).json({
      success: true,
      count: interviews.length,
      message: 'Interviews retrieved successfully',
      data: interviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update interview details or status
// @route   PUT /api/interviews/:id
// @access  Private (Recruiter only)
const updateInterviewStatus = async (req, res, next) => {
  const { status, date, time, meetingLink, notes } = req.body;

  try {
    const interview = await Interview.findById(req.params.id)
      .populate('job', 'title')
      .populate('recruiter', 'name');

    if (!interview) {
      res.status(404);
      return next(new Error('Interview record not found'));
    }

    // Verify ownership
    if (interview.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      return next(new Error('You are not authorized to update this interview schedule'));
    }

    // Update details
    interview.status = status || interview.status;
    interview.date = date || interview.date;
    interview.time = time || interview.time;
    interview.meetingLink = meetingLink !== undefined ? meetingLink : interview.meetingLink;
    interview.notes = notes !== undefined ? notes : interview.notes;

    await interview.save();

    // Notify candidate of update
    await Notification.create({
      user: interview.candidate,
      title: status === 'Cancelled' ? 'Interview Cancelled' : 'Interview Schedule Updated',
      message: status === 'Cancelled' 
        ? `Your interview for the role '${interview.job?.title}' has been cancelled.`
        : `The interview details for the role '${interview.job?.title}' have been modified. New date: ${new Date(interview.date).toLocaleDateString()} at ${interview.time}.`,
      type: status === 'Cancelled' ? 'warning' : 'info'
    });

    res.status(200).json({
      success: true,
      message: 'Interview updated successfully',
      data: interview
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  scheduleInterview,
  getMyInterviews,
  updateInterviewStatus
};
