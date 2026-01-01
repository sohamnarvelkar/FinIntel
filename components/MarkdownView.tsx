
import React from 'react';

interface Props {
  content: string;
}

const MarkdownView: React.FC<Props> = ({ content }) => {
  const processLine = (line: string, index: number) => {
    const trimmedLine = line.trim();

    // Specialized header for Risk (Alert Style)
    if (line.toLowerCase().includes('risk guidance & caution') && (line.startsWith('#') || line.startsWith('**'))) {
        return (
            <div key={index} className="mt-8 mb-4 p-4 bg-orange-500/5 border-l-4 border-orange-500 rounded-r-lg">
                <h3 className="text-xl font-black text-orange-400 uppercase tracking-[0.1em]">
                    {line.replace(/^#+\s*/, '').replace(/\*\*/g, '')}
                </h3>
            </div>
        );
    }

    // Specialized Block for Mentor Discovery / Clarifying Questions
    if (line.toLowerCase().includes('personal discovery session') || line.toLowerCase().includes('discovery session')) {
        return (
            <div key={index} className="mt-8 mb-6 p-1 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-blue-500/10">
                <div className="bg-[#0a0f1a] rounded-[15px] p-6 border border-white/5 shadow-2xl">
                    <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-300 uppercase tracking-widest mb-2 flex items-center gap-3">
                        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        {line.replace(/\*\*/g, '')}
                    </h3>
                </div>
            </div>
        );
    }

    // Specialized Block for Mentor Insights/Quotes (Empathy Block)
    if (line.startsWith('> ')) {
      return (
        <blockquote key={index} className="mt-6 mb-6 p-6 bg-indigo-500/5 border-l-4 border-indigo-500 rounded-r-2xl italic text-indigo-200 leading-relaxed shadow-sm relative group">
          <div className="absolute -left-1 top-2 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></div>
          {formatText(line.substring(2))}
        </blockquote>
      );
    }

    // Specialized Styling for "Micro-Wins" or "Action Steps"
    if (line.toLowerCase().includes('micro-win') || line.toLowerCase().includes('action step') || line.toLowerCase().includes('blueprint')) {
        return (
            <div key={index} className="mt-6 mb-2 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest">
                    {line.replace(/\*\*/g, '')}
                </h4>
            </div>
        );
    }

    // Standard Headers
    if (line.startsWith('### ')) return <h3 key={index} className="text-xl font-bold mt-8 mb-4 text-blue-400 tracking-tight">{line.replace('### ', '')}</h3>;
    if (line.startsWith('## ')) return <h2 key={index} className="text-2xl font-bold mt-10 mb-6 text-blue-300 border-b border-slate-800 pb-3 tracking-tight">{line.replace('## ', '')}</h2>;
    if (line.startsWith('# ')) return <h1 key={index} className="text-3xl font-black mt-12 mb-8 text-white tracking-tighter uppercase">{line.replace('# ', '')}</h1>;

    // Bullet points (Softer styling for Mentor context)
    if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
      return (
        <li key={index} className="ml-6 mb-3 list-disc text-slate-300 leading-relaxed">
          {formatText(trimmedLine.substring(2))}
        </li>
      );
    }

    // Regular paragraph
    if (trimmedLine === '') return <div key={index} className="h-4" />;
    
    return (
      <p key={index} className="mb-5 leading-relaxed text-slate-300 text-[15px] font-medium">
        {formatText(line)}
      </p>
    );
  };

  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="markdown-body">
      {content.split('\n').map((line, i) => processLine(line, i))}
    </div>
  );
};

export default MarkdownView;
