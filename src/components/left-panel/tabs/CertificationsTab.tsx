import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useResumeStore } from '@/lib/store/resume.slice';
import { useDragReorder } from '@/hooks/useDragReorder';
import { Plus, Trash2, Award, GripVertical } from 'lucide-react';

export const CertificationsTab: React.FC = () => {
  const { data, addCertification, removeCertification, updateCertification, reorderCertification } = useResumeStore();
  const [newCert, setNewCert] = useState('');
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  const { dragIndex, overIndex, getDragHandleProps, getItemProps } = useDragReorder(reorderCertification);

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
        <div className="space-y-2">
          {data.certifications.length > 1 && editingIdx === null && (
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5 pl-1">
              <GripVertical size={11} className="text-slate-300" />
              Drag the handle to reorder
            </p>
          )}
          {data.certifications.map((cert, index) => {
            const isEditing = editingIdx === index;
            const isDragging = dragIndex === index;
            const isOver = overIndex === index && dragIndex !== null && dragIndex !== index;

            return (
              <div
                key={index}
                data-drag-card
                {...(editingIdx === null ? getItemProps(index) : {})}
                className={[
                  'flex items-center justify-between gap-3 rounded-2xl border p-4 shadow-sm',
                  'transition-transform duration-200 select-none',
                  isDragging  ? 'drag-placeholder'   : '',
                  isOver      ? 'drag-over-target'   : '',
                  isEditing && !isDragging && !isOver
                    ? 'border-indigo-300 bg-indigo-50/30 ring-2 ring-indigo-600/5' : '',
                  !isDragging && !isOver && !isEditing
                    ? 'border-slate-200 bg-white hover:shadow-md cursor-pointer' : '',
                ].join(' ')}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('button')) return;
                  if ((e.target as HTMLElement).closest('[data-grip]')) return;
                  if (!isDragging && dragIndex === null) {
                    setEditingIdx(index);
                    setNewCert(cert);
                  }
                }}
              >
                {/* Drag handle */}
                {editingIdx === null && (
                  <div
                    {...getDragHandleProps(index)}
                    data-grip="true"
                    className="flex-shrink-0 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors p-0.5 rounded"
                    title="Drag to reorder"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <GripVertical size={16} />
                  </div>
                )}

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
                    if (isEditing) handleCancel();
                    removeCertification(index);
                  }}
                  className={`flex-shrink-0 rounded-full p-1.5 transition-colors ${
                    isEditing
                      ? 'text-indigo-400 hover:bg-indigo-100 hover:text-indigo-700'
                      : 'text-slate-400 hover:bg-red-50 hover:text-red-500'
                  }`}
                  title="Remove"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
        </div>
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
