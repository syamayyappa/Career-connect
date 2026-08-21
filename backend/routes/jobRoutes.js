const express = require('express');
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getRecruiterJobs
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getJobs)
  .post(protect, authorize('recruiter'), createJob);

router.route('/recruiter/my')
  .get(protect, authorize('recruiter'), getRecruiterJobs);

router.route('/:id')
  .get(getJobById)
  .put(protect, authorize('recruiter'), updateJob)
  .delete(protect, authorize('recruiter', 'admin'), deleteJob);

module.exports = router;
