'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { SearchScannerBar } from '@/components/SearchScannerBar';
import { JobCard } from '@/components/JobCard';
import { JobDetailDrawer } from '@/components/JobDetailDrawer';
import { ProfileModal } from '@/components/ProfileModal';
import { ApplicationTracker } from '@/components/ApplicationTracker';
import { 
  CandidateProfile, 
  Job, 
  MatchAnalysis, 
  SearchFilterState, 
  ApplicationRecord, 
  ApplicationStatus 
} from '@/types/job';
import { calculateJobMatch } from '@/lib/matching/scoringEngine';
import { 
  Radar, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Building2, 
  RefreshCw,
  Zap,
  TrendingUp,
  BookmarkCheck
} from 'lucide-react';

const DEFAULT_PROFILE: CandidateProfile = {
  id: 'user-1',
  name: 'Olamilekan Dev',
  email: 'olamilekan.dev@example.com',
  title: 'React / Next.js Developer',
  skills: ['React', 'TypeScript', 'Next.js', 'Node.js', 'Express', 'PostgreSQL', 'Tailwind CSS', 'REST API', 'Git'],
  targetRoles: ['Frontend Engineer', 'Full-Stack Developer', 'Junior Frontend Developer', 'Software Engineering Intern', 'React Developer'],
  experienceLevel: 'junior',
  locations: ['Nigeria', 'Australia', 'Canada', 'United States', 'Worldwide', 'Remote'],
  remoteOnly: true,
  minSalary: 40000,
  bio: 'Ambitious web developer with expertise in React, TypeScript, Next.js, and Node.js backend systems.'
};

const INITIAL_FILTERS: SearchFilterState = {
  query: '',
  roleFilter: '',
  locationFilter: '',
  remoteOnly: false,
  minMatchScore: 0,
  sourceFilter: '',
  experienceFilter: '',
  sortBy: 'score'
};

