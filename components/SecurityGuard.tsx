
import React from 'react';

const SecurityGuard: React.FC = () => {
  return (
    <div className="bg-[#0f172a] border-t border-slate-800 p-4 shrink-0">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Ethical Safeguard Active</div>
            <div className="text-[9px] text-slate-500 mono">VERIFIED_NON_ADVISORY_PROTOCOL</div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
            NO GUARANTEED GAINS
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
            ZERO INSIDER INTEL
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
            EDUCATIONAL SCOPE ONLY
          </div>
        </div>

        <div className="text-[8px] text-slate-600 max-w-[200px] leading-tight hidden lg:block italic">
          Investing involves significant risk. Historical performance is not indicative of future results. Consult a licensed professional for direct advice.
        </div>
      </div>
    </div>
  );
};

export default SecurityGuard;
