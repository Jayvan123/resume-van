import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useResumeStore } from '@/lib/store/resume.slice';
import { Plus, X } from 'lucide-react';

export const SkillsTab: React.FC = () => {
  const { data, addSkill, removeSkill } = useResumeStore();
  const [newSkill, setNewSkill] = useState('');

  const handleAdd = () => {
    if (newSkill.trim()) {
      addSkill(newSkill.trim());
      setNewSkill('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill and press Enter…"
          className="flex-1 text-sm"
        />
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold px-3.5 py-2 rounded-lg transition-colors"
        >
          <Plus size={15} />
          Add
        </button>
      </div>

      {data.skills.length > 0 ? (
        <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-slate-50/60 p-4 min-h-[100px]">
          {data.skills.map((skill, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors rounded-full"
            >
              {skill}
              <button
                onClick={() => removeSkill(index)}
                className="ml-0.5 text-blue-400 hover:text-red-500 transition-colors"
                title="Remove"
              >
                <X size={12} />
              </button>
            </Badge>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-slate-200 p-8 text-center text-slate-400">
          <p className="text-sm font-medium">No skills added yet</p>
          <p className="text-xs mt-1">Start typing above to add your skills</p>
        </div>
      )}

      <p className="text-xs text-slate-400">
        💡 Add skills one at a time, or press <kbd className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">Enter</kbd> after each one
      </p>
    </div>
  );
};
