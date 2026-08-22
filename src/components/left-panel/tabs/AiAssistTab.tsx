import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw, Clock, User, Briefcase, GraduationCap, Wrench, Award } from 'lucide-react';

const MAX_CHARS = 4000;

const TARGET_SECTIONS = [
  { label: 'Personal', icon: User },
  { label: 'Experience', icon: Briefcase },
  { label: 'Education', icon: GraduationCap },
  { label: 'Skills', icon: Wrench },
  { label: 'Certifications', icon: Award },
];

const EXAMPLE_TEXT =
  "I'm a Senior Software Engineer with 6 years of experience. At TechCorp (Jan 2021 - Present), I migrated a monolith to microservices using Go and React. Before that, I completed my BS in CS at Stanford University (2016-2020).";

export const AiAssistTab: React.FC = () => {
  const [text, setText] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);

  const handleProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isProcessing) return;

    setIsProcessing(true);
    setIsDone(false);

    // Simulate AI parsing / structuring delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
    }, 1500);
  };

  const charCount = text.length;
  const isOverLimit = charCount > MAX_CHARS;

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
          <Badge
            variant="secondary"
            className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-600"
          >
            Preview
          </Badge>
        </div>

        <p className="text-xs leading-relaxed text-slate-500">
          Paste your resume as plain paragraphs — your bio, job history, education, skills — and
          the AI will structure it into the sections on the right.
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
                disabled={isProcessing}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 disabled:pointer-events-none disabled:opacity-40"
              >
                Try an example
              </button>
            </div>
            <Textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setIsDone(false);
              }}
              placeholder="e.g., I'm a Senior Software Engineer with 6 years of experience. At TechCorp (Jan 2021 - Present), I migrated a monolith to microservices using Go and React. Before that, I completed my BS in CS at Stanford University (2016-2020)."
              rows={8}
              className={`resize-none rounded-xl p-3 text-sm min-h-[180px] focus-visible:ring-slate-900/10 focus-visible:border-slate-400 ${
                isOverLimit ? 'border-red-400 focus-visible:ring-red-400/10 focus-visible:border-red-400' : ''
              }`}
              disabled={isProcessing}
            />
            <p className={`text-right text-[11px] ${isOverLimit ? 'text-red-500' : 'text-slate-400'}`}>
              {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
            </p>
          </div>

          <button
            type="submit"
            disabled={!text.trim() || isProcessing || isOverLimit}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/10 transition-all hover:bg-black disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed active:scale-[0.99]"
          >
            {isProcessing ? (
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

      {isDone && (
        <div className="flex gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-600 animate-in fade-in duration-200">
          <div className="mt-0.5 flex-shrink-0">
            <Clock size={16} className="text-indigo-500" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-700">Coming soon</p>
            <p className="text-xs leading-relaxed text-slate-500">
              AI parsing isn't wired up yet. Once it is, this text will automatically populate
              your Personal, Experience, Education, Skills, and Certifications tabs — no manual
              re-typing needed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
