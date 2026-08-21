const express = require('express');
const {
  getAdminStats,
  getAllUsers,
  deleteUser,
  getAllApplications
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected and require admin role authorization
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/applications', getAllApplications);

module.exports = router;
