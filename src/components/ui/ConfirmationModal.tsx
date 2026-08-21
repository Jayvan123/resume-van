import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  onConfirm,
  onCancel,
}) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const iconMap = {
    danger: <AlertTriangle className="size-6 text-white" />,
    warning: <AlertTriangle className="size-6 text-white" />,
    info: <Info className="size-6 text-white" />,
  };

  const iconBgMap = {
    danger: 'bg-rose-600',
    warning: 'bg-amber-500',
    info: 'bg-indigo-600',
  };

  const confirmBtnClass = variant === 'danger'
    ? 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500'
    : variant === 'warning'
      ? 'bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500'
      : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.15)] max-w-[440px] w-full p-6 z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center text-center">
        
        {/* Centered Filled Icon */}
        <div className={`p-3 rounded-full flex items-center justify-center mb-4.5 shadow-md ${iconBgMap[variant]}`}>
          {iconMap[variant]}
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-slate-900 leading-tight">
          {title}
        </h3>
        <p className="text-xs text-slate-500 mt-3 leading-relaxed px-2">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-7 w-full">
          <button
            onClick={onCancel}
            className="flex-1 text-xs font-semibold text-slate-600 hover:text-slate-800 border border-slate-200 hover:border-slate-300 bg-white py-2.5 rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 active:scale-[0.98]"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 text-xs font-semibold py-2.5 rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] ${confirmBtnClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
