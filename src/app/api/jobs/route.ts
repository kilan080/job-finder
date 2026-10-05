import { NextRequest, NextResponse } from 'next/server';
import { runJobIngestionPipeline } from '@/lib/ingestion/liveIngestion';
import { calculateJobMatch } from '@/lib/matching/scoringEngine';
import { CandidateProfile, SearchFilterState } from '@/types/job';

// Default candidate profile aligned with React/TS/Next.js developer profile
const DEFAULT_PROFILE: CandidateProfile = {
  id: 'user-1',
  name: 'Olamilekan Dev',
  email: 'olamilekan.dev@example.com',
  title: 'React / Next.js Developer',
  skills: ['React', 'TypeScript', 'Next.js', 'Node.js', 'Express', 'PostgreSQL', 'Tailwind CSS', 'REST API', 'Git'],
  targetRoles: ['Frontend Engineer', 'Full-Stack Developer', 'Junior Frontend Developer', 'Software Engineering Intern', 'React Developer'],
  experienceLevel: 'junior',
  locations: ['Nigeria', 'New Zealand', 'Worldwide', 'Remote'],
  remoteOnly: true,
  minSalary: 40000,
  bio: 'Ambitious web developer with expertise in React, TypeScript, Next.js, and Node.js backend systems.'
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const roleFilter = searchParams.get('role') || '';
    const locationFilter = searchParams.get('location') || '';
    const remoteOnly = searchParams.get('remote') === 'true';
    const minMatchScore = Number(searchParams.get('minScore') || 0);
    const sourceFilter = searchParams.get('source') || '';
    const experienceFilter = searchParams.get('exp') || '';
    const sortBy = (searchParams.get('sort') || 'score') as SearchFilterState['sortBy'];

    // Custom profile override passed in query string or headers
    let candidateProfile = DEFAULT_PROFILE;
    const profileParam = searchParams.get('profile');
    if (profileParam) {
      try {
        candidateProfile = { ...DEFAULT_PROFILE, ...JSON.parse(profileParam) };
      } catch (e) {
        // use default
      }
    }

    // 1. Run live ingestion
    const { jobs, totalRawScanned, totalDeduplicated, sourcesScanned } = await runJobIngestionPipeline();

    // 2. Score jobs against candidate profile
    const scoredJobs = jobs.map(job => {
      const match = calculateJobMatch(job, candidateProfile);
      return {
        job,
        match
      };
    });

    // 3. Filter
    const filtered = scoredJobs.filter(({ job, match }) => {
      // Query filter
      if (query) {
        const qLower = query.toLowerCase();
        const matchesQuery = 
          job.title.toLowerCase().includes(qLower) ||
          job.company.toLowerCase().includes(qLower) ||
          job.description.toLowerCase().includes(qLower) ||
          job.skills.some(s => s.toLowerCase().includes(qLower));
        if (!matchesQuery) return false;
      }

      // Role filter
      if (roleFilter && roleFilter !== 'all') {
        if (!job.title.toLowerCase().includes(roleFilter.toLowerCase())) return false;
      }

      // Location filter
      if (locationFilter && locationFilter !== 'all') {
        if (!job.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
      }

      // Remote filter
      if (remoteOnly && !job.remote) return false;

      // Experience filter
      if (experienceFilter && experienceFilter !== 'all') {
        if (job.experienceLevel.toLowerCase() !== experienceFilter.toLowerCase()) return false;
      }

      // Source filter
      if (sourceFilter && sourceFilter !== 'all') {
        if (job.source.toLowerCase() !== sourceFilter.toLowerCase()) return false;
      }

      // Minimum Match Score filter
      if (match.overallScore < minMatchScore) return false;

      return true;
    });

    // 4. Sort
    filtered.sort((a, b) => {
      if (sortBy === 'score') {
        return b.match.overallScore - a.match.overallScore;
      }
      if (sortBy === 'postedAt') {
        return new Date(b.job.postedAt).getTime() - new Date(a.job.postedAt).getTime();
      }
      if (sortBy === 'company') {
        return a.job.company.localeCompare(b.job.company);
      }
      return b.match.overallScore - a.match.overallScore;
    });

    return NextResponse.json({
      success: true,
      meta: {
        totalRawScanned,
        totalDeduplicated,
        sourcesScanned,
        totalMatched: filtered.length,
        candidateProfile
      },
      data: filtered
    });

  } catch (error: any) {
    console.error('Jobs GET route error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
