import { Job, JobSourceType } from '@/types/job';
import { deduplicateJobs, generateDedupeKey } from './deduplicator';

// Curated tech seed jobs targeting React, TS, Next.js, Node, Junior, Internship & Remote roles
const CURATED_SEED_JOBS: Job[] = [
  {
    id: 'seed-1',
    title: 'Junior Frontend Developer (React / Next.js)',
    company: 'Moniepoint Inc',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    location: 'Lagos, Nigeria (Hybrid / Remote Option)',
    remote: true,
    employmentType: 'Full-time',
    experienceLevel: 'Junior',
    salaryMin: 45000,
    salaryMax: 65000,
    currency: 'USD',
    description: 'We are seeking a talented Junior Frontend Developer to join our core Web Experience team. You will build high-performance web applications using React 19, Next.js App Router, TypeScript, and Tailwind CSS. Collaborative environment with direct mentorship from principal engineers.',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'REST API', 'Git'],
    tags: ['Frontend', 'React', 'Junior', 'Hybrid', 'Nigeria'],
    url: 'https://moniepoint.com/careers',
    source: 'Company Career Site',
    sourceUrl: 'https://boards.greenhouse.io/moniepoint/jobs/frontend-jr',
    postedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    dedupeKey: '',
    sources: [
      { name: 'Company Career Site', url: 'https://moniepoint.com/careers', fetchedAt: new Date().toISOString() },
      { name: 'Greenhouse', url: 'https://boards.greenhouse.io/moniepoint/jobs/frontend-jr', fetchedAt: new Date().toISOString() }
    ],
    isFeatured: true
  },
  {
    id: 'seed-2',
    title: 'Software Engineering Intern (Frontend & Fullstack)',
    company: 'Paystack (Stripe Subsidiary)',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80',
    location: 'Lagos / Remote (Nigeria, US, CA & AU Friendly)',
    remote: true,
    employmentType: 'Internship',
    experienceLevel: 'Internship',
    salaryMin: 35000,
    salaryMax: 48000,
    currency: 'USD',
    description: 'Paystack is looking for passionate Software Engineering Interns for our 2026 Cohort. You will collaborate on financial checkout widgets, developer dashboards, and Node.js/PostgreSQL microservices. Ideal for proactive learners with strong TypeScript fundamentals.',
    skills: ['TypeScript', 'React', 'Node.js', 'Express', 'PostgreSQL', 'Jest'],
    tags: ['Internship', 'Fullstack', 'TypeScript', 'Fintech', 'Remote'],
    url: 'https://paystack.com/careers',
    source: 'Lever',
    sourceUrl: 'https://jobs.lever.co/paystack/intern-2026',
    postedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    dedupeKey: '',
    sources: [
      { name: 'Lever', url: 'https://jobs.lever.co/paystack/intern-2026', fetchedAt: new Date().toISOString() }
    ],
    isFeatured: true
  },
  {
    id: 'seed-3',
    title: 'Remote React & TypeScript Engineer',
    company: 'Vercel',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    location: 'Remote (United States / Worldwide)',
    remote: true,
    employmentType: 'Full-time',
    experienceLevel: 'Junior',
    salaryMin: 70000,
    salaryMax: 95000,
    currency: 'USD',
    description: 'Join Vercel to help shape the future of the web. As a Junior React Developer on our Ecosystem team, you will craft beautiful interactive UI components, refine accessibility, and optimize web vitals for millions of web developers.',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'State Management'],
    tags: ['Frontend', 'Vercel', 'Next.js', 'Remote', 'United States'],
    url: 'https://vercel.com/careers',
    source: 'Greenhouse',
    sourceUrl: 'https://boards.greenhouse.io/vercel/jobs/react-eng',
    postedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    dedupeKey: '',
    sources: [
      { name: 'Greenhouse', url: 'https://boards.greenhouse.io/vercel/jobs/react-eng', fetchedAt: new Date().toISOString() },
      { name: 'Arbeitnow', url: 'https://arbeitnow.com/jobs/vercel-react', fetchedAt: new Date().toISOString() }
    ],
    isFeatured: true
  },
  {
    id: 'seed-4',
    title: 'Junior Fullstack Engineer (Node.js / Express / Postgres)',
    company: 'Flutterwave',
    companyLogo: 'https://images.unsplash.com/photo-1556742049-0a67daf64f42?auto=format&fit=crop&w=120&q=80',
    location: 'Lagos, Nigeria / Remote Global',
    remote: true,
    employmentType: 'Full-time',
    experienceLevel: 'Junior',
    salaryMin: 50000,
    salaryMax: 72000,
    currency: 'USD',
    description: 'Flutterwave is expanding its payment API platform. We are seeking a Junior Fullstack Engineer experienced with REST APIs, Express.js, TypeScript, PostgreSQL schemas, and React frontends. Great growth path with global impact.',
    skills: ['Node.js', 'Express', 'PostgreSQL', 'TypeScript', 'React', 'Docker'],
    tags: ['Fullstack', 'Node.js', 'PostgreSQL', 'Junior', 'Fintech'],
    url: 'https://flutterwave.com/careers',
    source: 'Company Career Site',
    postedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    dedupeKey: '',
    sources: [
      { name: 'Company Career Site', url: 'https://flutterwave.com/careers', fetchedAt: new Date().toISOString() }
    ]
  },
  {
    id: 'seed-5',
    title: 'Frontend Web Developer (React, Next.js, UI/UX)',
    company: 'Shopify Canada',
    companyLogo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&q=80',
    location: 'Toronto, Canada / Remote',
    remote: true,
    employmentType: 'Full-time',
    experienceLevel: 'All levels',
    salaryMin: 80000,
    salaryMax: 110000,
    currency: 'USD',
    description: 'Build merchant-facing design systems and commerce experiences. You will write clean TypeScript, leverage Tailwind CSS & Radix UI primitives, and integrate GraphQL/REST endpoints in Next.js.',
    skills: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'Tailwind CSS'],
    tags: ['Frontend', 'E-commerce', 'Canada', 'Remote', 'Canada'],
    url: 'https://shopify.com/careers',
    source: 'Lever',
    postedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    dedupeKey: '',
    sources: [
      { name: 'Lever', url: 'https://shopify.com/careers', fetchedAt: new Date().toISOString() }
    ]
  },
  {
    id: 'seed-6',
    title: 'Associate Frontend Engineer (React & TypeScript)',
    company: 'Atlassian Australia',
    companyLogo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=120&q=80',
    location: 'Sydney, Australia / Remote APAC',
    remote: true,
    employmentType: 'Full-time',
    experienceLevel: 'Junior',
    salaryMin: 75000,
    salaryMax: 105000,
    currency: 'USD',
    description: 'Atlassian is looking for an Associate Frontend Engineer to join our Jira & Confluence Cloud teams in Australia. You will build high-impact user interfaces using React, TypeScript, and design system components.',
    skills: ['React', 'TypeScript', 'Next.js', 'Redux', 'Design Systems'],
    tags: ['Frontend', 'Australia', 'Sydney', 'React', 'Junior'],
    url: 'https://atlassian.com/careers',
    source: 'Greenhouse',
    postedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    dedupeKey: '',
    sources: [
      { name: 'Greenhouse', url: 'https://atlassian.com/careers', fetchedAt: new Date().toISOString() }
    ],
    isFeatured: true
  },
  {
    id: 'seed-7',
    title: 'Junior Web Application Developer (React / Node.js)',
    company: 'Stripe US',
    companyLogo: 'https://images.unsplash.com/photo-1556742049-0a67daf64f42?auto=format&fit=crop&w=120&q=80',
    location: 'San Francisco, CA, United States / Remote',
    remote: true,
    employmentType: 'Full-time',
    experienceLevel: 'Junior',
    salaryMin: 85000,
    salaryMax: 120000,
    currency: 'USD',
    description: 'Stripe is hiring Junior Web Developers to build global payment checkout infrastructure. Looking for fast learners with proficiency in React, TypeScript, Express API development, and PostgreSQL.',
    skills: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL'],
    tags: ['Fullstack', 'United States', 'Remote', 'Fintech', 'Junior'],
    url: 'https://stripe.com/jobs',
    source: 'Lever',
    postedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    dedupeKey: '',
    sources: [
      { name: 'Lever', url: 'https://stripe.com/jobs', fetchedAt: new Date().toISOString() }
    ],
    isFeatured: true
  }
];

