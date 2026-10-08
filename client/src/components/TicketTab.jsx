import { QRCodeSVG } from 'qrcode.react';
import { Calendar, Ticket } from 'lucide-react';

export default function TicketTab({ studentId, studentName }) {
  return (
    <div className="space-y-4">
      {/* QR Pass */}
      <div className="bg-[#1d1d20]/90 border border-amber-500/30 rounded-2xl p-6 text-center shadow-2xl relative overflow-hidden">
        <div className="uppercase text-[10px] tracking-widest text-amber-300 font-extrabold mb-1">
          Official Entry Pass
        </div>
        <h2 className="text-xl font-extrabold text-zinc-100 mb-4">
          Timeless M-Gala 2026
        </h2>

        <div className="bg-white p-4 rounded-2xl inline-block mb-4 border-4 border-amber-400/30 shadow-xl">
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
          <div className="text-xs font-bold text-amber-300">PAID (89 THB)</div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-[#1d1d20]/60 border border-zinc-800 rounded-xl p-4 space-y-2 text-xs">
        <h3 className="font-bold text-zinc-200 border-b border-zinc-800 pb-2">
          Pass Details
        </h3>
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