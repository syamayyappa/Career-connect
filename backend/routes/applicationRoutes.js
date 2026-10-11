const express = require('express');
const {
  applyForJob,
  getMyApplications,
  getJobApplications,
  getRecruiterApplications,
  updateApplicationStatus,
  getRecruiterStats
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

const { uploadResumeFile } = require('../middleware/fileUpload');
const router = express.Router();

router.post('/', protect, authorize('seeker'), (req, res, next) => {
  uploadResumeFile.single('resume')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, applyForJob);
router.get('/my', protect, authorize('seeker'), getMyApplications);
router.get('/recruiter', protect, authorize('recruiter'), getRecruiterApplications);
router.get('/recruiter/stats', protect, authorize('recruiter'), getRecruiterStats);
router.get('/job/:jobId', protect, authorize('recruiter'), getJobApplications);
router.put('/:id/status', protect, authorize('recruiter'), updateApplicationStatus);

module.exports = router;
