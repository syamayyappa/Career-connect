const express = require('express');
const {
  createCompany,
  getCompanyById,
  updateCompany,
  getRecruiterCompanies
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, authorize('recruiter'), createCompany);

router.route('/recruiter/my')
  .get(protect, authorize('recruiter'), getRecruiterCompanies);

router.route('/:id')
  .get(getCompanyById)
  .put(protect, authorize('recruiter'), updateCompany);

module.exports = router;
