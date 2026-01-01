
import React from 'react';
import { FinMode } from '../types';

interface Props {
  content: string;
  mode: FinMode;
}

const AnalysisModule: React.FC<Props> = ({ content, mode }) => {
  const lowercaseContent = content.toLowerCase();

  const extractMetric = (pattern: string) => {
    const regex = new RegExp(`${pattern}[:\\s]+([\\d.,/\\s%\\w-:]+)`, 'i');
    const match = content.match(regex);
    return match ? match[1].trim() : null;
  };

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
          <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-bold text-blue-300 uppercase">
            Factor Analysis: Applied
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

  // Rendering for Finance Mentor (Personalization Phase)
  if (mode === FinMode.MENTOR && (lowercaseContent.includes('discovery') || lowercaseContent.includes('session'))) {
    return (
      <div className="bg-[#1e1b4b]/40 border border-indigo-500/40 rounded-3xl p-8 mb-10 relative overflow-hidden backdrop-blur-md shadow-2xl group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-blue-500/5 opacity-50"></div>
        <div className="absolute top-0 right-0 p-6 opacity-20 transition-transform group-hover:scale-110 duration-700">
          <svg className="w-16 h-16 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
          </svg>
        </div>
        
        <div className="flex items-center gap-4 mb-6 relative">
          <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/30 shadow-xl shadow-indigo-900/20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <div>
            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">Holistic Calibration</div>
            <h3 className="text-xl font-black text-white">Your Wealth Operating System</h3>
          </div>
        </div>

        <p className="text-slate-300 text-[15px] leading-relaxed mb-8 max-w-2xl font-medium relative">
          Institutional wealth isn't built on luck; it's engineered through cash-flow precision. To calibrate your roadmap, I need to map your financial DNA.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
          {[
            { label: 'Cash Flow Surplus', icon: '💎' },
            { label: 'Burn Rate Audit', icon: '🔥' },
            { label: 'Survive & Thrive Gap', icon: '🛡️' },
            { label: 'Debt Efficiency Rating', icon: '📉' },
            { label: 'Volatility Threshold', icon: '🧠' }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-xl hover:bg-white/10 hover:border-indigo-500/30 transition-all group/item cursor-default">
              <span className="text-lg grayscale group-hover/item:grayscale-0 group-hover/item:scale-110 transition-all duration-300">{item.icon}</span>
              <span className="text-[11px] font-bold text-indigo-200 uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default AnalysisModule;
