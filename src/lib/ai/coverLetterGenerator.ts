import { CandidateProfile, Job, MatchAnalysis } from '@/types/job';

export interface ApplicationPitchResult {
  coverLetter: string;
  shortPitch: string;
  atsKeywords: string[];
  suggestedSubjectLine: string;
}

export function generateApplicationPitch(
  job: Job,
  profile: CandidateProfile,
  match: MatchAnalysis
): ApplicationPitchResult {
  const topMatchedSkills = match.skillBreakdown.matched.slice(0, 4).join(', ') || 'React, TypeScript, Next.js';
  const missingKeywords = match.skillBreakdown.missing.slice(0, 3);
  
  const subjectLine = `Application for ${job.title} - ${profile.name}`;

  const shortPitch = `Hi ${job.company} Hiring Team,\n\nI am writing to express my enthusiasm for the ${job.title} position. With hands-on experience building modern, scalable web applications in ${topMatchedSkills}, I am confident in my ability to deliver immediate value to your engineering team.\n\nLooking forward to connecting!\nBest regards,\n${profile.name}`;

  const coverLetter = `Dear Hiring Manager & Engineering Team at ${job.company},

I am writing to formally submit my application for the ${job.title} role. Having followed ${job.company}'s work in software engineering, I am excited about the opportunity to contribute to your technical initiatives.

As a dedicated developer specializing in ${profile.title}, my core stack centers on ${profile.skills.slice(0, 6).join(', ')}. In my recent project work, I have focused on building responsive frontends, designing resilient API integrations, and implementing scalable state management architectures.

What specifically draws me to this ${job.title} position:
- Strong Alignment with ${job.company}'s Tech Stack: I have active experience working with ${topMatchedSkills}.
- Commitment to Quality: I prioritize clean TypeScript types, modular UI component architecture, and smooth user experience.
- Adaptability & Fast Learning: As a ${profile.experienceLevel} developer, I thrive in collaborative agile environments and absorb new engineering patterns quickly.

I would welcome the opportunity to discuss how my background and enthusiasm for modern web engineering align with ${job.company}'s team goals. Thank you for your time and consideration.

Warm regards,

${profile.name}
Email: ${profile.email}
Location: ${profile.locations.join(' / ')}`;

  const atsKeywords = [
    ...match.skillBreakdown.matched,
    ...missingKeywords
  ];

  return {
    coverLetter,
    shortPitch,
    atsKeywords,
    suggestedSubjectLine: subjectLine
  };
}
