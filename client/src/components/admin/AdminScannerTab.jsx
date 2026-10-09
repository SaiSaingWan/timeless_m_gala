import { useEffect, useRef, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Html5Qrcode } from 'html5-qrcode';
import { QrCode, CheckCircle2, AlertTriangle, Search, UserCheck, ShieldAlert, Check, Camera } from 'lucide-react';

export default function AdminScannerTab({ users, createAuditLog }) {
  const [scanResult, setScanResult] = useState(null);
  const [manualSearch, setManualSearch] = useState('');
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const html5QrCodeRef = useRef(null);

  const playSound = (type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {
      console.warn('Audio playback not allowed or supported', e);
    }
  };

  const handleProcessScan = async (studentId) => {
    const user = users.find((u) => u.studentId === studentId);

    if (!user) {
      playSound('error');
      setScanResult({
        status: 'error',
        title: 'PASS NOT FOUND',
        message: `No registration found for ID: ${studentId}`,
        user: null
      });
      await createAuditLog('SCAN_FAILED', `Scanned unknown ID: ${studentId}`, studentId);
      return;
    }

    if (user.paymentStatus !== 'approved') {
      playSound('error');
      setScanResult({
        status: 'error',
        title: 'PAYMENT UNVERIFIED',
        message: `${user.fullName}'s payment slip is pending review.`,
        user
      });
      await createAuditLog('SCAN_DENIED', `Denied entry for ${user.fullName} (Unpaid)`, studentId);
      return;
    }

    if (user.checkedIn) {
      playSound('error');
      setScanResult({
        status: 'warning',
        title: 'ALREADY CHECKED IN!',
        message: `Pass previously scanned. DO NOT ADMIT AGAIN.`,
        user
      });
      await createAuditLog('SCAN_DUPLICATE', `Duplicate entry attempt for ${user.fullName}`, studentId);
      return;
    }

    try {
      await updateDoc(doc(db, 'users', studentId), {
        checkedIn: true,
        checkedInAt: new Date().toISOString()
      });
      playSound('success');
      setScanResult({
        status: 'success',
        title: 'GATE ENTRY GRANTED',
        message: `Welcome ${user.fullName}`,
        user
      });
      await createAuditLog('GATE_CHECKIN', `Admitted ${user.fullName} at gate`, studentId);
    } catch (err) {
      console.error('Check-in error:', err);
    }
  };

  const handleManualCheckIn = async (user) => {
    if (user.checkedIn) return;

    if (user.paymentStatus !== 'approved') {
      alert(`Cannot check in ${user.fullName}: Payment status is ${user.paymentStatus.toUpperCase()}.`);
      return;
    }

    try {
      await updateDoc(doc(db, 'users', user.studentId), {
        checkedIn: true,
        checkedInAt: new Date().toISOString()
      });
      playSound('success');
      setScanResult({
        status: 'success',
        title: 'MANUAL CHECK-IN SUCCESS',
        message: `Manually admitted ${user.fullName}`,
        user: { ...user, checkedIn: true }
      });
      await createAuditLog('MANUAL_CHECKIN', `Manually admitted ${user.fullName} at gate`, user.studentId);
    } catch (err) {
      console.error('Manual check-in failed:', err);
    }
  };

  // 1. Get List of Available Physical Cameras & Filter out OBS Virtual Camera
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          setCameras(devices);
          // Prefer physical laptop/phone camera over virtual devices like OBS
          const physicalCam = devices.find((d) => !d.label.toLowerCase().includes('obs')) || devices[0];
          setSelectedCameraId(physicalCam.id);
        }
      })
      .catch((err) => console.error('Camera enumeration error:', err));
  }, []);

  // 2. Start Scanner with Selected Camera Device
  useEffect(() => {
    if (!selectedCameraId) return;

    const html5QrCode = new Html5Qrcode('qr-reader');
    html5QrCodeRef.current = html5QrCode;

    html5QrCode
      .start(
        selectedCameraId,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          const studentId = decodedText.replace('TMG-PASS-', '').trim();
          await handleProcessScan(studentId);
        },
        () => {}
      )
      .catch((err) => console.error('Error starting scanner:', err));

    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch((err) => console.error('Scanner stop error:', err));
      }
    };
  }, [selectedCameraId, users]);

  const manualMatches = manualSearch.trim()
    ? users.filter(
        (u) =>
          u.studentId?.includes(manualSearch.trim()) ||
          u.fullName?.toLowerCase().includes(manualSearch.trim().toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6">
      {/* Upper Grid: Scanner & Live Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0f0f10] border border-zinc-800 p-5 rounded-2xl space-y-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-sm text-zinc-100 flex items-center gap-2">
              <QrCode className="w-4 h-4 text-amber-400" /> Live Gate Camera Scanner
            </h2>
            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20 animate-pulse">
              CAMERA ACTIVE
            </span>
          </div>

          {/* Camera Selection Dropdown */}
          {cameras.length > 1 && (
            <div className="flex items-center gap-2 bg-[#1d1d20] border border-zinc-800 p-2 rounded-xl text-xs text-zinc-300">
              <Camera className="w-4 h-4 text-amber-400 shrink-0" />
              <select
                value={selectedCameraId}
                onChange={(e) => setSelectedCameraId(e.target.value)}
                className="bg-transparent text-zinc-100 text-xs w-full focus:outline-none cursor-pointer"
              >
                {cameras.map((cam) => (
                  <option key={cam.id} value={cam.id} className="bg-[#1d1d20] text-zinc-100">
                    {cam.label || `Camera ${cam.id}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div id="qr-reader" className="w-full rounded-xl overflow-hidden border border-zinc-800 bg-[#1d1d20]" />
          <p className="text-[11px] text-zinc-500 text-center">
            Point camera at student QR pass to verify gate check-in.
          </p>
        </div>

        {/* Scan Status Feedback */}
        <div className="bg-[#0f0f10] border border-zinc-800 p-5 rounded-2xl flex flex-col justify-center text-center space-y-4">
          {scanResult ? (
            <div
              className={`p-6 rounded-2xl border ${
                scanResult.status === 'success'
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : scanResult.status === 'warning'
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                  : 'bg-red-950/40 border-red-500/40 text-red-200'
              } space-y-3 shadow-2xl`}
            >
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-black/40 border border-current">
                {scanResult.status === 'success' ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-amber-400" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-black">{scanResult.title}</h3>
                <p className="text-xs font-medium opacity-90 mt-1">{scanResult.message}</p>
              </div>

              {scanResult.user && (
                <div className="bg-black/50 p-3 rounded-xl text-xs space-y-1 text-left font-mono border border-zinc-800">
                  <div>Name: <span className="font-bold text-zinc-100">{scanResult.user.fullName}</span></div>
                  <div>ID: <span className="text-amber-300">{scanResult.user.studentId}</span></div>
                  <div>Phone: {scanResult.user.phone}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 space-y-2 text-zinc-500">
              <QrCode className="w-12 h-12 mx-auto text-zinc-700" />
              <p className="text-xs font-semibold">Ready to scan student entry passes...</p>
            </div>
          )}
        </div>
      </div>

      {/* Manual Search & Override Check-In Section */}
      <div className="bg-[#0f0f10] border border-zinc-800 p-5 rounded-2xl space-y-4 shadow-2xl">
        <div>
          <h3 className="font-extrabold text-sm text-zinc-100 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-400" /> Manual Gate Entry Override
          </h3>
          <p className="text-xs text-zinc-400">Search student ID or name directly to check in manually if QR camera scan fails.</p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Student ID or Name..."
            value={manualSearch}
            onChange={(e) => setManualSearch(e.target.value)}
            className="w-full bg-[#1d1d20] border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-all font-mono"
          />
        </div>

        {/* Search Results List */}
        {manualSearch.trim() && (
          <div className="space-y-2 border-t border-zinc-800/80 pt-3">
            {manualMatches.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-4">No matching student record found.</p>
            ) : (
              manualMatches.map((u) => {
                const isPaid = u.paymentStatus === 'approved';
                const isChecked = u.checkedIn;

                return (
                  <div
                    key={u.studentId}
                    className="bg-[#1d1d20] border border-zinc-800 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-xs text-zinc-100">{u.fullName}</div>
                      <div className="text-[11px] font-mono text-amber-300">ID: {u.studentId}</div>
                      <div className="flex items-center gap-2 pt-1">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                            isPaid
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {isPaid ? 'PAID / APPROVED' : 'UNPAID / PENDING'}
                        </span>
                        {isChecked && (
                          <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full text-[9px] font-extrabold">
                            CHECKED IN
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      disabled={isChecked || !isPaid}
                      onClick={() => handleManualCheckIn(u)}
                      className={`px-4 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                        isChecked
                          ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                          : !isPaid
                          ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 text-zinc-950 hover:brightness-110 cursor-pointer shadow-md'
                      }`}
                    >
                      {isChecked ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Admitted
                        </>
                      ) : !isPaid ? (
                        <>
                          <ShieldAlert className="w-3.5 h-3.5 text-zinc-600" /> Slip Unverified
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-3.5 h-3.5" /> Manual Check-In
                        </>
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}