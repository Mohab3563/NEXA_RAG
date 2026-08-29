import { BrainCircuit } from 'lucide-react';

export function Logo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl blur-md opacity-40" />
        <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <BrainCircuit className="w-5 h-5 text-white" />
        </div>
      </div>
      {!collapsed && (
        <div className="leading-tight">
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Nexa AI
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500">
            Knowledge Assistant
          </div>
        </div>
      )}
    </div>
  );
}
