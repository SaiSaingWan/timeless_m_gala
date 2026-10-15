import { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { Heart, Flower, Sparkles, X, MessageSquare, Drama, Music, Tv, Mic, Users } from 'lucide-react';

const CATEGORIES = [
  { id: 'msa_ops', label: "Myanmar Students' Association", icon: Users, color: 'text-emerald-400' },
  { id: 'mc_team', label: 'Masters of Ceremony', icon: Mic, color: 'text-cyan-400' },
  { id: 'yip_band', label: 'YIP Band', icon: Music, color: 'text-purple-400' },
  { id: 'musical_drama', label: 'Musical Drama', icon: Tv, color: 'text-rose-400' },
  { id: 'a_nyeint', label: 'Ngu Wa Nee Anyeint', icon: Drama, color: 'text-amber-400' }
];

export default function MokePhoeTab({ user }) {
  const [feed, setFeed] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCat, setSelectedCat] = useState('msa_ops');
  const [flowerAmount, setFlowerAmount] = useState('30');
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);

  // Real-time listener for live gift feed
  useEffect(() => {
    const q = query(collection(db, 'mokePhoeFeed'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setFeed(items);
    });
    return () => unsubscribe();
  }, []);

  const handleSendGift = async (e) => {
    e.preventDefault();
    const amountNum = Number(flowerAmount);

    if (!amountNum || amountNum <= 0) {
      alert('Please enter a valid flower amount.');
      return;
    }

    const currentBalance = user?.flowerBalance || 0;
    if (currentBalance < amountNum) {
      alert(`Insufficient flowers! You currently have ${currentBalance} flowers. Please top up in the Flower Shop tab.`);
      return;
    }

    setSending(true);
    try {
      const catObj = CATEGORIES.find((c) => c.id === selectedCat);

      // 1. Post to Feed
      await addDoc(collection(db, 'mokePhoeFeed'), {
        senderName: user?.fullName || 'Anonymous',
        studentId: user?.studentId || 'N/A',
        targetCategory: catObj.label,
        flowerAmount: amountNum,
        comment: comment.trim() || 'Awesome job!',
        createdAt: new Date().toISOString()
      });

      // 2. Deduct user's flower balance
      const userRef = doc(db, 'users', user.studentId);
      await updateDoc(userRef, {
        flowerBalance: increment(-amountNum)
      });

      setShowModal(false);
      setComment('');
      setFlowerAmount('30');
    } catch (err) {
      console.error('Failed to send gift:', err);
      alert('Failed to send gift. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto relative pb-6">
      {/* Header Banner & Trigger Button */}
      <div className="bg-[#0f0f10] border border-zinc-800 p-5 rounded-2xl flex items-center justify-between shadow-xl">
        <div>
          <h2 className="text-lg font-black text-amber-300 flex items-center gap-2">
            <Heart className="w-5 h-5 fill-pink-500 text-pink-500 animate-pulse" /> Moke Phoe (Love Gift)
          </h2>
          <p className="text-xs text-zinc-400">Send love & flowers to event teams!</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 via-amber-400 to-amber-300 text-zinc-950 font-black text-xs hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-pink-500/20 flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4" /> Give Moke Phoe
        </button>
      </div>

      {/* Live Feed */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-pink-400" /> Live Gift Feed
        </h3>

        {feed.length === 0 ? (
          <div className="bg-[#0f0f10] border border-zinc-800 rounded-2xl p-8 text-center text-xs text-zinc-500 italic">
            No gifts sent yet. Be the first to send Moke Phoe! 🌸
          </div>
        ) : (
          feed.map((item) => (
            <div
              key={item.id}
              className="bg-[#0f0f10] border border-zinc-800 p-4 rounded-2xl space-y-2 hover:border-zinc-700 transition-all shadow-md"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-zinc-100">{item.senderName}</span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <p className="text-xs text-zinc-300">
                gifted <span className="font-extrabold text-amber-300">"{item.targetCategory}"</span>{' '}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 font-bold text-[11px]">
                  🌸 {item.flowerAmount}x Flowers
                </span>
              </p>

              {item.comment && (
                <div className="bg-[#1d1d20] border border-zinc-800/60 p-2.5 rounded-xl text-xs text-zinc-300 italic">
                  "{item.comment}"
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Gift Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f0f10] border border-pink-500/30 w-full max-w-md rounded-2xl p-5 relative shadow-2xl space-y-4">
            
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-extrabold text-base text-zinc-100 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-400 fill-pink-400" /> Send Moke Phoe
              </h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-zinc-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. Recipient Options */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Choose Recipient Team</label>
              <div className="grid grid-cols-1 gap-2">
                {CATEGORIES.map((cat) => {
                  const IconComp = cat.icon;
                  const isSelected = selectedCat === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCat(cat.id)}
                      className={`p-3 rounded-xl border text-xs font-bold text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-pink-500/20 border-pink-400 text-zinc-100'
                          : 'bg-[#1d1d20] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComp className={`w-4 h-4 ${cat.color}`} />
                        <span>{cat.label}</span>
                      </div>
                      {isSelected && <Sparkles className="w-4 h-4 text-amber-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Flower Amount */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Flower Amount</label>
                <span className="text-[11px] font-bold text-pink-300">Balance: {user?.flowerBalance || 0} 🌸</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['10', '30', '50', '100'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setFlowerAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      flowerAmount === amt
                        ? 'bg-pink-500 text-zinc-950 border-pink-400'
                        : 'bg-[#1d1d20] border-zinc-800 text-zinc-300'
                    }`}
                  >
                    🌸 {amt}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="1"
                value={flowerAmount}
                onChange={(e) => setFlowerAmount(e.target.value)}
                placeholder="Custom flower count..."
                className="w-full bg-[#1d1d20] border border-zinc-800 rounded-xl py-2 px-3 text-xs text-zinc-100 font-bold focus:border-pink-400 focus:outline-none"
              />
            </div>

            {/* 3. Comment */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Cheer Message</label>
              <textarea
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your cheer message..."
                className="w-full bg-[#1d1d20] border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:border-pink-400 focus:outline-none"
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleSendGift}
              disabled={sending}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 via-amber-400 to-amber-300 text-zinc-950 font-black text-xs hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20"
            >
              {sending ? 'Sending...' : `Send 🌸 ${flowerAmount || 0} Flowers`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}