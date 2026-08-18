import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useResumeStore } from '@/lib/store/resume.slice';
import { Plus, Trash2, Award } from 'lucide-react';

export const CertificationsTab: React.FC = () => {
  const { data, addCertification, removeCertification } = useResumeStore();
  const [newCert, setNewCert] = useState('');

  const handleAdd = () => {
    if (newCert.trim()) {
      addCertification(newCert.trim());
      setNewCert('');
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
          value={newCert}
          onChange={(e) => setNewCert(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. AWS Certified Solutions Architect…"
          className="flex-1 text-sm"
        />
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/10 transition-colors hover:bg-black"
        >
          <Plus size={15} />
          Add
        </button>
      </div>

      {data.certifications.length > 0 ? (
        <ul className="space-y-2.5">
          {data.certifications.map((cert, index) => (
            <li
              key={index}
              className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                  <Award size={15} />
                </span>
                <span className="truncate text-sm font-medium text-slate-700">{cert}</span>
              </div>
              <button
                onClick={() => removeCertification(index)}
                className="flex-shrink-0 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                title="Remove"
              >
                <Trash2 size={13} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center text-slate-400">
          <p className="text-sm font-medium">No certifications added yet</p>
          <p className="text-xs mt-1">Add certifications above or press Enter</p>
        </div>
      )}

      <p className="text-xs text-slate-400">
        Include the full certification name and any relevant issuer
      </p>
    </div>
  );
};
