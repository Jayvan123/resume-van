import React, { ReactNode } from 'react';

interface SplitLayoutProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
}

export const SplitLayout: React.FC<SplitLayoutProps> = ({ leftPanel, rightPanel }) => {
  return (
    <div className="flex flex-1 overflow-hidden bg-slate-100/70">
      {/* Left Panel — 45% */}
      <div className="w-[45%] flex-shrink-0 flex flex-col overflow-hidden py-4 pl-4 pr-2">
        <div className="flex-1 bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden flex flex-col h-full">
          {leftPanel}
        </div>
      </div>
      {/* Right Panel — 55% */}
      <div className="w-[55%] flex-shrink-0 flex flex-col overflow-hidden">
        {rightPanel}
      </div>
    </div>
  );
};
