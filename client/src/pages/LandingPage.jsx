import { useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, MapPin, Ticket, LogIn, Drama, Award, Music } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const events = [
    {
      title: 'A-Nyeint',
      tag: 'Cultural Stage',
      desc: 'Traditional stage performance blending comedy, dance, and royal cultural storytelling.',
      icon: <Drama className="w-5 h-5 text-amber-400" />
    },
    {
      title: 'Crowning Ambassador',
      tag: 'Live Voting',
      desc: 'Witness the crowning of our gala ambassadors. Cast your vote live during the grand show!',
      icon: <Award className="w-5 h-5 text-amber-400" />
    },
    {
      title: 'Musical Drama',
      tag: 'Gala Theatre',
      desc: 'An enchanting musical drama presented by our university’s premier student performers.',
      icon: <Sparkles className="w-5 h-5 text-amber-400" />
    },
    {
      title: 'Music Band',
      tag: 'Live Concert',
      desc: 'High-energy live concert featuring royal gala arrangements, acoustic acts, and bands.',
      icon: <Music className="w-5 h-5 text-amber-400" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-100 flex justify-center font-sans selection:bg-amber-400 selection:text-zinc-950">
      <div className="w-full max-w-md bg-[#0f0f10] min-h-screen flex flex-col shadow-2xl border-x border-zinc-800/60 relative overflow-hidden pb-10">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <header className="px-5 py-4 flex items-center justify-between border-b border-zinc-800/60 bg-[#0f0f10]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-100 p-[1px]">
              <div className="w-full h-full bg-[#0f0f10] rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <span className="font-extrabold text-sm tracking-widest bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 bg-clip-text text-transparent">
              M-GALA 2026
            </span>
          </div>
          
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1d1d20] border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-[#27272a] transition-all cursor-pointer shadow-sm"
          >
            <LogIn className="w-3.5 h-3.5" />
            Login
          </button>
        </header>

        {/* Hero Banner */}
        <section className="px-5 pt-6 pb-4 text-center space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl group">
            <img 
              src="/poster.png" 
              alt="The Timeless M-Gala Poster" 
              className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f10] via-transparent to-transparent opacity-85" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-amber-400" /> Annual Grand Celebration
            </span>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto font-medium">
              An Enchanting Evening of Heritage, Music & Royalty
            </p>
          </div>

          <div className="flex justify-center items-center gap-4 text-xs text-amber-100 bg-[#1d1d20]/80 border border-zinc-800 rounded-xl p-3">
            <div className="flex items-center gap-1.5 font-semibold">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Grand Night</span>
            </div>
            <div className="h-4 w-[1px] bg-zinc-700/60" />
            <div className="flex items-center gap-1.5 font-semibold">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Main Auditorium</span>
            </div>
          </div>

          {/* Action CTA Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => navigate('/buy-ticket')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 text-zinc-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15 hover:brightness-110 transition-all cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              Buy Ticket Pass (89 THB)
            </button>

            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 rounded-xl bg-[#1d1d20] border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#27272a] transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              Already Have a Ticket? Login
            </button>
          </div>
        </section>

        {/* Gala Lineup Section */}
        <section className="px-5 pt-4 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-zinc-100">Gala Lineup</h2>
              <p className="text-[11px] text-zinc-400">4 iconic performances taking the stage</p>
            </div>
            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              4 Shows
            </span>
          </div>

          <div className="space-y-2.5">
            {events.map((evt, idx) => (
              <div 
                key={idx}
                className="bg-[#1d1d20]/70 border border-zinc-800/80 rounded-xl p-3.5 flex items-start gap-3 hover:border-amber-400/40 transition-all"
              >
                <div className="p-2 bg-[#0f0f10] border border-zinc-800 rounded-lg shrink-0">
                  {evt.icon}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-zinc-100">{evt.title}</h3>
                    <span className="text-[9px] font-extrabold text-amber-300 uppercase tracking-wider bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      {evt.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {evt.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 py-4 border-t border-zinc-800/60 text-center text-[10px] text-zinc-500">
          © 2026 The Timeless M-Gala • Student Entry System
        </footer>

      </div>
    </div>
  );
}