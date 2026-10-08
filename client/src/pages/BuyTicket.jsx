import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ArrowLeft, Ticket, KeyRound, UserCheck, Sparkles, ShieldCheck, Mail, Phone, User, QrCode, Upload, Check, X, ShieldAlert } from 'lucide-react';

export default function BuyTicket() {
  const navigate = useNavigate();

  // Form States
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');

  // Payment Modal & Slip States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [slipFile, setSlipFile] = useState(null);
  const [slipPreview, setSlipPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form Validation
  const validateForm = () => {
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return false;
    }

    if (!/^\d{10}$/.test(studentId)) {
      setError('Student ID must be exactly 10 digits.');
      return false;
    }

    if (!email.trim().toLowerCase().endsWith('@lamduan.mfu.ac.th')) {
      setError('Email must end with @lamduan.mfu.ac.th');
      return false;
    }

    if (!phone.trim()) {
      setError('Please enter your phone number.');
      return false;
    }

    if (!/^\d{6}$/.test(passcode)) {
      setError('Passcode must be exactly 6 numeric digits.');
      return false;
    }

    if (passcode !== confirmPasscode) {
      setError('Passcodes do not match.');
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowPaymentModal(true);
  };

  const handleSlipChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSlipFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Registration directly to Firebase Firestore
  const completeRegistration = async () => {
    if (!slipPreview) {
      setError('Please upload your PromptPay payment slip before submitting.');
      return;
    }

    setLoading(true);

    try {
      const userPayload = {
        studentId,
        fullName,
        email,
        phone,
        passcode,
        ticketPrice: '39.00',
        paymentStatus: 'pending',
        slipUrl: slipPreview,
        votedMaleId: null,
        votedFemaleId: null,
        checkedIn: false,
        createdAt: new Date().toISOString()
      };

      // Save to Firebase Firestore 'users' collection
      await setDoc(doc(db, 'users', studentId), userPayload);

      localStorage.setItem('studentId', studentId);
      localStorage.setItem('studentName', fullName);

      setLoading(false);
      setShowPaymentModal(false);
      navigate('/dashboard');
    } catch (err) {
      console.error('Firebase Save Error:', err);
      setError('Failed to complete registration. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-100 flex justify-center font-sans selection:bg-amber-400 selection:text-zinc-950">
      <div className="w-full max-w-md bg-[#0f0f10] min-h-screen flex flex-col shadow-2xl border-x border-zinc-800/60 relative overflow-hidden">
        
        {/* Glow Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <header className="px-5 py-4 flex items-center justify-between border-b border-zinc-800/60 bg-[#0f0f10]/80 backdrop-blur-md sticky top-0 z-40">
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

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="bg-red-950/40 border border-red-500/40 text-red-200 text-xs p-3 rounded-xl text-center font-medium flex items-center justify-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
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
                  className="w-full bg-[#1d1d20]/80 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-all font-mono"
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
                    className="w-full bg-[#1d1d20]/80 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-2 text-sm tracking-widest text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-all font-mono"
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
                    className="w-full bg-[#1d1d20]/80 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-2 text-sm tracking-widest text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Price Tag */}
            <div className="bg-[#1d1d20]/80 border border-zinc-800 rounded-xl p-3 flex justify-between items-center text-xs my-2">
              <span className="text-zinc-400 font-medium">Standard Gala Ticket Pass</span>
              <span className="font-black text-amber-300 text-sm bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                39 THB
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
                  Confirm & Pay 39 THB
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

      {/* PromptPay Payment & Slip Upload Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f0f10] border border-amber-500/30 w-full max-w-sm rounded-2xl p-5 relative shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1d1d20] border border-amber-500/20 text-zinc-300 flex items-center justify-center hover:bg-[#27272a] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <span className="bg-amber-500/10 text-amber-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-amber-500/30 uppercase tracking-wider inline-flex items-center gap-1">
                <QrCode className="w-3 h-3 text-amber-400" /> PromptPay QR Payment
              </span>
              <h3 className="text-lg font-extrabold text-zinc-100">Scan & Pay 39 THB</h3>
              <p className="text-xs text-zinc-400">Transfer exact amount to complete registration.</p>
            </div>

            {/* PromptPay QR Section */}
            <div className="bg-[#1d1d20] p-4 rounded-xl border border-zinc-800 text-center space-y-3">
              <div className="bg-white p-3 rounded-lg inline-block shadow-lg">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PROMPTPAY-0812345678-39"
                  alt="PromptPay QR Code"
                  className="w-36 h-36"
                />
              </div>
              <div className="text-xs space-y-0.5">
                <p className="font-bold text-amber-300">Mae Fah Luang Student Gala Account</p>
                <p className="text-[11px] text-zinc-400 font-mono">PromptPay ID: 081-234-5678</p>
                <p className="text-sm font-extrabold text-zinc-100 pt-1">Amount: 39.00 THB</p>
              </div>
            </div>

            {/* Slip Upload */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                Upload Payment Transfer Slip
              </label>

              {slipPreview ? (
                <div className="relative rounded-xl border border-amber-500/40 p-2 bg-[#1d1d20] flex items-center gap-3">
                  <img src={slipPreview} alt="Slip Preview" className="w-12 h-16 object-cover rounded-md" />
                  <div className="flex-1 text-xs">
                    <p className="font-bold text-amber-300 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-amber-400" /> Slip Attached
                    </p>
                    <p className="text-[10px] text-zinc-400 truncate">{slipFile?.name}</p>
                  </div>
                  <button
                    onClick={() => { setSlipFile(null); setSlipPreview(''); }}
                    className="p-1.5 rounded-lg bg-[#0f0f10] text-zinc-400 hover:text-red-400 border border-zinc-800 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-zinc-800 hover:border-amber-500/40 bg-[#1d1d20]/50 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors">
                  <Upload className="w-6 h-6 text-amber-400/80 mb-1" />
                  <span className="text-xs font-semibold text-zinc-300">Tap to upload transfer slip image</span>
                  <span className="text-[10px] text-zinc-500 mt-0.5">JPG, PNG or WEBP</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSlipChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Confirm Button */}
            <button
              onClick={completeRegistration}
              disabled={loading || !slipPreview}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 text-zinc-950 font-black text-xs flex items-center justify-center gap-2 hover:brightness-110 cursor-pointer disabled:opacity-40 shadow-lg shadow-amber-500/15"
            >
              {loading ? (
                <Sparkles className="w-4 h-4 animate-spin text-zinc-950" />
              ) : (
                <>
                  <Check className="w-4 h-4" /> Submit Slip & Complete Registration
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}