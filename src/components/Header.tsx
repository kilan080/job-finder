'use client';

import React from 'react';
import { 
  Radar, 
  BookmarkCheck, 
  Search, 
  UserCheck, 
  Zap,
  TrendingUp
} from 'lucide-react';
import { CandidateProfile } from '@/types/job';

interface HeaderProps {
  profile: CandidateProfile;
  totalMatched: number;
  savedCount: number;
  appliedCount: number;
  primeFitCount: number;
  onOpenProfile: () => void;
  onOpenTracker: () => void;
  onTriggerScan: () => void;
  isScanning: boolean;
  activeTab: 'feed' | 'tracker';
  setActiveTab: (tab: 'feed' | 'tracker') => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  totalMatched,
  savedCount,
  appliedCount,
  primeFitCount,
  onOpenProfile,
  onOpenTracker: _onOpenTracker,
  onTriggerScan,
  isScanning,
  activeTab,
  setActiveTab
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#07090e]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo & Live Radar */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#090d16]">
                <Zap className="h-5 w-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-gradient-to-r from-white via-indigo-100 to-indigo-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                  MatchPulse
                </span>
                <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                  AI Job Scanner
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Continuous Job Discovery & Match Scoring
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="ml-4 hidden md:flex items-center gap-1 rounded-lg bg-slate-900/90 p-1 border border-slate-800">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                activeTab === 'feed'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Search className="h-3.5 w-3.5" />
              Job Discovery ({totalMatched})
            </button>
            <button
              onClick={() => setActiveTab('tracker')}
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                activeTab === 'tracker'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <BookmarkCheck className="h-3.5 w-3.5" />
              Applications ({savedCount + appliedCount})
            </button>
          </div>
        </div>

        {/* Live Stats Ticker & Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Prime Fit Counter */}
          <div className="hidden lg:flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="font-semibold">{primeFitCount}</span> Prime Fits (90%+)
          </div>

          {/* Trigger Scan Button */}
          <button
            onClick={onTriggerScan}
            disabled={isScanning}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all border ${
              isScanning
                ? 'bg-indigo-950/60 border-indigo-700/50 text-indigo-300 animate-pulse'
                : 'bg-indigo-600/90 hover:bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/20 active:scale-95'
            }`}
          >
            <Radar className={`h-3.5 w-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning Web Sources...' : 'Scan Now'}</span>
          </button>

          {/* Profile & CV Intelligence Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-indigo-500/50 hover:bg-slate-800"
          >
            <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{profile.name.split(' ')[0]} Profile</span>
            <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] text-indigo-300 font-mono">
              {profile.skills.length} Skills
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
