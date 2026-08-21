import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Info, RefreshCw } from 'lucide-react';

export const AiAssistTab: React.FC = () => {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'info' | 'success'; text: string } | null>(null);

  const handleProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsProcessing(true);
    setMessage(null);

    // Simulate AI parsing / structuring delay
    setTimeout(() => {
      setIsProcessing(false);
      setMessage({
        type: 'info',
        text: 'AI parsing integration is coming soon! In the final version, this will automatically extract details and populate your Personal, Experience, Education, Skills, and Certifications tabs.',
      });
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 animate-pulse">
            <Sparkles size={12} />
          </span>
          AI Assist
        </h4>

        <p className="text-xs leading-relaxed text-slate-500">
          Paste or type your resume details in plain paragraphs (e.g. your bio, a summary of your jobs, certifications, and skills). The AI will analyze the text, structure it, and automatically populate the corresponding tabs.
        </p>

        <form onSubmit={handleProcess} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Raw Resume Text / Paragraphs
            </label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., I'm a Senior Software Engineer with 6 years of experience. At TechCorp (Jan 2021 - Present), I migrated a monolith to microservices using Go and React. Before that, I completed my BS in CS at Stanford University (2016-2020)."
              rows={8}
              className="resize-none rounded-xl p-3 text-sm min-h-[180px] focus-visible:ring-violet-500/10 focus-visible:border-violet-500"
              disabled={isProcessing}
            />
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={!text.trim() || isProcessing}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/10 transition-all hover:bg-black disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              {isProcessing ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Analyzing details...
                </>
              ) : (
                <>
                  <Sparkles size={14} className="text-violet-400" />
                  Structure with AI
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {message && (
        <div className="flex gap-2.5 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 text-blue-700 animate-fadeIn">
          <div className="mt-0.5 flex-shrink-0">
            <Info size={16} className="text-blue-500" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold">Preview Mode</p>
            <p className="text-xs leading-relaxed text-blue-600/90">{message.text}</p>
          </div>
        </div>
      )}
    </div>
  );
};
