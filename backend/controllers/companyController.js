const Company = require('../models/Company');

// @desc    Register a new company profile
// @route   POST /api/companies
// @access  Private (Recruiter only)
const createCompany = async (req, res, next) => {
  const { name, description, website, location, logo } = req.body;

  if (!name) {
    res.status(400);
    return next(new Error('Company name is required'));
  }

  try {
    // Check if company name already exists
    const companyExists = await Company.findOne({ name });
    if (companyExists) {
      res.status(400);
      return next(new Error('A company with this name is already registered'));
    }

    const company = await Company.create({
      name,
      description,
      website,
      location,
      logo, // Can be updated later or filled with a file path
      recruiter: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Company profile created successfully',
      data: company
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get company profile details
// @route   GET /api/companies/:id
// @access  Public
const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate('recruiter', 'name email phone');

    if (!company) {
      res.status(404);
      return next(new Error('Company profile not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Company details retrieved successfully',
      data: company
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update company profile details
// @route   PUT /api/companies/:id
// @access  Private (Recruiter only)
const updateCompany = async (req, res, next) => {
  try {
    let company = await Company.findById(req.params.id);

    if (!company) {
      res.status(404);
      return next(new Error('Company profile not found'));
    }

    // Verify authorized recruiter owner
    if (company.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      return next(new Error('You are not authorized to update this company profile'));
    }

    company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Company profile updated successfully',
      data: company
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all companies created by the logged-in recruiter
// @route   GET /api/companies/recruiter/my
// @access  Private (Recruiter only)
const getRecruiterCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find({ recruiter: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: companies.length,
      message: 'Recruiter companies fetched successfully',
      data: companies
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCompany,
  getCompanyById,
  updateCompany,
  getRecruiterCompanies
};
