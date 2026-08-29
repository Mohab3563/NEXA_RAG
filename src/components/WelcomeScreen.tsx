import { Sparkles, FileSearch, ListChecks, BookOpen } from 'lucide-react';

interface WelcomeScreenProps {
  onPromptClick: (prompt: string) => void;
}

const STARTER_PROMPTS = [
  {
    icon: FileSearch,
    title: 'Summarize key takeaways',
    prompt: 'Summarize the key takeaways from the document.',
  },
  {
    icon: ListChecks,
    title: 'What technical skills are listed?',
    prompt: 'What technical skills are listed in the document?',
  },
  {
    icon: BookOpen,
    title: 'Extract main topics',
    prompt: 'What are the main topics covered across all documents?',
  },
  {
    icon: Sparkles,
    title: 'Give me a quick overview',
    prompt: 'Give me a quick overview of everything you know.',
  },
];

export function WelcomeScreen({ onPromptClick }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full py-8 animate-fade-in">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl blur-2xl opacity-20 animate-pulse-soft" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
        How can I help you today?
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 text-center max-w-md">
        Ask questions about your uploaded documents, or try one of these starter
        prompts.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
        {STARTER_PROMPTS.map((p, i) => (
          <button
            key={i}
            onClick={() => onPromptClick(p.prompt)}
            className="group flex items-start gap-3 p-4 rounded-xl glass hover:shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-300/60 dark:hover:border-indigo-700/50 transition-all text-left animate-fade-in-up"
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
          >
            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500/10 to-violet-500/10 flex items-center justify-center group-hover:from-indigo-500/20 group-hover:to-violet-500/20 transition-all">
              <p.icon className="w-4.5 h-4.5 text-indigo-500 dark:text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                {p.title}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-2">
                {p.prompt}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
