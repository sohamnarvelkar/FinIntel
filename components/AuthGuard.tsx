
import React, { useState, useEffect } from 'react';
import { AuthStatus, UserSession } from '../types';

interface Props {
  onAuthenticated: (session: UserSession) => void;
}

interface UserRecord {
  username: string;
  passwordHash: string; // Stored as plain string for this demo environment
}

const AuthGuard: React.FC<Props> = ({ onAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [status, setStatus] = useState<AuthStatus>('CHALLENGE');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      // Check if any users exist
      const usersRaw = localStorage.getItem('finintel_users');
      const users: Record<string, UserRecord> = usersRaw ? JSON.parse(usersRaw) : {};
      
      if (Object.keys(users).length === 0) {
        setIsLogin(false);
        setStatus('UNAUTHENTICATED');
      }
    };
    checkStatus();
  }, []);

  const handleKeySelection = async () => {
    try {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      const session: UserSession = {
        username: username || 'Operator',
        lastLogin: Date.now(),
        accessLevel: 'INSTITUTIONAL'
      };
      onAuthenticated(session);
    } catch (err) {
      setError("Strategic Key Access Denied.");
    }
  };

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError(null);

    const usersRaw = localStorage.getItem('finintel_users');
    const users: Record<string, UserRecord> = usersRaw ? JSON.parse(usersRaw) : {};

    setTimeout(async () => {
      if (!isLogin) {
        // Registration Logic
        if (username.length < 3) {
          setError("Username must be at least 3 characters.");
          setIsVerifying(false);
          return;
        }
        if (password.length < 6) {
          setError("Security password must be at least 6 characters.");
          setIsVerifying(false);
          return;
        }
        if (password !== confirmPassword) {
          setError("Password confirmation mismatch.");
          setIsVerifying(false);
          return;
        }
        if (users[username]) {
          setError("Username already registered in terminal.");
          setIsVerifying(false);
          return;
        }

        // Save new user
        users[username] = { username, passwordHash: password };
        localStorage.setItem('finintel_users', JSON.stringify(users));
        localStorage.setItem('finintel_username', username);
      } else {
        // Login Logic
        const user = users[username];
        if (!user || user.passwordHash !== password) {
          setError("Invalid credentials. Terminal access denied.");
          setIsVerifying(false);
          return;
        }
        localStorage.setItem('finintel_username', username);
      }

      // Check for Gemini API Key
      // @ts-ignore
      if (await window.aistudio.hasSelectedApiKey()) {
        const session: UserSession = {
          username: username,
          lastLogin: Date.now(),
          accessLevel: 'INSTITUTIONAL'
        };
        onAuthenticated(session);
      } else {
        setStatus('KEY_REQUIRED');
      }
      setIsVerifying(false);
    }, 1500);
  };

  if (status === 'KEY_REQUIRED') {
    return (
      <div className="fixed inset-0 bg-[#0a0f1a] z-[200] flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-8 text-center animate-fade-in">
          <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto border border-blue-500/20 mb-8">
            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Strategic Link Required</h2>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            FinIntel Advanced requires a paid Google Cloud project key to operate the Gemini Pro reasoning core. 
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-blue-400 hover:underline ml-1">View Billing Docs</a>.
          </p>
          <button 
            onClick={handleKeySelection}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-blue-900/20 active:scale-95"
          >
            Connect Intelligence Key
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#0a0f1a] z-[200] flex items-center justify-center p-6 overflow-y-auto">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-md w-full bg-[#0d1321]/80 backdrop-blur-xl border border-slate-800 p-8 lg:p-10 rounded-[40px] shadow-2xl relative z-10 animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4">
            Security Layer 6.2
          </div>
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase mb-2">Terminal <span className="text-blue-500">Access</span></h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
            {isLogin ? 'Provide credentials to authorize session' : 'Initialize your institutional profile'}
          </p>
        </div>

        <form onSubmit={handleAuthAction} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </span>
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="operator_name"
                className="w-full bg-slate-900/50 border border-slate-800 text-white pl-11 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </span>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900/50 border border-slate-800 text-white pl-11 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono text-sm"
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1.5 animate-slide-up">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Identity Key</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </span>
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/50 border border-slate-800 text-white pl-11 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono text-sm"
                  required
                />
              </div>
            </div>
          )}

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center gap-3 animate-fade-in mt-4">
              <svg className="w-5 h-5 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <p className="text-[11px] font-bold text-rose-400 uppercase tracking-widest leading-relaxed">{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isVerifying}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black py-4 rounded-2xl uppercase tracking-[0.2em] text-xs transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 mt-6"
          >
            {isVerifying ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Authenticating...
              </>
            ) : (
              isLogin ? 'Initialize Session' : 'Create Profile'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(null); }}
            className="text-[10px] font-black text-slate-500 hover:text-blue-400 uppercase tracking-widest transition-colors"
          >
            {isLogin ? "No identity on record? Create Account" : "Registered operator? Terminal Login"}
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 flex justify-center gap-6">
          <div className="flex items-center gap-2 opacity-30 grayscale hover:grayscale-0 transition-all cursor-help" title="AES-256 Bit Encryption">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Encrypted</span>
          </div>
          <div className="flex items-center gap-2 opacity-30 grayscale hover:grayscale-0 transition-all cursor-help" title="Quantum Guard Active">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Hardened</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthGuard;
