const express = require('express');
const { 
  getRecommendedJobs, 
  checkAtsScore, 
  enhanceBulletPoint, 
  matchCareerPathAndSkills 
} = require('../controllers/aiController');
const { protect, authorize, optionalProtect } = require('../middleware/authMiddleware');
const { uploadResumeFile } = require('../middleware/fileUpload');

const router = express.Router();

// Seeker job recommendations
router.get('/jobs', protect, authorize('seeker'), getRecommendedJobs);

// ATS Resume Checker (can be accessed with uploaded file or text, public or protected)
router.post('/ats-check', (req, res, next) => {
  uploadResumeFile.single('resume')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, checkAtsScore);

// Resume Career Matcher & Skill Gap Analyzer (Primary Aim)
router.post('/resume-career-match', optionalProtect, (req, res, next) => {
  uploadResumeFile.single('resume')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, matchCareerPathAndSkills);

// AI Bullet point enhancer
router.post('/bullet-enhance', enhanceBulletPoint);

module.exports = router;

