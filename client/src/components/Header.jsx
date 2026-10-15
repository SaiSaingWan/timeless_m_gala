import { User, LogOut, ShieldCheck } from 'lucide-react';

export default function Header({ studentName, studentId, flowerBalance = 0, onLogout }) {
  return (
    <header className="bg-[#121214] border-b border-zinc-800/80 sticky top-0 z-30 shadow-md">
      <div className="px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">
            TIMELESS M-GALA
          </span>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1d1d20] border border-amber-500/20 text-zinc-300 text-xs hover:text-amber-300 hover:border-amber-500/40 transition-all cursor-pointer font-medium"
        >
          <LogOut className="w-3.5 h-3.5 text-amber-400" />
          Log Out
        </button>
      </div>

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

        <div className="flex items-center gap-1.5">
          {/* Flower Balance Badge */}
          <span className="inline-flex items-center gap-1 bg-pink-500/10 text-pink-300 border border-pink-500/30 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
            🌸 {flowerBalance}
          </span>

          {/* Pass Badge */}
          <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3 text-amber-400" /> Verified Pass
          </span>
        </div>
      </div>
    </header>
  );
}