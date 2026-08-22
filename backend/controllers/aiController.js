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

// Helper to calculate candidate's total years of experience from profile records
const calculateCandidateExperienceYears = (experienceList) => {
  if (!experienceList || experienceList.length === 0) return 0;
  
  let totalMs = 0;
  experienceList.forEach(exp => {
    const from = exp.from ? new Date(exp.from) : new Date();
    const to = exp.current ? new Date() : (exp.to ? new Date(exp.to) : new Date());
    const diff = to.getTime() - from.getTime();
    if (diff > 0) {
      totalMs += diff;
    }
  });

  const totalYears = totalMs / (1000 * 60 * 60 * 24 * 365.25);
  return Math.round(totalYears * 10) / 10; // Round to 1 decimal place
};

// Helper to parse required experience years from job experience string
const parseJobRequiredYears = (jobExpString) => {
  if (!jobExpString) return 0;
  
  const lower = jobExpString.toLowerCase();
  
  // Look for exact numbers in strings like "3+ years", "5 years required"
  const match = jobExpString.match(/\d+/);
  if (match) {
    return parseInt(match[0], 10);
  }

  // Fallback defaults for standard tier names
  if (lower.includes('entry') || lower.includes('junior')) return 1;
  if (lower.includes('mid')) return 3;
  if (lower.includes('senior')) return 5;
  if (lower.includes('lead') || lower.includes('architect')) return 8;

  return 0;
};

// @desc    Get recommended jobs for the current seeker based on multi-factor weighted score
// @route   GET /api/recommendations/jobs
// @access  Private (Seeker only)
const getRecommendedJobs = async (req, res, next) => {
  try {
    // 1. Fetch user to retrieve profile parameters
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

    // Calculate candidate experience years
    const candidateExpYears = calculateCandidateExperienceYears(user.experience);

    // 2. Fetch all active jobs and populate company
    const jobs = await Job.find({ status: 'Active' }).populate('company', 'name description logo website location');

    // Normalize user skills for fast intersection checks
    const normalizedUserSkills = userSkills.map(normalizeSkill).filter(s => s !== '');
    const userSkillsSet = new Set(normalizedUserSkills);

    // 3. Compute score matches
    const recommendations = [];

    jobs.forEach(job => {
      // --- FACTOR 1: SKILL MATCH (60% weight) ---
      const requiredSkills = job.skills || [];
      let skillScore = 0;
      const matchedSkills = [];

      if (requiredSkills.length > 0) {
        const normalizedJobSkills = requiredSkills.map(normalizeSkill).filter(s => s !== '');
        let matchCount = 0;

        requiredSkills.forEach((skill, index) => {
          const norm = normalizedJobSkills[index];
          if (userSkillsSet.has(norm)) {
            matchCount++;
            matchedSkills.push(skill);
          }
        });
        skillScore = (matchCount / requiredSkills.length) * 100;
      }

      // --- FACTOR 2: EXPERIENCE MATCH (20% weight) ---
      const requiredExpYears = parseJobRequiredYears(job.experience);
      let expScore = 100;

      if (requiredExpYears > 0) {
        if (candidateExpYears >= requiredExpYears) {
          expScore = 100;
        } else {
          expScore = (candidateExpYears / requiredExpYears) * 100;
        }
      }

      // --- FACTOR 3: LOCATION MATCH (10% weight) ---
      let locationScore = 0;
      const jobLoc = job.location.toLowerCase();
      const jobTypeLower = job.jobType.toLowerCase();
      const prefLoc = user.preferredLocation ? user.preferredLocation.toLowerCase() : '';

      if (jobLoc.includes('remote') || jobTypeLower.includes('remote')) {
        locationScore = 100;
      } else if (prefLoc && (jobLoc.includes(prefLoc) || prefLoc.includes(jobLoc))) {
        locationScore = 100;
      } else if (user.location && (jobLoc.includes(user.location.toLowerCase()) || user.location.toLowerCase().includes(jobLoc))) {
        locationScore = 100;
      }

      // --- FACTOR 4: PREFERENCE MATCH (10% weight) ---
      let preferenceScore = 0;
      const prefType = user.preferredJobType ? user.preferredJobType.toLowerCase() : '';
      
      if (!prefType || prefType === jobTypeLower) {
        preferenceScore = 100;
      }

      // --- FINAL WEIGHTED SCORE CALCULATION ---
      const finalScore = Math.round(
        (0.60 * skillScore) +
        (0.20 * expScore) +
        (0.10 * locationScore) +
        (0.10 * preferenceScore)
      );

      // Include job in recommendations if there is some matching compatibility (>0%)
      if (finalScore > 0) {
        const jobObj = job.toObject();
        recommendations.push({
          ...jobObj,
          matchScore: finalScore,
          matchedSkills,
          missingSkills: requiredSkills.filter(skill => !matchedSkills.includes(skill)),
          matchDetails: {
            skillMatch: Math.round(skillScore),
            experienceMatch: Math.round(expScore),
            locationMatch: Math.round(locationScore),
            preferenceMatch: Math.round(preferenceScore),
            candidateExpYears,
            requiredExpYears
          }
        });
      }
    });

    // 4. Sort descending by score
    recommendations.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      count: recommendations.length,
      message: 'AI recommendations computed successfully',
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecommendedJobs
};
