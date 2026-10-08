import { QRCodeSVG } from 'qrcode.react';
import { Calendar, Ticket, Clock, ShieldAlert, CheckCircle2, UserCheck } from 'lucide-react';

export default function TicketTab({ studentId, studentName, paymentStatus = 'pending', checkedIn = false }) {
  const isApproved = paymentStatus === 'approved';

  return (
    <div className="space-y-4">
      {/* Ticket Pass Box */}
      <div className="bg-[#1d1d20]/90 border border-amber-500/30 rounded-2xl p-6 text-center shadow-2xl relative overflow-hidden">
        <div className="uppercase text-[10px] tracking-widest text-amber-300 font-extrabold mb-1">
          Official Entry Pass
        </div>
        <h2 className="text-xl font-extrabold text-zinc-100 mb-4">
          Timeless M-Gala 2026
        </h2>

        {/* QR Pass vs Pending Box */}
        {isApproved ? (
          <>
            <div className="bg-white p-4 rounded-2xl inline-block mb-3 border-4 border-amber-400/30 shadow-xl">
              <QRCodeSVG 
                value={`TMG-PASS-${studentId}`} 
                size={160} 
                bgColor="#FFFFFF" 
                fgColor="#0F0F10" 
                level="H" 
              />
            </div>
            <p className="text-[11px] text-amber-300 font-mono font-medium">
              TMG-PASS-{studentId}
            </p>
            <p className="text-[10px] text-zinc-400 mt-0.5">
              Scan at door for entry verification
            </p>
          </>
        ) : (
          <div className="bg-[#0f0f10] border-2 border-dashed border-amber-500/40 p-6 rounded-2xl flex flex-col items-center justify-center space-y-3 my-2 shadow-inner">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <span className="bg-amber-500/10 text-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-500/20 uppercase tracking-wider inline-flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-amber-400" /> Payment Under Verification
              </span>
              <p className="text-xs font-semibold text-zinc-200 pt-1">
                QR Pass Pending Approval
              </p>
              <p className="text-[11px] text-zinc-400 max-w-xs mx-auto">
                Your payment slip is being reviewed by the admin team. Unique QR code ticket will appear here once verified.
              </p>
            </div>
            <p className="text-[11px] text-amber-300 font-mono font-medium pt-2">
              REF: TMG-PENDING-{studentId}
            </p>
          </div>
        )}
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#1d1d20]/80 border border-zinc-800 rounded-xl p-3.5 text-left space-y-1">
          <Calendar className="w-4 h-4 text-amber-400" />
          <div className="text-[10px] text-zinc-400 uppercase font-bold">Date & Time</div>
          <div className="text-xs font-bold text-zinc-100">Nov 18 • 18:00 PM</div>
        </div>

        <div className="bg-[#1d1d20]/80 border border-zinc-800 rounded-xl p-3.5 text-left space-y-1">
          <Ticket className="w-4 h-4 text-amber-400" />
          <div className="text-[10px] text-zinc-400 uppercase font-bold">Ticket Status</div>
          <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            {isApproved ? (
              <span className="text-emerald-400 flex items-center gap-1 font-extrabold">
                <CheckCircle2 className="w-3.5 h-3.5" /> PAID (39 THB)
              </span>
            ) : (
              <span className="text-amber-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
                PENDING (39 THB)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pass Details + Check-In Status */}
      <div className="bg-[#1d1d20]/60 border border-zinc-800 rounded-xl p-4 space-y-3 text-xs">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
          <h3 className="font-bold text-zinc-200">Pass Details</h3>
          
          {/* Green Light Bud Check-In Badge */}
          {checkedIn ? (
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Checked In
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-zinc-800/80 border border-zinc-700/50 text-zinc-400 px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wider uppercase">
              <span className="h-2 w-2 rounded-full bg-zinc-500 inline-block" />
              Not Checked In
            </div>
          )}
        </div>

        <div className="flex justify-between text-zinc-400">
          <span>Student Name</span>
          <span className="font-semibold text-zinc-100">{studentName}</span>
        </div>
        <div className="flex justify-between text-zinc-400">
          <span>Student ID</span>
          <span className="font-mono font-semibold text-amber-300">{studentId}</span>
        </div>
        <div className="flex justify-between text-zinc-400">
          <span>Venue</span>
          <span className="font-semibold text-zinc-100">Main Auditorium</span>
        </div>
      </div>
    </div>
  );
}