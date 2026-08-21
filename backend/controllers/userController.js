const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

// Predefined Skills Dictionary for Keyword Extraction
const SKILLS_DICTIONARY = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust', 'php', 'swift', 'kotlin',
  'react', 'angular', 'vue', 'redux', 'html', 'css', 'tailwindcss', 'bootstrap', 'sass',
  'node', 'express', 'django', 'flask', 'fastapi', 'spring', 'laravel',
  'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'github', 'jenkins', 'ci/cd', 'terraform',
  'machine learning', 'deep learning', 'nlp', 'ai', 'data science', 'statistics', 'rest api', 'graphql'
];

const extractSkillsFromText = (text) => {
  const foundSkills = [];
  const lowerText = text.toLowerCase();

  SKILLS_DICTIONARY.forEach(skill => {
    // Escape special regex characters
    const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    
    // Check for word boundary of the skill
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    
    if (regex.test(lowerText)) {
      // Format skill cleanly (e.g. capitalize)
      const formatted = skill
        .split(' ')
        .map(w => w === 'ai' || w === 'nlp' || w === 'sql' || w === 'jwt' || w === 'gcp' || w === 'aws'
          ? w.toUpperCase() 
          : w.charAt(0).toUpperCase() + w.slice(1)
        )
        .join(' ');
      foundSkills.push(formatted);
    }
  });

  return foundSkills;
};

// @desc    Get user profile details
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }
    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile details
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }

    // Update basic fields if provided
    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.location = req.body.location !== undefined ? req.body.location : user.location;
    user.skills = req.body.skills !== undefined ? req.body.skills : user.skills;
    user.education = req.body.education !== undefined ? req.body.education : user.education;
    user.experience = req.body.experience !== undefined ? req.body.experience : user.experience;
    user.profileImage = req.body.profileImage !== undefined ? req.body.profileImage : user.profileImage;

    // Check if password update is requested
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    
    // Convert Mongoose doc and remove password
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: userResponse
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload seeker resume & extract skills
// @route   POST /api/users/resume
// @access  Private (Seeker only)
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      return next(new Error('Please upload a resume file (PDF, DOC, DOCX)'));
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }

    // Save resume filename/path relative to uploads
    user.resume = `/uploads/${req.file.filename}`;

    let extractedSkills = [];
    
    // If PDF uploaded, extract text and parse skills
    if (req.file.mimetype === 'application/pdf') {
      try {
        const dataBuffer = fs.readFileSync(req.file.path);
        const parsedPdf = await pdfParse(dataBuffer);
        
        extractedSkills = extractSkillsFromText(parsedPdf.text);
        
        // Merge unique skills into user profile
        if (extractedSkills.length > 0) {
          const uniqueMergedSkills = Array.from(
            new Set([...(user.skills || []), ...extractedSkills])
          );
          user.skills = uniqueMergedSkills;
        }
      } catch (parseError) {
        console.error('Resume PDF text parsing error:', parseError);
        // Carry on without failing response
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: extractedSkills.length > 0 
        ? `Resume uploaded. AI successfully identified & added these skills: ${extractedSkills.join(', ')}`
        : 'Resume uploaded successfully.',
      data: {
        resumeUrl: user.resume,
        extractedSkills,
        skills: user.skills
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  uploadResume
};
