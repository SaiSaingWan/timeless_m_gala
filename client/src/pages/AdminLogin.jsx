import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ShieldCheck, Lock, Sparkles, ShieldAlert, ArrowLeft, UserCheck } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!/^\d{10}$/.test(studentId)) {
      setError('Admin Student ID must be exactly 10 digits.');
      return;
    }

    if (!/^\d{6}$/.test(passcode)) {
      setError('Passcode must be exactly 6 numeric digits.');
      return;
    }

    setLoading(true);

    try {
      // Query the 'admins' collection by studentId
      const adminRef = doc(db, 'admins', studentId);
      const adminSnap = await getDoc(adminRef);

      if (!adminSnap.exists()) {
        setError('Access denied. No admin account found with this ID.');
        setLoading(false);
        return;
      }

      const adminData = adminSnap.data();

      if (adminData.passcode !== passcode) {
        setError('Incorrect 6-digit passcode.');
        setLoading(false);
        return;
      }

      // Store admin session
      localStorage.setItem('isAdminAuthenticated', 'true');
      localStorage.setItem('adminName', adminData.fullName);

      setLoading(false);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Admin login error:', err);
      setError('Failed to authenticate admin. Check connection.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-100 flex justify-center items-center p-4 font-sans selection:bg-amber-400 selection:text-zinc-950">
      <div className="w-full max-w-md bg-[#0f0f10] border border-amber-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-100 p-[1px] mx-auto shadow-lg shadow-amber-500/15">
            <div className="w-full h-full bg-[#0f0f10] rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <h1 className="text-xl font-extrabold text-zinc-100">Gala Admin Portal</h1>
          <p className="text-xs text-zinc-400">Enter Admin ID & 6-Digit Passcode</p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          {error && (
            <div className="bg-red-950/40 border border-red-500/40 text-red-200 text-xs p-3 rounded-xl text-center font-medium flex items-center justify-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Admin Student ID */}
          <div>
            <label className="block text-[10px] font-bold text-amber-300 mb-1 uppercase tracking-wider">
              Admin Student ID (10 Digits)
            </label>
            <div className="relative">
              <UserCheck className="w-4 h-4 text-amber-400/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                inputMode="numeric"
                maxLength={10}
                required
                placeholder="e.g. 6731503084"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full bg-[#1d1d20] border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-all font-mono"
              />
            </div>
          </div>

          {/* 6-Digit Passcode */}
          <div>
            <label className="block text-[10px] font-bold text-amber-300 mb-1 uppercase tracking-wider">
              6-Digit Passcode
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-amber-400/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                required
                placeholder="••••••"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-[#1d1d20] border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm tracking-widest text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-all font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 hover:brightness-110 text-zinc-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15 cursor-pointer disabled:opacity-50 transition-all"
          >
            {loading ? (
              <Sparkles className="w-4 h-4 animate-spin text-zinc-950" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" /> Log In to Admin Panel
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-xs text-zinc-500 hover:text-amber-300 flex items-center justify-center gap-1 mx-auto transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Public Portal
          </button>
        </div>
      </div>
    </div>
  );
}