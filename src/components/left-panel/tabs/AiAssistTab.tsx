import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import {
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Award,
} from 'lucide-react';
import { useResumeStore } from '@/lib/store/resume.slice';
import { aiExtractionSchema, type AiExtraction } from '@/lib/validations/resume.schema';
import type { PersonalInfo } from '@/types/resume.types';
import { MAX_CHARS } from '@/constants/aiAssist';

const TARGET_SECTIONS = [
  { label: 'Personal', icon: User },
  { label: 'Experience', icon: Briefcase },
  { label: 'Education', icon: GraduationCap },
  { label: 'Skills', icon: Wrench },
  { label: 'Certifications', icon: Award },
];

const EXAMPLE_TEXT =
  "I'm a Senior Software Engineer with 6 years of experience. At TechCorp (Jan 2021 - Present), I migrated a monolith to microservices using Go and React. Before that, I completed my BS in CS at Stanford University (2016-2020).";

type Status = 'idle' | 'loading' | 'success' | 'error';

const pluralize = (count: number, singular: string, plural = `${singular}s`) =>
  `${count} ${count === 1 ? singular : plural}`;

export const AiAssistTab: React.FC = () => {
  const { setPersonal, addTitle, addLink, addExperience, addEducation, addSkill, addCertification } =
    useResumeStore();
  const [text, setText] = React.useState('');
  const [status, setStatus] = React.useState<Status>('idle');
  const [message, setMessage] = React.useState<string | null>(null);

  const charCount = text.length;
  const isOverLimit = charCount > MAX_CHARS;

  // Merges the AI's structured extraction into the existing resume store,
  // reusing the same mutators the manual-entry tabs use. Only non-empty
  // personal fields are applied so we never blank out something the user
  // already typed that the AI simply didn't find in this pass. Returns a
  // human-readable summary of what was added, for the success message.
  const applyExtraction = (extracted: AiExtraction): string[] => {
    const personalUpdates: Partial<PersonalInfo> = {};
    (['fullName', 'email', 'phone', 'location', 'summary'] as const).forEach((field) => {
      const value = extracted.personal[field];
      if (typeof value === 'string' && value.trim()) {
        personalUpdates[field] = value.trim();
      }
    });
    if (Object.keys(personalUpdates).length > 0) {
      setPersonal(personalUpdates);
    }

    extracted.personal.titles?.forEach((title) => title.trim() && addTitle(title.trim()));
    extracted.personal.links?.forEach((link) => link.trim() && addLink(link.trim()));
    extracted.experience.forEach((exp) => addExperience(exp));
    extracted.education.forEach((edu) => addEducation(edu));
    extracted.skills.forEach((skill) => skill.trim() && addSkill(skill.trim()));
    extracted.certifications.forEach((cert) => cert.trim() && addCertification(cert.trim()));

    const parts: string[] = [];
    if (extracted.experience.length) parts.push(pluralize(extracted.experience.length, 'job'));
    if (extracted.education.length) parts.push(pluralize(extracted.education.length, 'education entry', 'education entries'));
    if (extracted.skills.length) parts.push(pluralize(extracted.skills.length, 'skill'));
    if (extracted.certifications.length) parts.push(pluralize(extracted.certifications.length, 'certification'));
    return parts;
  };

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || status === 'loading' || isOverLimit) return;

    setStatus('loading');
    setMessage(null);

    try {
      const res = await fetch('/api/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() }),
      });

      let body: unknown = null;
      try {
        body = await res.json();
      } catch {
        body = null;
      }

      if (!res.ok) {
        const errorMessage =
          body && typeof body === 'object' && 'error' in body && typeof (body as { error: unknown }).error === 'string'
            ? (body as { error: string }).error
            : 'Something went wrong. Please try again.';
        setStatus('error');
        setMessage(errorMessage);
        return;
      }

      const rawData = body && typeof body === 'object' && 'data' in body ? (body as { data: unknown }).data : undefined;
      const parsed = aiExtractionSchema.safeParse(rawData);
      if (!parsed.success) {
        setStatus('error');
        setMessage('The AI returned data in an unexpected format. Please try again.');
        return;
      }

      const addedParts = applyExtraction(parsed.data);
      setStatus('success');
      setMessage(
        addedParts.length > 0
          ? `Added ${addedParts.join(', ')} — plus any personal details found — to your resume.`
          : "Updated your personal details, but didn't find any experience, education, skills, or certifications in that text."
      );
    } catch {
      setStatus('error');
      setMessage("Couldn't reach the AI service. Check your connection and try again.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white">
              <Sparkles size={12} />
            </span>
            AI Assist
          </h4>
        </div>

        <p className="text-xs leading-relaxed text-slate-500">
          Paste your resume as plain paragraphs — your bio, job history, education, skills, or even
          a rambling stream-of-consciousness about yourself — and the AI will structure it into the
          sections on the right.
        </p>

        {/* Mirrors the resume preview's own sections, so it's clear what this maps to */}
        <div className="flex flex-wrap gap-1.5">
          {TARGET_SECTIONS.map(({ label, icon: Icon }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600"
            >
              <Icon size={11} className="text-slate-400" />
              {label}
            </span>
          ))}
        </div>

        <form onSubmit={handleProcess} className="space-y-2">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Raw Resume Text
              </label>
              <button
                type="button"
                onClick={() => setText(EXAMPLE_TEXT)}
                disabled={status === 'loading'}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 disabled:pointer-events-none disabled:opacity-40"
              >
                Try an example
              </button>
            </div>
            <Textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (status !== 'idle') {
                  setStatus('idle');
                  setMessage(null);
                }
              }}
              placeholder="e.g., I'm a Senior Software Engineer with 6 years of experience. At TechCorp (Jan 2021 - Present), I migrated a monolith to microservices using Go and React. Before that, I completed my BS in CS at Stanford University (2016-2020)."
              rows={8}
              className={`resize-none rounded-xl p-3 text-sm min-h-[180px] focus-visible:ring-slate-900/10 focus-visible:border-slate-400 ${
                isOverLimit ? 'border-red-400 focus-visible:ring-red-400/10 focus-visible:border-red-400' : ''
              }`}
              disabled={status === 'loading'}
            />
            <p className={`text-right text-[11px] ${isOverLimit ? 'text-red-500' : 'text-slate-400'}`}>
              {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
            </p>
          </div>

          <button
            type="submit"
            disabled={!text.trim() || status === 'loading' || isOverLimit}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/10 transition-all hover:bg-black disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed active:scale-[0.99]"
          >
            {status === 'loading' ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Analyzing details...
              </>
            ) : (
              <>
                <Sparkles size={14} className="text-indigo-300" />
                Structure with AI
              </>
            )}
          </button>
        </form>
      </div>

      {status === 'success' && message && (
        <div className="flex gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 animate-in fade-in duration-200">
          <div className="mt-0.5 flex-shrink-0">
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-emerald-800">Done</p>
            <p className="text-xs leading-relaxed text-emerald-700">{message}</p>
          </div>
        </div>
      )}

      {status === 'error' && message && (
        <div className="flex gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 animate-in fade-in duration-200">
          <div className="mt-0.5 flex-shrink-0">
            <AlertCircle size={16} className="text-red-500" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-red-800">Couldn't structure that text</p>
            <p className="text-xs leading-relaxed text-red-700">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
};
