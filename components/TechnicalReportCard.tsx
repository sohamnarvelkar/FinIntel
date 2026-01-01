
import React from 'react';

interface Props {
  content: string;
}

const TechnicalReportCard: React.FC<Props> = ({ content }) => {
  const isBullish = content.toLowerCase().includes('bullish');
  const isBearish = content.toLowerCase().includes('bearish');
  
  const extractMetric = (pattern: string) => {
    const regex = new RegExp(`${pattern}[:\\s]+([\\d.,/\\s%\\w-:]+)`, 'i');
    const match = content.match(regex);
    return match ? match[1].trim() : null;
  };

  const extractLevels = (type: string) => {
    const regex = new RegExp(`${type}[:\\s]+([\\d,.\\s&]+)`, 'i');
    const match = content.match(regex);
    return match ? match[1].split(/[&,]/).map(s => s.trim()).filter(s => s.length > 0) : [];
  };

  const liveQuote = extractMetric('LIVE QUOTE') || extractMetric('Price') || extractMetric('Current Price');
  const newsSummaryRaw = content.match(/NEWS SUMMARY:([\s\S]*?)(?=\n\n|\d\.|$)/i);
  const newsBulletPoints = newsSummaryRaw 
    ? newsSummaryRaw[1].split('\n').map(l => l.replace(/^[-*]\s*/, '').trim()).filter(l => l.length > 5) 
    : [];

  const resistanceLevels = extractLevels('Resistance');
  const supportLevels = extractLevels('Support');
  const riskReward = extractMetric('Risk-Reward') || extractMetric('RR');
  
  // Identify high-priority cautions
  const cautionWords = ['volatile', 'earnings', 'fomc', 'liquidity', 'unstable', 'overhead supply', 'breakdown', 'cpi', 'interest rate'];
  const foundCautions = cautionWords.filter(word => content.toLowerCase().includes(word));

  return (
    <div className="border border-slate-800 rounded-3xl overflow-hidden bg-[#0d1321] shadow-2xl mb-8 transition-all duration-300 hover:border-slate-700/50 group/card">
      {/* Live Quote Banner */}
      {liveQuote && (
        <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/5 border-b border-blue-500/20 p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <div>
              <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-0.5">Live Intel Feed</div>
              <div className="text-xl font-black text-white mono tracking-tighter">{liveQuote}</div>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
            isBullish ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
            isBearish ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
            'bg-slate-500/10 text-slate-400 border-slate-500/20'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isBullish ? 'bg-emerald-500' : isBearish ? 'bg-rose-500' : 'bg-slate-500'}`}></div>
            <span className="text-[10px] font-black uppercase tracking-widest">{isBullish ? 'Strong Momentum' : isBearish ? 'Under Pressure' : 'Neutral Range'}</span>
          </div>
        </div>
      )}

      {/* News Stream */}
      {newsBulletPoints.length > 0 && (
        <div className="px-6 py-5 border-b border-slate-800/50 bg-[#0a0f1a]/40">
          <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
            Latest Institutional Headlines
          </div>
          <div className="space-y-3">
            {newsBulletPoints.map((news, i) => (
              <div key={i} className="flex items-start gap-3 group/news">
                <div className="mt-1.5 w-1 h-1 rounded-full bg-blue-500 group-hover/news:scale-150 transition-transform"></div>
                <p className="text-[13px] text-slate-300 font-medium leading-relaxed group-hover/news:text-white transition-colors">
                  {news}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Analysis Grid */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-slate-800/50">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
            <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Resistance Barriers</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {resistanceLevels.length > 0 ? resistanceLevels.map((lvl, i) => (
              <div key={i} className="mono text-[11px] font-bold bg-rose-500/5 border border-rose-500/10 px-3 py-1.5 rounded text-rose-200">
                {lvl}
              </div>
            )) : <span className="text-slate-600 text-[10px] italic">No immediate overhead detected</span>}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Support Clusters</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {supportLevels.length > 0 ? supportLevels.map((lvl, i) => (
              <div key={i} className="mono text-[11px] font-bold bg-emerald-500/5 border border-emerald-500/10 px-3 py-1.5 rounded text-emerald-200">
                {lvl}
              </div>
            )) : <span className="text-slate-600 text-[10px] italic">Scanning historical floor...</span>}
          </div>
        </div>
      </div>

      <div className="p-6 bg-slate-900/20 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-1">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
             <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
             Execution R:R
          </div>
          <div className="mono text-xs font-black text-blue-400 uppercase">{riskReward || 'Calculation Pending...'}</div>
        </div>
        <div className="space-y-1">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
             <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
             Volatility Metric
          </div>
          <div className="mono text-xs font-black text-slate-300 uppercase tracking-tighter">Systemic Sensitivity: High</div>
        </div>
      </div>

      {foundCautions.length > 0 && (
        <div className="px-6 py-4 bg-orange-500/5 border-t border-slate-800/50">
          <div className="flex items-start gap-4">
            <div className="mt-0.5 text-orange-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">Macro & Risk Catalysts:</div>
              <div className="flex flex-wrap gap-2">
                {foundCautions.map((c, idx) => (
                  <span key={idx} className="text-[9px] font-bold bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20 uppercase">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicalReportCard;
