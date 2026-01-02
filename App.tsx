
import React, { useState, useRef, useEffect } from 'react';
import { FinMode, ChatMessage, ExpertiseLevel, FinancialGoal } from './types';
import { MODE_CONFIGS } from './constants';
import { askFinIntel } from './services/gemini';
import MarkdownView from './components/MarkdownView';
import TechnicalReportCard from './components/TechnicalReportCard';
import AnalysisModule from './components/AnalysisModule';
import SecurityGuard from './components/SecurityGuard';

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
    <div className="w-full bg-[#0d1321] border-b border-slate-800 overflow-hidden flex items-center h-8 px-4 z-20 shadow-sm shrink-0">
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

const ErrorAlert: React.FC<{ message: string; onRetry: () => void; onClose: () => void }> = ({ message, onRetry, onClose }) => {
  return (
    <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4 animate-indicator-in">
      <div className="bg-[#1a0a0a] border-2 border-rose-500/50 rounded-2xl p-5 shadow-2xl flex items-start gap-4">
        <div className="bg-rose-500/20 p-2 rounded-lg text-rose-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-1">System Exception Detected</div>
          <p className="text-rose-100 text-sm font-semibold leading-relaxed mb-4">{message}</p>
          <div className="flex gap-3">
            <button 
              onClick={onRetry}
              className="bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black uppercase px-4 py-2 rounded-lg transition-colors border border-rose-400/30"
            >
              Re-Initiate Connection
            </button>
            <button 
              onClick={onClose}
              className="text-slate-500 hover:text-white text-[10px] font-black uppercase transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<FinMode>(FinMode.TRADING);
  const [expertise, setExpertise] = useState<ExpertiseLevel>(ExpertiseLevel.INTERMEDIATE);
  const [goal, setGoal] = useState<FinancialGoal>(FinancialGoal.ACCUMULATION);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('finintel_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('finintel_history', JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const finalInput = customPrompt || input;
    if (!finalInput.trim() || isLoading) return;

    setLastPrompt(finalInput);
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: finalInput,
      mode: activeMode,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const modeHistory = messages.filter(m => m.mode === activeMode);
      const response = await askFinIntel(finalInput, activeMode, expertise, goal, modeHistory);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.text,
        mode: activeMode,
        timestamp: Date.now(),
        sources: response.sources
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || 'Connection lost.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    handleSend(undefined, lastPrompt);
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem('finintel_history');
  };

  const currentMessages = messages.filter(m => m.mode === activeMode);

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-[#0a0f1a] text-slate-300">
      
      {error && <ErrorAlert message={error} onRetry={handleRetry} onClose={() => setError(null)} />}

      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-[#0d1321] border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col z-30 shadow-2xl shrink-0">
        <div className="p-5 border-b border-slate-800 bg-[#0a0f1a]/50">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-lg shadow-blue-900/40">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-tighter uppercase">FinIntel <span className="text-blue-500">v4.8</span></h1>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-blue-500">
                  {expertise}_{goal}_SYNC
                </span>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {Object.entries(MODE_CONFIGS).map(([key, config]) => (
            <button
              key={key}
              onClick={() => {
                setActiveMode(key as FinMode);
                setError(null);
              }}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 group flex items-center gap-3 border ${
                activeMode === key 
                  ? 'bg-blue-600/10 border-blue-500/50 text-white shadow-lg shadow-blue-900/10' 
                  : 'hover:bg-slate-800/50 border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`transition-colors duration-200 ${activeMode === key ? 'text-blue-400' : 'text-slate-500'}`}>
                {config.icon}
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold tracking-tight">{config.title}</div>
              </div>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Stage */}
      <main key={activeMode} className="flex-1 flex flex-col relative animate-fade-in min-w-0 h-full">
        <MarketTicker />

        <header className="bg-[#0a0f1a] border-b border-slate-800/50 h-12 flex items-center justify-between shrink-0 z-10 px-6">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">{MODE_CONFIGS[activeMode].title}</span>
          </div>
          <button 
            onClick={clearHistory}
            className="text-[10px] font-bold text-slate-500 hover:text-rose-400 transition-colors uppercase tracking-widest"
          >
            Purge History
          </button>
        </header>

        <div className="flex-1 overflow-y-auto scroll-smooth">
          <div className="max-w-5xl mx-auto w-full px-4 lg:px-8 py-10 space-y-10 pb-48">
            {activeMode === FinMode.HISTORY ? (
              <AnalysisModule 
                content="" 
                mode={FinMode.HISTORY} 
                messages={messages}
                onSelectMode={(m) => setActiveMode(m)}
              />
            ) : currentMessages.length === 0 ? (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center animate-slide-up">
                <div className="relative max-w-lg w-full">
                  <div className="p-10 bg-[#0d1321] rounded-3xl border border-slate-800 shadow-2xl">
                    <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-500 border border-blue-500/20">
                      {MODE_CONFIGS[activeMode].icon}
                    </div>
                    <h2 className="text-lg font-bold text-white mb-2 uppercase tracking-[0.2em]">{MODE_CONFIGS[activeMode].title}</h2>
                    <p className="text-slate-400 leading-relaxed text-sm mb-8">
                      {activeMode === FinMode.CALIBRATION 
                        ? 'Define your persona and objectives to synchronize the intelligence node.' 
                        : `System tuned for ${expertise} level ${goal.replace('_', ' ')} logic.`}
                    </p>
                    <button 
                      onClick={() => handleSend(undefined, "Begin domain-specific reasoning.")}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black rounded-xl transition-all uppercase tracking-widest"
                    >
                      Initialize Node
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {activeMode === FinMode.CALIBRATION && (
              <AnalysisModule 
                content="" 
                mode={FinMode.CALIBRATION} 
                expertise={expertise} 
                goal={goal}
                onSetExpertise={setExpertise}
                onSetGoal={setGoal}
              />
            )}

            {activeMode !== FinMode.HISTORY && currentMessages.map((msg, idx) => (
              <div key={`${activeMode}-${idx}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up w-full`}>
                <div className={`${
                  msg.role === 'user' 
                    ? 'max-w-[85%] sm:max-w-[70%] bg-blue-600 text-white rounded-2xl rounded-tr-none px-6 py-4 shadow-xl' 
                    : 'w-full'
                }`}>
                  {msg.role === 'assistant' ? (
                    <div className="bg-[#0d1321] border border-slate-800 rounded-3xl p-6 lg:p-10 shadow-lg relative group">
                      <div className="flex items-center justify-between mb-8 border-b border-slate-800/50 pb-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 text-blue-500 shadow-inner">
                            {MODE_CONFIGS[msg.mode].icon}
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Persona: {expertise} | {goal}</span>
                          </div>
                        </div>
                      </div>
                      
                      {msg.mode === FinMode.TRADING && <TechnicalReportCard content={msg.content} />}
                      <AnalysisModule content={msg.content} mode={msg.mode} expertise={expertise} goal={goal} />

                      <div className="prose prose-invert max-w-none text-slate-200">
                        <MarkdownView content={msg.content} />
                      </div>

                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-slate-800/50">
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                            Intelligence Sources
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {msg.sources.map((source, sIdx) => (
                              <a 
                                key={sIdx} 
                                href={source.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/5 border border-blue-500/10 px-3 py-1.5 rounded-lg flex items-center gap-2"
                              >
                                {source.title}
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-base font-semibold leading-relaxed">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start animate-fade-in w-full">
                <div className="bg-[#0d1321] border border-slate-800 p-8 rounded-3xl w-full max-w-xl shadow-lg border-l-4 border-l-blue-500">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500">Processing via {expertise} reasoning core...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input Console */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/95 to-transparent z-20 pointer-events-none">
          <div className="max-w-5xl mx-auto w-full pointer-events-auto relative">
            <form onSubmit={handleSend} className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for anything"
                className="w-full bg-[#0d1321] border border-slate-800 text-white py-5 px-8 rounded-2xl shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-semibold"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800/50 px-8 rounded-2xl text-white transition-all font-black text-xs uppercase tracking-widest border border-blue-400/30"
              >
                Enter
              </button>
            </form>
          </div>
        </div>
        
        <SecurityGuard />
      </main>
    </div>
  );
};

export default App;
