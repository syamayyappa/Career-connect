const express = require('express');
const { getUserProfile, updateUserProfile, uploadResume } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadResumeFile } = require('../middleware/fileUpload');

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/resume', protect, authorize('seeker'), uploadResumeFile.single('resume'), uploadResume);

module.exports = router;
