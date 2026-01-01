
import React, { useState, useRef, useEffect } from 'react';
import { FinMode, ChatMessage, ExpertiseLevel } from './types';
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

const ManualFeedPanel: React.FC<{ onApply: (data: string) => void; onCancel: () => void }> = ({ onApply, onCancel }) => {
  const [ticker, setTicker] = useState('');
  const [price, setPrice] = useState('');
  const [news, setNews] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker) return;
    const manualData = `[MANUAL DATA OVERRIDE] Asset: ${ticker}, Price: ${price || 'Unknown'}, News: ${news || 'None mentioned'}. Please factor this as the absolute truth for analysis.`;
    onApply(manualData);
  };

  return (
    <div className="absolute bottom-full left-0 mb-4 w-full max-w-md bg-[#0d1321] border border-blue-500/30 rounded-2xl p-6 shadow-2xl animate-slide-up backdrop-blur-xl z-50">
      <div className="flex items-center justify-between mb-5">
        <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          Direct Market Entry
        </div>
        <button onClick={onCancel} className="text-slate-500 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Symbol</label>
            <input 
              type="text" 
              placeholder="e.g. BTC, AAPL" 
              className="w-full bg-[#0a0f1a] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-blue-500/50 outline-none"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Latest Price</label>
            <input 
              type="text" 
              placeholder="e.g. 64200" 
              className="w-full bg-[#0a0f1a] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-blue-500/50 outline-none"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Manual News Feed</label>
          <textarea 
            placeholder="Key catalyst or headline..." 
            className="w-full bg-[#0a0f1a] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-blue-500/50 outline-none h-20 resize-none"
            value={news}
            onChange={(e) => setNews(e.target.value)}
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-xl transition-all shadow-xl shadow-blue-900/20"
        >
          Inject to Intel Node
        </button>
      </form>
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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState('');
  const [showManualFeed, setShowManualFeed] = useState(false);
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
      const response = await askFinIntel(finalInput, activeMode, expertise, modeHistory);
      
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

  const handleManualDataApply = (manualData: string) => {
    setShowManualFeed(false);
    handleSend(undefined, manualData);
  };

  const handleRetry = () => {
    setError(null);
    handleSend(undefined, lastPrompt);
  };

  const clearHistory = () => {
    setMessages(prev => prev.filter(m => m.mode !== activeMode));
  };

  const currentMessages = messages.filter(m => m.mode === activeMode);

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-[#0a0f1a] text-slate-300">
      
      {error && <ErrorAlert message={error} onRetry={handleRetry} onClose={() => setError(null)} />}

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
              <h1 className="text-sm font-black text-white tracking-tighter uppercase">FinIntel <span className="text-blue-500">v3.5</span></h1>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${expertise === ExpertiseLevel.PRO ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>
                <span className={`text-[9px] font-bold uppercase tracking-widest ${expertise === ExpertiseLevel.PRO ? 'text-indigo-400' : 'text-emerald-500'}`}>
                  {expertise}_MODE_SYNC
                </span>
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

        <div className="p-4 border-t border-slate-800 bg-[#0a0f1a]/80 space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-slate-500">
              <span>Cognitive Depth</span>
              <span className="text-blue-400 mono">{expertise}</span>
            </div>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[98%] opacity-50"></div>
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
            <div className="flex items-center gap-6">
              <button 
                onClick={clearHistory}
                className="text-[10px] font-bold text-slate-500 hover:text-rose-400 transition-colors uppercase tracking-widest flex items-center gap-2 group"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                Flush Node
              </button>
            </div>
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
                    <h2 className="text-lg font-bold text-white mb-2 uppercase tracking-[0.2em]">{MODE_CONFIGS[activeMode].title} Active</h2>
                    <p className="text-slate-400 leading-relaxed text-sm mb-8">
                      System recalibrated for <strong>{expertise}</strong> level reasoning.
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      <button 
                        onClick={() => handleSend(undefined, activeMode === FinMode.CALIBRATION ? `Show me the status of the intelligence calibration.` : `Analyze with ${expertise} precision.`)}
                        className="px-4 py-3 bg-slate-900/50 hover:bg-blue-600/10 text-slate-300 hover:text-blue-400 text-[10px] font-bold rounded-xl border border-slate-800 hover:border-blue-500/30 transition-all uppercase tracking-widest"
                      >
                        {activeMode === FinMode.CALIBRATION ? 'View Calibration Profile' : 'Initiate Reasoning'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeMode === FinMode.CALIBRATION && (
              <AnalysisModule 
                content="" 
                mode={FinMode.CALIBRATION} 
                expertise={expertise} 
                onSetExpertise={setExpertise}
              />
            )}

            {currentMessages.map((msg, idx) => (
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
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Intel Node {expertise}</span>
                            <div className="text-[9px] text-slate-600 mono">{new Date(msg.timestamp).toLocaleTimeString()} • SYNC_OK</div>
                          </div>
                        </div>
                      </div>
                      
                      {msg.mode === FinMode.TRADING && (
                        <TechnicalReportCard content={msg.content} />
                      )}

                      <AnalysisModule content={msg.content} mode={msg.mode} />

                      <div className="prose prose-invert max-w-none text-slate-200">
                        <MarkdownView content={msg.content} />
                      </div>

                      {msg.sources && (
                        <div className="mt-12 pt-8 border-t border-slate-800/80">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {msg.sources.slice(0, 4).map((source, sIdx) => (
                              <a 
                                key={sIdx} 
                                href={source.uri} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-[10px] bg-[#0a0f1a] hover:bg-blue-900/10 py-2.5 px-4 rounded-xl border border-slate-800 text-blue-400 transition-all font-bold flex items-center gap-3 group/link truncate"
                              >
                                {source.title}
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
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500">Reasoning at {expertise} depth...</span>
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
          <div className="max-w-5xl mx-auto w-full pointer-events-auto relative">
            
            {showManualFeed && (
              <ManualFeedPanel 
                onApply={handleManualDataApply} 
                onCancel={() => setShowManualFeed(false)} 
              />
            )}

            <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-3 mb-4 backdrop-blur-sm flex items-center justify-center gap-4">
              <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1.5">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                Calibrated Guidance: {expertise} Level Active
              </span>
            </div>
            
            <form onSubmit={handleSend} className="flex gap-4">
              <div className="relative flex-1 group">
                <button 
                  type="button"
                  onClick={() => setShowManualFeed(!showManualFeed)}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    showManualFeed ? 'bg-blue-600 text-white' : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={() => setError(null)}
                  placeholder={`Consult intelligence at ${expertise} depth...`}
                  className="w-full bg-[#0d1321] border border-slate-800 text-white py-5 pl-14 pr-20 rounded-2xl shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/40 transition-all placeholder-slate-700 font-semibold text-base lg:text-lg"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800/50 disabled:text-slate-700 px-8 rounded-2xl text-white transition-all shadow-2xl shadow-blue-900/20 active:scale-95 flex items-center justify-center font-black text-xs uppercase tracking-widest border border-blue-400/30 group"
              >
                Sync
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
