
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FinMode, ChatMessage, ExpertiseLevel, FinancialGoal, Attachment, AppError, ErrorCategory, UserSession } from './types';
import { MODE_CONFIGS } from './constants';
import { askFinIntel } from './services/gemini';
import MarkdownView from './components/MarkdownView';
import TechnicalReportCard from './components/TechnicalReportCard';
import AnalysisModule from './components/AnalysisModule';
import SecurityGuard from './components/SecurityGuard';
import AuthGuard from './components/AuthGuard';

const MarketTicker: React.FC = () => {
  const indices = [
    { name: 'NIFTY 50', value: '22,410.20', change: '+0.85%', up: true },
    { name: 'SENSEX', value: '73,876.15', change: '+0.78%', up: true },
    { name: 'S&P 500', value: '5,123.44', change: '-0.12%', up: false },
    { name: 'NASDAQ', value: '16,248.50', change: '+0.22%', up: true },
    { name: 'BTC/USD', value: '64,120.00', change: '-1.45%', up: false },
    { name: 'GOLD', value: '2,345.10', change: '+0.45%', up: true },
  ];

  return (
    <div id="ticker-node" className="w-full bg-[#0d1321] border-b border-slate-800 overflow-hidden flex items-center h-8 px-4 z-20 shadow-sm shrink-0">
      <div className="flex items-center gap-2 mr-6 shrink-0 border-r border-slate-800 pr-4">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mono">Intel Stream</span>
      </div>
      <div className="flex gap-10 animate-ticker whitespace-nowrap">
        {[...indices, ...indices].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 mono">{item.name}</span>
            <span className="text-[10px] font-medium text-slate-100 mono">{item.value}</span>
            <span className={`text-[9px] font-bold mono ${item.up ? 'text-emerald-400' : 'text-rose-400'}`}>
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ErrorToast: React.FC<{ error: AppError; onDismiss: () => void; onRetry?: () => void }> = ({ error, onDismiss, onRetry }) => {
  const categoryStyles: Record<ErrorCategory, { bg: string, border: string, text: string, icon: React.ReactNode }> = {
    [ErrorCategory.API]: { 
      bg: 'bg-rose-950/80', border: 'border-rose-500/50', text: 'text-rose-400',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
    },
    [ErrorCategory.NETWORK]: { 
      bg: 'bg-amber-950/80', border: 'border-amber-500/50', text: 'text-amber-400',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.828-2.828M12 12v.01" /></svg>
    },
    [ErrorCategory.SAFETY]: { 
      bg: 'bg-slate-900', border: 'border-slate-500/50', text: 'text-slate-400',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
    },
    [ErrorCategory.PERMISSIONS]: { 
      bg: 'bg-rose-950/80', border: 'border-rose-500/50', text: 'text-rose-400',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
    },
    [ErrorCategory.VALIDATION]: { 
      bg: 'bg-blue-950/80', border: 'border-blue-500/50', text: 'text-blue-400',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    [ErrorCategory.AUTH]: { 
      bg: 'bg-rose-950/80', border: 'border-rose-500/50', text: 'text-rose-400',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    }
  };

  const style = categoryStyles[error.category];

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-4 animate-slide-up">
      <div className={`${style.bg} backdrop-blur-md border ${style.border} rounded-2xl p-5 shadow-2xl flex items-start gap-4 ring-1 ring-white/10`}>
        <div className={`${style.text} mt-1`}>
          {style.icon}
        </div>
        <div className="flex-1">
          <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${style.text}`}>{error.category.replace('_', ' ')}</div>
          <p className="text-white text-xs font-bold leading-relaxed">{error.message}</p>
          <div className="flex gap-4 mt-4">
            {error.retryable && onRetry && (
              <button 
                onClick={onRetry}
                className="bg-white/10 hover:bg-white/20 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-lg border border-white/10 transition-all"
              >
                Retry Logic
              </button>
            )}
            <button 
              onClick={onDismiss}
              className="text-slate-400 hover:text-white text-[9px] font-black uppercase tracking-widest transition-all"
            >
              Acknowledge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [activeMode, setActiveMode] = useState<FinMode>(FinMode.TRADING);
  const [expertise, setExpertise] = useState<ExpertiseLevel>(ExpertiseLevel.INTERMEDIATE);
  const [goal, setGoal] = useState<FinancialGoal>(FinancialGoal.ACCUMULATION);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('finintel_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('finintel_recent_searches');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [appError, setAppError] = useState<AppError | null>(null);
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [showRecentDropdown, setShowRecentDropdown] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('finintel_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('finintel_recent_searches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleExportPDF = () => {
    window.print();
  };

  const handleError = useCallback((err: any, category: ErrorCategory = ErrorCategory.API, retryable: boolean = true) => {
    const message = typeof err === 'string' ? err : (err.message || 'An unexpected fault occurred.');
    const appErr: AppError = {
      category: err.category || category,
      message: err.message || message,
      retryable: err.retryable !== undefined ? err.retryable : retryable,
      timestamp: Date.now()
    };
    setAppError(appErr);
    setIsLoading(false);
  }, []);

  const handleShare = async (msg: ChatMessage) => {
    const shareText = `FinIntel Report [${msg.mode}]\n\n${msg.content}\n\nSources: ${msg.sources?.map(s => s.uri).join(', ') || 'Internal Reasoning Node'}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `FinIntel Advanced: ${MODE_CONFIGS[msg.mode].title}`,
          text: shareText,
          url: window.location.href
        });
      } catch (err) {
        handleError("Sharing failed due to system restrictions.", ErrorCategory.PERMISSIONS, false);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      handleError("Intelligence copied to secure clipboard.", ErrorCategory.VALIDATION, false);
      setTimeout(() => setAppError(null), 2000);
    }
  };

  const startCamera = async () => {
    setAppError(null);
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      handleError("Camera access denied. Check system hardware permissions.", ErrorCategory.PERMISSIONS, false);
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);
      setPendingAttachments(prev => [...prev, {
        data: canvas.toDataURL('image/jpeg'),
        mimeType: 'image/jpeg',
        name: `capture_${Date.now()}.jpg`
      }]);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    Array.from(files).forEach(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        handleError(`File ${file.name} exceeds 10MB capacity limit.`, ErrorCategory.VALIDATION, false);
        return;
      }

      const reader = new FileReader();
      reader.onerror = () => handleError("File ingestion failure. Read error.", ErrorCategory.VALIDATION, false);
      reader.onload = (event) => {
        setPendingAttachments(prev => [...prev, {
          data: event.target?.result as string,
          mimeType: file.type,
          name: file.name
        }]);
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const finalInput = customPrompt || input;
    
    // Validation
    if (!finalInput.trim() && pendingAttachments.length === 0) {
      handleError("Empty intelligence request. Please provide query or visual data.", ErrorCategory.VALIDATION, false);
      return;
    }

    if (isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: finalInput || "[Asset Scan]",
      mode: activeMode,
      timestamp: Date.now(),
      attachments: pendingAttachments.length > 0 ? [...pendingAttachments] : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setPendingAttachments([]);
    setIsLoading(true);
    setAppError(null);
    setSearchQuery(''); 

    try {
      const modeHistory = messages.filter(m => m.mode === activeMode);
      const response = await askFinIntel(userMessage.content, activeMode, expertise, goal, modeHistory, userMessage.attachments);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.text,
        mode: activeMode,
        timestamp: Date.now(),
        sources: response.sources
      }]);
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarize = async () => {
    const currentModeMessages = messages.filter(m => m.mode === activeMode);
    if (currentModeMessages.length === 0) {
      handleError("No history to summarize in the current mode.", ErrorCategory.VALIDATION, false);
      return;
    }

    setIsLoading(true);
    setAppError(null);

    try {
      const prompt = "Please provide a high-density executive summary of our entire discussion in this session so far. Focus on key themes, strategic insights, and identified risks.";
      const response = await askFinIntel(prompt, activeMode, expertise, goal, currentModeMessages, []);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `### 📊 EXECUTIVE SUMMARY\n\n${response.text}`,
        mode: activeMode,
        timestamp: Date.now(),
        sources: response.sources
      }]);
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchCommit = (q: string) => {
    const term = q.trim();
    if (term) {
      setRecentSearches(prev => {
        const filtered = prev.filter(s => s !== term);
        return [term, ...filtered].slice(0, 5);
      });
    }
    setSearchQuery(term);
    setShowRecentDropdown(false);
  };

  const handleLogout = () => {
    setSession(null);
  };

  if (!session) {
    return <AuthGuard onAuthenticated={setSession} />;
  }

  const currentMessages = messages.filter(m => m.mode === activeMode);
  const filteredMessages = searchQuery.trim() === '' 
    ? currentMessages 
    : currentMessages.filter(m => 
        m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.attachments?.some(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-[#0a0f1a] text-slate-300">
      
      {appError && (
        <ErrorToast 
          error={appError} 
          onDismiss={() => setAppError(null)} 
          onRetry={appError.retryable ? () => handleSend(undefined, messages[messages.length-1]?.content) : undefined} 
        />
      )}

      {isCameraOpen && (
        <div id="camera-modal" className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-2xl aspect-video bg-slate-900 rounded-3xl overflow-hidden border border-blue-500/30">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6">
              <button onClick={stopCamera} className="bg-white/10 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest">Cancel</button>
              <button onClick={capturePhoto} className="bg-blue-600 text-white w-16 h-16 rounded-full border-4 border-white/20 active:scale-95 transition-all"></button>
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      <aside className="w-full lg:w-72 bg-[#0d1321] border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col z-30 shrink-0">
        <div className="p-5 border-b border-slate-800">
          <h1 className="text-sm font-black text-white tracking-tighter uppercase">FinIntel <span className="text-blue-500">v6.2</span></h1>
          <div className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-1">Institutional Grade</div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {Object.entries(MODE_CONFIGS).map(([key, config]) => (
            <button
              key={key}
              onClick={() => {
                setActiveMode(key as FinMode);
                setSearchQuery('');
              }}
              className={`w-full text-left p-3 rounded-lg transition-all flex items-center gap-3 border ${
                activeMode === key ? 'bg-blue-600/10 border-blue-500/50 text-white' : 'hover:bg-slate-800/50 border-transparent text-slate-400'
              }`}
            >
              {config.icon}
              <div className="text-xs font-bold tracking-tight">{config.title}</div>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-3 px-3 py-3 bg-slate-900/50 rounded-2xl border border-slate-800">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black text-white">OP</div>
            <div className="flex-1 min-w-0">
               <div className="text-[10px] font-black text-white truncate uppercase">{session.username}</div>
               <div className="text-[8px] font-bold text-blue-500 uppercase tracking-widest">{session.accessLevel}</div>
            </div>
            <button onClick={handleLogout} className="text-slate-600 hover:text-rose-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </div>
      </aside>

      <main key={activeMode} className="flex-1 flex flex-col relative min-w-0 h-full">
        <MarketTicker />

        <header className="bg-[#0a0f1a] border-b border-slate-800/50 h-16 flex items-center justify-between px-6 shrink-0 z-40">
          <div className="flex items-center gap-6 flex-1 relative" ref={searchContainerRef}>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] whitespace-nowrap hidden lg:inline">{MODE_CONFIGS[activeMode].title}</span>
            <div className="relative max-w-sm w-full group">
              <input 
                type="text" 
                value={searchQuery}
                onFocus={() => setShowRecentDropdown(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchCommit(searchQuery)}
                placeholder="Search Current Session..."
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-[10px] font-bold text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 uppercase tracking-widest shadow-inner"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              {showRecentDropdown && recentSearches.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d1321] border border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-fade-in z-50">
                  <div className="p-3 border-b border-slate-800 bg-slate-900/40 flex justify-between items-center">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Searched History</span>
                    <button onClick={() => { setRecentSearches([]); setShowRecentDropdown(false); }} className="text-[8px] font-black text-rose-500 hover:text-rose-400 uppercase">Clear</button>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {recentSearches.map((term, i) => (
                      <button 
                        key={i} 
                        onClick={() => { setSearchQuery(term); setShowRecentDropdown(false); }}
                        className="w-full text-left px-4 py-2.5 text-[10px] font-bold text-slate-400 hover:text-white hover:bg-blue-600/10 flex items-center gap-3 transition-colors border-b border-slate-800/30 last:border-none"
                      >
                        <svg className="w-3 h-3 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {showRecentDropdown && <div className="fixed inset-0 z-40" onClick={() => setShowRecentDropdown(false)} />}
          </div>

          <div className="flex gap-4 ml-4">
            <button 
              onClick={handleSummarize} 
              disabled={isLoading || currentMessages.length === 0}
              className="text-[10px] font-black text-emerald-500 hover:text-emerald-400 disabled:text-slate-700 disabled:cursor-not-allowed uppercase tracking-widest transition-colors flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              <span className="hidden sm:inline">Summarize Intel</span>
            </button>
            <button onClick={handleExportPDF} className="text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-colors flex items-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <span className="hidden sm:inline">Export Report</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scroll-smooth">
          <div className="max-w-5xl mx-auto w-full px-4 lg:px-8 py-10 space-y-10 pb-48">
            <div className="print-header">
                <h1 className="text-2xl font-black uppercase tracking-tighter">FinIntel Advanced | Intelligence Report</h1>
                <p className="text-xs font-bold text-slate-500 mt-2 uppercase">Mode: {MODE_CONFIGS[activeMode].title} | Generated: {new Date().toLocaleString()}</p>
                <div className="mt-4 border-t border-slate-200"></div>
            </div>

            {activeMode === FinMode.HISTORY ? (
              <AnalysisModule content="" mode={FinMode.HISTORY} messages={messages} onSelectMode={m => setActiveMode(m)} />
            ) : filteredMessages.length === 0 && !isLoading ? (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center animate-slide-up">
                <div className="p-10 bg-[#0d1321] rounded-3xl border border-slate-800 shadow-2xl relative">
                  <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-500 border border-blue-500/20">{MODE_CONFIGS[activeMode].icon}</div>
                  <h2 className="text-lg font-bold text-white mb-2 uppercase tracking-[0.2em]">{searchQuery ? "No Local Matches" : MODE_CONFIGS[activeMode].title}</h2>
                  {!searchQuery && <button onClick={() => handleSend(undefined, "Initial Audit Request")} className="px-6 py-3 bg-blue-600 text-white text-[10px] font-black rounded-xl uppercase tracking-widest border border-blue-400/30 hover:bg-blue-500 transition-colors">Initialize Node</button>}
                </div>
              </div>
            ) : null}

            {activeMode === FinMode.CALIBRATION && (
              <AnalysisModule content="" mode={FinMode.CALIBRATION} expertise={expertise} goal={goal} onSetExpertise={setExpertise} onSetGoal={setGoal} />
            )}

            {activeMode !== FinMode.HISTORY && filteredMessages.map((msg, idx) => (
              <div key={idx} className={`assistant-node flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full animate-slide-up`}>
                <div className={`${msg.role === 'user' ? 'max-w-[80%] bg-blue-600 text-white rounded-2xl rounded-tr-none px-6 py-4 shadow-xl border border-blue-400/20' : 'w-full'}`}>
                  {msg.role === 'assistant' ? (
                    <div className="bg-[#0d1321] border border-slate-800 rounded-3xl p-6 lg:p-10 shadow-lg relative group">
                      <div className="flex items-center justify-between mb-8 border-b border-slate-800/50 pb-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 text-blue-500">{MODE_CONFIGS[msg.mode].icon}</div>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{expertise} Level Analysis</span>
                        </div>
                        <div className="action-btn-node flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleShare(msg)} className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-blue-400 transition-colors" title="Share Analysis"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-2.684 3 3 0 000 2.684zm0 12.684a3 3 0 100-2.684 3 3 0 000 2.684z" /></svg></button>
                          <button onClick={handleExportPDF} className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-indigo-400 transition-colors" title="Export to PDF"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg></button>
                        </div>
                      </div>
                      {msg.mode === FinMode.TRADING && <TechnicalReportCard content={msg.content} />}
                      <AnalysisModule content={msg.content} mode={msg.mode} expertise={expertise} goal={goal} />
                      <div className="prose prose-invert max-w-none text-slate-200"><MarkdownView content={msg.content} /></div>
                      {msg.sources && (
                        <div className="mt-8 pt-6 border-t border-slate-800/50">
                           <div className="flex flex-wrap gap-2">{msg.sources.map((s, i) => <a key={i} href={s.uri} target="_blank" className="text-[11px] font-bold text-blue-400 bg-blue-500/5 px-3 py-1.5 rounded-lg border border-blue-500/10 hover:border-blue-500/30">{s.title}</a>)}</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {msg.attachments && <div className="flex flex-wrap gap-2">{msg.attachments.map((a, i) => <img key={i} src={a.data} className="w-24 h-24 object-cover rounded-xl border border-white/20 shadow-lg" alt="Asset" />)}</div>}
                      <p className="text-[15px] font-semibold leading-relaxed">{msg.content}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start animate-fade-in w-full">
                <div className="bg-[#0d1321] border border-slate-800 p-8 rounded-3xl w-full max-w-xl shadow-lg border-l-4 border-l-blue-500">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500">Synthesizing intelligence packet...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        <div id="input-console" className="absolute bottom-0 left-0 right-0 p-6 lg:p-10 bg-gradient-to-t from-[#0a0f1a] to-transparent pointer-events-none z-30">
          <div className="max-w-5xl mx-auto w-full pointer-events-auto">
            {pendingAttachments.length > 0 && (
              <div className="flex gap-3 mb-4 animate-slide-up">
                {pendingAttachments.map((a, i) => (
                  <div key={i} className="relative group/thumb">
                    <img src={a.data} className="w-20 h-20 object-cover rounded-xl border border-blue-500 shadow-2xl transition-transform group-hover/thumb:scale-105" alt="Preview" />
                    <button onClick={() => setPendingAttachments(prev => prev.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full p-1.5 opacity-0 group-hover/thumb:opacity-100 transition-opacity shadow-lg"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                  </div>
                ))}
              </div>
            )}
            <form onSubmit={handleSend} className="flex gap-4">
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} multiple className="hidden" accept="image/*,.pdf,.doc,.docx,.txt" />
              <div className="flex gap-2">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-[#0d1321] border border-slate-800 p-5 rounded-2xl text-slate-400 hover:bg-slate-800 transition-colors shadow-xl" title="Upload Evidence"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg></button>
                <button type="button" onClick={startCamera} className="bg-[#0d1321] border border-slate-800 p-5 rounded-2xl text-slate-400 hover:bg-slate-800 transition-colors shadow-xl" title="Optical Scan"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg></button>
              </div>
              <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Execute query or scan chart..." className="flex-1 bg-[#0d1321] border border-slate-800 text-white py-5 px-8 rounded-2xl shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-bold" disabled={isLoading} />
              <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-500 px-10 rounded-2xl text-white font-black text-xs uppercase tracking-widest border border-blue-400/30 transition-all active:scale-95 shadow-xl shadow-blue-900/20">Execute</button>
            </form>
          </div>
        </div>
        <SecurityGuard />
      </main>
    </div>
  );
};

export default App;
