import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Library, Check } from 'lucide-react';
import type { UploadedDocument } from '@/types';

interface DocumentSelectorProps {
  documents: UploadedDocument[];
  selectedDocument: string;
  onSelect: (doc: string) => void;
  variant?: 'sidebar' | 'inline';
}

export function DocumentSelector({
  documents,
  selectedDocument,
  onSelect,
  variant = 'sidebar',
}: DocumentSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const displayLabel =
    selectedDocument === 'ALL' ? 'All Documents' : selectedDocument;

  if (variant === 'inline') {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
        >
          <Library className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
          <span className="max-w-[120px] truncate">{displayLabel}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>
        {open && (
          <div className="absolute bottom-full right-0 mb-2 w-56 rounded-xl glass-strong shadow-xl shadow-slate-900/10 dark:shadow-black/40 p-1.5 z-50 animate-scale-in">
            <DropdownItem
              label="All Documents"
              isSelected={selectedDocument === 'ALL'}
              onClick={() => {
                onSelect('ALL');
                setOpen(false);
              }}
            />
            {documents.length > 0 && (
              <div className="my-1 border-t border-slate-200/60 dark:border-slate-700/50" />
            )}
            {documents.map((doc) => (
              <DropdownItem
                key={doc.id}
                label={doc.file}
                isSelected={selectedDocument === doc.file}
                onClick={() => {
                  onSelect(doc.file);
                  setOpen(false);
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
        Scope Filter
      </label>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-700/50 transition-colors"
      >
        <span className="flex items-center gap-2 min-w-0">
          <Library className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
          <span className="truncate">{displayLabel}</span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 rounded-xl glass-strong shadow-xl shadow-slate-900/10 dark:shadow-black/40 p-1.5 z-50 animate-scale-in">
          <DropdownItem
            label="All Documents"
            isSelected={selectedDocument === 'ALL'}
            onClick={() => {
              onSelect('ALL');
              setOpen(false);
            }}
          />
          {documents.length > 0 && (
            <div className="my-1 border-t border-slate-200/60 dark:border-slate-700/50" />
          )}
          {documents.map((doc) => (
            <DropdownItem
              key={doc.id}
              label={doc.file}
              isSelected={selectedDocument === doc.file}
              onClick={() => {
                onSelect(doc.file);
                setOpen(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DropdownItem({
  label,
  isSelected,
  onClick,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs transition-colors ${
        isSelected
          ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 font-medium'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      <span className="truncate text-left">{label}</span>
      {isSelected && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
    </button>
  );
}