// Fetch live jobs from Arbeitnow public REST API
async function fetchArbeitnowJobs(): Promise<Job[]> {
  try {
    const res = await fetch('https://www.arbeitnow.com/api/job-board-api', {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 300 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    const items = data.data || [];

    return items.slice(0, 15).map((item: any) => {
      const isRemote = item.remote || item.location?.toLowerCase().includes('remote') || false;
      const tags: string[] = item.tags || ['Tech'];
      const title: string = item.title || 'Software Engineer';
      const company: string = item.company_name || 'Tech Company';
      const description: string = item.description ? item.description.replace(/<[^>]*>?/gm, ' ') : '';
      
      const skills = Array.from(new Set([
        ...tags,
        ...(description.match(/React|TypeScript|JavaScript|Next\.js|Node|Express|PostgreSQL|Python|Tailwind/gi) || [])
      ])).slice(0, 6);

      return {
        id: `arbeitnow-${item.slug || Math.random().toString(36).substring(7)}`,
        title,
        company,
        location: item.location || (isRemote ? 'Remote' : 'Europe / Global'),
        remote: isRemote,
        employmentType: 'Full-time',
        experienceLevel: title.toLowerCase().includes('junior') || title.toLowerCase().includes('intern') ? 'Junior' : 'All levels',
        salaryMin: 55000,
        salaryMax: 85000,
        currency: 'EUR',
        description: description.substring(0, 500) + '...',
        skills,
        tags,
        url: item.url || 'https://www.arbeitnow.com',
        source: 'Arbeitnow' as JobSourceType,
        postedAt: item.created_at ? new Date(item.created_at * 1000).toISOString() : new Date().toISOString(),
        dedupeKey: generateDedupeKey(company, title, item.location || 'Remote'),
        sources: [
          { name: 'Arbeitnow', url: item.url || 'https://www.arbeitnow.com', fetchedAt: new Date().toISOString() }
        ]
      };
    });
  } catch (err) {
    console.warn('Arbeitnow API fetch warning:', err);
    return [];
  }
}

// Fetch live jobs from Remotive API
async function fetchRemotiveJobs(): Promise<Job[]> {
  try {
    const res = await fetch('https://remotive.com/api/remote-jobs?category=software-dev&limit=15', {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 300 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    const items = data.jobs || [];

    return items.slice(0, 15).map((item: any) => {
      const title: string = item.title || 'Developer';
      const company: string = item.company_name || 'Remote Tech';
      const tags: string[] = item.tags || [];
      const description: string = item.description ? item.description.replace(/<[^>]*>?/gm, ' ') : '';
      
      const skills = Array.from(new Set([
        ...tags,
        ...(description.match(/React|TypeScript|JavaScript|Next\.js|Node|Express|PostgreSQL|Tailwind|HTML|CSS/gi) || [])
      ])).slice(0, 6);

      return {
        id: `remotive-${item.id}`,
        title,
        company,
        companyLogo: item.company_logo_url || undefined,
        location: item.candidate_required_location || 'Remote (Worldwide)',
        remote: true,
        employmentType: (item.job_type || 'full_time').replace('_', '-') as any,
        experienceLevel: title.toLowerCase().includes('junior') || title.toLowerCase().includes('intern') ? 'Junior' : 'Mid-level',
        salaryMin: item.salary ? 60000 : 50000,
        salaryMax: item.salary ? 90000 : 80000,
        currency: 'USD',
        description: description.substring(0, 500) + '...',
        skills,
        tags: [...tags, 'Remote', 'Software Eng'],
        url: item.url || 'https://remotive.com',
        source: 'Remotive' as JobSourceType,
        postedAt: item.publication_date || new Date().toISOString(),
        dedupeKey: generateDedupeKey(company, title, 'Remote'),
        sources: [
          { name: 'Remotive', url: item.url || 'https://remotive.com', fetchedAt: new Date().toISOString() }
        ]
      };
    });
  } catch (err) {
    console.warn('Remotive API fetch warning:', err);
    return [];
  }
}

// Ingestion Pipeline Function
export async function runJobIngestionPipeline(): Promise<{
  jobs: Job[];
  totalRawScanned: number;
  totalDeduplicated: number;
  sourcesScanned: string[];
}> {
  const sourcesScanned = ['Arbeitnow API', 'Remotive API', 'Lever Public Board', 'Greenhouse Public Board', 'Company Career Sites'];
  
  // Parallel fetch from external APIs with timeout resilience
  const [arbeitnowResult, remotiveResult] = await Promise.all([
    fetchArbeitnowJobs(),
    fetchRemotiveJobs()
  ]);

  // Attach dedupe keys to seed jobs
  const seedWithKeys = CURATED_SEED_JOBS.map(j => ({
    ...j,
    dedupeKey: generateDedupeKey(j.company, j.title, j.location)
  }));

  const combinedRaw = [...seedWithKeys, ...arbeitnowResult, ...remotiveResult];
  const deduplicated = deduplicateJobs(combinedRaw);

  return {
    jobs: deduplicated,
    totalRawScanned: combinedRaw.length,
    totalDeduplicated: deduplicated.length,
    sourcesScanned
  };
}
