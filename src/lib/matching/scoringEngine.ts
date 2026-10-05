import { CandidateProfile, Job, MatchAnalysis } from '@/types/job';

export function calculateJobMatch(job: Job, profile: CandidateProfile): MatchAnalysis {
  // 1. Skill Match (Weight: 35%)
  const userSkillsNormalized = profile.skills.map(s => s.toLowerCase());
  const jobSkillsNormalized = job.skills.map(s => s.toLowerCase());
  const descriptionLower = job.description.toLowerCase() + ' ' + job.title.toLowerCase();

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  // Check explicit job skills
  userSkillsNormalized.forEach((skill, index) => {
    const originalSkill = profile.skills[index];
    if (jobSkillsNormalized.includes(skill) || descriptionLower.includes(skill)) {
      matchedSkills.push(originalSkill);
    }
  });

  // Identify key job skills candidate is missing
  job.skills.forEach(skill => {
    if (!userSkillsNormalized.some(us => us.includes(skill.toLowerCase()) || skill.toLowerCase().includes(us))) {
      if (!missingSkills.includes(skill)) {
        missingSkills.push(skill);
      }
    }
  });

  const totalUserSkillsCount = Math.max(profile.skills.length, 1);
  const skillMatchRatio = matchedSkills.length / totalUserSkillsCount;
  const skillScore = Math.min(100, Math.round(skillMatchRatio * 100 + (matchedSkills.length >= 3 ? 15 : 0)));

  // 2. Role Title Match (Weight: 25%)
  let roleScore = 40; // baseline
  const jobTitleLower = job.title.toLowerCase();
  
  for (const role of profile.targetRoles) {
    const rLower = role.toLowerCase();
    if (jobTitleLower.includes(rLower) || rLower.includes(jobTitleLower)) {
      roleScore = 100;
      break;
    }
    // Partial match keywords
    const keywords = rLower.split(' ');
    const hitCount = keywords.filter(kw => kw.length > 2 && jobTitleLower.includes(kw)).length;
    if (hitCount > 0) {
      roleScore = Math.max(roleScore, Math.round((hitCount / keywords.length) * 85));
    }
  }

  // 3. Experience Match (Weight: 15%)
  let experienceScore = 50;
  const profileExp = profile.experienceLevel;
  const jobExp = job.experienceLevel;

  if (jobExp === 'All levels') {
    experienceScore = 95;
  } else if (profileExp === 'junior' || profileExp === 'internship') {
    if (jobExp === 'Junior' || jobExp === 'Internship') {
      experienceScore = 100;
    } else if (jobExp === 'Mid-level') {
      experienceScore = 65;
    } else {
      experienceScore = 30;
    }
  } else if (profileExp === 'mid') {
    if (jobExp === 'Mid-level' || jobExp === 'Junior') {
      experienceScore = 100;
    } else {
      experienceScore = 70;
    }
  } else {
    experienceScore = 90;
  }

  // 4. Location & Remote Preference (Weight: 15%)
  let locationScore = 50;
  if (profile.remoteOnly && job.remote) {
    locationScore = 100;
  } else {
    const jobLocLower = job.location.toLowerCase();
    const matchesTargetLoc = profile.locations.some(loc => 
      jobLocLower.includes(loc.toLowerCase()) || loc.toLowerCase() === 'worldwide'
    );
    if (matchesTargetLoc) {
      locationScore = 95;
    } else if (job.remote) {
      locationScore = 85;
    }
  }

  // 5. Recency Score (Weight: 10%)
  let recencyScore = 70;
  const now = new Date().getTime();
  const postedDate = new Date(job.postedAt).getTime();
  const hoursAgo = Math.max(0, (now - postedDate) / (1000 * 60 * 60));

  if (hoursAgo <= 24) {
    recencyScore = 100;
  } else if (hoursAgo <= 72) {
    recencyScore = 85;
  } else if (hoursAgo <= 168) {
    recencyScore = 70;
  } else {
    recencyScore = 50;
  }

  // Calculate overall weighted score
  const weightedScore = Math.round(
    skillScore * 0.35 +
    roleScore * 0.25 +
    experienceScore * 0.15 +
    locationScore * 0.15 +
    recencyScore * 0.10
  );

  const overallScore = Math.min(99, Math.max(35, weightedScore));

  let grade: MatchAnalysis['grade'] = 'Low Fit (<60%)';
  if (overallScore >= 90) grade = 'Prime Fit (90%+)';
  else if (overallScore >= 75) grade = 'Strong Fit (75-89%)';
  else if (overallScore >= 60) grade = 'Moderate Fit (60-74%)';

  // Build natural language breakdown
  const reasons: string[] = [];
  if (matchedSkills.length > 0) {
    reasons.push(`Matches ${matchedSkills.length} key tech skill${matchedSkills.length > 1 ? 's' : ''}: ${matchedSkills.slice(0, 4).join(', ')}.`);
  }
  if (roleScore >= 80) {
    reasons.push(`Job title "${job.title}" closely aligns with your target role preferences.`);
  }
  if (job.remote && profile.remoteOnly) {
    reasons.push(`100% Remote friendly matching your location preference.`);
  }
  if (experienceScore >= 85) {
    reasons.push(`Position is tailored for ${job.experienceLevel} level talent.`);
  }
  if (hoursAgo <= 24) {
    reasons.push(`Posted within the last 24 hours (high application visibility).`);
  }

  const whyThisMatches = reasons.join(' ');

  // Build ATS recommendations
  const atsTips: string[] = [];
  if (missingSkills.length > 0) {
    atsTips.push(`Add keywords: ${missingSkills.slice(0, 3).join(', ')} to your resume resume bullet points if applicable.`);
  }
  if (job.remote) {
    atsTips.push(`Highlight your remote collaboration tools (Slack, Async Git Workflow, Zoom/Loom) in your application pitch.`);
  }
  atsTips.push(`Emphasize your hands-on projects built with ${matchedSkills.slice(0, 2).join(' and ') || 'TypeScript'}.`);

  return {
    overallScore,
    grade,
    skillBreakdown: {
      matched: matchedSkills,
      missing: missingSkills.slice(0, 5),
      matchScore: skillScore
    },
    roleMatchScore: roleScore,
    experienceMatchScore: experienceScore,
    locationMatchScore: locationScore,
    recencyScore,
    whyThisMatches: whyThisMatches || 'This opportunity provides good software engineering experience.',
    atsTips
  };
}
