import { useRef, useState, type DragEvent, type ChangeEvent } from 'react';
import { UploadCloud, FileUp, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { uploadDocument } from '@/lib/api';
import type { UploadedDocument } from '@/types';

interface FileUploadZoneProps {
  onUploadSuccess: (doc: UploadedDocument) => void;
}

export function FileUploadZone({ onUploadSuccess }: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFile = async (file: File) => {
    const allowed = ['.pdf', '.docx', '.txt'];
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowed.includes(ext)) {
      toast.error('Unsupported file type', {
        description: 'Please upload a PDF, DOCX, or TXT file.',
      });
      return;
    }

    setIsUploading(true);
    setProgress(0);

    // Simulate progress while uploading
    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 18, 92));
    }, 200);

    try {
      const res = await uploadDocument(file);
      setProgress(100);
      onUploadSuccess({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file: res.file,
        chunks: res.chunks,
        uploadedAt: Date.now(),
      });
      toast.success('Document uploaded', {
        description: `${res.file} • ${res.chunks} chunks indexed`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error('Upload failed', { description: message });
    } finally {
      clearInterval(progressInterval);
      setIsUploading(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => !isUploading && inputRef.current?.click()}
      className={`
        relative group cursor-pointer rounded-xl border-2 border-dashed p-4 text-center transition-all
        ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-500/10 scale-[1.02]'
            : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/40'
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={onChange}
        className="hidden"
      />

      {isUploading ? (
        <div className="py-1.5">
          <div className="flex items-center justify-center gap-2 text-indigo-500 dark:text-indigo-400 mb-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-xs font-medium">Uploading & indexing…</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="py-1.5">
          <div className="flex items-center justify-center mb-1.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500/10 to-violet-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              {isDragging ? (
                <FileUp className="w-4.5 h-4.5 text-indigo-500" />
              ) : (
                <UploadCloud className="w-4.5 h-4.5 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors" />
              )}
            </div>
          </div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
            {isDragging ? 'Drop to upload' : 'Drag & drop or click'}
          </p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
            PDF, DOCX, TXT
          </p>
        </div>
      )}
    </div>
  );
}
