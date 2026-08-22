const express = require('express');
const {
  getAdminStats,
  getAllUsers,
  deleteUser,
  getAllApplications,
  createReport,
  getAllReports,
  resolveReport
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Allow any logged-in user to submit a moderation report
router.post('/reports', protect, createReport);

// Admin-only management endpoints
router.get('/stats', protect, authorize('admin'), getAdminStats);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
router.get('/applications', protect, authorize('admin'), getAllApplications);
router.get('/reports', protect, authorize('admin'), getAllReports);
router.put('/reports/:id', protect, authorize('admin'), resolveReport);

module.exports = router;
