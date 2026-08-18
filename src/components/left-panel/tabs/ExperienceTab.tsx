import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { experienceSchema } from '@/lib/validations/resume.schema';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useResumeStore } from '@/lib/store/resume.slice';
import { z } from 'zod';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

type ExperienceFormData = z.infer<typeof experienceSchema>;

export const ExperienceTab: React.FC = () => {
  const { data, addExperience, updateExperience, removeExperience } = useResumeStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: { company: '', role: '', dates: '', description: '' },
  });

  const onSubmit = (formData: ExperienceFormData) => {
    if (editingId) {
      updateExperience(editingId, formData);
      setEditingId(null);
    } else {
      addExperience(formData);
    }
    reset();
    setShowForm(false);
  };

  const handleEdit = (id: string) => {
    const exp = data.experience.find((e) => e.id === id);
    if (exp) {
      reset({ company: exp.company, role: exp.role, dates: exp.dates, description: exp.description });
      setEditingId(id);
      setShowForm(true);
    }
  };

  const handleCancel = () => {
    reset();
    setEditingId(null);
    setShowForm(false);
  };

  const handleAddNew = () => {
    reset({ company: '', role: '', dates: '', description: '' });
    setEditingId(null);
    setShowForm(true);
  };

  return (
    <div className="space-y-4">
      {/* Existing entries */}
      {data.experience.length > 0 && (
        <div className="space-y-2.5">
          {data.experience.map((exp) => (
            <div
              key={exp.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm truncate">{exp.role || 'Role'}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{exp.company} · {exp.dates}</p>
                  {exp.description && (
                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(exp.id)}
                    className="p-1.5 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Edit"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="p-1.5 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit form */}
      {showForm ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-md"
        >
          <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white">
              {editingId ? <Pencil size={12} /> : <Plus size={12} />}
            </span>
            {editingId ? 'Edit Experience' : 'New Experience'}
          </h4>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <Input
                {...register('company')}
                placeholder="Company name"
                className={`text-sm ${errors.company ? 'border-red-400' : ''}`}
              />
              {errors.company && <p className="text-xs text-red-500 mt-1">{errors.company.message}</p>}
            </div>
            <div>
              <Input
                {...register('role')}
                placeholder="Job title / Role"
                className={`text-sm ${errors.role ? 'border-red-400' : ''}`}
              />
              {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>}
            </div>
          </div>

          <div>
            <Input
              {...register('dates')}
              placeholder="e.g. Jan 2020 – Present"
              className={`text-sm ${errors.dates ? 'border-red-400' : ''}`}
            />
            {errors.dates && <p className="text-xs text-red-500 mt-1">{errors.dates.message}</p>}
          </div>

          <div>
            <Textarea
              {...register('description')}
              placeholder={'• Led product strategy…\n• Increased engagement by 35%…'}
              rows={4}
              className={`resize-none text-sm ${errors.description ? 'border-red-400' : ''}`}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/10 transition-colors hover:bg-black"
            >
              <Check size={14} />
              {editingId ? 'Update' : 'Add'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
            >
              <X size={14} />
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={handleAddNew}
          className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 py-3.5 text-sm font-medium text-slate-500 transition-all hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900"
        >
          <Plus size={16} />
          Add Work Experience
        </button>
      )}
    </div>
  );
};
