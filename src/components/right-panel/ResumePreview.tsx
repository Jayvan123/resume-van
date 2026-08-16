import React, { useRef } from 'react';
import { useResumeStore } from '@/lib/store/resume.slice';

export const ResumePreview: React.FC = () => {
  const { data } = useResumeStore();
  const previewRef = useRef<HTMLDivElement>(null);

  const hasData =
    data.personal.fullName !== '' ||
    data.experience.length > 0 ||
    data.education.length > 0;

  if (!hasData) {
    return (
      <div className="flex h-full items-center justify-center text-slate-400">
        <div className="text-center">
          <p className="text-5xl mb-4">👈</p>
          <p className="text-lg font-semibold text-slate-600">Start adding your details</p>
          <p className="text-sm mt-1 text-slate-400">Fill in the left panel and your resume will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto py-4 pl-2 pr-4">
      {/* A4/Letter paper sheet */}
      <div
        ref={previewRef}
        id="resume-preview-paper"
        className="mx-auto max-w-[660px] min-h-[900px] bg-white shadow-2xl rounded-sm px-8 py-8 text-slate-900"
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
      >
        {/* ── Header ─────────────────────────────────── */}
        <header className="border-b-2 border-slate-900 pb-3 mb-4 text-center">
          <h1 className="text-[24px] font-extrabold tracking-tight leading-none text-slate-900 mb-1.5"
              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
            {data.personal.fullName || 'YOUR NAME'}
          </h1>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-0.5 text-[12px] text-slate-600"
               style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
            {data.personal.email && <span>{data.personal.email}</span>}
            {data.personal.phone && (
              <><span className="text-slate-300">•</span><span>{data.personal.phone}</span></>
            )}
            {data.personal.location && (
              <><span className="text-slate-300">•</span><span>{data.personal.location}</span></>
            )}
          </div>
        </header>

        {/* ── Summary ─────────────────────────────────── */}
        {data.personal.summary && (
          <section className="mb-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-800 border-b border-slate-300 pb-1 mb-2"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
              Professional Summary
            </h2>
            <p className="text-[13px] leading-relaxed text-slate-700">
              {data.personal.summary}
            </p>
          </section>
        )}

        {/* ── Experience ───────────────────────────────── */}
        {data.experience.length > 0 && (
          <section className="mb-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-800 border-b border-slate-300 pb-1 mb-3"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
              Work Experience
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex items-baseline justify-between gap-4 mb-0.5">
                    <div>
                      <span className="text-[13.5px] font-bold text-slate-900"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                        {exp.role}
                      </span>
                      <span className="text-[13px] text-slate-600 ml-1.5">— {exp.company}</span>
                    </div>
                    <span className="text-[12px] text-slate-500 whitespace-nowrap flex-shrink-0"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      {exp.dates}
                    </span>
                  </div>
                  {exp.description && (
                    <div className="text-[12.5px] leading-relaxed text-slate-700 whitespace-pre-line pl-3 border-l border-slate-200 mt-1">
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Education ───────────────────────────────── */}
        {data.education.length > 0 && (
          <section className="mb-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-800 border-b border-slate-300 pb-1 mb-3"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
              Education
            </h2>
            <div className="space-y-2.5">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex items-baseline justify-between gap-4">
                  <div>
                    <span className="text-[13.5px] font-bold text-slate-900"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      {edu.school}
                    </span>
                    <p className="text-[12.5px] text-slate-600 mt-0.5">{edu.degree}</p>
                  </div>
                  <span className="text-[12px] text-slate-500 whitespace-nowrap flex-shrink-0"
                        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    {edu.dates}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Skills ──────────────────────────────────── */}
        {data.skills.length > 0 && (
          <section className="mb-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-800 border-b border-slate-300 pb-1 mb-2"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
              Skills
            </h2>
            <p className="text-[13px] leading-relaxed text-slate-700">
              {data.skills.join(' · ')}
            </p>
          </section>
        )}

        {/* ── Certifications ──────────────────────────── */}
        {data.certifications.length > 0 && (
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-800 border-b border-slate-300 pb-1 mb-2"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
              Certifications
            </h2>
            <ul className="list-disc list-inside text-[13px] text-slate-700 space-y-1">
              {data.certifications.map((cert, index) => (
                <li key={index}>{cert}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};
