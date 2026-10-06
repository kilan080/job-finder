'use client';

import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  FileText, 
  Send, 
  ShieldCheck, 
  Layers,
  Award,
  Briefcase
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Job, MatchAnalysis, CandidateProfile, ApplicationRecord, ApplicationStatus } from '@/types/job';
import { generateApplicationPitch, ApplicationPitchResult } from '@/lib/ai/coverLetterGenerator';

interface JobDetailDrawerProps {
  job: Job | null;
  match: MatchAnalysis | null;
  profile: CandidateProfile;
  applicationRecord?: ApplicationRecord;
  onClose: () => void;
  onUpdateStatus: (jobId: string, status: ApplicationStatus, customCoverLetter?: string) => void;
}

export const JobDetailDrawer: React.FC<JobDetailDrawerProps> = ({
  job,
  match,
  profile,
  applicationRecord,
  onClose,
  onUpdateStatus
}) => {
  const [copiedType, setCopiedType] = useState<'letter' | 'pitch' | 'subject' | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'pitch' | 'ats'>('details');
  const [pitchData, setPitchData] = useState<ApplicationPitchResult | null>(null);

  if (!job || !match) return null;

  const currentStatus = applicationRecord?.status || 'saved';

  // Generate pitch on demand
  const handleGeneratePitch = () => {
    const generated = generateApplicationPitch(job, profile, match);
    setPitchData(generated);
    setActiveTab('pitch');
  };

  const handleCopy = (text: string, type: 'letter' | 'pitch' | 'subject') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleStatusChange = (status: ApplicationStatus) => {
    onUpdateStatus(job.id, status, pitchData?.coverLetter);
    if (['applied', 'interviewing', 'offered'].includes(status)) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (_e) {}
    }
  };

  const pitch = pitchData || generateApplicationPitch(job, profile, match);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      <div className="relative flex h-full w-full max-w-2xl flex-col bg-[#0b0f19] border-l border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Drawer Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-[#07090e]/90 p-5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-indigo-400 font-bold text-lg">
              {job.company.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-snug">{job.title}</h2>
              <p className="text-xs text-indigo-300 font-medium">{job.company} • {job.location}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Navigation Tabs */}
        <div className="flex items-center border-b border-slate-800 bg-slate-900/60 px-5 pt-2">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-all ${
              activeTab === 'details'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            Job Overview & Match
          </button>

          <button
            onClick={() => {
              if (!pitchData) handleGeneratePitch();
              setActiveTab('pitch');
            }}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-all ${
              activeTab === 'pitch'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="h-4 w-4 text-emerald-400" />
            Tailored Pitch & Cover Letter
          </button>

          <button
            onClick={() => setActiveTab('ats')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-all ${
              activeTab === 'ats'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="h-4 w-4 text-indigo-400" />
            ATS Keyword Checklist
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: Job Overview & Match Analysis */}
          {activeTab === 'details' && (
            <>
              {/* Match Scoring Card */}
              <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-5 shadow-lg">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold">
                      Match Engine Rating
                    </span>
                    <h3 className="text-2xl font-black text-white font-mono flex items-center gap-2">
                      <span>{match.overallScore}%</span>
                      <span className="text-sm font-sans font-normal text-emerald-400">({match.grade})</span>
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 shadow-inner">
                    <Award className="h-6 w-6" />
                  </div>
                </div>

                {/* Score Breakdown Progress Bars */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Skills Match</span>
                      <span className="font-mono text-emerald-400">{match.skillBreakdown.matchScore}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${match.skillBreakdown.matchScore}%` }}></div>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Role Alignment</span>
                      <span className="font-mono text-indigo-400">{match.roleMatchScore}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${match.roleMatchScore}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-indigo-500/20 pt-3 text-xs text-indigo-200">
                  <span className="font-semibold text-indigo-300">Match Reason: </span>
                  {match.whyThisMatches}
                </div>
              </div>

              {/* Job Tags & Info */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-1 text-xs text-slate-300 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                  {job.location}
                </span>

                {job.remote && (
                  <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs text-emerald-400 font-semibold">
                    Remote Position
                  </span>
                )}

                <span className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-1 text-xs text-slate-300">
                  Level: {job.experienceLevel}
                </span>

                {job.salaryMin && (
                  <span className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs text-amber-300 font-mono">
                    ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax! / 1000).toFixed(0)}k {job.currency}
                  </span>
                )}
              </div>

              {/* Job Description */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 space-y-3">
                <h4 className="text-sm font-bold text-white">Role Description</h4>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </div>

              {/* Verified Discovery Sources */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                <h4 className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-indigo-400" />
                  Discovered Across Multiple Sources
                </h4>
                <div className="space-y-2">
                  {job.sources.map((s, i) => (
                    <a
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl bg-slate-800/80 p-2.5 text-xs text-slate-200 hover:bg-slate-800 hover:text-white transition-colors border border-slate-700/60"
                    >
                      <span className="font-semibold text-indigo-300">{s.name}</span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-indigo-400">
                        View Portal <ExternalLink className="h-3 w-3" />
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: AI Tailored Pitch & Cover Letter Generator */}
          {activeTab === 'pitch' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-xl text-xs text-emerald-300">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Tailored specifically for <strong>{job.company}</strong> based on your candidate skills.</span>
                </div>
              </div>

              {/* Subject Line Box */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-medium">Recommended Email / Application Subject Line:</span>
                  <button
                    onClick={() => handleCopy(pitch.suggestedSubjectLine, 'subject')}
                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
                  >
                    {copiedType === 'subject' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedType === 'subject' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs font-mono font-semibold text-white">{pitch.suggestedSubjectLine}</p>
              </div>

              {/* Full Cover Letter */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-indigo-400" /> Tailored Cover Letter
                  </span>
                  <button
                    onClick={() => handleCopy(pitch.coverLetter, 'letter')}
                    className="flex items-center gap-1 rounded bg-indigo-600/30 border border-indigo-500/50 px-2.5 py-1 text-xs text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all"
                  >
                    {copiedType === 'letter' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedType === 'letter' ? 'Copied!' : 'Copy Cover Letter'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={12}
                  value={pitch.coverLetter}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 font-sans leading-relaxed focus:outline-none"
                />
              </div>

              {/* Short Application Pitch */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Send className="h-4 w-4 text-emerald-400" /> Quick Application Message (LinkedIn / Form)
                  </span>
                  <button
                    onClick={() => handleCopy(pitch.shortPitch, 'pitch')}
                    className="flex items-center gap-1 rounded bg-emerald-600/30 border border-emerald-500/50 px-2.5 py-1 text-xs text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all"
                  >
                    {copiedType === 'pitch' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedType === 'pitch' ? 'Copied!' : 'Copy Pitch'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={5}
                  value={pitch.shortPitch}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 font-sans leading-relaxed focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 3: ATS Keyword Checklist */}
          {activeTab === 'ats' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Keywords Found in Your Profile
                </h4>
                <div className="flex flex-wrap gap-2">
                  {match.skillBreakdown.matched.map(skill => (
                    <span
                      key={skill}
                      className="flex items-center gap-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-xs font-medium text-emerald-300"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <h4 className="text-xs font-bold text-amber-300 mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-400" />
                  Recommended Keywords to Add for ATS Optimization
                </h4>
                <p className="text-xs text-slate-400 mb-3">
                  Including these exact phrases from the job listing will maximize ATS parsing success:
                </p>
                <div className="flex flex-wrap gap-2">
                  {match.skillBreakdown.missing.map(skill => (
                    <span
                      key={skill}
                      className="flex items-center gap-1 rounded-lg bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-xs font-medium text-amber-300"
                    >
                      + {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Drawer Bottom Status Tracker & Direct Apply Bar */}
        <div className="sticky bottom-0 z-10 border-t border-slate-800 bg-[#07090e]/95 p-4 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Status Pipeline Buttons */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[11px] font-medium text-slate-400 mr-1">Status:</span>
              {(['saved', 'applying', 'applied', 'interviewing', 'offered'] as ApplicationStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition-all border ${
                    currentStatus === status
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/20'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Direct Link to Job Portal */}
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition-all active:scale-95"
            >
              <span>Apply via Official Portal</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

          </div>
        </div>

      </div>
    </div>
  );
};
