
import React, { useState, useRef, useEffect } from 'react';
import { FinMode, ChatMessage } from './types';
import { MODE_CONFIGS } from './constants';
import { askFinIntel } from './services/gemini';
import MarkdownView from './components/MarkdownView';
import TechnicalReportCard from './components/TechnicalReportCard';
import AnalysisModule from './components/AnalysisModule';

const MarketTicker: React.FC = () => {
  const indices = [
    { name: 'NIFTY 50', value: '22,410.20', change: '+0.85%', up: true },
    { name: 'SENSEX', value: '73,876.15', change: '+0.78%', up: true },
    { name: 'S&P 500', value: '5,123.44', change: '-0.12%', up: false },
    { name: 'NASDAQ', value: '16,248.50', change: '+0.22%', up: true },
    { name: 'BTC/USD', value: '64,120.00', change: '-1.45%', up: false },
    { name: 'GOLD', value: '2,345.10', change: '+0.45%', up: true },
    { name: 'USD/INR', value: '83.34', change: '-0.05%', up: false },
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

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<FinMode>(FinMode.TRADING);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

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
      const response = await askFinIntel(finalInput, activeMode, modeHistory);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.text,
        mode: activeMode,
        timestamp: Date.now(),
        sources: response.sources
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || 'System error. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages(prev => prev.filter(m => m.mode !== activeMode));
  };

  const currentMessages = messages.filter(m => m.mode === activeMode);

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-[#0a0f1a] text-slate-300">
      
      {/* Sidebar - Terminal Metadata */}
      <aside className="w-full lg:w-72 bg-[#0d1321] border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col z-30 shadow-2xl shrink-0">
        <div className="p-5 border-b border-slate-800 bg-[#0a0f1a]/50">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-lg shadow-blue-900/40">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-tighter uppercase">FinIntel <span className="text-blue-500">v3.0</span></h1>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">PRO_LINK ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 mb-2 flex justify-between items-center">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Active Modules</span>
            <span className="text-[8px] text-slate-700 mono">RD-100</span>
          </div>
          {Object.entries(MODE_CONFIGS).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setActiveMode(key as FinMode)}
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

        <div className="p-4 border-t border-slate-800 bg-[#0a0f1a]/80 space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-slate-500">
              <span>Reasoning Depth</span>
              <span className="text-blue-400 mono">ULTRA</span>
            </div>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[95%] opacity-50"></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main key={activeMode} className="flex-1 flex flex-col relative animate-fade-in min-w-0 h-full">
        <MarketTicker />

        <header className="bg-[#0a0f1a] border-b border-slate-800/50 h-12 flex items-center justify-center shrink-0 z-10 px-6">
          <div className="w-full max-w-5xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] hidden sm:inline">Grounding Engine</span>
              <div className="h-4 w-px bg-slate-800 hidden sm:inline mx-1"></div>
              <span className="text-xs font-bold text-white uppercase tracking-wider">{MODE_CONFIGS[activeMode].title}</span>
            </div>
            <button 
              onClick={clearHistory}
              className="text-[10px] font-bold text-slate-500 hover:text-rose-400 transition-colors uppercase tracking-widest flex items-center gap-2 group"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Flush Node Cache
            </button>
          </div>
        </header>

        {/* Message Stage */}
        <div className="flex-1 overflow-y-auto scroll-smooth">
          <div className="max-w-5xl mx-auto w-full px-4 lg:px-8 py-10 space-y-10 pb-48">
            {currentMessages.length === 0 && (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center animate-slide-up">
                <div className="relative max-w-lg w-full">
                  <div className="absolute inset-0 bg-blue-600/5 blur-[80px] rounded-full"></div>
                  <div className="relative p-10 bg-[#0d1321] rounded-3xl border border-slate-800 shadow-2xl">
                    <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-500 border border-blue-500/20">
                      {MODE_CONFIGS[activeMode].icon}
                    </div>
                    <h2 className="text-lg font-bold text-white mb-2 uppercase tracking-[0.2em]">Analytical Core Synced</h2>
                    <p className="text-slate-400 leading-relaxed text-sm mb-8">
                      {MODE_CONFIGS[activeMode].description} Ready for institutional-grade inquiry.
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      <button 
                        onClick={() => handleSend(undefined, `Perform a first-principles analysis of current high-alpha opportunities in this sector.`)}
                        className="px-4 py-3 bg-slate-900/50 hover:bg-blue-600/10 text-slate-300 hover:text-blue-400 text-[10px] font-bold rounded-xl border border-slate-800 hover:border-blue-500/30 transition-all uppercase tracking-widest"
                      >
                        Initiate Alpha Scan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentMessages.map((msg, idx) => (
              <div key={`${activeMode}-${idx}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up w-full`}>
                <div className={`${
                  msg.role === 'user' 
                    ? 'max-w-[85%] sm:max-w-[70%] bg-blue-600 text-white rounded-2xl rounded-tr-none px-6 py-4 shadow-xl' 
                    : 'w-full'
                }`}>
                  {msg.role === 'assistant' ? (
                    <div className="bg-[#0d1321] border border-slate-800 rounded-3xl p-6 lg:p-10 shadow-lg">
                      <div className="flex items-center justify-between mb-8 border-b border-slate-800/50 pb-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 text-blue-500 shadow-inner">
                            {MODE_CONFIGS[msg.mode].icon}
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Verified Intelligence</span>
                            <div className="text-[9px] text-slate-600 mono">{new Date(msg.timestamp).toLocaleTimeString()} • GMNI_PRO_09</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/5 rounded-full border border-blue-500/10">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                          <span className="text-[9px] font-bold text-blue-500 uppercase tracking-tighter">Verified Reasoning</span>
                        </div>
                      </div>
                      
                      {msg.mode === FinMode.TRADING && (
                        <TechnicalReportCard content={msg.content} />
                      )}

                      {(msg.mode === FinMode.ANALYST || msg.mode === FinMode.PORTFOLIO) && (
                        <AnalysisModule content={msg.content} mode={msg.mode} />
                      )}

                      <div className="prose prose-invert max-w-none text-slate-200">
                        <MarkdownView content={msg.content} />
                      </div>

                      {msg.sources && (
                        <div className="mt-12 pt-8 border-t border-slate-800/80">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Intel Verification Sources</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {msg.sources.slice(0, 4).map((source, sIdx) => (
                              <a 
                                key={sIdx} 
                                href={source.uri} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-[10px] bg-[#0a0f1a] hover:bg-blue-900/10 py-2.5 px-4 rounded-xl border border-slate-800 text-blue-400 transition-all font-bold flex items-center gap-3 group"
                              >
                                <div className="w-5 h-5 bg-slate-900 rounded flex items-center justify-center text-slate-600 group-hover:text-blue-500 transition-colors">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                </div>
                                <span className="truncate">{source.title}</span>
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
                <div className="bg-[#0d1321] border border-slate-800 p-8 rounded-3xl w-full max-w-xl shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500">Executing Deep Reasoning Models...</span>
                      <div className="text-[9px] text-slate-600 mt-0.5">ESTIMATED_TTR: 2.4s • STATUS: RETRIEVING_REALTIME_GROUNDING</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input Console */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/95 to-transparent z-20 pointer-events-none">
          <div className="max-w-5xl mx-auto w-full pointer-events-auto">
            <form onSubmit={handleSend} className="flex gap-4">
              <div className="relative flex-1 group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isLoading ? "Analyzing multi-layered data points..." : `Direct Inquiry: ${MODE_CONFIGS[activeMode].title}...`}
                  className="w-full bg-[#0d1321] border border-slate-800 text-white py-5 pl-14 pr-20 rounded-2xl shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/40 transition-all placeholder-slate-700 font-semibold text-base lg:text-lg"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800/50 disabled:text-slate-700 px-8 rounded-2xl text-white transition-all shadow-2xl shadow-blue-900/20 active:scale-95 flex items-center justify-center font-black text-xs uppercase tracking-widest border border-blue-400/30 group"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  <span className="flex items-center gap-3">
                    Consult
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
