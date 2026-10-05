'use client';

import React from 'react';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink, 
  Layers, 
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Job, MatchAnalysis, ApplicationRecord } from '@/types/job';

interface JobCardProps {
  job: Job;
  match: MatchAnalysis;
  applicationRecord?: ApplicationRecord;
  onSelectJob: (job: Job) => void;
  onToggleSave: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  match,
  applicationRecord,
  onSelectJob,
  onToggleSave
}) => {
  const isSaved = applicationRecord?.status === 'saved';
  const isApplied = ['applied', 'interviewing', 'offered'].includes(applicationRecord?.status || '');

  // Determine score color theme
  let scoreColorClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  let scoreGlow = 'shadow-emerald-500/20';
  if (match.overallScore >= 90) {
    scoreColorClass = 'text-emerald-400 bg-emerald-500/15 border-emerald-500/40';
    scoreGlow = 'shadow-emerald-500/25';
  } else if (match.overallScore >= 75) {
    scoreColorClass = 'text-indigo-400 bg-indigo-500/15 border-indigo-500/40';
    scoreGlow = 'shadow-indigo-500/20';
  } else if (match.overallScore >= 60) {
    scoreColorClass = 'text-amber-400 bg-amber-500/15 border-amber-500/40';
    scoreGlow = 'shadow-amber-500/20';
  } else {
    scoreColorClass = 'text-slate-400 bg-slate-800 border-slate-700';
  }

  // Format posted time
  const postedDate = new Date(job.postedAt);
  const hoursAgo = Math.max(1, Math.round((Date.now() - postedDate.getTime()) / (1000 * 60 * 60)));
  const timeAgoText = hoursAgo < 24 ? `${hoursAgo}h ago` : `${Math.round(hoursAgo / 24)}d ago`;

  return (
    <div className="group relative rounded-2xl border border-slate-800/90 bg-slate-900/60 p-5 transition-all duration-300 hover:border-indigo-500/40 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-indigo-500/10">
      
      {/* Top Banner: Match Score Badge & Quick Action Buttons */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          {/* Match Score Badge */}
          <div className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-sm font-bold shadow-lg ${scoreColorClass} ${scoreGlow}`}>
            <Sparkles className="h-4 w-4" />
            <span>{match.overallScore}% Match</span>
          </div>

          {/* Grade Tag */}
          <span className="hidden sm:inline-block rounded-full bg-slate-800/80 border border-slate-700/80 px-2.5 py-0.5 text-xs text-slate-300">
            {match.grade}
          </span>

          {/* Featured Badge if applicable */}
          {job.isFeatured && (
            <span className="rounded-full bg-gradient-to-r from-amber-500/20 to-indigo-500/20 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300 flex items-center gap-1">
              <Zap className="h-3 w-3 text-amber-400" /> Hot Pick
            </span>
          )}
        </div>

        {/* Action Buttons: Save & Details */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(job);
            }}
            title={isSaved ? 'Remove from Saved' : 'Save Job'}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${
              isSaved
                ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-500/20'
                : 'bg-slate-800/70 border-slate-700/80 text-slate-400 hover:border-slate-600 hover:text-white'
            }`}
          >
            {isSaved ? <BookmarkCheck className="h-4 w-4 text-indigo-400" /> : <Bookmark className="h-4 w-4" />}
          </button>

          <button
            onClick={() => onSelectJob(job)}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-500 active:scale-95"
          >
            <span>Apply & Pitch</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content: Title & Company info */}
      <div className="cursor-pointer" onClick={() => onSelectJob(job)}>
        <h3 className="text-lg font-bold text-slate-100 transition-colors group-hover:text-indigo-300">
          {job.title}
        </h3>

        <div className="mt-1.5 flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-medium text-slate-200">
            <Building2 className="h-3.5 w-3.5 text-indigo-400" />
            <span>{job.company}</span>
          </div>

          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-emerald-400" />
            <span>{job.location}</span>
          </div>

          {job.remote && (
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
              100% Remote
            </span>
          )}

          {job.salaryMin && (
            <div className="flex items-center gap-1 text-slate-300 font-mono">
              <DollarSign className="h-3.5 w-3.5 text-amber-400" />
              <span>${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax! / 1000).toFixed(0)}k</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-slate-500 ml-auto">
            <Clock className="h-3 w-3" />
            <span>{timeAgoText}</span>
          </div>
        </div>

        {/* Why Match Explanation Banner */}
        <div className="mt-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 p-2.5 text-xs text-indigo-200/90 leading-relaxed">
          <div className="font-semibold text-indigo-300 mb-1 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
            <span>Why am I seeing this?</span>
          </div>
          <p className="text-[11px] text-slate-300">{match.whyThisMatches}</p>
        </div>

        {/* Matched vs Missing Skills Badges */}
        <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
          {/* Matched Skills */}
          {match.skillBreakdown.matched.map(skill => (
            <span
              key={skill}
              className="flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-medium text-emerald-300"
            >
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              {skill}
            </span>
          ))}

          {/* Missing Skills */}
          {match.skillBreakdown.missing.slice(0, 3).map(skill => (
            <span
              key={skill}
              className="flex items-center gap-1 rounded-md bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 text-[11px] font-medium text-slate-400"
            >
              <AlertCircle className="h-3 w-3 text-slate-500" />
              {skill}
            </span>
          ))}
        </div>

        {/* Footer: Deduplicated Sources */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-800/70 pt-2.5 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-indigo-400" />
            <span>Discovered from:</span>
            <div className="flex items-center gap-1">
              {job.sources.map((s, idx) => (
                <span
                  key={idx}
                  className="rounded bg-slate-800 border border-slate-700 px-1.5 py-0.5 text-[10px] text-slate-300"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>

          {isApplied && (
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
              Applied ✓
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
