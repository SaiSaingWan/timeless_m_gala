import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogIn, KeyRound, UserCheck, Sparkles, Ticket } from 'lucide-react';

export default function LogInPage() {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!/^\d{10}$/.test(studentId)) {
      setError('Student ID must be exactly 10 digits.');
      return;
    }

    if (!/^\d{6}$/.test(passcode)) {
      setError('Passcode must be exactly 6 numeric digits.');
      return;
    }

    setLoading(true);

    localStorage.setItem('studentId', studentId);
    localStorage.setItem('studentName', 'MFU Student');

    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-100 flex justify-center font-sans selection:bg-amber-400 selection:text-zinc-950">
      <div className="w-full max-w-md bg-[#0f0f10] min-h-screen flex flex-col shadow-2xl border-x border-zinc-800/60 relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <header className="px-5 py-4 flex items-center justify-between border-b border-zinc-800/60 bg-[#0f0f10]/80 backdrop-blur-md sticky top-0 z-50">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-9 h-9 rounded-full bg-[#1d1d20] border border-amber-500/30 flex items-center justify-center text-amber-300 hover:bg-[#27272a] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="font-extrabold text-sm tracking-widest bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 bg-clip-text text-transparent">
            STUDENT PORTAL LOGIN
          </span>
          <div className="w-9" />
        </header>

        {/* Form Body */}
        <main className="px-5 py-10 flex-1 flex flex-col justify-center">
          
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-100 p-[1px] mx-auto mb-3 shadow-lg shadow-amber-500/15">
              <div className="w-full h-full bg-[#0f0f10] rounded-2xl flex items-center justify-center">
                <LogIn className="w-7 h-7 text-amber-400" />
              </div>
            </div>
            <h1 className="text-2xl font-extrabold text-zinc-100 mb-1">
              Welcome Back
            </h1>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Enter your Student ID and 6-digit passcode to access your Gala Pass.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            
            {error && (
              <div className="bg-red-950/40 border border-red-500/40 text-red-200 text-xs p-3 rounded-xl text-center font-medium">
                {error}
              </div>
            )}

            {/* Student ID */}
            <div>
              <label className="block text-[10px] font-bold text-amber-300 mb-1 uppercase tracking-wider">
                Student ID (10 Digits)
              </label>
              <div className="relative">
                <UserCheck className="w-4 h-4 text-amber-400/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  required
                  placeholder="e.g. 6731503084"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full bg-[#1d1d20]/80 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-all"
                />
              </div>
            </div>

            {/* Passcode */}
            <div>
              <label className="block text-[10px] font-bold text-amber-300 mb-1 uppercase tracking-wider">
                6-Digit Passcode
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-amber-400/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  required
                  placeholder="••••••"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-[#1d1d20]/80 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm tracking-widest text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 hover:brightness-110 text-zinc-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Sparkles className="w-4 h-4 animate-spin text-zinc-950" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Log In to Student Portal
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-800/60 text-center">
            <p className="text-xs text-zinc-400 mb-3">Don't have a ticket yet?</p>
            <button
              type="button"
              onClick={() => navigate('/buy-ticket')}
              className="w-full py-2.5 rounded-xl bg-[#1d1d20] border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#27272a] transition-all cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5 text-amber-400" />
              Buy Ticket Pass (89 THB)
            </button>
          </div>

        </main>

        <footer className="py-3 border-t border-zinc-800/60 text-center text-[10px] text-zinc-500">
          The Timeless M-Gala Pass System
        </footer>

      </div>
    </div>
  );
}