import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ticket, KeyRound, UserCheck, Sparkles, ShieldCheck, Mail, Phone, User } from 'lucide-react';

export default function BuyTicket() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePurchase = (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!/^\d{10}$/.test(studentId)) {
      setError('Student ID must be exactly 10 digits.');
      return;
    }

    if (!email.trim().toLowerCase().endsWith('@lamduan.mfu.ac.th')) {
      setError('Email must end with @lamduan.mfu.ac.th');
      return;
    }

    if (!phone.trim()) {
      setError('Please enter your phone number.');
      return;
    }

    if (!/^\d{6}$/.test(passcode)) {
      setError('Passcode must be exactly 6 numeric digits.');
      return;
    }

    if (passcode !== confirmPasscode) {
      setError('Passcodes do not match.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('studentId', studentId);
      localStorage.setItem('studentName', fullName);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-100 flex justify-center font-sans selection:bg-amber-400 selection:text-zinc-950">
      <div className="w-full max-w-md bg-[#0f0f10] min-h-screen flex flex-col shadow-2xl border-x border-zinc-800/60 relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <header className="px-5 py-4 flex items-center justify-between border-b border-zinc-800/60 bg-[#0f0f10]/80 backdrop-blur-md sticky top-0 z-50">
          <button
            onClick={() => navigate('/')}
            className="w-9 h-9 rounded-full bg-[#1d1d20] border border-amber-500/30 flex items-center justify-center text-amber-300 hover:bg-[#27272a] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="font-extrabold text-sm tracking-widest bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 bg-clip-text text-transparent">
            TICKET REGISTRATION
          </span>
          <div className="w-9" />
        </header>

        {/* Form Body */}
        <main className="px-5 py-6 flex-1 flex flex-col justify-center">
          
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-100 p-[1px] mx-auto mb-3 shadow-lg shadow-amber-500/15">
              <div className="w-full h-full bg-[#0f0f10] rounded-2xl flex items-center justify-center">
                <Ticket className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <h1 className="text-2xl font-extrabold text-zinc-100 mb-1">
              Reserve Your Spot
            </h1>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Fill in your MFU student details and create a 6-digit passcode.
            </p>
          </div>

          <form onSubmit={handlePurchase} className="space-y-3.5">
            
            {error && (
              <div className="bg-red-950/40 border border-red-500/40 text-red-200 text-xs p-3 rounded-xl text-center font-medium">
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-[10px] font-bold text-amber-300 mb-1 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-amber-400/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#1d1d20]/80 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-all"
                />
              </div>
            </div>

            {/* Student ID */}
            <div>
              <label className="block text-[10px] font-bold text-amber-300 mb-1 uppercase tracking-wider">
                Student ID (10 Digits)
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
                  className="w-full bg-[#1d1d20]/80 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold text-amber-300 mb-1 uppercase tracking-wider">
                MFU Student Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-amber-400/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="username@lamduan.mfu.ac.th"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1d1d20]/80 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-all"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[10px] font-bold text-amber-300 mb-1 uppercase tracking-wider">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-amber-400/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="0812345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#1d1d20]/80 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-all"
                />
              </div>
            </div>

            {/* Passcodes */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-amber-300 mb-1 uppercase tracking-wider">
                  Passcode
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-amber-400/80 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    required
                    placeholder="••••••"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full bg-[#1d1d20]/80 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-2 text-sm tracking-widest text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-amber-300 mb-1 uppercase tracking-wider">
                  Confirm
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-amber-400/80 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    required
                    placeholder="••••••"
                    value={confirmPasscode}
                    onChange={(e) => setConfirmPasscode(e.target.value)}
                    className="w-full bg-[#1d1d20]/80 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-2 text-sm tracking-widest text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Price Tag */}
            <div className="bg-[#1d1d20]/80 border border-zinc-800 rounded-xl p-3 flex justify-between items-center text-xs my-2">
              <span className="text-zinc-400 font-medium">Standard Gala Ticket Pass</span>
              <span className="font-black text-amber-300 text-sm bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                89 THB
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 hover:brightness-110 text-zinc-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Sparkles className="w-4 h-4 animate-spin text-zinc-950" />
              ) : (
                <>
                  <Ticket className="w-4 h-4" />
                  Confirm & Pay 89 THB
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] text-center text-zinc-500 mt-4">
            Already registered?{' '}
            <span
              onClick={() => navigate('/login')}
              className="text-amber-300 underline cursor-pointer hover:text-amber-200"
            >
              Log in here
            </span>
          </p>

        </main>

        <footer className="py-3 border-t border-zinc-800/60 text-center text-[10px] text-zinc-500">
          The Timeless M-Gala Pass System
        </footer>

      </div>
    </div>
  );
}