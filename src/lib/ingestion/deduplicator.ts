import { Job } from '@/types/job';

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

export function generateDedupeKey(company: string, title: string, location: string): string {
  const normCompany = normalizeText(company);
  // Remove common prefix variations like "Senior", "Junior", "Lead" if needed, or keep core title
  const normTitle = normalizeText(title.replace(/\b(hiring|urgent|remote)\b/gi, ''));
  const normLoc = normalizeText(location.includes('remote') ? 'remote' : location);
  
  return `${normCompany}_${normTitle}_${normLoc}`;
}

export function deduplicateJobs(jobs: Job[]): Job[] {
  const map = new Map<string, Job>();

  for (const job of jobs) {
    const key = job.dedupeKey || generateDedupeKey(job.company, job.title, job.location);

    if (map.has(key)) {
      const existing = map.get(key)!;
      // Merge sources
      const existingSourceNames = new Set(existing.sources.map(s => s.name));
      for (const newSource of job.sources) {
        if (!existingSourceNames.has(newSource.name)) {
          existing.sources.push(newSource);
        }
      }
      // Prefer richer description or higher salary if available
      if (job.description.length > existing.description.length) {
        existing.description = job.description;
      }
      if (!existing.companyLogo && job.companyLogo) {
        existing.companyLogo = job.companyLogo;
      }
      if (!existing.salaryMin && job.salaryMin) {
        existing.salaryMin = job.salaryMin;
        existing.salaryMax = job.salaryMax;
      }
    } else {
      map.set(key, { ...job, dedupeKey: key });
    }
  }

  return Array.from(map.values());
}
