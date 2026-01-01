
import React from 'react';
import { FinMode, ExpertiseLevel } from '../types';

interface Props {
  content: string;
  mode: FinMode;
  expertise?: ExpertiseLevel;
  onSetExpertise?: (level: ExpertiseLevel) => void;
}

const AnalysisModule: React.FC<Props> = ({ content, mode, expertise, onSetExpertise }) => {
  const lowercaseContent = content.toLowerCase();

  const extractMetric = (pattern: string) => {
    const regex = new RegExp(`${pattern}[:\\s]+([\\d.,/\\s%\\w-:]+)`, 'i');
    const match = content.match(regex);
    return match ? match[1].trim() : null;
  };

  // Rendering for System Calibration
  if (mode === FinMode.CALIBRATION) {
    return (
      <div className="bg-[#0f172a] border border-blue-500/30 rounded-3xl p-8 mb-10 overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -mr-20 -mt-20"></div>
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-xl">
             <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
          </div>
          <div>
            <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-1">Intelligence Calibration Hub</div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Adjust Reasoning Depth</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {(['BEGINNER', 'INTERMEDIATE', 'PRO'] as const).map((levelKey) => {
            const levelId = ExpertiseLevel[levelKey];
            const level = {
               BEGINNER: { title: 'Beginner', desc: 'Simpler language, focused on foundations and risk safety.', color: 'emerald' },
               INTERMEDIATE: { title: 'Intermediate', desc: 'Standard market terms, balanced data reasoning.', color: 'blue' },
               PRO: { title: 'Pro Trader', desc: 'High-density institutional jargon and advanced alpha nodes.', color: 'indigo' }
            }[levelKey];

            return (
              <button
                key={levelId}
                onClick={() => onSetExpertise?.(levelId)}
                className={`text-left p-6 rounded-2xl border transition-all duration-300 group ${
                  expertise === levelId 
                    ? `bg-${level.color}-600/10 border-${level.color}-500 shadow-2xl shadow-${level.color}-900/20` 
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${expertise === levelId ? `text-${level.color}-400` : 'text-slate-500'}`}>
                  Level {levelKey === 'BEGINNER' ? '01' : levelKey === 'INTERMEDIATE' ? '02' : '03'}
                </div>
                <div className={`text-xl font-black mb-3 ${expertise === levelId ? 'text-white' : 'text-slate-300'}`}>{level.title}</div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">{level.desc}</p>
              </button>
            );
          })}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
          <div className="space-y-6">
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
               <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
               Sentiment Calibration (Fear -> Greed)
            </div>
            <div className="relative h-4 bg-slate-900 rounded-full border border-slate-800 overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${
                  moodPercent > 60 ? 'bg-emerald-500' : moodPercent < 40 ? 'bg-rose-500' : 'bg-blue-500'
                }`} 
                style={{ width: `${moodPercent}%` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-between px-4 text-[8px] font-black text-white/40 uppercase">
                <span>Extreme Fear</span>
                <span>Extreme Greed</span>
              </div>
            </div>
            <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
               <div className="text-[9px] font-black text-indigo-400 uppercase mb-3">Narrative Pulse</div>
               <p className="text-xs text-slate-300 leading-relaxed italic">
                 "The current volatility is driven by shifting expectations in the macro regime. Smart money remains defensive while retail sentiment hits resistance levels."
               </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             {[
               { sector: 'Equities', mood: lowercaseContent.includes('equity bullish') || mood.includes('Greed') ? 'Risk-On' : 'Defensive', color: 'emerald' },
               { sector: 'Crypto', mood: lowercaseContent.includes('crypto bearish') || mood.includes('Fear') ? 'Risk-Off' : 'Bullish', color: 'rose' },
               { sector: 'Gold', mood: lowercaseContent.includes('gold safe') ? 'Safe Haven' : 'Neutral', color: 'amber' },
               { sector: 'Bonds', mood: lowercaseContent.includes('yield curve') ? 'Inverted' : 'Standard', color: 'blue' }
             ].map((item, i) => (
               <div key={i} className="bg-[#0a0f1a] border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                 <span className="text-[9px] font-bold text-slate-500 uppercase mb-2">{item.sector}</span>
                 <span className="text-xs font-black text-white">{item.mood}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    );
  }

  // Rendering for Portfolio Strategist
  if (mode === FinMode.PORTFOLIO) {
    const riskLevel = extractMetric('Risk Category') || (lowercaseContent.includes('aggressive') ? 'Aggressive' : lowercaseContent.includes('conservative') ? 'Conservative' : 'Balanced');
    const urgency = parseInt(extractMetric('Urgency') || extractMetric('Rebalancing Urgency') || '5');
    return (
      <div className="bg-[#0f172a] border border-blue-500/20 rounded-2xl p-6 mb-8 overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full -mr-10 -mt-10"></div>
        <div className="flex items-center justify-between mb-6">
          <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Quant Strategy Core
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Risk Topology</div>
            <div className="text-xl font-black text-white">{riskLevel}</div>
          </div>
          <div className="space-y-2">
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Rebalancing Urgency</div>
            <div className="flex items-center gap-2 mt-2">
               {[...Array(10)].map((_, i) => (
                 <div key={i} className={`h-4 w-1.5 rounded-sm ${i < urgency ? (urgency > 7 ? 'bg-rose-500' : 'bg-blue-500') : 'bg-slate-800'}`}></div>
               ))}
               <span className="text-xs font-bold text-slate-400 ml-1">{urgency}/10</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Modern Frontier Opt.</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Rendering for Stock Analyst
  if (mode === FinMode.ANALYST) {
    const valuation = lowercaseContent.includes('undervalued') ? 'Undervalued' : lowercaseContent.includes('overvalued') ? 'Overvalued' : 'Fair Value';
    const moat = extractMetric('Moat') || 'Institutional';
    return (
      <div className="bg-[#0a0f1a] border border-slate-800 rounded-2xl p-6 mb-8 shadow-inner border-l-4 border-l-indigo-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-indigo-500/5 blur-3xl rounded-full"></div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
          <div>
            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Alpha Research Terminal</div>
            <div className="text-lg font-bold text-white">Fundamental Moat & ESG Audit</div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
              <div className="text-[8px] font-bold text-slate-500 uppercase mb-1">Intrinsic Value</div>
              <div className={`text-xs font-black ${valuation === 'Undervalued' ? 'text-emerald-400' : valuation === 'Overvalued' ? 'text-rose-400' : 'text-blue-400'}`}>
                {valuation}
              </div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
              <div className="text-[8px] font-bold text-slate-500 uppercase mb-1">Moat Durability</div>
              <div className="text-xs font-black text-indigo-300">{moat}</div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
              <div className="text-[8px] font-bold text-slate-500 uppercase mb-1">ESG Risk Score</div>
              <div className="text-xs font-black text-emerald-400">Low Alpha Risk</div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
              <div className="text-[8px] font-bold text-slate-500 uppercase mb-1">DCF Conviction</div>
              <div className="text-xs font-black text-slate-400">High Tier</div>
            </div>
        </div>
      </div>
    );
  }

  // Rendering for Wealth Forecaster
  if (mode === FinMode.PROJECTION) {
    const decade1 = extractMetric('10y') || extractMetric('10 year') || '$---';
    const decade3 = extractMetric('30y') || extractMetric('30 year') || '$---';
    return (
      <div className="bg-[#0f172a] border border-emerald-500/20 rounded-3xl p-8 mb-10 overflow-hidden relative shadow-2xl group border-l-8 border-l-emerald-600">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-emerald-500/10 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-xl">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20V10M8 20v-4m8 4v-6" /></svg>
            </div>
            <div>
              <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-1">Compounding Simulator v1.0</div>
              <h3 className="text-2xl font-black text-white">Multi-Decade Growth Audit</h3>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="relative h-48 bg-slate-900/50 rounded-2xl border border-slate-800 p-4 overflow-hidden shadow-inner">
            <div className="absolute z-10 grid grid-cols-3 h-full items-end gap-2 px-2">
               <div className="text-center space-y-1"><div className="h-12 w-full bg-emerald-500/20 rounded-t-lg"></div></div>
               <div className="text-center space-y-1"><div className="h-24 w-full bg-emerald-500/40 rounded-t-lg"></div></div>
               <div className="text-center space-y-1"><div className="h-32 w-full bg-emerald-500 rounded-t-lg"></div></div>
            </div>
          </div>
          <div className="space-y-6">
             <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl group/item">
                 <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">10-Year Horizon</div>
                 <div className="text-2xl font-black text-white mono">{decade1}</div>
               </div>
               <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl group/item">
                 <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">30-Year Terminal</div>
                 <div className="text-2xl font-black text-white mono">{decade3}</div>
               </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // Rendering for Strategy Generator
  if (mode === FinMode.STRATEGY) {
    const rr = extractMetric('Risk-Reward') || extractMetric('R:R') || '1:2.0';
    return (
      <div className="bg-[#0f172a] border border-blue-500/30 rounded-2xl p-6 mb-8 overflow-hidden relative shadow-2xl border-l-8 border-l-blue-500">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/30">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <div>
              <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Quant Execution Blueprint</div>
            </div>
          </div>
          <div className="text-right">
             <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Target R:R</div>
             <div className="text-xl font-black text-blue-400 mono">{rr}</div>
          </div>
        </div>
      </div>
    );
  }

  // Rendering for Discipline Coach
  if (mode === FinMode.DISCIPLINE) {
    return (
      <div className="bg-[#1a1610] border border-orange-500/20 rounded-2xl p-6 mb-8 overflow-hidden relative shadow-2xl border-l-4 border-l-orange-500">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-600/20 rounded-2xl flex items-center justify-center text-orange-400 border border-orange-500/30">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3m0 0l.054.09A10.003 10.003 0 0015.44 18.53l-.054.09M12 3v3m3.243 1.243l-2.122 2.122m4.5 4.5l-2.122 2.122M12 21v-3m-3.243-1.243l2.122-2.122m-4.5-4.5l2.122-2.122M3 12h3m12 0h3" /></svg>
            </div>
            <div>
              <div className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-1">Discipline Terminal</div>
              <h3 className="text-xl font-black text-white">Mindset & Risk Resilience</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AnalysisModule;
