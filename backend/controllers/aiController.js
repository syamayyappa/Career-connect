const Job = require('../models/Job');
const User = require('../models/User');

// Helper to normalize and standardize skill string
const normalizeSkill = (skill) => {
  if (!skill) return '';
  return skill
    .toLowerCase()
    .trim()
    .replace(/[.\-\s]/g, ''); // standardizes 'react.js', 'react-js', 'react js' to 'reactjs'
};

// @desc    Get recommended jobs for the current seeker based on skills
// @route   GET /api/recommendations/jobs
// @access  Private (Seeker only)
const getRecommendedJobs = async (req, res, next) => {
  try {
    // 1. Fetch user to retrieve profile skills
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }

    const userSkills = user.skills || [];
    if (userSkills.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        message: 'Please add technical skills to your profile to receive recommended jobs.',
        data: []
      });
    }

    // 2. Fetch all jobs and populate company
    const jobs = await Job.find().populate('company', 'name description logo website location');

    // 3. Normalize user skills for fast intersection checks
    const normalizedUserSkills = userSkills.map(normalizeSkill).filter(s => s !== '');
    const userSkillsSet = new Set(normalizedUserSkills);

    // 4. Calculate match scores
    const recommendations = [];

    jobs.forEach(job => {
      const requiredSkills = job.skills || [];
      if (requiredSkills.length === 0) return;

      const normalizedJobSkills = requiredSkills.map(normalizeSkill).filter(s => s !== '');
      
      let matchCount = 0;
      const matchedSkills = [];

      requiredSkills.forEach((skill, index) => {
        const norm = normalizedJobSkills[index];
        if (userSkillsSet.has(norm)) {
          matchCount++;
          matchedSkills.push(skill);
        }
      });

      const matchScore = Math.round((matchCount / requiredSkills.length) * 100);

      // Return recommended jobs with at least some skill overlap
      if (matchScore > 0) {
        // Convert to plain object to attach custom match fields
        const jobObj = job.toObject();
        recommendations.push({
          ...jobObj,
          matchScore,
          matchedSkills,
          // Calculate missing skills list
          missingSkills: requiredSkills.filter(skill => !matchedSkills.includes(skill))
        });
      }
    });

    // 5. Rank by match score descending
    recommendations.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      count: recommendations.length,
      message: 'Recommended jobs ranked successfully',
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecommendedJobs
};
