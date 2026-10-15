import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { Flower, Trophy, Drama, Music, Tv, Mic, Users, Heart, MessageSquare } from 'lucide-react';

const TEAM_CONFIG = [
  { label: 'A Nyeint', icon: Drama, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  { label: 'YIP Music Band', icon: Music, color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
  { label: 'Musical Drama', icon: Tv, color: 'text-rose-400 border-rose-500/30 bg-rose-500/10' },
  { label: 'MC (Master Ceremony)', icon: Mic, color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
  { label: 'MSA (Operation Team)', icon: Users, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' }
];

export default function AdminFlowerStatsTab() {
  const [feed, setFeed] = useState([]);
  const [stats, setStats] = useState({});
  const [totalFlowersGiven, setTotalFlowersGiven] = useState(0);

  useEffect(() => {
    const q = query(collection(db, 'mokePhoeFeed'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setFeed(items);

      // Aggregate flower totals per team category
      const totals = {};
      let overallSum = 0;

      TEAM_CONFIG.forEach((t) => {
        totals[t.label] = 0;
      });

      items.forEach((item) => {
        const amount = Number(item.flowerAmount) || 0;
        const target = item.targetCategory;
        if (totals[target] !== undefined) {
          totals[target] += amount;
        } else {
          totals[target] = (totals[target] || 0) + amount;
        }
        overallSum += amount;
      });

      setStats(totals);
      setTotalFlowersGiven(overallSum);
    });

    return () => unsubscribe();
  }, []);

  // Sorted list of teams by total flowers received
  const sortedTeams = TEAM_CONFIG.map((team) => ({
    ...team,
    totalFlowers: stats[team.label] || 0
  })).sort((a, b) => b.totalFlowers - a.totalFlowers);

  return (
    <div className="space-y-6">
      {/* Top Total Overview Card */}
      <div className="bg-gradient-to-r from-pink-500/20 via-amber-500/20 to-purple-500/20 border border-pink-500/30 p-5 rounded-2xl flex items-center justify-between shadow-xl">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">Total Love Gifts Sent</span>
          <h2 className="text-3xl font-black text-pink-300 flex items-center gap-2 mt-1">
            🌸 {totalFlowersGiven} <span className="text-sm font-bold text-zinc-300">Flowers Distributed</span>
          </h2>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center shrink-0">
          <Heart className="w-6 h-6 text-pink-400 fill-pink-400 animate-pulse" />
        </div>
      </div>

      {/* Team Leaderboard Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-amber-400" /> Team Flower Leaderboard
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {sortedTeams.map((team, index) => {
            const IconComp = team.icon;
            const isTop = index === 0 && team.totalFlowers > 0;

            return (
              <div
                key={team.label}
                className={`p-4 rounded-2xl border transition-all relative space-y-3 ${
                  isTop
                    ? 'bg-gradient-to-br from-amber-500/20 via-pink-500/10 to-[#0f0f10] border-amber-400/60 ring-1 ring-amber-400/40 shadow-xl'
                    : 'bg-[#0f0f10] border-zinc-800'
                }`}
              >
                {isTop && (
                  <span className="absolute -top-2.5 -right-2 bg-amber-400 text-zinc-950 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                    <Trophy className="w-3 h-3 fill-zinc-950" /> #1 LEADER
                  </span>
                )}

                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl border ${team.color}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs text-zinc-500 font-bold">#{index + 1}</span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-zinc-100">{team.label}</h4>
                  <div className="text-xl font-black text-pink-300 flex items-center gap-1.5 mt-1">
                    <span>🌸 {team.totalFlowers}</span>
                    <span className="text-xs text-zinc-400 font-normal">Flowers</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gift Activity Log */}
      <div className="bg-[#0f0f10] border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-pink-400" /> Recent Gift Submissions ({feed.length})
        </h3>

        <div className="divide-y divide-zinc-800/60 max-h-96 overflow-y-auto pr-1">
          {feed.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500 italic">
              No gifts recorded yet.
            </div>
          ) : (
            feed.map((item) => (
              <div key={item.id} className="py-3 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-200">
                    {item.senderName}{' '}
                    <span className="text-[10px] text-zinc-500 font-mono">({item.studentId})</span>
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>

                <p className="text-xs text-zinc-300">
                  sent <span className="font-extrabold text-pink-300">🌸 {item.flowerAmount} Flowers</span> to{' '}
                  <span className="font-bold text-amber-300">{item.targetCategory}</span>
                </p>

                {item.comment && (
                  <p className="text-xs text-zinc-400 italic bg-[#1d1d20] p-2 rounded-lg mt-1 border border-zinc-800/60">
                    "{item.comment}"
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}