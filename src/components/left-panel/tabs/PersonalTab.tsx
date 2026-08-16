import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalSchema } from '@/lib/validations/resume.schema';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useResumeStore } from '@/lib/store/resume.slice';
import { z } from 'zod';
import { Save } from 'lucide-react';

type PersonalFormData = z.infer<typeof personalSchema>;

export const PersonalTab: React.FC = () => {
  const { data, setPersonal } = useResumeStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<PersonalFormData>({
    resolver: zodResolver(personalSchema),
    defaultValues: data.personal,
  });

  const onSubmit = (formData: PersonalFormData) => {
    setPersonal(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
          Full Name <span className="text-red-500">*</span>
        </label>
        <Input
          {...register('fullName')}
          placeholder="Sarah Johnson"
          className={errors.fullName ? 'border-red-400 focus-visible:ring-red-400' : ''}
        />
        {errors.fullName && (
          <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
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
            className={errors.email ? 'border-red-400 focus-visible:ring-red-400' : ''}
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
            className={errors.phone ? 'border-red-400 focus-visible:ring-red-400' : ''}
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
          className={errors.location ? 'border-red-400 focus-visible:ring-red-400' : ''}
        />
        {errors.location && (
          <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
          Professional Summary
        </label>
        <Textarea
          {...register('summary')}
          placeholder="Results-driven professional with 5+ years of experience…"
          rows={5}
          className={`resize-none ${errors.summary ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
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
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 rounded-lg transition-all shadow-sm"
        >
          <Save size={15} />
          Save Changes
        </button>
      )}
    </form>
  );
};
