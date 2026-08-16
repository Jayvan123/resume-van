import React from 'react';
import { TABS } from '@/constants/tabs';
import { TabId } from '@/types/resume.types';

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="flex overflow-x-auto border-b border-slate-200 bg-white flex-shrink-0">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          id={`tab-${tab.id}`}
          onClick={() => onTabChange(tab.id)}
          className={`
            flex-shrink-0 px-4 py-3.5 text-sm font-medium transition-all
            border-b-2 focus:outline-none
            ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600 bg-blue-50/60'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50'
            }
          `}
        >
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-base leading-none">{tab.icon}</span>
            <span>{tab.label}</span>
          </span>
        </button>
      ))}
    </nav>
  );
};
