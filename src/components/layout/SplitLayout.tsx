import React, { ReactNode } from 'react';

interface SplitLayoutProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
}

export const SplitLayout: React.FC<SplitLayoutProps> = ({ leftPanel, rightPanel }) => {
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left Panel — 40% */}
      <div className="w-2/5 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col overflow-hidden">
        {leftPanel}
      </div>
      {/* Right Panel — 60% */}
      <div className="flex-1 bg-slate-100 overflow-hidden">
        {rightPanel}
      </div>
    </div>
  );
};
