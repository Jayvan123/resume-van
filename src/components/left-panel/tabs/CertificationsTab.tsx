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
          className="flex items-center gap-1 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold px-3.5 py-2 rounded-lg transition-colors"
        >
          <Plus size={15} />
          Add
        </button>
      </div>

      {data.certifications.length > 0 ? (
        <ul className="space-y-2">
          {data.certifications.map((cert, index) => (
            <li
              key={index}
              className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 shadow-sm"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Award size={15} className="text-yellow-500 flex-shrink-0" />
                <span className="text-sm font-medium text-slate-700 truncate">{cert}</span>
              </div>
              <button
                onClick={() => removeCertification(index)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                title="Remove"
              >
                <Trash2 size={13} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-slate-200 p-8 text-center text-slate-400">
          <p className="text-sm font-medium">No certifications added yet</p>
          <p className="text-xs mt-1">Add certifications above or press Enter</p>
        </div>
      )}

      <p className="text-xs text-slate-400">
        💡 Include the full certification name and any relevant issuer
      </p>
    </div>
  );
};
