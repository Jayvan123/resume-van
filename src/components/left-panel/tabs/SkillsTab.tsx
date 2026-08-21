import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useResumeStore } from '@/lib/store/resume.slice';
import { Plus, X } from 'lucide-react';

export const SkillsTab: React.FC = () => {
  const { data, addSkill, removeSkill, updateSkill } = useResumeStore();
  const [newSkill, setNewSkill] = useState('');
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  const handleAddOrSave = () => {
    if (editingIdx !== null) {
      updateSkill(editingIdx, newSkill.trim());
      setEditingIdx(null);
      setNewSkill('');
    } else {
      if (newSkill.trim()) {
        addSkill(newSkill.trim());
        setNewSkill('');
      }
    }
  };

  const handleCancel = () => {
    setEditingIdx(null);
    setNewSkill('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddOrSave();
    } else if (e.key === 'Escape') {
      if (editingIdx !== null) {
        e.preventDefault();
        handleCancel();
      }
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
        {editingIdx !== null ? (
          <div className="flex gap-1.5">
            <button
              onClick={handleAddOrSave}
              className="flex items-center gap-1 rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/10 transition-colors hover:bg-black"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddOrSave}
            className="flex items-center gap-1 rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/10 transition-colors hover:bg-black"
          >
            <Plus size={15} />
            Add
          </button>
        )}
      </div>

      {data.skills.length > 0 ? (
        <div className="flex min-h-[100px] flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm align-content-start">
          {data.skills.map((skill, index) => {
            const isEditing = editingIdx === index;
            return (
              <Badge
                key={index}
                variant="secondary"
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-colors select-none cursor-pointer ${
                  isEditing
                    ? 'border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 ring-2 ring-indigo-600/10'
                    : 'border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
                onClick={(e) => {
                  // Only edit if we didn't click the remove button
                  if ((e.target as HTMLElement).closest('button')) return;
                  setEditingIdx(index);
                  setNewSkill(skill);
                }}
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (isEditing) {
                      handleCancel();
                    }
                    removeSkill(index);
                  }}
                  className={`ml-0.5 transition-colors flex-shrink-0 ${
                    isEditing ? 'text-indigo-400 hover:text-indigo-600' : 'text-blue-400 hover:text-red-500'
                  }`}
                  title="Remove"
                >
                  <X size={12} />
                </button>
              </Badge>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center text-slate-400">
          <p className="text-sm font-medium">No skills added yet</p>
          <p className="text-xs mt-1">Start typing above to add your skills</p>
        </div>
      )}

      <p className="text-xs text-slate-400">
        Add skills one at a time, or click on a skill to edit it
      </p>
    </div>
  );
};
