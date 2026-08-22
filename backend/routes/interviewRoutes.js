const express = require('express');
const {
  scheduleInterview,
  getMyInterviews,
  updateInterviewStatus
} = require('../controllers/interviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getMyInterviews)
  .post(authorize('recruiter'), scheduleInterview);

router.route('/:id')
  .put(authorize('recruiter'), updateInterviewStatus);

module.exports = router;
