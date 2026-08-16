import React from 'react';
import { TabNavigation } from './TabNavigation';
import { PersonalTab } from './tabs/PersonalTab';
import { ExperienceTab } from './tabs/ExperienceTab';
import { EducationTab } from './tabs/EducationTab';
import { SkillsTab } from './tabs/SkillsTab';
import { CertificationsTab } from './tabs/CertificationsTab';
import { useResumeStore } from '@/lib/store/resume.slice';
import { TabId } from '@/types/resume.types';

const renderTabContent = (activeTab: TabId) => {
  switch (activeTab) {
    case 'personal':      return <PersonalTab />;
    case 'experience':    return <ExperienceTab />;
    case 'education':     return <EducationTab />;
    case 'skills':        return <SkillsTab />;
    case 'certifications':return <CertificationsTab />;
    default:              return <PersonalTab />;
  }
};

export const LeftPanel: React.FC = () => {
  const { activeTab, setActiveTab } = useResumeStore();

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-y-auto p-6">
        {renderTabContent(activeTab)}
      </div>
      <div className="border-t border-slate-100 bg-slate-50 px-4 py-2.5 text-center text-xs text-slate-400 flex-shrink-0">
        💡 All changes update the preview instantly · Auto-saved to browser
      </div>
    </div>
  );
};
