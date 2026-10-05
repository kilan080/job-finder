'use client';

import React, { useState } from 'react';
import { 
  Bookmark, 
  Send, 
  MessageSquare, 
  Award, 
  XCircle, 
  Building2, 
  ExternalLink, 
  Trash2, 
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { Job, ApplicationRecord, ApplicationStatus, MatchAnalysis } from '@/types/job';

interface ApplicationTrackerProps {
  jobs: Job[];
  matchMap: Map<string, MatchAnalysis>;
  applications: Record<string, ApplicationRecord>;
  onSelectJob: (job: Job) => void;
  onUpdateStatus: (jobId: string, status: ApplicationStatus) => void;
  onRemoveApplication: (jobId: string) => void;
}

const STAGES: { key: ApplicationStatus; label: string; icon: any; color: string }[] = [
  { key: 'saved', label: 'Saved Jobs', icon: Bookmark, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' },
  { key: 'applying', label: 'In Draft Pitch', icon: FileText, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  { key: 'applied', label: 'Applied', icon: Send, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  { key: 'interviewing', label: 'Interviewing', icon: MessageSquare, color: 'text-teal-400 bg-teal-500/10 border-teal-500/30' },
  { key: 'offered', label: 'Offers', icon: Award, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
];

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  jobs,
  matchMap,
  applications,
  onSelectJob,
  onUpdateStatus,
  onRemoveApplication
}) => {
  const [activeStage, setActiveStage] = useState<ApplicationStatus>('saved');

  // Filter jobs by current stage
  const appRecords = Object.values(applications).filter(app => app.status === activeStage);
  const trackedJobs = appRecords.map(app => jobs.find(j => j.id === app.jobId)).filter(Boolean) as Job[];

  return (
    <div className="space-y-6">
      {/* Stage Selection Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {STAGES.map(stage => {
          const Icon = stage.icon;
          const count = Object.values(applications).filter(a => a.status === stage.key).length;
          const isActive = activeStage === stage.key;

          return (
            <button
              key={stage.key}
              onClick={() => setActiveStage(stage.key)}
              className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all ${
                isActive
                  ? 'bg-slate-800 border-indigo-500/60 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${stage.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{stage.label}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">{count} jobs</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Pipeline List View */}
      {trackedJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-slate-400 mb-3">
            <Bookmark className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white">No jobs in {STAGES.find(s => s.key === activeStage)?.label}</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Save opportunities from the Job Discovery feed or update application statuses to track your interviews!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trackedJobs.map(job => {
            const match = matchMap.get(job.id);
            const record = applications[job.id];

            return (
              <div
                key={job.id}
                className="group relative rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition-all hover:border-indigo-500/40 hover:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{job.company} • {job.location}</p>
                  </div>

                  {match && (
                    <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-xs font-mono font-bold text-emerald-400">
                      {match.overallScore}%
                    </span>
                  )}
                </div>

                {/* Application Record Details */}
                <div className="mt-3 rounded-xl bg-slate-950 p-2.5 text-xs text-slate-300 flex items-center justify-between border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Saved: {new Date(record.savedAt).toLocaleDateString()}
                  </span>

                  <select
                    value={record.status}
                    onChange={(e) => onUpdateStatus(job.id, e.target.value as ApplicationStatus)}
                    className="rounded-md border border-slate-700 bg-slate-900 px-2 py-0.5 text-[11px] text-indigo-300 font-semibold focus:outline-none"
                  >
                    <option value="saved">Saved</option>
                    <option value="applying">Draft Pitch</option>
                    <option value="applied">Applied</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="offered">Offered</option>
                  </select>
                </div>

                {/* Card Actions */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3">
                  <button
                    onClick={() => onSelectJob(job)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>View Cover Letter & Details</span>
                  </button>

                  <button
                    onClick={() => onRemoveApplication(job.id)}
                    className="text-slate-500 hover:text-red-400 text-xs transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
