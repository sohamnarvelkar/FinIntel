
import React from 'react';
import { FinMode, ExpertiseLevel, FinancialGoal, ChatMessage } from '../types';
import { MODE_CONFIGS } from '../constants';

interface Props {
  content: string;
  mode: FinMode;
  expertise?: ExpertiseLevel;
  goal?: FinancialGoal;
  messages?: ChatMessage[];
  onSetExpertise?: (level: ExpertiseLevel) => void;
  onSetGoal?: (goal: FinancialGoal) => void;
  onSelectMode?: (mode: FinMode) => void;
}

const AnalysisModule: React.FC<Props> = ({ content, mode, expertise, goal, messages = [], onSetExpertise, onSetGoal, onSelectMode }) => {
  const lowercaseContent = content.toLowerCase();

  const extractMetric = (pattern: string) => {
    const regex = new RegExp(`${pattern}[:\\s]+([\\d.,/\\s%\\w-:]+)`, 'i');
    const match = content.match(regex);
    return match ? match[1].trim() : null;
  };

  // Rendering for Session History Audit
  if (mode === FinMode.HISTORY) {
    const userPrompts = messages.filter(m => m.role === 'user');
    
    return (
      <div className="space-y-8 mb-10 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Intelligence Archive</div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Session Audit Trail</h3>
          </div>
          <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-[10px] font-bold text-slate-400">
            {userPrompts.length} Strategic Points Logged
          </div>
        </div>

        {userPrompts.length === 0 ? (
          <div className="p-20 border-2 border-dashed border-slate-800 rounded-3xl text-center">
            <div className="text-slate-600 mb-2">
              <svg className="w-12 h-12 mx-auto opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-sm font-bold text-slate-600">No session data available in current archive.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userPrompts.reverse().map((msg, idx) => (
              <div key={idx} className="group bg-[#0d1321] border border-slate-800 hover:border-blue-500/30 p-5 rounded-2xl transition-all shadow-xl flex items-start gap-5">
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800 text-slate-500 group-hover:text-blue-400 transition-colors shrink-0">
                  {MODE_CONFIGS[msg.mode]?.icon || <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{msg.mode}</span>
                       <span className="text-[9px] text-slate-600 font-mono">{new Date(msg.timestamp).toLocaleString()}</span>
                    </div>
                    <button 
                      onClick={() => onSelectMode?.(msg.mode)}
                      className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors opacity-0 group-hover:opacity-100"
                    >
                      Jump to Node
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-slate-300 truncate pr-10">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Rendering for System Calibration (Persona Architect)
  if (mode === FinMode.CALIBRATION) {
    return (
      <div className="space-y-12 mb-10">
        <div className="bg-[#0f172a] border border-blue-500/30 rounded-3xl p-8 overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -mr-20 -mt-20"></div>
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-xl">
               <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <div>
              <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-1">Phase 1: Cognitive Alignment</div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Set Reasoning Depth</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {(['BEGINNER', 'INTERMEDIATE', 'PRO'] as const).map((levelKey) => {
              const levelId = ExpertiseLevel[levelKey];
              const config = {
                 BEGINNER: { title: 'Beginner', desc: 'Analogy-based reasoning, focus on safety.', color: 'emerald' },
                 INTERMEDIATE: { title: 'Intermediate', desc: 'Standard data metrics, balanced execution.', color: 'blue' },
                 PRO: { title: 'Pro Trader', desc: 'High-density jargon, alpha-focused nodes.', color: 'indigo' }
              }[levelKey];

              return (
                <button
                  key={levelId}
                  onClick={() => onSetExpertise?.(levelId)}
                  className={`text-left p-6 rounded-2xl border transition-all duration-300 group ${
                    expertise === levelId 
                      ? `bg-${config.color}-600/10 border-${config.color}-500 shadow-2xl shadow-${config.color}-900/20` 
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className={`text-xl font-black mb-2 ${expertise === levelId ? 'text-white' : 'text-slate-300'}`}>{config.title}</div>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">{config.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-[#0f172a] border border-indigo-500/30 rounded-3xl p-8 overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] rounded-full -mr-20 -mt-20"></div>
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-xl">
               <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">Phase 2: Tactical Objective</div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Primary Goal Selection</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
            {(['ACCUMULATION', 'SCALPING', 'PRESERVATION', 'INCOME'] as const).map((goalKey) => {
              const goalId = FinancialGoal[goalKey];
              const config = {
                 ACCUMULATION: { title: 'Wealth Build', desc: 'Long-term growth.', icon: '🏦' },
                 SCALPING: { title: 'Intraday Alpha', desc: 'Short-term momentum.', icon: '⚡' },
                 PRESERVATION: { title: 'Defense', desc: 'Capital protection.', icon: '🛡️' },
                 INCOME: { title: 'Yield Node', desc: 'Passive cash flow.', icon: '💎' }
              }[goalKey];

              return (
                <button
                  key={goalId}
                  onClick={() => onSetGoal?.(goalId)}
                  className={`text-left p-5 rounded-2xl border transition-all duration-300 ${
                    goal === goalId 
                      ? 'bg-indigo-600/10 border-indigo-500 shadow-xl' 
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-2xl mb-3">{config.icon}</div>
                  <div className={`text-sm font-black mb-1 ${goal === goalId ? 'text-white' : 'text-slate-300'}`}>{config.title}</div>
                  <p className="text-[10px] text-slate-500 font-medium">{config.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Rendering for Strategy Generator
  if (mode === FinMode.STRATEGY) {
    const isSynced = lowercaseContent.includes('synced');
    const rr = extractMetric('Risk-Reward') || extractMetric('R:R') || '1:2.5';
    const entry = extractMetric('Entry Zone') || 'Wait for trigger';
    const stop = extractMetric('Hard Stop') || 'TBD';
    const tp1 = extractMetric('TP1') || 'Zone 1';

    return (
      <div className="bg-[#0f172a] border border-blue-500/30 rounded-3xl p-8 mb-10 overflow-hidden relative shadow-2xl border-l-8 border-l-blue-500">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -mr-20 -mt-20"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-white/5 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-xl">
               <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <div>
              <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-1">Strategy Lab Node v4</div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Hybrid Execution Blueprint</h3>
            </div>
          </div>
          <div className={`px-5 py-2 rounded-2xl border font-black uppercase tracking-widest text-sm flex items-center gap-3 ${
            isSynced ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-orange-500/10 border-orange-500/30 text-orange-400'
          }`}>
             <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
             {isSynced ? 'Status: SYNCED' : 'Status: DIVERGENT'}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
          <div className="space-y-8">
             <div className="space-y-4">
               <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                 Objective: {goal?.replace('_', ' ')} Profile
               </div>
               <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col items-center">
                    <span className="text-[8px] font-bold text-slate-500 uppercase mb-2">Technical Bias</span>
                    <span className="text-xs font-black text-white uppercase">{lowercaseContent.includes('bullish') ? 'BULLISH' : 'BEARISH'}</span>
                  </div>
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col items-center">
                    <span className="text-[8px] font-bold text-slate-500 uppercase mb-2">Sentiment Bias</span>
                    <span className="text-xs font-black text-white uppercase">{lowercaseContent.includes('synced') ? (lowercaseContent.includes('bullish') ? 'BULLISH' : 'BEARISH') : 'NEUTRAL'}</span>
                  </div>
               </div>
             </div>
          </div>

          <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
             <div className="flex items-center justify-between mb-4">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tactical Execution Matrix</div>
                <div className="text-xl font-black text-blue-400 mono">{rr} R:R</div>
             </div>
             <div className="space-y-4">
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                  <div className="text-[8px] font-bold text-blue-300 uppercase mb-1">Entry Zone</div>
                  <div className="text-lg font-black text-white mono">{entry}</div>
                </div>
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                  <div className="text-[8px] font-bold text-rose-300 uppercase mb-1">Hard Stop-Loss</div>
                  <div className="text-lg font-black text-white mono">{stop}</div>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // Rendering for Sentiment Mode
  if (mode === FinMode.SENTIMENT) {
    const mood = extractMetric('MARKET MOOD') || (lowercaseContent.includes('greed') ? 'Greed' : lowercaseContent.includes('fear') ? 'Fear' : 'Neutral');
    const moodPercent = lowercaseContent.includes('extreme greed') ? 90 : lowercaseContent.includes('greed') ? 75 : lowercaseContent.includes('extreme fear') ? 10 : lowercaseContent.includes('fear') ? 25 : 50;
    
    return (
      <div className="bg-[#0d1117] border border-indigo-500/30 rounded-3xl p-8 mb-10 overflow-hidden relative shadow-2xl border-t-8 border-t-indigo-600">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] rounded-full -mr-20 -mt-20"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-xl">
               <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">Macro Sentiment Radar</div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Current Market Mood</h3>
            </div>
          </div>
          <div className={`px-5 py-2 rounded-2xl border font-black uppercase tracking-widest text-sm flex items-center gap-3 ${
            mood.toLowerCase().includes('greed') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
            mood.toLowerCase().includes('fear') ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
            'bg-blue-500/10 border-blue-500/30 text-blue-400'
          }`}>
             <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
             {mood}
          </div>
        </div>

        <div className="relative h-4 bg-slate-900 rounded-full border border-slate-800 overflow-hidden mb-8">
          <div 
            className={`h-full transition-all duration-1000 ${
              moodPercent > 60 ? 'bg-emerald-500' : moodPercent < 40 ? 'bg-rose-500' : 'bg-blue-500'
            }`} 
            style={{ width: `${moodPercent}%` }}
          ></div>
        </div>
      </div>
    );
  }

  return null;
};

export default AnalysisModule;
