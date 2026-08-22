import React from 'react';
import { Folder, Trash2, Edit3, X, ChevronDown, Check, Save, AlertTriangle, Plus } from 'lucide-react';
import { useResumeStore } from '@/lib/store/resume.slice';
import { ConfirmationModal } from './ui/ConfirmationModal';

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
    data,
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
  const [confirmLoadId, setConfirmLoadId] = React.useState<string | null>(null);
  const [savedFlash, setSavedFlash] = React.useState(false);

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

  // ── Ctrl+S / Cmd+S global keyboard shortcut ────────────────────────────────
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (!activeDraftId) {
          // No active draft → create one automatically with a generated name
          if (drafts.length < 5) {
            saveDraft('');
          }
        }
        // If active draft exists it is already synced live on every keystroke —
        // just flash the indicator so the user gets visual confirmation.
        setSavedFlash(true);
        setTimeout(() => setSavedFlash(false), 1800);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeDraftId, drafts.length, saveDraft]);

  const activeDraft = drafts.find((d) => d.id === activeDraftId);

  const hasData =
    data.personal.fullName !== '' ||
    data.experience.length > 0 ||
    data.education.length > 0;

  let defaultDraftName = '';
  const baseName = activeDraft
    ? `${activeDraft.name} (Copy)`
    : (data.personal.fullName && data.personal.fullName.trim())
      ? `${data.personal.fullName.trim()} Resume`
      : 'Draft';

  defaultDraftName = baseName;
  if (drafts.some((d) => d.name.toLowerCase() === defaultDraftName.toLowerCase())) {
    let idx = 2;
    const template = baseName === 'Draft' ? 'Draft {}' : `${baseName} {}`;
    let proposed = template.replace('{}', String(idx));
    while (drafts.some((d) => d.name.toLowerCase() === proposed.toLowerCase())) {
      idx++;
      proposed = template.replace('{}', String(idx));
    }
    defaultDraftName = proposed;
  } else if (baseName === 'Draft') {
    defaultDraftName = 'Draft 1';
  }

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    saveDraft(newDraftName.trim());
    setNewDraftName('');
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
    setIsOpen(false); // Close dropdown on save to provide a smooth, focused transition
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

  const handleQuickSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (drafts.length >= 5) return;
    saveDraft('');
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  };

  const handleLoadClick = (id: string) => {
    if (!activeDraftId && hasData) {
      setConfirmLoadId(id);
    } else {
      loadDraft(id);
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className="relative flex items-center gap-2">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Saved Drafts:</span>
      <div className="flex items-center gap-1.5">
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
          {/* Saved flash indicator */}
          {savedFlash && (
            <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200 flex-shrink-0 animate-in fade-in zoom-in duration-150">
              <Check size={9} strokeWidth={3} />
              Saved
            </span>
          )}
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
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-medium">Ctrl+S to save</span>
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
            </div>

            {/* Quick Save form */}
            {drafts.length >= 5 ? (
              <div className="p-3 bg-amber-50 border-b border-amber-100 text-[11px] text-amber-850 font-semibold flex items-center justify-center gap-1.5">
                <AlertTriangle size={12} className="text-amber-600 flex-shrink-0" />
                <span>Draft limit reached (Max 5). Delete one to save.</span>
              </div>
            ) : (
              <form onSubmit={handleSaveNew} className="p-3.5 border-b border-slate-100 flex gap-2">
                <input
                  type="text"
                  value={newDraftName}
                  onChange={(e) => setNewDraftName(e.target.value)}
                  placeholder={`Draft name (default: ${defaultDraftName})`}
                  className="flex-1 text-xs border border-slate-200 hover:border-slate-300 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-lg px-2.5 py-1.5 outline-none transition-all"
                />
                <button
                  type="submit"
                  title="Save draft"
                  className="bg-slate-900 hover:bg-black text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all animate-in fade-in zoom-in duration-100"
                >
                  <Save size={12} />
                  Save
                </button>
              </form>
            )}

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
                              handleLoadClick(draft.id);
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

      {/* Quick plus icon button */}
      <button
        onClick={handleQuickSave}
        disabled={drafts.length >= 5}
        title={drafts.length >= 5 ? "Draft limit reached (Max 5)" : `Quick save as ${defaultDraftName} (or Ctrl+S)`}
        className={`flex items-center justify-center size-9 border bg-white text-slate-500 disabled:opacity-30 disabled:hover:bg-white disabled:cursor-not-allowed rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-900/10 active:scale-[0.95] flex-shrink-0 ${
          savedFlash
            ? 'border-emerald-300 bg-emerald-50 text-emerald-600 scale-110'
            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800'
        }`}
      >
        {savedFlash ? <Check size={15} strokeWidth={2.5} /> : <Plus size={15} />}
      </button>
    </div>

      {/* Confirmation modal for overwrite when loading draft */}
      <ConfirmationModal
        isOpen={confirmLoadId !== null}
        title="Overwrite Unsaved Changes?"
        message="You have unsaved changes in your workspace. Loading this draft will replace all your current edits. Are you sure you want to proceed?"
        confirmText="Yes, Load Draft"
        cancelText="Cancel"
        variant="warning"
        onConfirm={() => {
          if (confirmLoadId) {
            loadDraft(confirmLoadId);
            setConfirmLoadId(null);
            setIsOpen(false);
          }
        }}
        onCancel={() => setConfirmLoadId(null)}
      />
    </div>
  );
};
