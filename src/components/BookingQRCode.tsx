import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, CheckCircle2, Maximize2, ShieldCheck, Smartphone } from 'lucide-react';
import { Booking } from '../types';

interface BookingQRCodeProps {
  booking: Booking;
  size?: number;
  showDetails?: boolean;
  className?: string;
}

export const BookingQRCode: React.FC<BookingQRCodeProps> = ({
  booking,
  size = 140,
  showDetails = true,
  className = ''
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Secure payload for mobile check-in verification
  const qrPayload = JSON.stringify({
    system: 'MMS_TRAVELS_VERIFIED',
    pnr: booking.pnr,
    tkt: booking.eticketNumber,
    flt: `${booking.departureFlight.airlineCode}${booking.departureFlight.flightNumber}`,
    route: `${booking.departureFlight.origin.code}-${booking.departureFlight.destination.code}`,
    depDate: booking.departureFlight.departureDate,
    pax: booking.passengers[0] ? `${booking.passengers[0].firstName} ${booking.passengers[0].lastName}` : 'PASSENGER',
    seat: booking.passengers[0]?.seatNumber || 'GEN',
    gate: booking.departureFlight.gate,
    status: booking.bookingStatus,
    ts: booking.createdAt
  });

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(qrPayload, {
      width: size * 2, // 2x for sharp rendering
      margin: 1,
      color: {
        dark: '#0f172a', // slate-900
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    })
      .then((url: string) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err: Error) => {
        console.error('Failed to generate QR code:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [qrPayload, size]);

  const handleDownloadQR = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `MMS-BOARDING-QR-${booking.pnr}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyPayload = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(booking.pnr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* QR Container with Scanner Target Corners */}
      <div 
        onClick={() => setIsExpanded(true)}
        className="relative group p-2.5 bg-white rounded-2xl border-2 border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer hover:border-amber-400"
        title="Click to expand boarding pass QR for kiosk scanning"
      >
        {/* Scanner target corner highlights */}
        <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-amber-500 rounded-tl pointer-events-none" />
        <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-amber-500 rounded-tr pointer-events-none" />
        <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-amber-500 rounded-bl pointer-events-none" />
        <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-amber-500 rounded-br pointer-events-none" />

        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt={`Boarding Pass QR for PNR ${booking.pnr}`}
            style={{ width: `${size}px`, height: `${size}px` }}
            className="rounded-lg object-contain block select-none"
          />
        ) : (
          <div 
            style={{ width: `${size}px`, height: `${size}px` }} 
            className="flex flex-col items-center justify-center bg-slate-50 rounded-lg text-slate-400 text-xs gap-1"
          >
            <QrCode className="w-6 h-6 animate-pulse text-amber-500" />
            <span className="text-[10px] font-mono">Generating...</span>
          </div>
        )}

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-[11px] font-bold">
          <Maximize2 className="w-4 h-4" />
          <span>Expand QR</span>
        </div>
      </div>

      {showDetails && (
        <div className="mt-2 text-center space-y-1">
          <div className="flex items-center justify-center gap-1 text-[11px] font-mono font-black text-slate-800">
            <span>PNR: {booking.pnr}</span>
            <button
              type="button"
              onClick={handleCopyPayload}
              className="text-slate-400 hover:text-slate-800 p-0.5"
              title="Copy PNR reference"
            >
              {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <ShieldCheck className="w-3 h-3 text-blue-600" />}
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <Smartphone className="w-3 h-3" />
            <span>Mobile Check-in & Gate Pass</span>
          </div>

          <button
            type="button"
            onClick={handleDownloadQR}
            className="text-[10px] text-slate-500 hover:text-slate-900 flex items-center justify-center gap-1 font-semibold mx-auto hover:underline pt-0.5"
          >
            <Download className="w-3 h-3" />
            <span>Save QR Image</span>
          </button>
        </div>
      )}

      {/* Expanded Modal for Kiosk / Mobile Gate Scanner */}
      {isExpanded && (
        <div 
          onClick={() => setIsExpanded(false)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-5 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 block">
                  MMS DIGITAL BOARDING PASS
                </span>
                <h4 className="font-extrabold text-sm text-slate-900">Mobile Gate & Kiosk QR</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block relative">
              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-600 rounded-tl pointer-events-none" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-600 rounded-tr pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-600 rounded-bl pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-600 rounded-br pointer-events-none" />

              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt={`Boarding Pass QR for PNR ${booking.pnr}`}
                  className="w-56 h-56 mx-auto rounded-xl object-contain"
                />
              )}
            </div>

            <div className="space-y-1.5 text-xs">
              <p className="font-mono font-black text-slate-900 text-sm">
                PNR: {booking.pnr}
              </p>
              <p className="text-slate-600 font-semibold">
                {booking.departureFlight.airline} {booking.departureFlight.flightNumber} • Seat {booking.passengers[0]?.seatNumber || 'Standard'}
              </p>
              <p className="text-[11px] text-slate-400">
                Gate {booking.departureFlight.gate} • Terminal {booking.departureFlight.terminalDep}
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Verified for Airport Gate Scanner
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleDownloadQR}
                className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Save to Phone</span>
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
