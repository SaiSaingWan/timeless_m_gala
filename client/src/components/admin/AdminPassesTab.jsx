import { useState } from 'react';
import { doc, getDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase';
import { Search, Eye, CheckSquare, XCircle, CheckCircle2, ZoomIn, ZoomOut, RotateCw, Sparkles, Filter } from 'lucide-react';

export default function AdminPassesTab({ users, createAuditLog }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected'
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [loadingSlip, setLoadingSlip] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [rejectionReason, setRejectionReason] = useState('');

  // Fetch slip image on demand when clicked
  const handleOpenSlip = async (user) => {
    setLoadingSlip(true);
    try {
      const userDoc = await getDoc(doc(db, 'users', user.studentId));
      if (userDoc.exists()) {
        setSelectedSlip({ ...user, slipUrl: userDoc.data().slipUrl });
      } else {
        setSelectedSlip(user);
      }
    } catch (err) {
      console.error('Failed to fetch slip:', err);
    } finally {
      setLoadingSlip(false);
      setZoomLevel(1);
      setRotation(0);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedUserIds.length === 0) return;
    const batch = writeBatch(db);

    selectedUserIds.forEach((studentId) => {
      const ref = doc(db, 'users', studentId);
      batch.update(ref, { paymentStatus: 'approved' });
    });

    await batch.commit();
    await createAuditLog('BULK_APPROVE', `Bulk approved ${selectedUserIds.length} payment slips`);
    setSelectedUserIds([]);
  };

  const handleApprovePayment = async (studentId) => {
    await updateDoc(doc(db, 'users', studentId), { paymentStatus: 'approved' });
    await createAuditLog('SLIP_APPROVE', `Approved payment slip for ID: ${studentId}`, studentId);
    setSelectedSlip(null);
  };

  const handleRejectPayment = async (studentId) => {
    await updateDoc(doc(db, 'users', studentId), {
      paymentStatus: 'rejected',
      rejectionNote: rejectionReason || 'Payment slip unverified.'
    });
    await createAuditLog('SLIP_REJECT', `Rejected payment slip for ID: ${studentId}. Reason: ${rejectionReason || 'N/A'}`, studentId);
    setSelectedSlip(null);
    setRejectionReason('');
  };

  // Real-time status counts
  const counts = {
    all: users.length,
    pending: users.filter((u) => (u.paymentStatus || 'pending') === 'pending').length,
    approved: users.filter((u) => u.paymentStatus === 'approved').length,
    rejected: users.filter((u) => u.paymentStatus === 'rejected').length
  };

  // Filter users by search term AND selected status tab
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.studentId?.includes(searchTerm);

    const userStatus = u.paymentStatus || 'pending';
    const matchesStatus = statusFilter === 'all' || userStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Top Control Bar: Search & Status Filter Tabs */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        
        {/* Search Input */}
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

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#0f0f10] p-1 border border-zinc-800 rounded-xl text-xs overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
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

        {/* Bulk Approve Action */}
        {selectedUserIds.length > 0 && (
          <button
            onClick={handleBulkApprove}
            className="py-2 px-4 bg-emerald-500 text-zinc-950 font-black text-xs rounded-xl hover:bg-emerald-400 transition-all cursor-pointer flex items-center gap-1.5 justify-center"
          >
            <CheckSquare className="w-4 h-4" /> Approve Selected ({selectedUserIds.length})
          </button>
        )}
      </div>

      {/* Table Data */}
      <div className="bg-[#0f0f10] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1d1d20] text-amber-300 font-bold uppercase tracking-wider border-b border-zinc-800">
              <tr>
                <th className="p-3.5">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setSelectedUserIds(e.target.checked ? filteredUsers.map((u) => u.studentId) : [])
                    }
                  />
                </th>
                <th className="p-3.5">Student</th>
                <th className="p-3.5">ID / Phone</th>
                <th className="p-3.5">Slip</th>
                <th className="p-3.5">Payment</th>
                <th className="p-3.5">Gate Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-500 italic">
                    No users found matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#1d1d20]/50 transition-colors">
                    <td className="p-3.5">
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(u.studentId)}
                        onChange={(e) =>
                          setSelectedUserIds((prev) =>
                            e.target.checked
                              ? [...prev, u.studentId]
                              : prev.filter((id) => id !== u.studentId)
                          )
                        }
                      />
                    </td>
                    <td className="p-3.5 font-bold text-zinc-100">{u.fullName}</td>
                    <td className="p-3.5 font-mono text-zinc-400">{u.studentId}</td>
                    <td className="p-3.5">
                      {u.hasSlip ? (
                        <button
                          onClick={() => handleOpenSlip(u)}
                          className="text-amber-400 underline font-semibold flex items-center gap-1 cursor-pointer hover:text-amber-300"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Slip
                        </button>
                      ) : (
                        <span className="text-zinc-600 italic">None</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.paymentStatus === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : u.paymentStatus === 'rejected'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {u.paymentStatus?.toUpperCase() || 'PENDING'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          u.checkedIn
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-zinc-800 text-zinc-500'
                        }`}
                      >
                        {u.checkedIn ? 'CHECKED IN' : 'OUT'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slip Modal */}
      {(selectedSlip || loadingSlip) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f0f10] border border-amber-500/30 w-full max-w-sm rounded-2xl p-5 relative shadow-2xl space-y-4">
            
            {loadingSlip ? (
              <div className="py-12 text-center text-xs text-amber-300 flex flex-col items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 animate-spin text-amber-400" />
                <span>Loading payment slip...</span>
              </div>
            ) : (
              <>
                <div className="text-center space-y-1">
                  <h3 className="font-extrabold text-base text-zinc-100">{selectedSlip.fullName}</h3>
                  <p className="text-xs text-amber-300 font-mono">ID: {selectedSlip.studentId}</p>
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

                <input
                  type="text"
                  placeholder="Reason for rejection (optional)..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full bg-[#1d1d20] border border-zinc-800 rounded-xl py-2 px-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-400"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => handleRejectPayment(selectedSlip.studentId)}
                    className="flex-1 py-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-bold hover:bg-red-900/60 transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                  <button
                    onClick={() => handleApprovePayment(selectedSlip.studentId)}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 text-zinc-950 text-xs font-black hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-1 shadow-lg shadow-amber-500/15"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </button>
                </div>

                <button
                  onClick={() => setSelectedSlip(null)}
                  className="w-full py-1.5 text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}