import { FileText } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
          <FileText className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="glass rounded-2xl rounded-tl-md px-4 py-3.5 flex items-center gap-1.5">
        <span className="typing-dot w-2 h-2 rounded-full bg-indigo-400 dark:bg-indigo-500" style={{ animationDelay: '0ms' }} />
        <span className="typing-dot w-2 h-2 rounded-full bg-indigo-400 dark:bg-indigo-500" style={{ animationDelay: '200ms' }} />
        <span className="typing-dot w-2 h-2 rounded-full bg-indigo-400 dark:bg-indigo-500" style={{ animationDelay: '400ms' }} />
      </div>
    </div>
  );
}
