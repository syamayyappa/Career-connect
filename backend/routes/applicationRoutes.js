const express = require('express');
const {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  getRecruiterStats
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('seeker'), applyForJob);
router.get('/my', protect, authorize('seeker'), getMyApplications);
router.get('/recruiter/stats', protect, authorize('recruiter'), getRecruiterStats);
router.get('/job/:jobId', protect, authorize('recruiter'), getJobApplications);
router.put('/:id/status', protect, authorize('recruiter'), updateApplicationStatus);

module.exports = router;
