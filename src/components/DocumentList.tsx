import { FileText, Layers, Trash2 } from 'lucide-react';
import type { UploadedDocument } from '@/types';

interface DocumentListProps {
  documents: UploadedDocument[];
  onRemove: (id: string) => void;
}

export function DocumentList({ documents, onRemove }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-6 px-4">
        <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
          <FileText className="w-4.5 h-4.5 text-slate-300 dark:text-slate-600" />
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          No documents yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40 hover:border-indigo-300 dark:hover:border-indigo-700/50 transition-colors animate-slide-in"
        >
          <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500/10 to-violet-500/10 flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">
              {doc.file}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded-full">
                <Layers className="w-2.5 h-2.5" />
                {doc.chunks} chunks
              </span>
            </div>
          </div>
          <button
            onClick={() => onRemove(doc.id)}
            aria-label="Remove document"
            className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all flex-shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
