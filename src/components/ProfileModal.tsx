'use client';

import React, { useState } from 'react';
import { 
  X, 
  User, 
  Sparkles, 
  Plus, 
  Check, 
  CheckCircle2, 
  Upload
} from 'lucide-react';
import { CandidateProfile } from '@/types/job';
import { parseCvTextToProfile } from '@/lib/ai/cvParser';

interface ProfileModalProps {
  isOpen: boolean;
  profile: CandidateProfile;
  onClose: () => void;
  onSaveProfile: (profile: CandidateProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  profile,
  onClose,
  onSaveProfile
}) => {
  const [formData, setFormData] = useState<CandidateProfile>(profile);
  const [newSkill, setNewSkill] = useState('');
  const [cvInputText, setCvInputText] = useState('');
  const [parsedStatus, setParsedStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const handleParseCv = () => {
    if (!cvInputText.trim()) return;
    const updated = parseCvTextToProfile(cvInputText, formData);
    setFormData(updated);
    setParsedStatus(`Extracted ${updated.skills.length} skills & experience parameters from your CV!`);
    setTimeout(() => setParsedStatus(null), 4000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-[#0b0f19] p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Candidate Profile & CV Intelligence</h2>
              <p className="text-xs text-slate-400">Match score engine updates automatically when you save changes.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-5 space-y-6">
          
          {/* CV Text Extraction Box */}
          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                Paste CV / Resume Text for Instant AI Parsing
              </label>
            </div>
            <textarea
              rows={3}
              value={cvInputText}
              onChange={(e) => setCvInputText(e.target.value)}
              placeholder="Paste raw text from your resume/CV here (e.g. 'Experienced with React 19, TypeScript, Next.js, Node.js, PostgreSQL...')"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleParseCv}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-500 transition-all"
              >
                <Upload className="h-3.5 w-3.5" />
                Parse CV & Auto-Fill Profile
              </button>

              {parsedStatus && (
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" /> {parsedStatus}
                </span>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Skills Tag Management */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Primary Tech Skills ({formData.skills.length})
            </label>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.skills.map(skill => (
                <span
                  key={skill}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-800 border border-slate-700 px-3 py-1 text-xs text-indigo-300"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Add skill (e.g. Next.js, PostgreSQL, Docker)..."
                className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Experience Level & Remote Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Experience Level</label>
              <select
                value={formData.experienceLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, experienceLevel: e.target.value as CandidateProfile['experienceLevel'] }))}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
              >
                <option value="internship">Internship Level</option>
                <option value="junior">Junior / Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Remote Work Preference</label>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, remoteOnly: !prev.remoteOnly }))}
                className={`w-full rounded-xl border p-2 text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  formData.remoteOnly
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                <CheckCircle2 className={`h-4 w-4 ${formData.remoteOnly ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span>{formData.remoteOnly ? 'Remote Only Required' : 'Open to On-site / Hybrid'}</span>
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all"
            >
              <Check className="h-4 w-4" />
              Save & Re-Score Jobs
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
