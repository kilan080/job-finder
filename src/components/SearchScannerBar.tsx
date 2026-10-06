'use client';

import React from 'react';
import { 
  Search, 
  Globe, 
  Briefcase, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { SearchFilterState } from '@/types/job';

interface SearchScannerBarProps {
  filters: SearchFilterState;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilterState>>;
  totalCount: number;
  sourcesScannedCount: number;
  onReset: () => void;
}

const ROLE_PRESETS = [
  { label: 'All Roles', value: '' },
  { label: 'Frontend', value: 'frontend' },
  { label: 'React / Next.js', value: 'react' },
  { label: 'Fullstack', value: 'fullstack' },
  { label: 'Junior / Entry', value: 'junior' },
  { label: 'Internship', value: 'internship' },
];

const LOCATION_PRESETS = [
  { label: 'All Locations', value: '' },
  { label: 'Remote Only', value: 'remote' },
  { label: 'Nigeria', value: 'nigeria' },
  { label: 'Australia', value: 'australia' },
  { label: 'Canada', value: 'canada' },
  { label: 'United States', value: 'united states' },
  { label: 'Worldwide', value: 'worldwide' },
];

export const SearchScannerBar: React.FC<SearchScannerBarProps> = ({
  filters,
  setFilters,
  _totalCount,
  _sourcesScannedCount,
  onReset
}) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0b101d]/90 p-4 shadow-xl backdrop-blur-xl mb-6">
      {/* Top Search Bar & Score Threshold Slider */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Full Text Search Input */}
        <div className="lg:col-span-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
            placeholder="Search roles, skills (e.g. React, TypeScript, Next.js, Node)..."
            className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          {filters.query && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, query: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Match Score Threshold Slider */}
        <div className="lg:col-span-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-300 min-w-[160px]">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span>Min Match Score:</span>
            <span className="font-bold text-indigo-400 font-mono text-sm">{filters.minMatchScore}%+</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={filters.minMatchScore}
              onChange={(e) => setFilters(prev => ({ ...prev, minMatchScore: Number(e.target.value) }))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            
            {/* Quick preset buttons */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setFilters(prev => ({ ...prev, minMatchScore: 0 }))}
                className={`px-2 py-0.5 text-[10px] rounded font-medium border ${
                  filters.minMatchScore === 0 ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, minMatchScore: 75 }))}
                className={`px-2 py-0.5 text-[10px] rounded font-medium border ${
                  filters.minMatchScore === 75 ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                75%+
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, minMatchScore: 85 }))}
                className={`px-2 py-0.5 text-[10px] rounded font-medium border ${
                  filters.minMatchScore === 85 ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                85%+
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Chips Row */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        {/* Role Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium text-slate-400 mr-1 flex items-center gap-1">
            <Briefcase className="h-3 w-3 text-indigo-400" /> Role:
          </span>
          {ROLE_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => setFilters(prev => ({ ...prev, roleFilter: preset.value }))}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                filters.roleFilter === preset.value
                  ? 'bg-indigo-600/90 text-white shadow-sm border border-indigo-400/50'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Location & Remote Toggle */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium text-slate-400 mr-1 flex items-center gap-1">
            <Globe className="h-3 w-3 text-emerald-400" /> Location:
          </span>
          {LOCATION_PRESETS.map((loc) => (
            <button
              key={loc.label}
              onClick={() => {
                if (loc.value === 'remote') {
                  setFilters(prev => ({ ...prev, remoteOnly: !prev.remoteOnly }));
                } else {
                  setFilters(prev => ({ ...prev, locationFilter: loc.value }));
                }
              }}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                (loc.value === 'remote' ? filters.remoteOnly : filters.locationFilter === loc.value)
                  ? 'bg-emerald-600/90 text-white shadow-sm border border-emerald-400/50'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {loc.label}
            </button>
          ))}

          {/* Reset Filters */}
          <button
            onClick={onReset}
            className="ml-2 flex items-center gap-1 text-[11px] text-slate-400 hover:text-indigo-300 transition-colors"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        </div>
      </div>
    </div>
  );
};
