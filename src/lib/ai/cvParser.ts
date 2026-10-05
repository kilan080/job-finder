import { CandidateProfile } from '@/types/job';

const COMMON_SKILLS = [
  'React', 'TypeScript', 'JavaScript', 'Next.js', 'Node.js', 'Express',
  'PostgreSQL', 'MongoDB', 'Tailwind CSS', 'CSS', 'HTML', 'REST API',
  'GraphQL', 'Git', 'GitHub', 'Docker', 'Redux', 'Zustand', 'React Query',
  'TanStack Query', 'Jest', 'Cypress', 'Python', 'Firebase', 'AWS',
  'Vercel', 'Material UI', 'MUI', 'Shadcn UI', 'Responsive Design'
];

export function parseCvTextToProfile(rawText: string, existingProfile: CandidateProfile): CandidateProfile {
  const textUpper = rawText.toUpperCase();
  const textLower = rawText.toLowerCase();

  // 1. Extract Skills
  const detectedSkills = COMMON_SKILLS.filter(skill => {
    const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    return regex.test(rawText);
  });

  // Combine with default skills, ensuring uniqueness
  const updatedSkills = Array.from(new Set([...existingProfile.skills, ...detectedSkills]));

  // 2. Extract Experience Level
  let experienceLevel: CandidateProfile['experienceLevel'] = existingProfile.experienceLevel;
  if (textLower.includes('intern') || textLower.includes('internship') || textLower.includes('trainee')) {
    experienceLevel = 'internship';
  } else if (textLower.includes('junior') || textLower.includes('entry level') || textLower.includes('graduate')) {
    experienceLevel = 'junior';
  } else if (textLower.includes('mid') || textLower.includes('intermediate') || textLower.includes('2+ years')) {
    experienceLevel = 'mid';
  } else if (textLower.includes('senior') || textLower.includes('lead') || textLower.includes('5+ years')) {
    experienceLevel = 'senior';
  }

  // 3. Extract Target Roles
  const rolesDetected: string[] = [];
  if (textLower.includes('frontend') || textLower.includes('front-end') || textLower.includes('react')) {
    rolesDetected.push('Frontend Engineer');
  }
  if (textLower.includes('fullstack') || textLower.includes('full-stack') || textLower.includes('full stack')) {
    rolesDetected.push('Full-Stack Engineer');
  }
  if (textLower.includes('backend') || textLower.includes('back-end') || textLower.includes('node')) {
    rolesDetected.push('Backend Engineer');
  }
  if (textLower.includes('intern') || textLower.includes('internship')) {
    rolesDetected.push('Software Engineering Intern');
  }

  const updatedRoles = Array.from(new Set([...existingProfile.targetRoles, ...rolesDetected]));

  // 4. Extract Name if visible (first non-empty line)
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  let name = existingProfile.name;
  if (lines.length > 0 && lines[0].length < 40 && !lines[0].toLowerCase().includes('resume')) {
    name = lines[0];
  }

  return {
    ...existingProfile,
    name: name || existingProfile.name,
    skills: updatedSkills.length > 0 ? updatedSkills : existingProfile.skills,
    targetRoles: updatedRoles.length > 0 ? updatedRoles : existingProfile.targetRoles,
    experienceLevel,
    rawCvText: rawText
  };
}
