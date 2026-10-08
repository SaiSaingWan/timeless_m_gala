import { useState } from 'react';
import { CheckCircle2, Vote, Info, X } from 'lucide-react';

const candidatesList = [
  {
    id: 101,
    name: 'Ethan & Sophia',
    number: 'Candidate #01',
    faculty: 'School of Information Technology',
    motto: 'Leadership through innovation and elegance.',
    bio: 'Representing IT, Ethan and Sophia have spearheaded community tech initiatives and student cultural events for two consecutive years.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 102,
    name: 'Lucas & Maya',
    number: 'Candidate #02',
    faculty: 'School of Management',
    motto: 'Empowering student voices through creative arts.',
    bio: 'Representing Management, Lucas and Maya are passionate advocates for cross-cultural collaboration and university performance art initiatives.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 103,
    name: 'Daniel & Chloe',
    number: 'Candidate #03',
    faculty: 'School of Liberal Arts',
    motto: 'Preserving heritage, inspiring future generations.',
    bio: 'Representing Liberal Arts, Daniel and Chloe bring a wealth of background in traditional stage acting, debate, and international ambassador programs.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'
  }
];

export default function AmbassadorsTab({ votedCandidateId, onVote }) {
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-zinc-100">Vote Ambassador 2026</h1>
        <p className="text-xs text-zinc-400">1 ticket pass = 1 live ambassador vote.</p>
      </div>

      {votedCandidateId && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center gap-2.5 text-amber-200 text-xs">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <span className="font-bold">Vote Submitted!</span> You voted for{' '}
            <span className="underline font-semibold text-amber-300">
              {candidatesList.find(c => c.id === votedCandidateId)?.name}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {candidatesList.map((cand) => {
          const isVoted = votedCandidateId === cand.id;
          return (
            <div
              key={cand.id}
              className={`bg-[#1d1d20]/90 border rounded-2xl overflow-hidden shadow-xl transition-all ${
                isVoted ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-zinc-800/80 hover:border-amber-500/40'
              }`}
            >
              <div className="relative h-44 overflow-hidden bg-zinc-900">
                <img src={cand.image} alt={cand.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1d1d20] via-transparent to-transparent opacity-90" />
                <span className="absolute top-3 left-3 bg-[#0f0f10]/80 backdrop-blur-md text-amber-300 font-black text-[10px] px-2.5 py-1 rounded-full border border-amber-500/30 uppercase tracking-wider">
                  {cand.number}
                </span>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h2 className="text-base font-extrabold text-zinc-100">{cand.name}</h2>
                  <p className="text-xs text-amber-300 font-medium">{cand.faculty}</p>
                  <p className="text-[11px] text-zinc-300 italic mt-1 font-serif">"{cand.motto}"</p>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => setSelectedCandidate(cand)}
                    className="flex-1 py-2.5 rounded-xl bg-[#0f0f10] border border-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-[#27272a] hover:border-amber-500/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Info className="w-3.5 h-3.5 text-amber-400" /> Bio Modal
                  </button>

                  <button
                    onClick={() => onVote(cand.id)}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isVoted 
                        ? 'bg-amber-400 text-zinc-950 font-black shadow-lg shadow-amber-400/20' 
                        : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 text-zinc-950 hover:brightness-110'
                    }`}
                  >
                    {isVoted ? (
                      <><CheckCircle2 className="w-4 h-4 text-zinc-950" /> Voted</>
                    ) : (
                      <><Vote className="w-4 h-4 text-zinc-950" /> Cast Vote</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-5">
          <div className="bg-[#0f0f10] border border-amber-500/30 w-full max-w-sm rounded-2xl p-5 relative shadow-2xl space-y-4">
            <button
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1d1d20] border border-amber-500/20 text-zinc-300 flex items-center justify-center hover:bg-[#27272a] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <span className="bg-amber-500/10 text-amber-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-amber-500/30 uppercase tracking-wider">
                {selectedCandidate.number}
              </span>
              <h3 className="text-lg font-extrabold text-zinc-100">{selectedCandidate.name}</h3>
              <p className="text-xs text-amber-300 font-medium">{selectedCandidate.faculty}</p>
            </div>

            <div className="space-y-1 bg-[#1d1d20]/80 border border-zinc-800 p-3 rounded-xl">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Candidate Bio</p>
              <p className="text-xs text-zinc-300 leading-relaxed">{selectedCandidate.bio}</p>
            </div>

            <button
              onClick={() => {
                onVote(selectedCandidate.id);
                setSelectedCandidate(null);
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 text-zinc-950 font-black text-xs flex items-center justify-center gap-2 hover:brightness-110 cursor-pointer shadow-lg shadow-amber-500/15"
            >
              <Vote className="w-4 h-4" /> Vote For {selectedCandidate.name}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}