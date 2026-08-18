import React from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { TABS } from '@/constants/tabs';
import { TabId } from '@/types/resume.types';
import { useResumeStore } from '@/lib/store/resume.slice';
import { downloadPDF } from '@/lib/pdf/generate';
import { PersonalTab } from './left-panel/tabs/PersonalTab';
import { ExperienceTab } from './left-panel/tabs/ExperienceTab';
import { EducationTab } from './left-panel/tabs/EducationTab';
import { SkillsTab } from './left-panel/tabs/SkillsTab';
import { CertificationsTab } from './left-panel/tabs/CertificationsTab';

/**
 * ResumeBuilder
 * ----------------------------------------------------------------
 * Single-file layout: page top bar + equal-width split-screen
 * (left = editor, right = live preview). Tab forms (Personal,
 * Experience, Education, Skills, Certifications) stay in their own
 * files under left-panel/tabs/ — each carries its own react-hook-form
 * + zod validation, so they're imported rather than inlined here.
 */

const renderTabContent = (activeTab: TabId) => {
  switch (activeTab) {
    case 'personal': return <PersonalTab />;
    case 'experience': return <ExperienceTab />;
    case 'education': return <EducationTab />;
    case 'skills': return <SkillsTab />;
    case 'certifications': return <CertificationsTab />;
    default: return <PersonalTab />;
  }
};

/** Slim top bar: title + subtitle on the left, Load/Clear buttons on the right. */
const TopBar: React.FC<{
  onLoadSample: () => void;
  onClear: () => void;
  hasData: boolean;
}> = ({ onLoadSample, onClear, hasData }) => (
  <div className="flex items-center justify-between px-6 py-6">
    <div>
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 leading-none">ResumeVan</h1>
      <p className="text-sm text-slate-500 mt-2">ATS-Optimized Resume Builder</p>
    </div>
    <div className="flex items-center gap-2">
      {hasData ? (
        <button
          onClick={onClear}
          className="text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl transition-all shadow-sm"
        >
          Clear Data
        </button>
      ) : (
        <button
          onClick={onLoadSample}
          className="text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl transition-all shadow-sm"
        >
          Load Sample
        </button>
      )}
    </div>
  </div>
);

/**
 * Flat underline tabs — no folder/card shapes, no border-radius or
 * negative-margin tricks to keep in sync. Just text plus a bottom-border
 * indicator on the active tab, aligned with the content padding below.
 */
const TabNav: React.FC<{ activeTab: TabId; onTabChange: (tabId: TabId) => void }> = ({
  activeTab,
  onTabChange,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = React.useState<React.CSSProperties>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const activeEl = container.querySelector(`#tab-${activeTab}`) as HTMLElement;
    if (activeEl) {
      setIndicatorStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        opacity: 1,
      });
    }
  }, [activeTab]);

  return (
    <nav
      ref={containerRef}
      className="relative flex-shrink-0 flex items-center gap-6 overflow-x-auto border-b border-slate-200 bg-white px-6 [scrollbar-width:none]"
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            aria-current={isActive ? 'page' : undefined}
            className={`
              relative flex-shrink-0 whitespace-nowrap py-3.5 text-sm
              transition-colors duration-150 ease-out
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/30 focus-visible:rounded-sm
              ${isActive ? 'font-semibold text-slate-900' : 'font-medium text-slate-400 hover:text-slate-600'}
            `}
          >
            {tab.label}
          </button>
        );
      })}
      <span
        className="absolute bottom-0 h-0.5 bg-slate-900 rounded-full transition-all duration-300 ease-out"
        style={indicatorStyle}
      />
    </nav>
  );
};

