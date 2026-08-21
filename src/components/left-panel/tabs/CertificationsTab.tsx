import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useResumeStore } from '@/lib/store/resume.slice';
import { Plus, Trash2, Award } from 'lucide-react';

export const CertificationsTab: React.FC = () => {
  const { data, addCertification, removeCertification, updateCertification } = useResumeStore();
  const [newCert, setNewCert] = useState('');
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  const handleAddOrSave = () => {
    if (editingIdx !== null) {
      updateCertification(editingIdx, newCert.trim());
      setEditingIdx(null);
      setNewCert('');
    } else {
      if (newCert.trim()) {
        addCertification(newCert.trim());
        setNewCert('');
      }
    }
  };

  const handleCancel = () => {
    setEditingIdx(null);
    setNewCert('');
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
          value={newCert}
          onChange={(e) => setNewCert(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. AWS Certified Solutions Architect…"
          className="flex-1 text-sm"
        />
        {editingIdx !== null ? (
          <div className="flex gap-1.5 flex-shrink-0">
            <button
              onClick={handleAddOrSave}
              className="flex items-center gap-1 rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/10 transition-colors hover:bg-black whitespace-nowrap"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 whitespace-nowrap"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddOrSave}
            className="flex items-center gap-1 rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/10 transition-colors hover:bg-black whitespace-nowrap"
          >
            <Plus size={15} />
            Add
          </button>
        )}
      </div>

      {data.certifications.length > 0 ? (
        <ul className="space-y-2.5">
          {data.certifications.map((cert, index) => {
            const isEditing = editingIdx === index;
            return (
              <li
                key={index}
                className={`flex items-center justify-between gap-3 rounded-2xl border p-4 shadow-sm transition-all select-none ${
                  isEditing
                    ? 'border-indigo-300 bg-indigo-50/30 ring-2 ring-indigo-600/5'
                    : 'border-slate-200 bg-white hover:shadow-md cursor-pointer'
                }`}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('button')) return;
                  setEditingIdx(index);
                  setNewCert(cert);
                }}
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                    isEditing ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    <Award size={15} />
                  </span>
                  <span className={`text-sm font-medium transition-colors truncate ${
                    isEditing ? 'text-indigo-900 font-semibold' : 'text-slate-700'
                  }`}>
                    {cert}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isEditing) {
                      handleCancel();
                    }
                    removeCertification(index);
                  }}
                  className={`flex-shrink-0 rounded-full p-1.5 transition-colors ${
                    isEditing ? 'text-indigo-400 hover:bg-indigo-100 hover:text-indigo-700' : 'text-slate-400 hover:bg-red-50 hover:text-red-500'
                  }`}
                  title="Remove"
                >
                  <Trash2 size={13} />
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center text-slate-400">
          <p className="text-sm font-medium">No certifications added yet</p>
          <p className="text-xs mt-1">Add certifications above or press Enter</p>
        </div>
      )}

      <p className="text-xs text-slate-400">
        Include the full certification name and click on it to edit
      </p>
    </div>
  );
};
