import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowUp, CornerDownLeft } from 'lucide-react';
import { DocumentSelector } from '@/components/DocumentSelector';
import type { UploadedDocument } from '@/types';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
  documents: UploadedDocument[];
  selectedDocument: string;
  onSelectDocument: (doc: string) => void;
}

export function ChatInput({
  onSend,
  disabled,
  documents,
  selectedDocument,
  onSelectDocument,
}: ChatInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autosize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  useEffect(() => {
    autosize();
  }, [text]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-1">
      <div className="max-w-3xl mx-auto">
        <div className="glass-strong rounded-2xl shadow-lg shadow-slate-900/5 dark:shadow-black/20 p-2 flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask anything about your documents…"
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 px-2 py-2 max-h-[200px] outline-none"
          />

          <div className="flex items-center gap-2 flex-shrink-0 pb-0.5">
            <DocumentSelector
              documents={documents}
              selectedDocument={selectedDocument}
              onSelect={onSelectDocument}
              variant="inline"
            />
            <button
              onClick={handleSend}
              disabled={!text.trim() || disabled}
              aria-label="Send message"
              className={`
                flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all
                ${
                  text.trim() && !disabled
                    ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                }
              `}
            >
              <ArrowUp className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-2 text-[10px] text-slate-400 dark:text-slate-500">
          <CornerDownLeft className="w-3 h-3" />
          <span>Enter to send • Shift+Enter for new line</span>
        </div>
      </div>
    </div>
  );
}
