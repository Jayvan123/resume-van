import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalSchema } from '@/lib/validations/resume.schema';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useResumeStore } from '@/lib/store/resume.slice';
import { z } from 'zod';
import { Save, User, FileText, Plus, X } from 'lucide-react';

type PersonalFormData = z.infer<typeof personalSchema>;

const inputClass = 'h-10 rounded-xl px-3';

export const PersonalTab: React.FC = () => {
  const { data, setPersonal, addTitle, updateTitle, removeTitle, addLink, updateLink, removeLink } = useResumeStore();
  const [newTitle, setNewTitle] = React.useState('');
  const [newLink, setNewLink] = React.useState('');

  const [editingTitleIdx, setEditingTitleIdx] = React.useState<number | null>(null);
  const [editingLinkIdx, setEditingLinkIdx] = React.useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<PersonalFormData>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      fullName: data.personal.fullName,
      email: data.personal.email,
      phone: data.personal.phone,
      location: data.personal.location,
      summary: data.personal.summary,
    },
  });

  const handleAddOrSaveTitle = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (editingTitleIdx !== null) {
      updateTitle(editingTitleIdx, newTitle.trim());
      setEditingTitleIdx(null);
      setNewTitle('');
    } else {
      if (newTitle.trim()) {
        addTitle(newTitle.trim());
        setNewTitle('');
      }
    }
  };

  const handleCancelTitle = () => {
    setEditingTitleIdx(null);
    setNewTitle('');
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddOrSaveTitle();
    } else if (e.key === 'Escape') {
      if (editingTitleIdx !== null) {
        e.preventDefault();
        handleCancelTitle();
      }
    }
  };

  const handleAddOrSaveLink = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (editingLinkIdx !== null) {
      updateLink(editingLinkIdx, newLink.trim());
      setEditingLinkIdx(null);
      setNewLink('');
    } else {
      if (newLink.trim()) {
        addLink(newLink.trim());
        setNewLink('');
      }
    }
  };

  const handleCancelLink = () => {
    setEditingLinkIdx(null);
    setNewLink('');
  };

  const handleLinkKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddOrSaveLink();
    } else if (e.key === 'Escape') {
      if (editingLinkIdx !== null) {
        e.preventDefault();
        handleCancelLink();
      }
    }
  };

  const onSubmit = (formData: PersonalFormData) => {
    setPersonal(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* ── Contact Info card ─────────────────────────── */}
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white">
            <User size={12} />
          </span>
          Contact Info
        </h4>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Full Name <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('fullName')}
            placeholder="Sarah Johnson"
            className={`${inputClass} ${errors.fullName ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
          />
          {errors.fullName && (
            <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Titles / Taglines (Add multiple)
          </label>
          <div className="flex gap-2">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              placeholder="e.g. Senior Product Manager"
              className="flex-1 h-10 rounded-xl px-3 text-sm font-medium"
            />
            {editingTitleIdx !== null ? (
              <div className="flex gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={(e) => handleAddOrSaveTitle(e)}
                  className="flex items-center gap-1 rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/10 transition-colors hover:bg-black whitespace-nowrap"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancelTitle}
                  className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 whitespace-nowrap"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => handleAddOrSaveTitle(e)}
                className="flex items-center gap-1 rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/10 transition-colors hover:bg-black whitespace-nowrap animate-in fade-in duration-200"
              >
                <Plus size={15} />
                Add
              </button>
            )}
          </div>

          {data.personal.titles && data.personal.titles.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {data.personal.titles.map((title, index) => {
                const isEditing = editingTitleIdx === index;
                return (
                  <Badge
                    key={index}
                    variant="secondary"
                    className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors select-none cursor-pointer ${
                      isEditing
                        ? 'border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 ring-2 ring-indigo-600/10'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest('button')) return;
                      setEditingTitleIdx(index);
                      setNewTitle(title);
                    }}
                  >
                    <span>{title}</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (isEditing) {
                          handleCancelTitle();
                        }
                        removeTitle(index);
                      }}
                      className={`ml-0.5 transition-colors flex-shrink-0 ${
                        isEditing ? 'text-indigo-400 hover:text-indigo-600' : 'text-slate-400 hover:text-red-500'
                      }`}
                    >
                      <X size={10} />
                    </button>
                  </Badge>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('email')}
              type="email"
              placeholder="sarah@email.com"
              className={`${inputClass} ${errors.email ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Phone <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('phone')}
              placeholder="+1 (555) 123-4567"
              className={`${inputClass} ${errors.phone ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Location <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('location')}
            placeholder="San Francisco, CA"
            className={`${inputClass} ${errors.location ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
          />
          {errors.location && (
            <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>
          )}
        </div>

        <div className="space-y-2 pt-1">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Links (LinkedIn, Portfolio, Website)
          </label>
          <div className="flex gap-2">
            <Input
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              onKeyDown={handleLinkKeyDown}
              placeholder="e.g. linkedin.com/in/username"
              className="flex-1 h-10 rounded-xl px-3 text-sm font-medium"
            />
            {editingLinkIdx !== null ? (
              <div className="flex gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={(e) => handleAddOrSaveLink(e)}
                  className="flex items-center gap-1 rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/10 transition-colors hover:bg-black whitespace-nowrap"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancelLink}
                  className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 whitespace-nowrap"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => handleAddOrSaveLink(e)}
                className="flex items-center gap-1 rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/10 transition-colors hover:bg-black whitespace-nowrap"
              >
                <Plus size={15} />
                Add
              </button>
            )}
          </div>

          {data.personal.links && data.personal.links.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {data.personal.links.map((link, index) => {
                const isEditing = editingLinkIdx === index;
                return (
                  <Badge
                    key={index}
                    variant="secondary"
                    className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors select-none cursor-pointer ${
                      isEditing
                        ? 'border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 ring-2 ring-indigo-600/10'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest('button')) return;
                      setEditingLinkIdx(index);
                      setNewLink(link);
                    }}
                  >
                    <span>{link}</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (isEditing) {
                          handleCancelLink();
                        }
                        removeLink(index);
                      }}
                      className={`ml-0.5 transition-colors flex-shrink-0 ${
                        isEditing ? 'text-indigo-400 hover:text-indigo-600' : 'text-slate-400 hover:text-red-500'
                      }`}
                    >
                      <X size={10} />
                    </button>
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Professional Summary card ─────────────────── */}
      <div className="space-y-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white">
            <FileText size={12} />
          </span>
          Professional Summary
        </h4>
        <Textarea
          {...register('summary')}
          placeholder="Results-driven professional with 5+ years of experience…"
          rows={5}
          className={`resize-none rounded-xl px-3 ${errors.summary ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
        />
        {errors.summary && (
          <p className="text-xs text-red-500 mt-1">{errors.summary.message}</p>
        )}
        <p className="text-xs text-slate-400 mt-1">
          Write 2–4 sentences highlighting your key strengths and experience (min. 20 characters)
        </p>
      </div>

      {isDirty && (
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/10 transition-all hover:bg-black"
        >
          <Save size={15} />
          Save Changes
        </button>
      )}
    </form>
  );
};
