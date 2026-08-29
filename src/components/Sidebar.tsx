import { X, Library, Eraser } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { FileUploadZone } from '@/components/FileUploadZone';
import { DocumentList } from '@/components/DocumentList';
import { DocumentSelector } from '@/components/DocumentSelector';
import type { UploadedDocument } from '@/types';

interface SidebarProps {
  documents: UploadedDocument[];
  onUploadSuccess: (doc: UploadedDocument) => void;
  onRemoveDocument: (id: string) => void;
  selectedDocument: string;
  onSelectDocument: (doc: string) => void;
  onClearChat: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  documents,
  onUploadSuccess,
  onRemoveDocument,
  selectedDocument,
  onSelectDocument,
  onClearChat,
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40 h-screen w-72 flex-shrink-0
          flex flex-col
          glass-strong border-r border-slate-200/60 dark:border-slate-700/50
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200/60 dark:border-slate-700/50">
          <Logo />
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          {/* Upload zone */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Document Manager
            </h3>
            <FileUploadZone onUploadSuccess={onUploadSuccess} />
          </div>

          {/* Document list */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Active Documents
              </h3>
              {documents.length > 0 && (
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">
                  {documents.length}
                </span>
              )}
            </div>
            <DocumentList documents={documents} onRemove={onRemoveDocument} />
          </div>

          {/* Scope filter */}
          <div>
            <DocumentSelector
              documents={documents}
              selectedDocument={selectedDocument}
              onSelect={onSelectDocument}
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-4 py-3 border-t border-slate-200/60 dark:border-slate-700/50">
          <button
            onClick={onClearChat}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 hover:border-red-300 dark:hover:border-red-700/50 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <Eraser className="w-3.5 h-3.5" />
            Clear Chat
          </button>
          <div className="flex items-center gap-1.5 mt-2.5 px-1">
            <Library className="w-3 h-3 text-slate-300 dark:text-slate-600" />
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              Nexa RAG • Powered by your docs
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
