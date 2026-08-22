import React from 'react';
import { Download, RefreshCw, ChevronDown, ChevronUp, X } from 'lucide-react';
import { TABS } from '@/constants/tabs';
import { TabId } from '@/types/resume.types';
import { useResumeStore } from '@/lib/store/resume.slice';
import { downloadPDF } from '@/lib/pdf/generate';
import { sampleResume } from '@/constants/sampleData';
import { PersonalTab } from './left-panel/tabs/PersonalTab';
import { ExperienceTab } from './left-panel/tabs/ExperienceTab';
import { EducationTab } from './left-panel/tabs/EducationTab';
import { SkillsTab } from './left-panel/tabs/SkillsTab';
import { CertificationsTab } from './left-panel/tabs/CertificationsTab';
import { AiAssistTab } from './left-panel/tabs/AiAssistTab';
import { DraftsManager } from './DraftsManager';
import { ConfirmationModal } from './ui/ConfirmationModal';

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
    case 'ai-assist': return <AiAssistTab />;
    default: return <PersonalTab />;
  }
};

const FONT_OPTIONS = ['Poppins', 'Calibri', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Cambria'];

const FontSelector: React.FC<{
  selectedFont: string;
  onFontChange: (font: string) => void;
  hideLabel?: boolean;
}> = ({ selectedFont, onFontChange, hideLabel }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative flex items-center gap-2">
      {!hideLabel && (
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Font:</span>
      )}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between gap-2 min-w-[140px] text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3.5 py-2 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-900/10 active:scale-[0.98]"
        >
          <span>{selectedFont}</span>
          <ChevronDown
            size={14}
            className={`text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        <div
          className={`absolute right-0 mt-1.5 min-w-[150px] bg-white border border-slate-200/80 shadow-lg rounded-xl overflow-hidden py-1 z-50 transition-all duration-200 origin-top-right ${
            isOpen
              ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }`}
        >
          {FONT_OPTIONS.map((font) => (
            <button
              key={font}
              onClick={() => {
                onFontChange(font);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2 text-sm font-medium transition-colors ${
                selectedFont === font
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {font}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/** Slim top bar: title + subtitle on the left, font selector + buttons on the right. */
const TopBar: React.FC<{
  onLoadSample: () => void;
  onClear: () => void;
  hasData: boolean;
  selectedFont: string;
  onFontChange: (font: string) => void;
  activeDraftName?: string;
  isSampleData?: boolean;
}> = ({ onLoadSample, onClear, hasData, selectedFont, onFontChange, isSampleData }) => (
  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-4 pt-4 pb-3 md:px-6 md:py-6 mx-auto w-full max-w-[1400px]">
    {/* Logo + subtitle */}
    <div className="flex-shrink-0">
      <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-slate-950 leading-none">ResumeVan</h1>
      <p className="hidden md:block text-lg text-slate-600 mt-2.5">ATS-Optimized Resume Builder</p>
    </div>

    {/* Actions row — own line on mobile so it always has full width to breathe */}
    <div className="flex items-center gap-2 md:gap-3 min-w-0">
      {/* Drafts Selector */}
      <DraftsManager />

      <div className="hidden md:block h-6 w-px bg-slate-200 flex-shrink-0" /> {/* Divider — desktop only */}

      {/* Font Selector — desktop only */}
      <div className="hidden md:flex">
        <FontSelector selectedFont={selectedFont} onFontChange={onFontChange} />
      </div>

      <div className="hidden md:block h-6 w-px bg-slate-200 flex-shrink-0" /> {/* Divider — desktop only */}

      {hasData ? (
        <button
          onClick={onClear}
          className="flex-shrink-0 text-xs md:text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 px-3 md:px-3.5 h-10 md:h-auto md:py-2 rounded-xl transition-all shadow-sm active:scale-[0.98]"
        >
          {isSampleData ? 'Clear' : 'Clear'}
        </button>
      ) : (
        <button
          onClick={onLoadSample}
          className="flex-shrink-0 text-xs md:text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 px-3 md:px-3.5 h-10 md:h-auto md:py-2 rounded-xl transition-all shadow-sm active:scale-[0.98]"
        >
          Sample
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
  activeDraftName?: string;
  selectedFont?: string;
  onFontChange?: (font: string) => void;
}> = ({ onDownload, hasData, isDownloading, activeDraftName, selectedFont, onFontChange }) => {
  const { activeTab, setActiveTab } = useResumeStore();

  return (
    <div className="flex flex-col h-full">
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Mobile-only font selector row */}
      {selectedFont && onFontChange && (
        <div className="md:hidden flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/80">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Font</span>
          <FontSelector selectedFont={selectedFont} onFontChange={onFontChange} hideLabel />
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-white">
        {renderTabContent(activeTab)}
      </div>
      <div className="flex flex-shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 md:px-6 py-3 md:py-4">
        <p className="hidden md:block text-xs text-slate-400">
          {activeDraftName ? `Auto-saving edits to "${activeDraftName}"` : 'Auto-saved to browser'}
        </p>
        <button
          onClick={onDownload}
          disabled={!hasData || isDownloading}
          className="w-full md:w-auto flex items-center justify-center gap-2 text-sm font-semibold text-white bg-slate-900 hover:bg-black disabled:bg-slate-300 disabled:cursor-not-allowed px-4 py-2.5 rounded-xl shadow-sm ring-1 ring-inset ring-white/10 transition-all"
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

const FONT_MAPPING: Record<string, string> = {
  'Poppins': "'Poppins', sans-serif",
  'Calibri': "Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif",
  'Arial': "Arial, 'Helvetica Neue', Helvetica, sans-serif",
  'Helvetica': "'Helvetica Neue', Helvetica, Arial, sans-serif",
  'Times New Roman': "'Times New Roman', Times, Baskerville, Georgia, serif",
  'Georgia': "Georgia, yingmar, serif",
  'Cambria': "Cambria, Georgia, serif",
};

const PAPER_WIDTH = 794;

/**
 * The paper markup itself — always laid out at a fixed 794px so text wraps
 * identically to the PDF export. Extracted so both the inline preview and
 * the full-screen zoom modal render the exact same content.
 */
const ResumePaper: React.FC<{ fontStyle: string }> = ({ fontStyle }) => {
  const { data } = useResumeStore();

  return (
    <div
      id="resume-preview-paper"
      className="w-[794px] min-h-[1123px] bg-white px-10 py-10 text-slate-900"
      style={{ fontFamily: fontStyle }}
    >
      <header className="pb-3 mb-4 text-center">
          <h1 className="text-[28px] font-extrabold tracking-tight leading-none text-slate-900 mb-1.5">
            {data.personal.fullName || 'YOUR NAME'}
          </h1>
          {data.personal.titles && data.personal.titles.length > 0 && (
            <div className="text-[14px] font-bold text-slate-800 uppercase tracking-[0.08em] mb-2">
              {data.personal.titles.join(' | ')}
            </div>
          )}
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 text-[13px] text-slate-600">
            {[
              data.personal.location,
              data.personal.email,
              data.personal.phone,
              ...(data.personal.links || [])
            ]
              .filter(Boolean)
              .map((item, idx, arr) => (
                <React.Fragment key={idx}>
                  <span>{item}</span>
                  {idx < arr.length - 1 && <span className="text-slate-300">|</span>}
                </React.Fragment>
              ))}
          </div>
        </header>

        {data.personal.summary && (
          <section className="mb-4">
            <h2 className="text-[12.5px] font-bold uppercase tracking-[0.12em] text-slate-800 border-b border-slate-300 pb-1 mb-2">
              Professional Summary
            </h2>
            <p className="text-[14px] leading-relaxed text-slate-700">
              {data.personal.summary}
            </p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section className="mb-4">
            <h2 className="text-[12.5px] font-bold uppercase tracking-[0.12em] text-slate-800 border-b border-slate-300 pb-1 mb-3">
              Work Experience
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex items-baseline justify-between gap-4 mb-0.5">
                    <div>
                      <span className="text-[14.5px] font-bold text-slate-900">
                        {exp.role}
                      </span>
                      <span className="text-[14px] text-slate-600 ml-1.5">— {exp.company}</span>
                    </div>
                    <span className="text-[13px] text-slate-500 whitespace-nowrap flex-shrink-0">
                      {exp.dates}
                    </span>
                  </div>
                  {exp.description && (
                    <div className="text-[13.5px] leading-relaxed text-slate-700 whitespace-pre-line pl-3 border-l border-slate-200 mt-1">
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education.length > 0 && (
          <section className="mb-4">
            <h2 className="text-[12.5px] font-bold uppercase tracking-[0.12em] text-slate-800 border-b border-slate-300 pb-1 mb-3">
              Education
            </h2>
            <div className="space-y-2.5">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex items-baseline justify-between gap-4">
                  <div>
                    <span className="text-[14.5px] font-bold text-slate-900">
                      {edu.school}
                    </span>
                    <p className="text-[13.5px] text-slate-600 mt-0.5">{edu.degree}</p>
                  </div>
                  <span className="text-[13px] text-slate-500 whitespace-nowrap flex-shrink-0">
                    {edu.dates}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.skills.length > 0 && (
          <section className="mb-4">
            <h2 className="text-[12.5px] font-bold uppercase tracking-[0.12em] text-slate-800 border-b border-slate-300 pb-1 mb-2">
              Skills
            </h2>
            <p className="text-[14px] leading-relaxed text-slate-700">
              {data.skills.join(' · ')}
            </p>
          </section>
        )}

        {data.certifications.length > 0 && (
          <section>
            <h2 className="text-[12.5px] font-bold uppercase tracking-[0.12em] text-slate-800 border-b border-slate-300 pb-1 mb-2">
              Certifications
            </h2>
            <ul className="list-disc list-inside text-[14px] text-slate-700 space-y-1">
              {data.certifications.map((cert, index) => (
                <li key={index}>{cert}</li>
              ))}
            </ul>
          </section>
        )}
    </div>
  );
};

/**
 * Live preview: scales the fixed-width paper down to fit whatever container
 * it's placed in (ResizeObserver-driven), so phones get a proportionally
 * shrunk thumbnail instead of a horizontal scrollbar. Tapping it opens a
 * full-screen zoomed viewer for actually reading the content on small
 * screens; on desktop the container is already wide enough that scale
 * settles at ~1 and the tap affordance is hidden.
 */
const ResumePreview: React.FC = () => {
  const { selectedFont } = useResumeStore();
  const fontStyle = FONT_MAPPING[selectedFont] || "Arial, sans-serif";

  const containerRef = React.useRef<HTMLDivElement>(null);
  const paperRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);
  const [paperHeight, setPaperHeight] = React.useState(1123);
  const [isZoomOpen, setIsZoomOpen] = React.useState(false);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const CONTAINER_PADDING = 32; // px-4 on each side of the scaled box
    const update = () => {
      const available = container.clientWidth - CONTAINER_PADDING;
      setScale(available < PAPER_WIDTH ? Math.max(available / PAPER_WIDTH, 0.32) : 1);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    if (paperRef.current) setPaperHeight(paperRef.current.scrollHeight);
  });

  return (
    <div ref={containerRef} className="py-6 px-4">
      <button
        type="button"
        onClick={() => scale < 1 && setIsZoomOpen(true)}
        className={`block mx-auto ${scale < 1 ? 'cursor-zoom-in' : 'cursor-default'}`}
        style={{ width: PAPER_WIDTH * scale, height: paperHeight * scale }}
        aria-label={scale < 1 ? 'Tap to enlarge resume preview' : 'Resume preview'}
      >
        <div
          ref={paperRef}
          className="border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] origin-top-left"
          style={{ width: PAPER_WIDTH, transform: `scale(${scale})` }}
        >
          <ResumePaper fontStyle={fontStyle} />
        </div>
      </button>

      {scale < 1 && (
        <p className="text-center text-xs text-slate-400 mt-2 md:hidden">Tap preview to zoom in</p>
      )}

      {isZoomOpen && (
        <ZoomModal fontStyle={fontStyle} onClose={() => setIsZoomOpen(false)} />
      )}
    </div>
  );
};

/** Full-screen scrollable viewer, scaled to fit the device width more generously than the inline thumbnail. */
const ZoomModal: React.FC<{ fontStyle: string; onClose: () => void }> = ({ fontStyle, onClose }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    const container = containerRef.current;
    const update = () => {
      if (!container) return;
      const available = container.clientWidth - 24;
      setScale(Math.min(1, available / PAPER_WIDTH));
    };
    update();
    window.addEventListener('resize', update);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex flex-col animate-in fade-in duration-150">
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
        <span className="text-sm font-semibold text-white/90">Resume Preview</span>
        <button
          onClick={onClose}
          className="flex items-center justify-center size-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors active:scale-95"
          aria-label="Close preview"
        >
          <X size={18} />
        </button>
      </div>
      <div ref={containerRef} className="flex-1 overflow-y-auto px-3 pb-6">
        <div className="mx-auto" style={{ width: PAPER_WIDTH * scale }}>
          <div
            className="border border-slate-200/80 shadow-2xl origin-top-left bg-white"
            style={{ width: PAPER_WIDTH, transform: `scale(${scale})` }}
          >
            <ResumePaper fontStyle={fontStyle} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ResumeBuilder: React.FC = () => {
  const {
    data,
    loadSampleData,
    resetAll,
    selectedFont,
    setFontStyle,
    isDownloading,
    setIsDownloading,
    drafts,
    activeDraftId,
  } = useResumeStore();

  const [isClearConfirmOpen, setIsClearConfirmOpen] = React.useState(false);
  // Mobile-only scroll anchors: editor and preview are stacked in normal page
  // flow (not tab-toggled), these back the "Preview ↓" / "Editor ↑" jump links.
  const editorAnchorRef = React.useRef<HTMLDivElement>(null);
  const previewAnchorRef = React.useRef<HTMLDivElement>(null);
  const scrollToPreview = () => previewAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const scrollToEditor = () => editorAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const activeDraft = drafts.find((d) => d.id === activeDraftId);
  const activeDraftName = activeDraft?.name;

  const hasData =
    data.personal.fullName !== '' ||
    data.experience.length > 0 ||
    data.education.length > 0;

  const isSampleData = JSON.stringify(data) === JSON.stringify(sampleResume);

  const handleClear = () => {
    if (hasData && !isSampleData) {
      setIsClearConfirmOpen(true);
    } else {
      resetAll();
    }
  };

  const handleLoadSample = () => {
    loadSampleData();
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadPDF(data, selectedFont, activeDraftName);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <TopBar
        onLoadSample={handleLoadSample}
        onClear={handleClear}
        hasData={hasData}
        selectedFont={selectedFont}
        onFontChange={setFontStyle}
        activeDraftName={activeDraftName}
        isSampleData={isSampleData}
      />

      {/* ─── MOBILE LAYOUT ───────────────────────────────── */}
      {/* Stacked, single-page-scroll: editor card first, live preview card
          below it — no hidden panels. Each section gets a small sticky-feel
          header with a jump link to the other, since the editor card caps
          its own height (68vh) with internal scrolling for comfortable
          form-filling, while the page itself keeps scrolling down to the
          preview. */}
      <div className="md:hidden flex flex-col">
        <div ref={editorAnchorRef} className="flex items-center justify-between px-4 pb-2 pt-1">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">1. Fill in your details</h2>
          <button
            onClick={scrollToPreview}
            className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 py-1.5 -mr-1.5 px-1.5"
          >
            Preview
            <ChevronDown size={14} />
          </button>
        </div>
        <div className="h-[68vh] flex flex-col mx-4 mb-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <LeftPanel
            onDownload={handleDownload}
            hasData={hasData}
            isDownloading={isDownloading}
            activeDraftName={activeDraftName}
            selectedFont={selectedFont}
            onFontChange={setFontStyle}
          />
        </div>

        <div ref={previewAnchorRef} className="flex items-center justify-between px-4 pb-2 pt-1">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">2. Live preview</h2>
          <button
            onClick={scrollToEditor}
            className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 py-1.5 -mr-1.5 px-1.5"
          >
            <ChevronUp size={14} />
            Editor
          </button>
        </div>
        <div className="mx-4 mb-6 bg-slate-50/50 rounded-2xl border border-slate-200/80 overflow-hidden">
          <ResumePreview />
        </div>
      </div>

      {/* ─── DESKTOP LAYOUT ──────────────────────────────── */}
      {/* editor (left, 40%) / live preview (right, 60%), capped and centered
          as one group so on wide screens the pair sits in the middle of the
          viewport with even margins, instead of stretching edge-to-edge and
          leaving the preview stranded far from the editor. */}
      <div className="hidden md:flex flex-1 justify-center overflow-hidden">
        <div className="flex w-full max-w-[1400px] items-stretch">
          <div className="w-2/5 flex-shrink-0 py-4 pl-4 pr-2">
            <div className="h-full bg-white flex flex-col rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <LeftPanel
                onDownload={handleDownload}
                hasData={hasData}
                isDownloading={isDownloading}
                activeDraftName={activeDraftName}
              />
            </div>
          </div>
          <div className="w-3/5 flex-shrink-0 h-full overflow-y-auto bg-slate-50/50">
            <ResumePreview />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full flex-shrink-0 bg-white border-t border-slate-200 py-4 mt-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 md:px-6 mx-auto w-full max-w-[1400px] text-xs font-medium text-slate-500">
          <div>
            Created by <span className="text-slate-800 font-semibold">Jayvan</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Jayvan123"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
            >
              <svg className="size-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub
            </a>
            <span className="text-slate-300">|</span>
            <a
              href="https://jayvan-portfolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-slate-900 transition-colors"
            >
              Portfolio
              <svg className="size-3.5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </a>
          </div>
        </div>
      </footer>

      <ConfirmationModal
        isOpen={isClearConfirmOpen}
        title="Clear Resume Details?"
        message={
          activeDraftName
            ? `Are you sure you want to clear your current progress? This will unlink your active draft "${activeDraftName}" from the workspace. The saved draft itself will remain safe.`
            : "Are you sure you want to clear your current progress? All entered details will be lost."
        }
        confirmText="Yes, Clear Data"
        cancelText="Cancel"
        variant="danger"
        onConfirm={() => {
          resetAll();
          setIsClearConfirmOpen(false);
        }}
        onCancel={() => setIsClearConfirmOpen(false)}
      />
    </div>
  );
};
