import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../firebase';
import { Search, Eye, CheckCircle2, XCircle, ZoomIn, ZoomOut, RotateCw, Sparkles, Flower, Clock } from 'lucide-react';

export default function AdminFlowerOrdersTab({ createAuditLog }) {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending'); // 'all' | 'pending' | 'approved' | 'rejected'
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [processingId, setProcessingId] = useState(null);

  // Real-time listener for flower orders
  useEffect(() => {
    const q = query(collection(db, 'flowerOrders'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(list);
    });
    return () => unsubscribe();
  }, []);

  // Approve order & auto-credit user balance
  const handleApproveOrder = async (order) => {
    setProcessingId(order.id);
    try {
      // 1. Mark order status as approved
      const orderRef = doc(db, 'flowerOrders', order.id);
      await updateDoc(orderRef, {
        status: 'approved',
        approvedAt: new Date().toISOString()
      });

      // 2. Automatically credit/increment user's flowerBalance in Firestore
      const userRef = doc(db, 'users', order.studentId);
      await updateDoc(userRef, {
        flowerBalance: increment(Number(order.flowerAmount))
      });

      if (createAuditLog) {
        await createAuditLog('FLOWER_APPROVE', `Approved ${order.flowerAmount} flowers for ID: ${order.studentId}`, order.studentId);
      }

      setSelectedSlip(null);
    } catch (err) {
      console.error('Failed to approve flower order:', err);
      alert('Failed to approve order. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  // Reject order
  const handleRejectOrder = async (order) => {
    setProcessingId(order.id);
    try {
      const orderRef = doc(db, 'flowerOrders', order.id);
      await updateDoc(orderRef, {
        status: 'rejected',
        rejectedAt: new Date().toISOString()
      });

      if (createAuditLog) {
        await createAuditLog('FLOWER_REJECT', `Rejected flower order for ID: ${order.studentId}`, order.studentId);
      }

      setSelectedSlip(null);
    } catch (err) {
      console.error('Failed to reject order:', err);
      alert('Failed to reject order.');
    } finally {
      setProcessingId(null);
    }
  };

  // Status counts
  const counts = {
    all: orders.length,
    pending: orders.filter((o) => (o.status || 'pending') === 'pending').length,
    approved: orders.filter((o) => o.status === 'approved').length,
    rejected: orders.filter((o) => o.status === 'rejected').length
  };

  // Filtered list
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.studentId?.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || (o.status || 'pending') === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ID, Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0f0f10] border border-zinc-800 rounded-xl py-2 pl-9 pr-3 text-xs text-zinc-100 focus:border-amber-400 focus:outline-none"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-[#0f0f10] p-1 border border-zinc-800 rounded-xl text-xs overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              statusFilter === 'all' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All <span className="text-[10px] bg-zinc-900 px-1.5 py-0.2 rounded-full border border-zinc-700">{counts.all}</span>
          </button>

          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              statusFilter === 'pending'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-zinc-400 hover:text-amber-300'
            }`}
          >
            Pending <span className="text-[10px] bg-amber-500/30 text-amber-300 px-1.5 py-0.2 rounded-full">{counts.pending}</span>
          </button>

          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              statusFilter === 'approved'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-zinc-400 hover:text-emerald-400'
            }`}
          >
            Approved <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.2 rounded-full">{counts.approved}</span>
          </button>

          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              statusFilter === 'rejected'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'text-zinc-400 hover:text-red-400'
            }`}
          >
            Rejected <span className="text-[10px] bg-red-500/30 text-red-300 px-1.5 py-0.2 rounded-full">{counts.rejected}</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#0f0f10] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1d1d20] text-amber-300 font-bold uppercase tracking-wider border-b border-zinc-800">
              <tr>
                <th className="p-3.5">Student</th>
                <th className="p-3.5">Student ID</th>
                <th className="p-3.5">Flowers Bundle</th>
                <th className="p-3.5">Amount (THB)</th>
                <th className="p-3.5">Payment Slip</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500 italic">
                    No flower orders found matching this filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#1d1d20]/50 transition-colors">
                    <td className="p-3.5 font-bold text-zinc-100">{order.buyerName}</td>
                    <td className="p-3.5 font-mono text-zinc-400">{order.studentId}</td>
                    <td className="p-3.5 font-bold text-pink-300 flex items-center gap-1">
                      <Flower className="w-3.5 h-3.5 text-pink-400" /> {order.flowerAmount} 🌸
                    </td>
                    <td className="p-3.5 font-mono text-amber-300 font-bold">฿{order.thbAmount} THB</td>
                    <td className="p-3.5">
                      {order.slipUrl ? (
                        <button
                          onClick={() => {
                            setSelectedSlip(order);
                            setZoomLevel(1);
                            setRotation(0);
                          }}
                          className="text-amber-400 underline font-semibold flex items-center gap-1 cursor-pointer hover:text-amber-300"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Slip
                        </button>
                      ) : (
                        <span className="text-zinc-600 italic">No Slip</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : order.status === 'rejected'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {order.status?.toUpperCase() || 'PENDING'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleRejectOrder(order)}
                            disabled={processingId === order.id}
                            className="px-2.5 py-1 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-[11px] font-bold hover:bg-red-900/60 cursor-pointer disabled:opacity-50"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleApproveOrder(order)}
                            disabled={processingId === order.id}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500 text-zinc-950 text-[11px] font-black hover:bg-emerald-400 cursor-pointer disabled:opacity-50"
                          >
                            Approve
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Slip Modal */}
      {selectedSlip && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f0f10] border border-amber-500/30 w-full max-w-sm rounded-2xl p-5 relative shadow-2xl space-y-4">
            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-base text-zinc-100">{selectedSlip.buyerName}</h3>
              <p className="text-xs text-pink-300 font-bold">🌸 {selectedSlip.flowerAmount} Flowers (฿{selectedSlip.thbAmount} THB)</p>
              <p className="text-[10px] text-zinc-500 font-mono">ID: {selectedSlip.studentId}</p>
            </div>

            <div className="bg-[#1d1d20] border border-zinc-800 p-2 rounded-xl text-center overflow-hidden relative">
              <div
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                  transition: 'transform 0.2s ease-in-out'
                }}
              >
                <img
                  src={selectedSlip.slipUrl}
                  alt="Payment Slip"
                  className="max-h-64 w-full object-contain rounded-lg mx-auto"
                />
              </div>

              <div className="flex justify-center gap-2 mt-3 pt-2 border-t border-zinc-800">
                <button
                  onClick={() => setZoomLevel((z) => Math.min(z + 0.3, 2.5))}
                  className="p-1.5 bg-[#0f0f10] border border-zinc-700 rounded-lg text-zinc-300 hover:text-amber-300 cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(z - 0.3, 0.8))}
                  className="p-1.5 bg-[#0f0f10] border border-zinc-700 rounded-lg text-zinc-300 hover:text-amber-300 cursor-pointer"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-1.5 bg-[#0f0f10] border border-zinc-700 rounded-lg text-zinc-300 hover:text-amber-300 cursor-pointer"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {selectedSlip.status === 'pending' && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleRejectOrder(selectedSlip)}
                  disabled={processingId === selectedSlip.id}
                  className="flex-1 py-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-bold hover:bg-red-900/60 transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
                <button
                  onClick={() => handleApproveOrder(selectedSlip)}
                  disabled={processingId === selectedSlip.id}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 text-zinc-950 text-xs font-black hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-1 shadow-lg shadow-amber-500/15"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve & Credit
                </button>
              </div>
            )}

            <button
              onClick={() => setSelectedSlip(null)}
              className="w-full py-1.5 text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}