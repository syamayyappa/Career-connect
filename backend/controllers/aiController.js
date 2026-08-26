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

const fs = require('fs');
const pdfParse = require('pdf-parse');

// Comprehensive dictionary of action verbs, tech skills, and buzzwords
const POWER_ACTION_VERBS = [
  'accelerated', 'achieved', 'administered', 'analyzed', 'architected', 'automated',
  'built', 'championed', 'collaborated', 'configured', 'constructed', 'coordinated',
  'created', 'decreased', 'delivered', 'deployed', 'designed', 'developed',
  'devised', 'directed', 'documented', 'doubled', 'drove', 'engineered',
  'enhanced', 'established', 'evaluated', 'executed', 'expanded', 'expedited',
  'formulated', 'generated', 'guided', 'headed', 'implemented', 'improved',
  'increased', 'initiated', 'innovated', 'installed', 'instituted', 'integrated',
  'introduced', 'invented', 'launched', 'led', 'managed', 'maximized',
  'mentored', 'minimized', 'modernized', 'negotiated', 'optimized', 'orchestrated',
  'overhauled', 'pioneered', 'planned', 'programmed', 'reduced', 'reengineered',
  'resolved', 'restructured', 'revitalized', 'saved', 'scaled', 'simplified',
  'spearheaded', 'standardized', 'streamlined', 'strengthened', 'structured', 'surpassed',
  'systematized', 'transformed', 'upgraded', 'validated', 'yielded'
];

const BUZZWORDS_CLICHES = [
  'hard worker', 'team player', 'go-getter', 'self-starter', 'detail oriented',
  'think outside the box', 'synergy', 'results-driven', 'fast learner',
  'dynamic', 'motivated', 'passionate', 'proactive', 'hardworking'
];

const SKILL_KEYWORDS_MAP = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'golang', 'rust', 'php', 'swift', 'kotlin',
  'react', 'reactjs', 'angular', 'vue', 'vuejs', 'redux', 'nextjs', 'html', 'html5', 'css', 'css3', 'tailwindcss', 'bootstrap', 'sass',
  'node', 'nodejs', 'express', 'expressjs', 'django', 'flask', 'fastapi', 'spring', 'spring boot', 'laravel', 'asp.net',
  'sql', 'mysql', 'postgresql', 'postgres', 'mongodb', 'redis', 'sqlite', 'oracle', 'nosql', 'prisma', 'sequelize', 'mongoose',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'github', 'gitlab', 'jenkins', 'ci/cd', 'terraform', 'linux',
  'machine learning', 'deep learning', 'nlp', 'ai', 'data science', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch',
  'rest api', 'restful', 'graphql', 'grpc', 'microservices', 'agile', 'scrum', 'jira', 'figma', 'ui/ux', 'unit testing', 'jest', 'cypress'
];

