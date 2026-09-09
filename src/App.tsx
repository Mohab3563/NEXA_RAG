import { useEffect, useRef, useState, useCallback } from 'react';
import { Menu, Sparkles, FileText } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { Sidebar } from '@/components/Sidebar';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { MessageBubble } from '@/components/MessageBubble';
import { TypingIndicator } from '@/components/TypingIndicator';
import { ChatInput } from '@/components/ChatInput';
import { queryRag } from '@/lib/api';
import type { ChatMessage, UploadedDocument } from '@/types';

const BASE_URL = 'https://nexadeploy-production.up.railway.app';

/**
 * Hook to automatically trigger backend user data cleanup using navigator.sendBeacon
 * when the user refreshes or closes the page.
 */
function useRefreshCleanup() {
  useEffect(() => {
    const handleBeforeUnload = () => {
      const userId = localStorage.getItem('nexa_user_id');
      if (userId) {
        const url = `${BASE_URL}/cleanup/${userId}`;
        // sendBeacon ensures the HTTP request fires reliably during page refresh or close
        navigator.sendBeacon(url);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
}

function App() {
  // Automatically bind the refresh/unload cleanup listener
  useRefreshCleanup();

  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<string>('ALL');
  const [isThinking, setIsThinking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const feedRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, scrollToBottom]);

  const handleUploadSuccess = (doc: UploadedDocument) => {
    setDocuments((prev) => {
      // Replace if same filename already exists
      const filtered = prev.filter((d) => d.file !== doc.file);
      return [...filtered, doc];
    });
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments((prev) => {
      const removed = prev.find((d) => d.id === id);
      if (removed && selectedDocument === removed.file) {
        setSelectedDocument('ALL');
      }
      return prev.filter((d) => d.id !== id);
    });
  };

  const handleClearChat = () => {
    setMessages([]);
    toast.success('Chat cleared');
  };

  const handleSend = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `${Date.now()}-u`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const res = await queryRag(text, 'rag', selectedDocument);
      const aiMsg: ChatMessage = {
        id: `${Date.now()}-a`,
        role: 'assistant',
        content: res.answer,
        references: res.references,
        mode: res.mode,
        selectedDocument: res.selected_document,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      if (message.includes('Failed to fetch') || message.includes('Network')) {
        toast.error('Network error', {
          description: 'Could not reach the server. Please check your connection.',
        });
      } else if (message.includes('422')) {
        toast.error('Invalid request', {
          description: 'The server could not process your query.',
        });
      } else if (message.includes('500')) {
        toast.error('Server error', {
          description: 'Something went wrong on the server side.',
        });
      } else {
        toast.error('Query failed', { description: message });
      }

      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-e`,
          role: 'assistant',
          content: 'I encountered an error while processing your request. Please try again.',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    handleSend(prompt);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30 text-slate-900 dark:text-slate-100">
      {/* Ambient background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-indigo-300/10 dark:bg-indigo-600/10 blur-3xl animate-pulse-soft" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-violet-300/10 dark:bg-violet-600/10 blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          documents={documents}
          onUploadSuccess={handleUploadSuccess}
          onRemoveDocument={handleRemoveDocument}
          selectedDocument={selectedDocument}
          onSelectDocument={setSelectedDocument}
          onClearChat={handleClearChat}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main chat workspace */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Mobile header */}
          <div className="lg:hidden flex items-center justify-between px-4 py-3 glass-strong border-b border-slate-200/60 dark:border-slate-700/50">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Nexa AI
              </span>
            </div>
            <div className="w-9" />
          </div>

          {/* Desktop header */}
          <div className="hidden lg:flex items-center justify-between px-6 py-3.5 glass border-b border-slate-200/60 dark:border-slate-700/50">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {selectedDocument === 'ALL'
                  ? 'All Documents'
                  : selectedDocument}
              </span>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {documents.length} document{documents.length !== 1 ? 's' : ''} indexed
            </span>
          </div>

          {/* Message feed */}
          <div
            ref={feedRef}
            className="flex-1 overflow-y-auto"
          >
            <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6">
              {messages.length === 0 && !isThinking ? (
                <WelcomeScreen onPromptClick={handlePromptClick} />
              ) : (
                <div className="space-y-6">
                  {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                  ))}
                  {isThinking && <TypingIndicator />}
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Input bar */}
          <ChatInput
            onSend={handleSend}
            disabled={isThinking}
            documents={documents}
            selectedDocument={selectedDocument}
            onSelectDocument={setSelectedDocument}
          />
        </main>
      </div>

      <Toaster
        position="top-center"
        theme="system"
        toastOptions={{
          style: {
            borderRadius: '12px',
            fontSize: '13px',
          },
        }}
      />
    </div>
  );
}

export default App;
