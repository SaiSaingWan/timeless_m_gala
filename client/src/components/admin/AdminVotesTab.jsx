import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Lock, Unlock, Users } from 'lucide-react';

const maleCandidates = [
  { id: 'm1', name: 'Wai Phyo Zaw', number: 'Male #01', image: '/males/3.png' },
  { id: 'm2', name: 'Thukha Nyan', number: 'Male #02', image: '/males/4.png' },
  { id: 'm3', name: 'Saw Hay Let Bwe Htoo', number: 'Male #03', image: '/males/5.png' },
  { id: 'm4', name: 'Maw Kun', number: 'Male #04', image: '/males/10.png' },
  { id: 'm5', name: 'Aung Phone Thant', number: 'Male #05', image: '/males/13.png' },
  { id: 'm6', name: 'Hein Htet Aung', number: 'Male #06', image: '/males/14.png' },
  { id: 'm7', name: 'Min Htet Aung', number: 'Male #07', image: '/males/15.png' }
];

const femaleCandidates = [
  { id: 'f1', name: 'Yunn Eaint Myint Mo', number: 'Female #01', image: '/females/1.png' },
  { id: 'f2', name: 'Wati Thae Maung', number: 'Female #02', image: '/females/2.png' },
  { id: 'f3', name: 'Pyae Sone Chan Thar', number: 'Female #03', image: '/females/6.png' },
  { id: 'f4', name: 'Phyo Thiri Khaing', number: 'Female #04', image: '/females/7.png' },
  { id: 'f5', name: 'Ngwe Kant Kaw', number: 'Female #05', image: '/females/8.png' },
  { id: 'f6', name: 'Naw Mercy Zaw', number: 'Female #06', image: '/females/9.png' },
  { id: 'f7', name: 'Nang Aye Aye Aung', number: 'Female #07', image: '/females/11.png' },
  { id: 'f8', name: 'Hsu Yi Htwe', number: 'Female #08', image: '/females/12.png' }
];

