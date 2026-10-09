import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { ShieldCheck, LogOut, Download, QrCode, UserCheck, History, Ticket, Clock, CheckCircle2, UserCheck as GateIcon } from 'lucide-react';

import AdminScannerTab from '../components/admin/AdminScannerTab';
import AdminPassesTab from '../components/admin/AdminPassesTab';
import AdminVotesTab from '../components/admin/AdminVotesTab';
import AdminAuditLogsTab from '../components/admin/AdminAuditLogsTab';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('scanner');
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);

  const adminName = localStorage.getItem('adminName') || 'System Admin';

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }

    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const logsQuery = query(collection(db, 'logs'), orderBy('createdAt', 'desc'));
    const unsubLogs = onSnapshot(logsQuery, (snapshot) => {
      setLogs(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubUsers();
      unsubLogs();
    };
  }, [navigate]);

  const createAuditLog = async (actionType, details, targetStudentId = '') => {
    try {
      await addDoc(collection(db, 'logs'), {
        adminName,
        actionType,
        details,
        targetStudentId,
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Failed to create audit log:', err);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Student ID,Full Name,Email,Phone,Payment Status,Checked In\n'];
    const rows = users.map(
      (u) =>
        `"${u.studentId}","${u.fullName}","${u.email}","${u.phone}","${u.paymentStatus}","${u.checkedIn ? 'YES' : 'NO'}"\n`
    );

    const blob = new Blob([headers.concat(rows).join('')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MFU_Gala_Attendees_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  // Calculated Real-Time Metrics
  const totalRegistered = users.length;
  const totalPending = users.filter((u) => u.paymentStatus === 'pending').length;
  const totalPaid = users.filter((u) => u.paymentStatus === 'approved').length;
  const totalCheckedIn = users.filter((u) => u.checkedIn).length;

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-100 font-sans p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0f0f10] border border-amber-500/30 p-4 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-base text-zinc-100">Gala Admin Suite</h1>
              <p className="text-xs text-zinc-400">Logged in as: <span className="text-amber-300 font-bold">{adminName}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="py-2 px-3 rounded-xl bg-[#1d1d20] border border-zinc-800 text-amber-300 text-xs font-semibold hover:border-amber-500/40 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('isAdminAuthenticated');
                localStorage.removeItem('adminName');
                navigate('/admin');
              }}
              className="py-2 px-3.5 rounded-xl bg-[#1d1d20] border border-zinc-800 text-zinc-300 text-xs font-semibold hover:text-red-400 transition-all cursor-pointer flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </header>

        {/* Real-time Insights Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Registered */}
          <div className="bg-[#0f0f10] border border-zinc-800 p-4 rounded-2xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Total Registered</span>
              <Ticket className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="text-2xl font-black text-zinc-100">{totalRegistered}</div>
            <div className="text-[10px] text-zinc-500">Student Sign-ups</div>
          </div>

          {/* Pending Review */}
          <div className="bg-[#0f0f10] border border-amber-500/30 p-4 rounded-2xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-amber-300">
              <span className="text-[10px] font-bold uppercase tracking-wider">Pending Review</span>
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            </div>
            <div className="text-2xl font-black text-amber-300">{totalPending}</div>
            <div className="text-[10px] text-amber-500/80">Slips to Approve</div>
          </div>

          {/* Approved / Paid */}
          <div className="bg-[#0f0f10] border border-emerald-500/30 p-4 rounded-2xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Approved / Paid</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">{totalPaid}</div>
            <div className="text-[10px] text-emerald-500/80">Valid Passes Generated</div>
          </div>

          {/* Gate Checked In */}
          <div className="bg-[#0f0f10] border border-blue-500/30 p-4 rounded-2xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-blue-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Checked In</span>
              <GateIcon className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-blue-400">{totalCheckedIn}</div>
            <div className="text-[10px] text-blue-500/80">Admitted at Venue Gate</div>
          </div>
        </div>

        {/* Modular Navigation Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 bg-[#0f0f10] p-1.5 rounded-2xl border border-zinc-800 gap-1.5">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'scanner' ? 'bg-amber-400 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <QrCode className="w-4 h-4" /> Camera Gate Scanner
          </button>
          
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'users' ? 'bg-amber-400 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <UserCheck className="w-4 h-4" /> Passes & Slips
            {totalPending > 0 && (
              <span className="bg-amber-500 text-zinc-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {totalPending}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('votes')}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'votes' ? 'bg-amber-400 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Vote Live Tally
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'logs' ? 'bg-amber-400 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <History className="w-4 h-4" /> Audit Log
          </button>
        </div>

        {/* Tab Components */}
        {activeTab === 'scanner' && <AdminScannerTab users={users} createAuditLog={createAuditLog} />}
        {activeTab === 'users' && <AdminPassesTab users={users} createAuditLog={createAuditLog} />}
        {activeTab === 'votes' && <AdminVotesTab users={users} createAuditLog={createAuditLog} />}
        {activeTab === 'logs' && <AdminAuditLogsTab logs={logs} />}

      </div>
    </div>
  );
}