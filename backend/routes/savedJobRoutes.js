const express = require('express');
const { toggleSavedJob, getMySavedJobs, removeSavedJob } = require('../controllers/savedJobController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('seeker'));

router.route('/')
  .get(getMySavedJobs)
  .post(toggleSavedJob);

router.route('/:jobId')
  .delete(removeSavedJob);

module.exports = router;