// @desc    Perform comprehensive ATS Resume Check
// @route   POST /api/recommendations/ats-check or POST /api/ai/ats-check
// @access  Public (or Private)
const checkAtsScore = async (req, res, next) => {
  try {
    let resumeText = '';

    // 1. Extract text from uploaded file or request body
    if (req.file) {
      if (req.file.mimetype === 'application/pdf') {
        try {
          const dataBuffer = fs.readFileSync(req.file.path);
          const pdfModule = require('pdf-parse');
          if (typeof pdfModule === 'function') {
            const parsed = await pdfModule(dataBuffer);
            resumeText = parsed.text || '';
          } else if (pdfModule.PDFParse) {
            const parser = new pdfModule.PDFParse({ data: dataBuffer });
            const result = await parser.getText();
            resumeText = result.text || '';
          }
        } catch (pdfErr) {
          console.error('ATS PDF parse error:', pdfErr);
        }
      } else {
        // Plain text / other format
        resumeText = fs.readFileSync(req.file.path, 'utf8');
      }
    } else if (req.body.resumeText) {
      resumeText = req.body.resumeText;
    } else if (req.user && req.user._id) {
      const user = await User.findById(req.user._id);
      if (user) {
        resumeText = `
          ${user.name || ''}
          ${user.email || ''}
          ${user.phone || ''}
          ${user.location || ''}
          ${user.headline || ''}
          ${user.about || ''}
          Skills: ${(user.skills || []).join(', ')}
          Education: ${(user.education || []).map(e => `${e.degree} ${e.school} ${e.fieldOfStudy}`).join('. ')}
          Experience: ${(user.experience || []).map(e => `${e.title} ${e.company} ${e.description}`).join('. ')}
        `;
      }
    }

    if (!resumeText || resumeText.trim().length < 20) {
      res.status(400);
      return next(new Error('Please provide resume text or upload a valid resume document (PDF/DOCX).'));
    }

    const textLower = resumeText.toLowerCase();
    const words = resumeText.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // 2. Section Headings Check (Format & Structure - Max 25 pts)
    let structureScore = 0;
    const sectionsDetected = [];
    const missingSections = [];

    // Contact Information details
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
    const phoneRegex = /(\+?\d[\d\s\-\(\)]{7,}\d)/;
    const linksRegex = /(linkedin\.com|github\.com|portfolio|http:\/\/|https:\/\/)/i;

    const hasEmail = emailRegex.test(resumeText);
    const hasPhone = phoneRegex.test(resumeText);
    const hasLinks = linksRegex.test(resumeText);

    if (hasEmail) structureScore += 5;
    if (hasPhone) structureScore += 3;
    if (hasLinks) structureScore += 3;

    // Section headings detection
    const sectionChecklist = [
      { name: 'Summary / Objective', regex: /(summary|professional summary|about me|profile|objective|career summary)/i, points: 2 },
      { name: 'Work Experience', regex: /(experience|work experience|employment history|work history|professional experience|career history)/i, points: 5 },
      { name: 'Education', regex: /(education|academic background|qualifications|degree|university|college)/i, points: 4 },
      { name: 'Skills & Tech Stack', regex: /(skills|technical skills|core competencies|technologies|expertise|tools)/i, points: 3 }
    ];

    sectionChecklist.forEach(sec => {
      if (sec.regex.test(resumeText)) {
        structureScore += sec.points;
        sectionsDetected.push(sec.name);
      } else {
        missingSections.push(sec.name);
      }
    });

    // 3. Keyword Matching against Target Job Description or Industry Dictionary (Max 35 pts)
    let targetJobSkills = [];
    let jobTitle = req.body.targetRole || '';

    // If a specific jobId is provided, fetch required skills
    if (req.body.jobId) {
      const targetJob = await Job.findById(req.body.jobId);
      if (targetJob) {
        targetJobSkills = targetJob.skills || [];
        jobTitle = targetJob.title;
      }
    } else if (req.body.jobDescription) {
      // Extract keywords from provided job description
      const jdLower = req.body.jobDescription.toLowerCase();
      SKILL_KEYWORDS_MAP.forEach(kw => {
        const escaped = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        if (new RegExp(`\\b${escaped}\\b`, 'i').test(jdLower)) {
          targetJobSkills.push(kw);
        }
      });
    }

    // Identify all skills in the resume
    const detectedResumeSkills = [];
    SKILL_KEYWORDS_MAP.forEach(kw => {
      const escaped = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      if (new RegExp(`\\b${escaped}\\b`, 'i').test(textLower)) {
        // Format nicely
        const cleanName = kw.charAt(0).toUpperCase() + kw.slice(1);
        detectedResumeSkills.push(cleanName);
      }
    });

    let matchedSkills = [];
    let missingKeywords = [];
    let keywordsScore = 0;

    if (targetJobSkills.length > 0) {
      // Compare against target job
      const resumeSkillSet = new Set(detectedResumeSkills.map(s => s.toLowerCase()));
      targetJobSkills.forEach(reqSkill => {
        const norm = reqSkill.toLowerCase();
        if (resumeSkillSet.has(norm) || textLower.includes(norm)) {
          matchedSkills.push(reqSkill);
        } else {
          missingKeywords.push(reqSkill);
        }
      });

      const matchRatio = targetJobSkills.length > 0 ? (matchedSkills.length / targetJobSkills.length) : 1;
      keywordsScore = Math.min(35, Math.round(matchRatio * 35));
    } else {
      // General skill density scoring
      matchedSkills = detectedResumeSkills;
      if (detectedResumeSkills.length >= 10) keywordsScore = 35;
      else if (detectedResumeSkills.length >= 6) keywordsScore = 28;
      else if (detectedResumeSkills.length >= 3) keywordsScore = 20;
      else keywordsScore = 12;

      // Suggest top high-demand tech skills if missing
      const suggestedHighDemand = ['React', 'Node.js', 'TypeScript', 'SQL', 'Docker', 'AWS', 'Python', 'Git', 'REST API'];
      missingKeywords = suggestedHighDemand.filter(s => !detectedResumeSkills.map(x => x.toLowerCase()).includes(s.toLowerCase())).slice(0, 5);
    }

    // 4. Action Verbs & Measurable Impact (Max 25 pts)
    const powerVerbsFound = [];
    POWER_ACTION_VERBS.forEach(verb => {
      const reg = new RegExp(`\\b${verb}\\b`, 'i');
      if (reg.test(textLower)) {
        powerVerbsFound.push(verb.charAt(0).toUpperCase() + verb.slice(1));
      }
    });

    // Detect quantifiable metrics: numbers, percentages, dollar signs, scale notations
    const metricMatches = resumeText.match(/\b\d+(\.\d+)?%|\$\d+[\d,]*(\.\d+)?|\b\d+[\d,]*\+?\s*(users|clients|requests|transactions|ms|seconds|hours|dollars|leads|views|downloads|members|engineers|candidates)\b|\b\d+[\d,]*\+?\b/gi) || [];
    const uniqueMetrics = Array.from(new Set(metricMatches)).slice(0, 8);

    let impactScore = 0;
    // Verb points (up to 13)
    if (powerVerbsFound.length >= 8) impactScore += 13;
    else if (powerVerbsFound.length >= 5) impactScore += 10;
    else if (powerVerbsFound.length >= 2) impactScore += 6;
    else impactScore += 2;

    // Metric points (up to 12)
    if (uniqueMetrics.length >= 5) impactScore += 12;
    else if (uniqueMetrics.length >= 3) impactScore += 9;
    else if (uniqueMetrics.length >= 1) impactScore += 5;

    // 5. Brevity, Readability & Buzzwords Check (Max 15 pts)
    let brevityScore = 0;
    
    // Ideal length: 350 to 1100 words
    if (wordCount >= 350 && wordCount <= 1100) {
      brevityScore += 10;
    } else if (wordCount >= 200 && wordCount <= 1500) {
      brevityScore += 7;
    } else {
      brevityScore += 3;
    }

    // Bullet point markers
    const hasBulletPoints = /[•\-\*\u2022]\s+[A-Z]/m.test(resumeText) || resumeText.includes('•') || resumeText.includes('-');
    if (hasBulletPoints) brevityScore += 5;

    // Check for clichés / filler words
    const buzzwordsFound = [];
    BUZZWORDS_CLICHES.forEach(buzz => {
      if (textLower.includes(buzz)) {
        buzzwordsFound.push(buzz);
        brevityScore = Math.max(0, brevityScore - 2); // Small deduction for vague buzzwords
      }
    });

    // 6. Overall ATS Score
    const overallScore = Math.min(100, Math.max(0, structureScore + keywordsScore + impactScore + brevityScore));

    // Determine ATS Grade & Badge
    let grade = 'Fair';
    let gradeDescription = 'Your resume needs optimization to consistently pass modern applicant tracking filters.';
    let gradeBadge = 'amber';

    if (overallScore >= 85) {
      grade = 'Excellent';
      gradeDescription = 'High ATS compatibility! Your resume is structured cleanly with strong keywords and quantified impact.';
      gradeBadge = 'emerald';
    } else if (overallScore >= 70) {
      grade = 'Good';
      gradeDescription = 'Solid ATS compatibility with a few minor keyword and metric optimization opportunities.';
      gradeBadge = 'indigo';
    } else if (overallScore < 50) {
      grade = 'Needs Improvement';
      gradeDescription = 'Low ATS parse score. Add structured headings, technical skills, and metric-backed achievements.';
      gradeBadge = 'rose';
    }

    // 7. Generate Strengths & Tailored Suggestions
    const strengths = [];
    const suggestions = [];

    if (hasEmail && hasPhone) strengths.push('Clear contact details detected (Email & Phone provided).');
    if (hasLinks) strengths.push('Professional portfolio / LinkedIn / GitHub links detected.');
    if (powerVerbsFound.length >= 5) strengths.push(`Strong active vocabulary with ${powerVerbsFound.length} power action verbs identified.`);
    if (uniqueMetrics.length >= 3) strengths.push(`Demonstrated business impact with ${uniqueMetrics.length} measurable metrics & numbers.`);
    if (detectedResumeSkills.length >= 6) strengths.push(`Rich technical skills footprint (${detectedResumeSkills.length} key competencies detected).`);

    // Suggestions
    if (!hasLinks) {
      suggestions.push({
        title: 'Include LinkedIn & GitHub Links',
        detail: 'Recruiters and ATS bots look for GitHub/LinkedIn links to verify code repositories and employment identity.',
        type: 'high'
      });
    }

    if (missingSections.length > 0) {
      suggestions.push({
        title: `Add Missing Standard Headings: ${missingSections.join(', ')}`,
        detail: 'ATS parsers rely on standard section headings to index your career history accurately.',
        type: 'high'
      });
    }

    if (missingKeywords.length > 0) {
      suggestions.push({
        title: `Incorporate Target Keywords: ${missingKeywords.slice(0, 4).join(', ')}`,
        detail: 'Integrate these high-impact skills into your experience bullet points to increase ranking match rates.',
        type: 'high'
      });
    }

    if (powerVerbsFound.length < 5) {
      suggestions.push({
        title: 'Replace Passive Phrases with Power Action Verbs',
        detail: 'Use strong verbs like "Architected", "Engineered", "Streamlined", or "Deployed" at the start of each bullet point.',
        type: 'medium'
      });
    }

    if (uniqueMetrics.length < 3) {
      suggestions.push({
        title: 'Quantify Achievements with Measurable Results (%, $, Scale)',
        detail: 'Include concrete metrics (e.g. "Reduced API response times by 35%", "Maintained 99.9% uptime across 50k users").',
        type: 'high'
      });
    }

    if (buzzwordsFound.length > 0) {
      suggestions.push({
        title: `Replace Vague Buzzwords: "${buzzwordsFound.join('", "')}"`,
        detail: 'Replace subjective buzzwords like "hard worker" with verifiable technical achievements.',
        type: 'medium'
      });
    }

    if (wordCount < 300) {
      suggestions.push({
        title: 'Expand Resume Depth (Currently under 300 words)',
        detail: 'Elaborate on project architecture, technical trade-offs, and responsibilities for better keyword indexing.',
        type: 'medium'
      });
    }

    res.status(200).json({
      success: true,
      message: 'ATS Resume analysis completed successfully',
      data: {
        overallScore,
        grade,
        gradeDescription,
        gradeBadge,
        categoryScores: {
          structure: { score: structureScore, max: 25, label: 'Format & Section Structure', percent: Math.round((structureScore / 25) * 100) },
          keywords: { score: keywordsScore, max: 35, label: 'Skills & Keyword Matching', percent: Math.round((keywordsScore / 35) * 100) },
          impact: { score: impactScore, max: 25, label: 'Action Verbs & Impact Metrics', percent: Math.round((impactScore / 25) * 100) },
          brevity: { score: brevityScore, max: 15, label: 'Length, Readability & Tone', percent: Math.round((brevityScore / 15) * 100) }
        },
        stats: {
          wordCount,
          hasEmail,
          hasPhone,
          hasLinks,
          sectionsDetected,
          missingSections,
          detectedSkillsCount: detectedResumeSkills.length,
          powerVerbsCount: powerVerbsFound.length,
          metricsCount: uniqueMetrics.length
        },
        keywords: {
          matched: matchedSkills,
          missing: missingKeywords,
          detectedAll: detectedResumeSkills
        },
        powerVerbs: powerVerbsFound.slice(0, 12),
        metricsFound: uniqueMetrics,
        buzzwordsFound,
        strengths,
        suggestions,
        targetJobTitle: jobTitle || 'General Software / ATS Benchmark'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    AI Resume Bullet Point Enhancer
// @route   POST /api/recommendations/bullet-enhance
// @access  Public
const enhanceBulletPoint = async (req, res, next) => {
  try {
    const { originalBullet, role, skill } = req.body;

    if (!originalBullet || originalBullet.trim().length < 5) {
      res.status(400);
      return next(new Error('Please provide a bullet point to enhance.'));
    }

    // Deterministic AI action verb and metrics formulation template
    const clean = originalBullet.trim().replace(/^[•\-\*]\s*/, '');
    
    // Choose high-impact action verbs based on role or context
    const suggestedTemplates = [
      `Engineered and deployed scalable solutions that ${clean.toLowerCase().replace(/^(worked on|helped with|was responsible for|did)\s*/i, '')}, improving performance by 35% and reducing processing latency.`,
      `Spearheaded the design and implementation of ${clean.toLowerCase().replace(/^(built|created|made)\s*/i, '')}, ensuring 99.9% uptime and streamlined developer workflows across cross-functional teams.`,
      `Architected and optimized core features using modern best practices, resulting in a 40% reduction in code complexity and accelerating deployment cycles.`
    ];

    res.status(200).json({
      success: true,
      message: 'Bullet point enhanced successfully',
      data: {
        original: clean,
        improvedBullets: suggestedTemplates
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecommendedJobs,
  checkAtsScore,
  enhanceBulletPoint
};

