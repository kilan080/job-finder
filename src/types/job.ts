export type ExperienceLevel = 'Internship' | 'Junior' | 'Mid-level' | 'Senior' | 'All levels';

export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';

export type JobSourceType = 
  | 'Arbeitnow' 
  | 'Remotive' 
  | 'Jobicy' 
  | 'HackerNews' 
  | 'Greenhouse' 
  | 'Lever' 
  | 'Company Career Site' 
  | 'Search Discovery';

export interface JobSourceRef {
  name: JobSourceType;
  url: string;
  fetchedAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  remote: boolean;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  description: string;
  skills: string[];
  tags: string[];
  url: string;
  source: JobSourceType;
  sourceUrl?: string;
  postedAt: string;
  dedupeKey: string;
  sources: JobSourceRef[];
  isFeatured?: boolean;
}

export interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  title: string;
  skills: string[];
  targetRoles: string[];
  experienceLevel: 'internship' | 'junior' | 'mid' | 'senior';
  locations: string[];
  remoteOnly: boolean;
  minSalary: number;
  bio: string;
  rawCvText?: string;
}

export interface MatchAnalysis {
  overallScore: number;
  grade: 'Prime Fit (90%+)' | 'Strong Fit (75-89%)' | 'Moderate Fit (60-74%)' | 'Low Fit (<60%)';
  skillBreakdown: {
    matched: string[];
    missing: string[];
    matchScore: number;
  };
  roleMatchScore: number;
  experienceMatchScore: number;
  locationMatchScore: number;
  recencyScore: number;
  whyThisMatches: string;
  atsTips: string[];
}

export type ApplicationStatus = 'saved' | 'applying' | 'applied' | 'interviewing' | 'offered' | 'rejected';

export interface ApplicationRecord {
  jobId: string;
  status: ApplicationStatus;
  savedAt: string;
  appliedAt?: string;
  customCoverLetter?: string;
  notes?: string;
  companyContact?: string;
}

export interface SearchFilterState {
  query: string;
  roleFilter: string;
  locationFilter: string;
  remoteOnly: boolean;
  minMatchScore: number;
  sourceFilter: string;
  experienceFilter: string;
  sortBy: 'score' | 'postedAt' | 'company';
}
