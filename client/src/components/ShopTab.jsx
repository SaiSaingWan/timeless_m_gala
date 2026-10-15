import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Flower, Upload, CheckCircle2, ShoppingBag, History, QrCode, Clock, XCircle, Sparkles } from 'lucide-react';

const FLOWER_PACKS = [
  { count: 30, price: 30, popular: false, qrImage: '/qrs/qr30pay.webp' },
  { count: 50, price: 50, popular: false, qrImage: '/qrs/qr50pay.webp' },
  { count: 100, price: 100, popular: true, qrImage: '/qrs/qr100pay.webp' },
  { count: 200, price: 200, popular: false, qrImage: '/qrs/qr200pay.webp' },
  { count: 500, price: 500, popular: false, qrImage: '/qrs/qr500pay.webp' }
];

export default function ShopTab({ user }) {
  const [activeSubTab, setActiveSubTab] = useState('buy'); // 'buy' | 'history'
  const [selectedPack, setSelectedPack] = useState(FLOWER_PACKS[2]); // Default 100 flowers
  const [slipUrl, setSlipUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  // Preload all bundle QR images in browser cache for instantaneous switching
  useEffect(() => {
    FLOWER_PACKS.forEach((pack) => {
      const img = new Image();
      img.src = pack.qrImage;
    });
  }, []);

  // Fetch purchase history for current user
  useEffect(() => {
    if (!user?.studentId) return;

    const q = query(
      collection(db, 'flowerOrders'),
      where('studentId', '==', user.studentId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPurchaseHistory(orders);
    });

    return () => unsubscribe();
  }, [user?.studentId]);

  // Compress slip on upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setSlipUrl(canvas.toDataURL('image/jpeg', 0.6));
      };
    };
    reader.readAsDataURL(file);
  };

  const handleBuyFlowers = async (e) => {
    e.preventDefault();
    if (!slipUrl) {
      alert('Please upload your bank transfer slip.');
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'flowerOrders'), {
        studentId: user?.studentId || 'N/A',
        buyerName: user?.fullName || 'MFU Student',
        flowerAmount: selectedPack.count,
        thbAmount: selectedPack.price,
        slipUrl,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      setSuccess(true);
      setSlipUrl('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to submit flower order:', err);
      alert('Order failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto pb-6">
      {/* Wallet Balance Header */}
      <div className="bg-gradient-to-r from-pink-500/20 via-amber-500/20 to-purple-500/20 border border-pink-500/30 p-5 rounded-2xl flex justify-between items-center shadow-xl">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">Your Flower Balance</span>
          <h3 className="text-2xl font-black text-pink-300 flex items-center gap-2">
            🌸 {user?.flowerBalance || 0} <span className="text-xs font-semibold text-zinc-300">Flowers</span>
          </h3>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-zinc-400 block">Exchange Rate</span>
          <span className="text-xs font-mono font-bold text-amber-300">1 Flower = 1 THB</span>
        </div>
      </div>

      {/* Sub Tab Navigation */}
      <div className="grid grid-cols-2 bg-[#0f0f10] p-1 rounded-xl border border-zinc-800 gap-1 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('buy')}
          className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'buy' ? 'bg-amber-400 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" /> Buy Flowers
        </button>
        <button
          onClick={() => setActiveSubTab('history')}
          className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'history' ? 'bg-amber-400 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <History className="w-3.5 h-3.5" /> Order History ({purchaseHistory.length})
        </button>
      </div>

      {activeSubTab === 'buy' ? (
        <div className="space-y-6">
          {/* Flower Pack Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-pink-400" /> 1. Select Flower Bundle
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {FLOWER_PACKS.map((pack) => {
                const isSelected = selectedPack.count === pack.count;
                return (
                  <button
                    key={pack.count}
                    type="button"
                    onClick={() => setSelectedPack(pack)}
                    className={`p-4 rounded-2xl border transition-all text-left relative cursor-pointer ${
                      isSelected
                        ? 'bg-pink-500/20 border-pink-400 text-pink-200 ring-2 ring-pink-400 shadow-lg'
                        : 'bg-[#0f0f10] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {pack.popular && (
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-pink-500 text-zinc-950 font-black text-[9px] px-2 py-0.5 rounded-full shadow-md">
                        POPULAR
                      </span>
                    )}
                    <div className="flex items-center gap-1.5 mb-1">
                      <Flower className="w-4 h-4 text-pink-400" />
                      <span className="font-extrabold text-base text-zinc-100">{pack.count} Flowers</span>
                    </div>
                    <p className="text-xs font-mono text-amber-300 font-bold">฿{pack.price} THB</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* QR Code & Payment Section */}
          <div className="bg-[#0f0f10] border border-zinc-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 text-xs">
              <span className="text-zinc-400">Selected Bundle:</span>
              <span className="font-bold text-amber-300">{selectedPack.count} Flowers = ฿{selectedPack.price} THB</span>
            </div>

            {/* QR Code Display */}
            <div className="bg-[#1d1d20] border border-zinc-800 p-4 rounded-2xl text-center space-y-2">
              <span className="text-xs font-bold text-amber-300 flex items-center justify-center gap-1">
                <QrCode className="w-4 h-4" /> Scan QR to Pay ฿{selectedPack.price} THB
              </span>
              <img
                src={selectedPack.qrImage}
                alt={`QR Pay ฿${selectedPack.price}`}
                className="w-48 h-48 object-contain mx-auto rounded-xl border border-zinc-700/80 bg-white p-2 shadow-md"
              />
              <p className="text-[10px] text-zinc-400">
                Please transfer exact amount <strong className="text-pink-300 font-mono">฿{selectedPack.price}.00 THB</strong>
              </p>
            </div>

            {/* Payment Slip Upload */}
            <form onSubmit={handleBuyFlowers} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  2. Upload Bank Transfer Slip
                </label>
                <label className="border-2 border-dashed border-zinc-800 hover:border-pink-500/50 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all bg-[#1d1d20]/50">
                  {slipUrl ? (
                    <div className="text-center space-y-1">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                      <span className="text-xs font-bold text-emerald-400">Payment Slip Attached!</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-pink-400" />
                      <span className="text-xs text-zinc-300 font-semibold">Click to attach bank slip</span>
                      <span className="text-[10px] text-zinc-500">Supports JPG, PNG</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              {success && (
                <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3 rounded-xl text-xs font-bold text-center">
                  ✅ Flower order submitted! Admins will verify your payment slip and credit your balance shortly.
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !slipUrl}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 via-amber-400 to-amber-300 text-zinc-950 font-black text-xs hover:brightness-110 transition-all cursor-pointer disabled:opacity-40 shadow-lg shadow-pink-500/20"
              >
                {submitting ? 'Submitting Order...' : `Buy ${selectedPack.count} Flowers (฿${selectedPack.price})`}
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* History Sub Tab */
        <div className="space-y-3">
          {purchaseHistory.length === 0 ? (
            <div className="bg-[#0f0f10] border border-zinc-800 rounded-2xl p-8 text-center text-xs text-zinc-500 italic">
              No flower purchase history yet.
            </div>
          ) : (
            purchaseHistory.map((order) => (
              <div
                key={order.id}
                className="bg-[#0f0f10] border border-zinc-800 p-4 rounded-2xl flex items-center justify-between text-xs shadow-md"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-pink-300">🌸 {order.flowerAmount} Flowers</span>
                    <span className="text-[11px] font-mono font-bold text-amber-300">(฿{order.thbAmount} THB)</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                      order.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : order.status === 'rejected'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {order.status === 'approved' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                    {order.status === 'pending' && <Clock className="w-3 h-3 text-amber-400" />}
                    {order.status === 'rejected' && <XCircle className="w-3 h-3 text-red-400" />}
                    {order.status?.toUpperCase() || 'PENDING'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}