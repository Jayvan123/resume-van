import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useResumeStore } from '@/lib/store/resume.slice';
import { Plus, X, Layers, Columns2 } from 'lucide-react';

/** A single skill row displayed as a bullet-dot item (matching the resume preview style) */
const SkillBulletItem: React.FC<{
  skill: string;
  onRemove: () => void;
}> = ({ skill, onRemove }) => (
  <div className="group flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/60 transition-all">
    {/* Bullet dot */}
    <span className="size-[6px] rounded-full bg-slate-400 flex-shrink-0 group-hover:bg-slate-600 transition-colors" />
    <span className="flex-1 text-sm text-slate-700 font-medium">{skill}</span>
    <button
      type="button"
      onClick={onRemove}
      className="opacity-0 group-hover:opacity-100 flex-shrink-0 rounded-full p-0.5 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
      title="Remove skill"
    >
      <X size={12} />
    </button>
  </div>
);

/** Add-skill input row */
const SkillInput: React.FC<{
  placeholder: string;
  onAdd: (skill: string) => void;
  accentClass?: string;
}> = ({ placeholder, onAdd, accentClass = 'bg-slate-900 hover:bg-black' }) => {
  const [value, setValue] = useState('');

  const commit = () => {
    if (value.trim()) {
      onAdd(value.trim());
      setValue('');
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); commit(); }
        }}
        placeholder={placeholder}
        className="flex-1 text-sm"
      />
      <button
        type="button"
        onClick={commit}
        className={`flex items-center gap-1 rounded-xl ${accentClass} px-3.5 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/10 transition-colors whitespace-nowrap`}
      >
        <Plus size={14} />
        Add
      </button>
    </div>
  );
};

export const SkillsTab: React.FC = () => {
  const {
    data,
    addSkill,
    removeSkill,
    setSkillMode,
    addHardSkill,
    removeHardSkill,
    addSoftSkill,
    removeSoftSkill,
  } = useResumeStore();

  const skillMode = data.skillMode ?? 'combined';
  const skills = data.skills ?? [];
  const hardSkills = data.hardSkills ?? [];
  const softSkills = data.softSkills ?? [];

  return (
    <div className="space-y-5">

      {/* ── Mode toggle ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex-shrink-0">
          Display mode:
        </span>
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setSkillMode('combined')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              skillMode === 'combined'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Layers size={12} />
            Combined
          </button>
          <button
            type="button"
            onClick={() => setSkillMode('separated')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              skillMode === 'separated'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Columns2 size={12} />
            Hard / Soft
          </button>
        </div>
      </div>

      {skillMode === 'combined' ? (
        /* ── Combined mode ──────────────────────────────────────── */
        <div className="space-y-3">
          <SkillInput
            placeholder="Type a skill and press Enter…"
            onAdd={addSkill}
          />

          {skills.length > 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-3 space-y-1.5">
              {skills.map((skill, index) => (
                <SkillBulletItem
                  key={index}
                  skill={skill}
                  onRemove={() => removeSkill(index)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center text-slate-400">
              <p className="text-sm font-medium">No skills added yet</p>
              <p className="text-xs mt-1">Start typing above to add your skills</p>
            </div>
          )}

          <p className="text-xs text-slate-400">
            Skills display as a bullet list in your resume — one per line.
          </p>
        </div>
      ) : (
        /* ── Separated (Hard / Soft) mode ───────────────────────── */
        <div className="space-y-5">

          {/* Hard Skills */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 uppercase tracking-wider">
                <span className="size-1.5 rounded-full bg-blue-500 inline-block" />
                Hard Skills
              </span>
              <span className="text-xs text-slate-400">Technical / measurable abilities</span>
            </div>

            <SkillInput
              placeholder="e.g. JavaScript, Photoshop, SQL…"
              onAdd={addHardSkill}
            />

            {hardSkills.length > 0 ? (
              <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-3 space-y-1.5">
                {hardSkills.map((skill, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-2.5 px-3 py-2 rounded-xl border border-blue-100 bg-white hover:border-blue-200 hover:bg-blue-50/40 transition-all"
                  >
                    <span className="size-[6px] rounded-full bg-blue-400 flex-shrink-0 group-hover:bg-blue-600 transition-colors" />
                    <span className="flex-1 text-sm text-slate-700 font-medium">{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeHardSkill(index)}
                      className="opacity-0 group-hover:opacity-100 flex-shrink-0 rounded-full p-0.5 text-blue-300 hover:text-red-500 hover:bg-red-50 transition-all"
                      title="Remove"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-blue-100 p-5 text-center text-slate-400">
                <p className="text-xs font-medium">No hard skills added yet</p>
              </div>
            )}
          </div>

          {/* Soft Skills */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-50 border border-violet-200 text-xs font-bold text-violet-700 uppercase tracking-wider">
                <span className="size-1.5 rounded-full bg-violet-500 inline-block" />
                Soft Skills
              </span>
              <span className="text-xs text-slate-400">Interpersonal / character traits</span>
            </div>

            <SkillInput
              placeholder="e.g. Communication, Adaptability…"
              onAdd={addSoftSkill}
            />

            {softSkills.length > 0 ? (
              <div className="rounded-2xl border border-violet-100 bg-violet-50/30 p-3 space-y-1.5">
                {softSkills.map((skill, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-2.5 px-3 py-2 rounded-xl border border-violet-100 bg-white hover:border-violet-200 hover:bg-violet-50/40 transition-all"
                  >
                    <span className="size-[6px] rounded-full bg-violet-400 flex-shrink-0 group-hover:bg-violet-600 transition-colors" />
                    <span className="flex-1 text-sm text-slate-700 font-medium">{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSoftSkill(index)}
                      className="opacity-0 group-hover:opacity-100 flex-shrink-0 rounded-full p-0.5 text-violet-300 hover:text-red-500 hover:bg-red-50 transition-all"
                      title="Remove"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-violet-100 p-5 text-center text-slate-400">
                <p className="text-xs font-medium">No soft skills added yet</p>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400">
            Hard and soft skills will each appear as their own bullet list section in your resume.
          </p>
        </div>
      )}
    </div>
  );
};