export default function AdminVotesTab({ users, createAuditLog }) {
  const [votingFrozen, setVotingFrozen] = useState(false);

  // Sync freeze state from Firestore on mount
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'eventConfig'), (docSnap) => {
      if (docSnap.exists()) {
        setVotingFrozen(docSnap.data().votingFrozen || false);
      }
    });
    return () => unsub();
  }, []);

  // Calculate vote tallies
  const maleVotes = users.reduce((acc, u) => {
    if (u.votedMaleId) acc[u.votedMaleId] = (acc[u.votedMaleId] || 0) + 1;
    return acc;
  }, {});

  const femaleVotes = users.reduce((acc, u) => {
    if (u.votedFemaleId) acc[u.votedFemaleId] = (acc[u.votedFemaleId] || 0) + 1;
    return acc;
  }, {});

  const totalMaleVotes = Object.values(maleVotes).reduce((a, b) => a + b, 0);
  const totalFemaleVotes = Object.values(femaleVotes).reduce((a, b) => a + b, 0);

  const handleToggleFreeze = async () => {
    const nextState = !votingFrozen;
    setVotingFrozen(nextState);

    // Persist freeze status globally in Firestore
    await setDoc(doc(db, 'settings', 'eventConfig'), { votingFrozen: nextState }, { merge: true });
    await createAuditLog('VOTE_FREEZE_TOGGLE', `Turned voting freeze ${nextState ? 'ON' : 'OFF'}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Controls */}
      <div className="flex justify-between items-center bg-[#0f0f10] border border-zinc-800 p-4 rounded-2xl shadow-lg">
        <div>
          <h2 className="font-extrabold text-sm text-zinc-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" /> Live Ambassador Leaderboard
          </h2>
          <p className="text-xs text-zinc-400">Real-time candidate tallying with percentage progress</p>
        </div>

        <button
          onClick={handleToggleFreeze}
          className={`py-2 px-4 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
            votingFrozen
              ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-red-500/10'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-amber-500/10'
          }`}
        >
          {votingFrozen ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          {votingFrozen ? 'VOTING FROZEN' : 'FREEZE VOTING'}
        </button>
      </div>

      {/* SECTION 1: FEMALE CANDIDATES (TOP) */}
      <div className="bg-[#0f0f10] border border-zinc-800 p-5 rounded-2xl space-y-4 shadow-xl overflow-hidden">
        {/* Female Banner - Original Ratio */}
        <div className="w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
          <img 
            src="/femalebanner.png" 
            alt="Female Candidates Banner" 
            className="w-full h-auto object-contain block" 
          />
        </div>

        <div className="flex justify-between items-center border-b border-zinc-800/80 pb-3">
          <h3 className="font-extrabold text-sm text-amber-300 uppercase tracking-wider flex items-center gap-2">
            Female Ambassador Candidates
          </h3>
          <span className="text-xs text-zinc-400 font-mono">
            Total Female Votes: <strong className="text-amber-300">{totalFemaleVotes}</strong>
          </span>
        </div>

        <div className="space-y-3">
          {femaleCandidates.map((cand) => {
            const votes = femaleVotes[cand.id] || 0;
            const percentage = totalFemaleVotes > 0 ? ((votes / totalFemaleVotes) * 100).toFixed(1) : 0;

            return (
              <div key={cand.id} className="bg-[#1d1d20]/80 p-3.5 rounded-xl border border-zinc-800 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  
                  {/* Image + Candidate Info */}
                  <div className="flex items-center gap-3">
                    <img 
                      src={cand.image} 
                      alt={cand.name} 
                      className="w-10 h-10 rounded-lg object-cover border border-amber-500/30 shrink-0" 
                    />
                    <div>
                      <div className="font-bold text-zinc-100 flex items-center gap-2">
                        {cand.name}
                        <span className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                          {cand.number}
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono">ID: {cand.id}</div>
                    </div>
                  </div>

                  {/* Percentage + Vote Count */}
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-zinc-400 text-[11px]">{percentage}%</span>
                    <span className="font-extrabold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                      {votes} Votes
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#0f0f10] h-2.5 rounded-full overflow-hidden border border-zinc-800">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: MALE CANDIDATES (BELOW) */}
      <div className="bg-[#0f0f10] border border-zinc-800 p-5 rounded-2xl space-y-4 shadow-xl overflow-hidden">
        {/* Male Banner - Original Ratio */}
        <div className="w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
          <img 
            src="/malebanner.png" 
            alt="Male Candidates Banner" 
            className="w-full h-auto object-contain block" 
          />
        </div>

        <div className="flex justify-between items-center border-b border-zinc-800/80 pb-3">
          <h3 className="font-extrabold text-sm text-amber-300 uppercase tracking-wider flex items-center gap-2">
            Male Ambassador Candidates
          </h3>
          <span className="text-xs text-zinc-400 font-mono">
            Total Male Votes: <strong className="text-amber-300">{totalMaleVotes}</strong>
          </span>
        </div>

        <div className="space-y-3">
          {maleCandidates.map((cand) => {
            const votes = maleVotes[cand.id] || 0;
            const percentage = totalMaleVotes > 0 ? ((votes / totalMaleVotes) * 100).toFixed(1) : 0;

            return (
              <div key={cand.id} className="bg-[#1d1d20]/80 p-3.5 rounded-xl border border-zinc-800 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  
                  {/* Image + Candidate Info */}
                  <div className="flex items-center gap-3">
                    <img 
                      src={cand.image} 
                      alt={cand.name} 
                      className="w-10 h-10 rounded-lg object-cover border border-amber-500/30 shrink-0" 
                    />
                    <div>
                      <div className="font-bold text-zinc-100 flex items-center gap-2">
                        {cand.name}
                        <span className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                          {cand.number}
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono">ID: {cand.id}</div>
                    </div>
                  </div>

                  {/* Percentage + Vote Count */}
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-zinc-400 text-[11px]">{percentage}%</span>
                    <span className="font-extrabold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                      {votes} Votes
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#0f0f10] h-2.5 rounded-full overflow-hidden border border-zinc-800">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}