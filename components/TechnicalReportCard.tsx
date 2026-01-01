
import React from 'react';

interface Props {
  content: string;
}

const TechnicalReportCard: React.FC<Props> = ({ content }) => {
  const isBullish = content.toLowerCase().includes('bullish');
  const isBearish = content.toLowerCase().includes('bearish');
  
  const extractLevels = (type: string) => {
    const regex = new RegExp(`${type}[:\\s]+([\\d,.\\s&]+)`, 'i');
    const match = content.match(regex);
    return match ? match[1].split(/[&,]/).map(s => s.trim()).filter(s => s.length > 0) : [];
  };

  const extractRiskMetric = (metric: string) => {
    const regex = new RegExp(`${metric}[:\\s]+([\\d.,/\\s%\\w-:]+)`, 'i');
    const match = content.match(regex);
    return match ? match[1].trim() : null;
  };

  const resistanceLevels = extractLevels('Resistance');
  const supportLevels = extractLevels('Support');
  const riskReward = extractRiskMetric('Risk-Reward') || extractRiskMetric('RR');
  const volatility = extractRiskMetric('Volatility');

  // Identify high-priority cautions
  const cautionWords = ['volatile', 'earnings', 'fomc', 'liquidity', 'unstable', 'overhead supply', 'breakdown', 'cpi', 'interest rate'];
  const foundCautions = cautionWords.filter(word => content.toLowerCase().includes(word));

  return (
    <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#0a0f1a] shadow-inner mb-6 transition-all duration-300 hover:border-slate-700">
      {/* Header */}
      <div className="bg-slate-900/50 px-5 py-3 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Execution Intel Module</span>
        </div>
        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
          isBullish ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
          isBearish ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
          'bg-blue-500/10 text-blue-400 border-blue-500/20'
        }`}>
          {isBullish ? 'Bullish Trend' : isBearish ? 'Bearish Trend' : 'Neutral Consolidation'}
        </div>
      </div>
      
      {/* Levels Grid */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-slate-800/50">
        {/* Resistance Levels */}
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
            )) : <span className="text-slate-600 text-[10px] italic">No immediate overhead</span>}
          </div>
        </div>

        {/* Support Levels */}
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
            )) : <span className="text-slate-600 text-[10px] italic">Base discovery in progress</span>}
          </div>
        </div>
      </div>

      {/* Risk Parameters Matrix */}
      <div className="p-6 bg-slate-900/20 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-slate-800/50">
        <div className="space-y-1">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
             <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
             Risk-Reward Ratio (RR)
          </div>
          <div className="mono text-xs font-black text-blue-400 uppercase">{riskReward || 'Refer to text section below'}</div>
        </div>
        <div className="space-y-1">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
             <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
             Volatility Index
          </div>
          <div className="mono text-xs font-black text-slate-300 uppercase">{volatility || 'Scanning Market Sentiment...'}</div>
        </div>
      </div>

      {/* Actionable Cautions */}
      {foundCautions.length > 0 && (
        <div className="px-6 py-4 bg-orange-500/5">
          <div className="flex items-start gap-4">
            <div className="mt-0.5">
              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">Macro & Risk Catalysts Identified:</div>
              <div className="flex flex-wrap gap-2">
                {foundCautions.map((c, idx) => (
                  <span key={idx} className="text-[9px] font-bold bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20 uppercase tracking-tighter shadow-sm">
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
