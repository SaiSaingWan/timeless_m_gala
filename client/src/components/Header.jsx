import { LogOut, User, ShieldCheck } from 'lucide-react';

export default function Header({ studentName, studentId, onLogout }) {
  return (
    <>
      <header className="px-5 py-3 flex items-center justify-between border-b border-zinc-800/60 bg-[#0f0f10]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <img 
            src="/logo.svg" 
            alt="Timeless M-Gala Logo" 
            className="h-9 w-auto object-contain" 
          />
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1d1d20] border border-amber-500/20 text-zinc-300 text-xs hover:text-amber-300 hover:border-amber-500/40 transition-all cursor-pointer font-medium"
        >
          <LogOut className="w-3.5 h-3.5 text-amber-400" />
          Log Out
        </button>
      </header>

      <div className="px-5 py-3 bg-[#1d1d20]/60 border-b border-zinc-800/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-300">
            <User className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-100 leading-tight">{studentName}</p>
            <p className="text-[10px] text-amber-300/90 font-mono font-semibold">ID: {studentId}</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
          <ShieldCheck className="w-3 h-3 text-amber-400" /> Verified Pass
        </span>
      </div>
    </>
  );
}