import React from 'react';
import { Folder, Trash2, Edit3, X, ChevronDown, Check, Save } from 'lucide-react';
import { useResumeStore } from '@/lib/store/resume.slice';

const formatRelativeTime = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 10) return 'just now';
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  } catch (e) {
    return '';
  }
};

export const DraftsManager: React.FC = () => {
  const {
    drafts,
    activeDraftId,
    saveDraft,
    loadDraft,
    deleteDraft,
    renameDraft,
    closeActiveDraft,
  } = useResumeStore();

  const [isOpen, setIsOpen] = React.useState(false);
  const [newDraftName, setNewDraftName] = React.useState('');
  const [editingDraftId, setEditingDraftId] = React.useState<string | null>(null);
  const [editingDraftName, setEditingDraftName] = React.useState('');
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);

  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setConfirmDeleteId(null);
        setEditingDraftId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeDraft = drafts.find((d) => d.id === activeDraftId);

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDraftName.trim()) return;
    saveDraft(newDraftName.trim());
    setNewDraftName('');
  };

  const handleStartRename = (id: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingDraftId(id);
    setEditingDraftName(currentName);
    setConfirmDeleteId(null);
  };

  const handleSaveRename = (id: string, e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    if (!editingDraftName.trim()) return;
    renameDraft(id, editingDraftName.trim());
    setEditingDraftId(null);
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmDeleteId === id) {
      deleteDraft(id);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      setEditingDraftId(null);
    }
  };

  return (
    <div ref={dropdownRef} className="relative flex items-center gap-2">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Saved Drafts:</span>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between gap-2 min-w-[180px] max-w-[260px] text-sm font-medium border rounded-xl px-3.5 py-2 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-900/10 active:scale-[0.98] ${
            activeDraft
              ? 'border-indigo-200 bg-indigo-50/50 text-indigo-900 hover:border-indigo-300'
              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
          }`}
        >
          <Folder size={14} className={activeDraft ? 'text-indigo-600' : 'text-slate-400'} />
          <span className="truncate flex-1 text-left">
            {activeDraft ? activeDraft.name : 'No Active Draft'}
          </span>
          <ChevronDown
            size={14}
            className={`text-slate-500 transition-transform duration-200 flex-shrink-0 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1.5 w-[320px] bg-white border border-slate-200/80 shadow-xl rounded-xl z-50 overflow-hidden flex flex-col transition-all duration-200 origin-top-right">
            {/* Header info */}
            <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Drafts Manager</h3>
                {activeDraft ? (
                  <p className="text-[11px] text-indigo-600 font-medium mt-0.5">
                    Syncing edits dynamically
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Not linked to any saved draft
                  </p>
                )}
              </div>
              {activeDraft && (
                <button
                  onClick={() => {
                    closeActiveDraft();
                    setIsOpen(false);
                  }}
                  title="Close draft (keep edits in active workspace)"
                  className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200/60 rounded-md transition-colors"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Quick Save form */}
            <form onSubmit={handleSaveNew} className="p-3.5 border-b border-slate-100 flex gap-2">
              <input
                type="text"
                value={newDraftName}
                onChange={(e) => setNewDraftName(e.target.value)}
                placeholder={activeDraft ? "Save current as new draft..." : "Name your current resume..."}
                className="flex-1 text-xs border border-slate-200 hover:border-slate-300 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-lg px-2.5 py-1.5 outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!newDraftName.trim()}
                title="Save draft"
                className="bg-slate-900 hover:bg-black text-white disabled:bg-slate-200 disabled:cursor-not-allowed px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
              >
                <Save size={12} />
                Save
              </button>
            </form>

            {/* Draft list */}
            <div className="flex-1 max-h-[220px] overflow-y-auto py-1">
              <div className="px-3.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Saved Drafts ({drafts.length})
              </div>
              {drafts.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-slate-400 font-medium">
                  No saved drafts yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {drafts
                    .slice()
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .map((draft) => {
                      const isSelected = draft.id === activeDraftId;
                      const isEditing = draft.id === editingDraftId;
                      const isConfirmingDelete = draft.id === confirmDeleteId;

                      return (
                        <div
                          key={draft.id}
                          onClick={() => {
                            if (!isEditing && !isConfirmingDelete) {
                              loadDraft(draft.id);
                              setIsOpen(false);
                            }
                          }}
                          className={`group/item flex items-center justify-between gap-3 px-3.5 py-2.5 text-left text-xs transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-50/40 text-indigo-900 font-semibold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex-1 min-w-0 pr-1">
                            {isEditing ? (
                              <div
                                className="flex items-center gap-1.5"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="text"
                                  value={editingDraftName}
                                  onChange={(e) => setEditingDraftName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveRename(draft.id, e);
                                    if (e.key === 'Escape') setEditingDraftId(null);
                                  }}
                                  className="flex-1 text-xs border border-indigo-200 focus:border-indigo-500 rounded px-1.5 py-0.5 outline-none font-normal"
                                  autoFocus
                                />
                                <button
                                  onClick={(e) => handleSaveRename(draft.id, e)}
                                  className="text-emerald-600 hover:text-emerald-700 p-0.5 hover:bg-emerald-50 rounded"
                                >
                                  <Check size={12} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingDraftId(null);
                                  }}
                                  className="text-slate-400 hover:text-slate-500 p-0.5 hover:bg-slate-100 rounded"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ) : (
                              <>
                                <div className="truncate flex items-center gap-1.5">
                                  {isSelected && <div className="size-1.5 rounded-full bg-indigo-600 flex-shrink-0" />}
                                  <span className="truncate">{draft.name}</span>
                                </div>
                                <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                                  Updated {formatRelativeTime(draft.updatedAt)}
                                </div>
                              </>
                            )}
                          </div>

                          {!isEditing && (
                            <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                              {isConfirmingDelete ? (
                                <button
                                  onClick={(e) => handleDeleteClick(draft.id, e)}
                                  className="text-[10px] bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold px-2 py-0.5 rounded transition-all"
                                >
                                  Confirm?
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={(e) => handleStartRename(draft.id, draft.name, e)}
                                    title="Rename draft"
                                    className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200/60 rounded transition-all"
                                  >
                                    <Edit3 size={11} />
                                  </button>
                                  <button
                                    onClick={(e) => handleDeleteClick(draft.id, e)}
                                    title="Delete draft"
                                    className="text-slate-400 hover:text-rose-600 p-1 hover:bg-slate-200/60 rounded transition-all"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
