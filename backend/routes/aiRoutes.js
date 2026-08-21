const express = require('express');
const { getRecommendedJobs } = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/jobs', protect, authorize('seeker'), getRecommendedJobs);

module.exports = router;