export default function HomePage() {
  const [profile, setProfile] = useState<CandidateProfile>(DEFAULT_PROFILE);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const [filters, setFilters] = useState<SearchFilterState>(INITIAL_FILTERS);
  const [activeTab, setActiveTab] = useState<'feed' | 'tracker'>('feed');

  // Selected Job for Drawer Modal
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  // Application Pipeline Records (JobId -> ApplicationRecord)
  const [applications, setApplications] = useState<Record<string, ApplicationRecord>>({});

  // Load saved state from LocalStorage on mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('matchpulse_profile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
      const savedApps = localStorage.getItem('matchpulse_apps');
      if (savedApps) {
        setApplications(JSON.parse(savedApps));
      }
    } catch (e) {}

    fetchJobs();
  }, []);

  // Save profile & application changes to LocalStorage
  const handleSaveProfile = (newProfile: CandidateProfile) => {
    setProfile(newProfile);
    try {
      localStorage.setItem('matchpulse_profile', JSON.stringify(newProfile));
    } catch (e) {}
  };

  const handleUpdateApplicationStatus = (jobId: string, status: ApplicationStatus, customCoverLetter?: string) => {
    setApplications(prev => {
      const existing = prev[jobId] || {
        jobId,
        savedAt: new Date().toISOString(),
        status
      };
      const updated = {
        ...existing,
        status,
        appliedAt: status === 'applied' ? new Date().toISOString() : existing.appliedAt,
        customCoverLetter: customCoverLetter || existing.customCoverLetter
      };
      const newApps = { ...prev, [jobId]: updated };
      try {
        localStorage.setItem('matchpulse_apps', JSON.stringify(newApps));
      } catch (e) {}
      return newApps;
    });
  };

  const handleToggleSave = (job: Job) => {
    const isSaved = applications[job.id]?.status === 'saved';
    if (isSaved) {
      handleRemoveApplication(job.id);
    } else {
      handleUpdateApplicationStatus(job.id, 'saved');
    }
  };

  const handleRemoveApplication = (jobId: string) => {
    setApplications(prev => {
      const newApps = { ...prev };
      delete newApps[jobId];
      try {
        localStorage.setItem('matchpulse_apps', JSON.stringify(newApps));
      } catch (e) {}
      return newApps;
    });
  };

  // Fetch Jobs from backend API pipeline
  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/jobs');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        // Raw jobs returned from pipeline
        const rawJobs: Job[] = json.data.map((item: any) => item.job);
        setJobs(rawJobs);
      }
    } catch (err) {
      console.error('Fetch jobs error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger Live Discovery Scan
  const handleTriggerScan = async () => {
    setIsScanning(true);
    setScanMessage('Scanning live job endpoints across Arbeitnow, Remotive, Greenhouse, Lever, and Company career feeds...');
    try {
      const res = await fetch('/api/jobs/scan', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setScanMessage(json.scanSummary.message);
        await fetchJobs();
      }
    } catch (err) {
      setScanMessage('Scan completed with partial results.');
    } finally {
      setIsScanning(false);
      setTimeout(() => setScanMessage(null), 5000);
    }
  };

  // Re-calculate scores for all jobs whenever profile changes
  const scoredJobsMap = useMemo(() => {
    const map = new Map<string, MatchAnalysis>();
    for (const job of jobs) {
      map.set(job.id, calculateJobMatch(job, profile));
    }
    return map;
  }, [jobs, profile]);

  // Filter & Sort Jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const match = scoredJobsMap.get(job.id);
      if (!match) return false;

      // Text query
      if (filters.query) {
        const qLower = filters.query.toLowerCase();
        const matchesText = 
          job.title.toLowerCase().includes(qLower) ||
          job.company.toLowerCase().includes(qLower) ||
          job.description.toLowerCase().includes(qLower) ||
          job.skills.some(s => s.toLowerCase().includes(qLower));
        if (!matchesText) return false;
      }

      // Role filter
      if (filters.roleFilter) {
        if (!job.title.toLowerCase().includes(filters.roleFilter.toLowerCase())) return false;
      }

      // Location filter
      if (filters.locationFilter) {
        if (!job.location.toLowerCase().includes(filters.locationFilter.toLowerCase())) return false;
      }

      // Remote filter
      if (filters.remoteOnly && !job.remote) return false;

      // Min Match Score
      if (match.overallScore < filters.minMatchScore) return false;

      return true;
    }).sort((a, b) => {
      const scoreA = scoredJobsMap.get(a.id)?.overallScore || 0;
      const scoreB = scoredJobsMap.get(b.id)?.overallScore || 0;
      return scoreB - scoreA;
    });
  }, [jobs, scoredJobsMap, filters]);

  // Statistics Counters
  const primeFitCount = useMemo(() => {
    return Array.from(scoredJobsMap.values()).filter(m => m.overallScore >= 90).length;
  }, [scoredJobsMap]);

  const savedCount = useMemo(() => {
    return Object.values(applications).filter(a => a.status === 'saved').length;
  }, [applications]);

  const appliedCount = useMemo(() => {
    return Object.values(applications).filter(a => ['applied', 'interviewing', 'offered'].includes(a.status)).length;
  }, [applications]);

  const selectedMatch = selectedJob ? scoredJobsMap.get(selectedJob.id) || null : null;

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans">
      
      {/* Navigation Header */}
      <Header
        profile={profile}
        totalMatched={filteredJobs.length}
        savedCount={savedCount}
        appliedCount={appliedCount}
        primeFitCount={primeFitCount}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenTracker={() => setActiveTab('tracker')}
        onTriggerScan={handleTriggerScan}
        isScanning={isScanning}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-6 sm:px-6">
        
        {/* Live Scanner Banner Notification */}
        {scanMessage && (
          <div className="mb-6 flex items-center justify-between rounded-xl bg-indigo-600/20 border border-indigo-500/40 p-4 text-xs text-indigo-200 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <Radar className="h-4 w-4 text-indigo-400 animate-spin" />
              <span>{scanMessage}</span>
            </div>
            <button onClick={() => setScanMessage(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* FEED DISCOVERY VIEW */}
        {activeTab === 'feed' && (
          <>
            {/* Search & Filter Controls Bar */}
            <SearchScannerBar
              filters={filters}
              setFilters={setFilters}
              totalCount={filteredJobs.length}
              sourcesScannedCount={5}
              onReset={() => setFilters(INITIAL_FILTERS)}
            />

            {/* Loading State */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin mb-3" />
                <p className="text-xs text-slate-400">Ingesting and scoring web jobs...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              /* Empty Search Results */
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-slate-400 mb-3">
                  <Radar className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-base font-bold text-white">No jobs match your current filters</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Try lowering your minimum match score threshold or clearing search parameters.
                </p>
                <button
                  onClick={() => setFilters(INITIAL_FILTERS)}
                  className="mt-4 rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              /* Job List Feed */
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span>Showing <strong>{filteredJobs.length}</strong> prioritized developer opportunities</span>
                  <span className="font-mono text-indigo-400">{primeFitCount} Prime Fit Opportunities</span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {filteredJobs.map(job => {
                    const match = scoredJobsMap.get(job.id)!;
                    const record = applications[job.id];

                    return (
                      <JobCard
                        key={job.id}
                        job={job}
                        match={match}
                        applicationRecord={record}
                        onSelectJob={setSelectedJob}
                        onToggleSave={handleToggleSave}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* APPLICATION TRACKER VIEW */}
        {activeTab === 'tracker' && (
          <ApplicationTracker
            jobs={jobs}
            matchMap={scoredJobsMap}
            applications={applications}
            onSelectJob={setSelectedJob}
            onUpdateStatus={handleUpdateApplicationStatus}
            onRemoveApplication={handleRemoveApplication}
          />
        )}

      </main>

      {/* Job Detail & AI Pitch Drawer */}
      <JobDetailDrawer
        job={selectedJob}
        match={selectedMatch}
        profile={profile}
        applicationRecord={selectedJob ? applications[selectedJob.id] : undefined}
        onClose={() => setSelectedJob(null)}
        onUpdateStatus={handleUpdateApplicationStatus}
      />

      {/* Candidate Profile & CV Intelligence Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        profile={profile}
        onClose={() => setIsProfileOpen(false)}
        onSaveProfile={handleSaveProfile}
      />

    </div>
  );
}