/** Left panel: tab nav, active tab's form, and a footer with Download PDF. */
const LeftPanel: React.FC<{
  onDownload: () => void;
  hasData: boolean;
  isDownloading: boolean;
}> = ({ onDownload, hasData, isDownloading }) => {
  const { activeTab, setActiveTab } = useResumeStore();

  return (
    <div className="flex flex-col h-full">
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
        {renderTabContent(activeTab)}
      </div>
      <div className="flex flex-shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-white px-6 py-4">
        <p className="text-xs text-slate-400">
          Auto-saved to browser
        </p>
        <button
          onClick={onDownload}
          disabled={!hasData || isDownloading}
          className="flex items-center gap-2 text-sm font-semibold text-white bg-slate-900 hover:bg-black disabled:bg-slate-300 disabled:cursor-not-allowed px-4 py-2 rounded-xl shadow-sm ring-1 ring-inset ring-white/10 transition-all"
        >
          {isDownloading ? (
            <>
              <RefreshCw size={14} className="animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <Download size={14} />
              Download PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const ResumePreview: React.FC = () => {
  const { data } = useResumeStore();

  return (
    <div className="py-6 pl-2 pr-4">
      <div
        id="resume-preview-paper"
        className="mx-auto max-w-[660px] min-h-[900px] bg-white border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] px-10 py-10 text-slate-900"
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
      >
        <header className="pb-3 mb-4 text-center">
          <h1
            className="text-[24px] font-extrabold tracking-tight leading-none text-slate-900 mb-1.5"
            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
          >
            {data.personal.fullName || 'YOUR NAME'}
          </h1>
          <div
            className="flex flex-wrap justify-center gap-x-4 gap-y-0.5 text-[12px] text-slate-600"
            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
          >
            {data.personal.email && <span>{data.personal.email}</span>}
            {data.personal.phone && (
              <><span className="text-slate-300">•</span><span>{data.personal.phone}</span></>
            )}
            {data.personal.location && (
              <><span className="text-slate-300">•</span><span>{data.personal.location}</span></>
            )}
          </div>
        </header>

        <section className="mb-4">
          <h2
            className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-800 border-b border-slate-300 pb-1 mb-2"
            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
          >
            Professional Summary
          </h2>
          <p className="text-[13px] leading-relaxed text-slate-700">
            {data.personal.summary}
          </p>
        </section>

        <section className="mb-4">
          <h2
            className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-800 border-b border-slate-300 pb-1 mb-3"
            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
          >
            Work Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between gap-4 mb-0.5">
                  <div>
                    <span
                      className="text-[13.5px] font-bold text-slate-900"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    >
                      {exp.role}
                    </span>
                    <span className="text-[13px] text-slate-600 ml-1.5">— {exp.company}</span>
                  </div>
                  <span
                    className="text-[12px] text-slate-500 whitespace-nowrap flex-shrink-0"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
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

        <section className="mb-4">
          <h2
            className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-800 border-b border-slate-300 pb-1 mb-3"
            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
          >
            Education
          </h2>
          <div className="space-y-2.5">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex items-baseline justify-between gap-4">
                <div>
                  <span
                    className="text-[13.5px] font-bold text-slate-900"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    {edu.school}
                  </span>
                  <p className="text-[12.5px] text-slate-600 mt-0.5">{edu.degree}</p>
                </div>
                <span
                  className="text-[12px] text-slate-500 whitespace-nowrap flex-shrink-0"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  {edu.dates}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-4">
          <h2
            className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-800 border-b border-slate-300 pb-1 mb-2"
            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
          >
            Skills
          </h2>
          <p className="text-[13px] leading-relaxed text-slate-700">
            {data.skills.join(' · ')}
          </p>
        </section>

        <section>
          <h2
            className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-800 border-b border-slate-300 pb-1 mb-2"
            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
          >
            Certifications
          </h2>
          <ul className="list-disc list-inside text-[13px] text-slate-700 space-y-1">
            {data.certifications.map((cert, index) => (
              <li key={index}>{cert}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export const ResumeBuilder: React.FC = () => {
  const { data, loadSampleData, resetAll, isDownloading, setIsDownloading } = useResumeStore();

  const hasData =
    data.personal.fullName !== '' ||
    data.experience.length > 0 ||
    data.education.length > 0;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadPDF(data);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <TopBar onLoadSample={loadSampleData} onClear={resetAll} hasData={hasData} />

      {/* Equal-width split screen: editor (left) / live preview (right) */}
      <div className="flex-1 flex items-stretch">
        <div className="w-1/2 flex-shrink-0 py-4 pl-4 pr-2">
          <div className="h-full bg-white flex flex-col rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <LeftPanel
              onDownload={handleDownload}
              hasData={hasData}
              isDownloading={isDownloading}
            />
          </div>
        </div>
        <div className="w-1/2 flex-shrink-0 h-full overflow-y-auto bg-slate-50/50">
          <ResumePreview />
        </div>
      </div>
    </div>
  );
};
