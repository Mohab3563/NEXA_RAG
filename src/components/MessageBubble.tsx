import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FileText, User } from 'lucide-react';
import type { ChatMessage } from '@/types';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex gap-3 animate-fade-in-up ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center shadow-md">
            <User className="w-4 h-4 text-white" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
            <FileText className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Bubble */}
      <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`
            rounded-2xl px-4 py-3
            ${
              isUser
                ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20 rounded-tr-md'
                : 'glass text-slate-700 dark:text-slate-200 rounded-tl-md'
            }
          `}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          ) : (
            <div className="markdown-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Reference badges */}
        {!isUser && message.references && message.references.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {message.references.map((ref, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-700/40"
              >
                <FileText className="w-3 h-3" />
                {ref.source}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
