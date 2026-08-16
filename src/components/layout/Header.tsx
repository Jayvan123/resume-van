import React from 'react';
import { Download, RefreshCw, Sparkles } from 'lucide-react';

interface HeaderProps {
  onDownload: () => void;
  onLoadSample: () => void;
  hasData: boolean;
  isDownloading?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onDownload,
  onLoadSample,
  hasData,
  isDownloading = false,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white px-6 py-3.5 shadow-sm sticky top-0 z-20">
      <div className="flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 text-lg shadow-sm">
            🚐
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-none">ResumeVan</h1>
            <p className="text-[11px] text-slate-400 mt-0.5">ATS-Optimized Resume Builder</p>
          </div>
          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
            Beta
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onLoadSample}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-lg transition-all"
          >
            <Sparkles size={14} className="text-yellow-500" />
            Load Sample
          </button>
          <button
            onClick={onDownload}
            disabled={!hasData || isDownloading}
            className="flex items-center gap-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed px-4 py-2 rounded-lg shadow-sm transition-all"
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
    </header>
  );
};
