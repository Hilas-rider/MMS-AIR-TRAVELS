import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Calendar, 
  Plane, 
  User, 
  Printer, 
  Download, 
  Share2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Luggage, 
  Utensils, 
  ArrowRight,
  Edit3,
  XCircle,
  Copy,
  FileCheck,
  ArrowUpDown,
  FileSpreadsheet,
  Filter,
  MessageSquare,
  Smartphone,
  QrCode,
  Send
} from 'lucide-react';
import { Booking, CurrencyCode } from '../types';
import { formatCurrency } from '../data/airports';
import { exportBookingsToCSV } from '../utils/csvExport';
import { BookingQRCode } from './BookingQRCode';
import { WhatsAppDispatchModal } from './WhatsAppDispatchModal';

interface ItineraryManagerProps {
  bookings: Booking[];
  currency: CurrencyCode;
  onUpdateBooking: (updated: Booking) => void;
  onCancelBooking: (bookingId: string) => void;
}

export const ItineraryManager: React.FC<ItineraryManagerProps> = ({
  bookings,
  currency,
  onUpdateBooking,
  onCancelBooking
}) => {
  const [searchPnr, setSearchPnr] = useState('');
  const [searchLastName, setSearchLastName] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState<string>(bookings[0]?.id || '');
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);
  const [copiedPnr, setCopiedPnr] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  // Dedicated search and sort state for the bookings list
  const [filterQuery, setFilterQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'status'>('date-desc');

  // Filter and sort bookings list
  const filteredBookings = useMemo(() => {
    let list = [...bookings];

    if (filterQuery.trim()) {
      const q = filterQuery.trim().toLowerCase();
      const cleanQ = q.replace(/^mms-?/i, '');
      list = list.filter(b => {
        const pnrClean = b.pnr.toLowerCase().replace(/^mms-?/i, '');
        const pnrMatch = b.pnr.toLowerCase().includes(q) || (cleanQ.length >= 3 && pnrClean.includes(cleanQ));
        const ticketMatch = b.eticketNumber.toLowerCase().includes(q);
        const flightMatch = b.departureFlight.flightNumber.toLowerCase().includes(q) ||
                            b.departureFlight.airline.toLowerCase().includes(q) ||
                            b.departureFlight.origin.code.toLowerCase().includes(q) ||
                            b.departureFlight.destination.code.toLowerCase().includes(q) ||
                            b.departureFlight.origin.name.toLowerCase().includes(q) ||
                            b.departureFlight.destination.name.toLowerCase().includes(q);
        const paxMatch = b.passengers.some(p => 
          `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
          (p.passportNumber && p.passportNumber.toLowerCase().includes(q))
        );
        return pnrMatch || ticketMatch || flightMatch || paxMatch;
      });
    }

    list.sort((a, b) => {
      if (sortBy === 'date-desc') {
        const dateA = new Date(a.createdAt || a.departureFlight.departureDate).getTime();
        const dateB = new Date(b.createdAt || b.departureFlight.departureDate).getTime();
        return dateB - dateA;
      }
      if (sortBy === 'date-asc') {
        const dateA = new Date(a.createdAt || a.departureFlight.departureDate).getTime();
        const dateB = new Date(b.createdAt || b.departureFlight.departureDate).getTime();
        return dateA - dateB;
      }
      if (sortBy === 'status') {
        const statusWeights: Record<string, number> = {
          'CONFIRMED': 1,
          'CHECKED_IN': 2,
          'BOARDING': 3,
          'PENDING': 4,
          'CANCELLED': 5,
        };
        const wA = statusWeights[a.bookingStatus] || 99;
        const wB = statusWeights[b.bookingStatus] || 99;
        return wA - wB;
      }
      return 0;
    });

    return list;
  }, [bookings, filterQuery, sortBy]);

  // Active selected booking (or first match)
  const selectedBooking = bookings.find(b => b.id === selectedBookingId) || filteredBookings[0] || bookings[0];

  const handleSearchBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = searchPnr.trim().toUpperCase();
    const stripped = raw.replace(/^MMS-?/i, '');
    const match = bookings.find(b => {
      const bPnr = b.pnr.toUpperCase();
      const bPnrClean = bPnr.replace(/^MMS-?/i, '');
      const pnrMatch = bPnr === raw || bPnr.includes(raw) || (stripped.length >= 4 && bPnrClean.includes(stripped));
      const eticketMatch = b.eticketNumber.toUpperCase().includes(raw);
      const lastNameMatch = searchLastName.trim()
        ? b.passengers.some(p => p.lastName.toUpperCase() === searchLastName.trim().toUpperCase())
        : false;
      return pnrMatch || eticketMatch || lastNameMatch;
    });

    if (match) {
      setSelectedBookingId(match.id);
      showToast(`Itinerary for PNR ${match.pnr} loaded successfully!`);
    } else {
      showToast(`No itinerary found for booking reference "${raw}". Please check your 8-digit reference.`);
    }
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleCopyPnr = (pnr: string) => {
    navigator.clipboard.writeText(pnr);
    setCopiedPnr(true);
    setTimeout(() => setCopiedPnr(false), 2000);
    showToast(`PNR ${pnr} copied to clipboard!`);
  };

  // Helper for dynamic color-coded badges
  const renderStatusBadge = (status: Booking['bookingStatus']) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            CONFIRMED
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            CANCELLED
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            PENDING
          </span>
        );
      case 'CHECKED_IN':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            CHECKED IN
          </span>
        );
      case 'BOARDING':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-300">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            BOARDING
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
            {status}
          </span>
        );
    }
  };

  const renderStatusBadgeDark = (status: Booking['bookingStatus']) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            CONFIRMED
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            CANCELLED
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            PENDING
          </span>
        );
      case 'CHECKED_IN':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            CHECKED IN
          </span>
        );
      case 'BOARDING':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            BOARDING
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-500/20 text-slate-300 border border-slate-500/40">
            {status}
          </span>
        );
    }
  };

  // Download iCal (.ics) file
  const handleExportCalendar = (b: Booking) => {
    const flight = b.departureFlight;
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//MMS Air Travels//Itinerary//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Flight ${flight.airline} ${flight.flightNumber}: ${flight.origin.code} to ${flight.destination.code}`,
      `DESCRIPTION:PNR: ${b.pnr}\\nTerminal: ${flight.terminalDep}\\nSeat: ${b.passengers[0]?.seatNumber || 'Unassigned'}`,
      `LOCATION:${flight.origin.name}`,
      `DTSTART:${flight.departureDate.replace(/-/g, '')}T${flight.departureTime.replace(':', '')}00Z`,
      `DTEND:${flight.arrivalDate.replace(/-/g, '')}T${flight.arrivalTime.replace(':', '')}00Z`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Itinerary-${b.pnr}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Calendar event (.ics) exported for ${b.pnr}`);
  };

  const handleChangeSeat = (newSeat: string) => {
    if (!selectedBooking) return;
    const updated = {
      ...selectedBooking,
      passengers: selectedBooking.passengers.map((p, idx) => 
        idx === 0 ? { ...p, seatNumber: newSeat } : p
      )
    };
    onUpdateBooking(updated);
    setShowSeatModal(false);
    showToast(`Seat updated to ${newSeat} successfully!`);
  };

  const handleChangeMeal = (newMeal: string) => {
    if (!selectedBooking) return;
    const updated = {
      ...selectedBooking,
      passengers: selectedBooking.passengers.map((p, idx) => 
        idx === 0 ? { ...p, mealPreference: newMeal } : p
      )
    };
    onUpdateBooking(updated);
    setShowMealModal(false);
    showToast(`Meal preference updated to ${newMeal}!`);
  };

  const handleCancelTrip = () => {
    if (!selectedBooking) return;
    if (confirm(`Are you sure you want to cancel booking ${selectedBooking.pnr}? Refund calculation will be processed.`)) {
      onCancelBooking(selectedBooking.id);
      showToast(`Booking ${selectedBooking.pnr} has been cancelled. Refund initiated.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-amber-500/50 flex items-center gap-3 text-xs font-bold animate-fadeIn">
          <FileCheck className="w-4 h-4 text-amber-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header & PNR Quick Lookup */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              Itinerary Management & Manage Booking
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Access e-tickets, check live gate status, change seats, request meals, or export to calendar.
            </p>
          </div>

          {/* Quick sample PNR buttons for convenience */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold">Try Sample PNR:</span>
            {bookings.slice(0, 3).map((b) => (
              <button
                key={b.pnr}
                type="button"
                onClick={() => setSelectedBookingId(b.id)}
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  selectedBookingId === b.id
                    ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {b.pnr}
              </button>
            ))}
          </div>
        </div>

        {/* PNR Search Form */}
        <form onSubmit={handleSearchBooking} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-5">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Booking Reference (8-Digit PNR) or E-Ticket Number *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. MMS-78492015 or 8-digit 78492015"
              value={searchPnr}
              onChange={(e) => setSearchPnr(e.target.value.toUpperCase())}
              className="w-full p-2.5 text-xs font-mono font-bold uppercase bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Passenger Last Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Kumar"
              value={searchLastName}
              onChange={(e) => setSearchLastName(e.target.value)}
              className="w-full p-2.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              id="lookup-pnr-btn"
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>Retrieve Itinerary</span>
            </button>
          </div>
        </form>
      </div>

      {/* Main Itinerary Content Area */}
      {selectedBooking ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Itinerary Details & Boarding Pass */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Live Status Header Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
                <div>
                  <span className="text-[10px] text-amber-400 font-black uppercase tracking-widest block">
                    CURRENT ITINERARY STATUS
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-extrabold text-lg text-white">
                      {selectedBooking.departureFlight.airline} {selectedBooking.departureFlight.flightNumber}
                    </span>
                    {renderStatusBadgeDark(selectedBooking.bookingStatus)}
                  </div>
                </div>

                {/* PNR with copy button */}
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block font-semibold">Booking PNR</span>
                    <span className="font-mono text-sm font-black text-amber-400">{selectedBooking.pnr}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyPnr(selectedBooking.pnr)}
                    title="Copy PNR"
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Real-time flight tracking alert */}
              <div className="bg-slate-950/70 rounded-xl p-3.5 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <div>
                    <span className="font-bold text-slate-200">Real-Time Flight Tracker: </span>
                    <span className="text-emerald-400 font-semibold">ON TIME • Gate {selectedBooking.departureFlight.gate}</span>
                  </div>
                </div>
                <div className="text-right text-slate-400">
                  <span>Terminal {selectedBooking.departureFlight.terminalDep} • Departs {selectedBooking.departureFlight.departureTime}</span>
                </div>
              </div>
            </div>

            {/* Comprehensive Digital Boarding Pass */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden print-container">
              {/* Boarding pass ribbon */}
              <div className="bg-amber-500 px-5 py-2.5 text-slate-950 flex items-center justify-between font-black text-xs uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Plane className="w-4 h-4 -rotate-45" />
                  <span>OFFICIAL ELECTRONIC BOARDING PASS</span>
                </div>
                <span className="font-mono text-slate-950 font-bold">
                  AIRLINE TKT #{selectedBooking.eticketNumber}
                </span>
              </div>

              {/* Pass Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-dashed border-slate-200 pb-6">
                  {/* Origin */}
                  <div className="md:col-span-4 text-center md:text-left">
                    <span className="text-3xl font-black text-slate-900 block font-mono">
                      {selectedBooking.departureFlight.origin.code}
                    </span>
                    <span className="text-xs font-bold text-slate-700 block">
                      {selectedBooking.departureFlight.origin.city}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      {selectedBooking.departureFlight.terminalDep} • {selectedBooking.departureFlight.origin.name}
                    </span>
                    <div className="mt-2 text-sm font-black text-amber-600 font-mono">
                      {selectedBooking.departureFlight.departureTime}
                    </div>
                  </div>

                  {/* Flight center icon / duration */}
                  <div className="md:col-span-4 text-center">
                    <div className="text-[11px] font-bold text-slate-400 mb-1">
                      {selectedBooking.departureFlight.flightNumber} • {selectedBooking.departureFlight.aircraft}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-amber-500 my-1">
                      <div className="h-0.5 bg-slate-200 w-16" />
                      <Plane className="w-5 h-5 text-slate-900 rotate-90" />
                      <div className="h-0.5 bg-slate-200 w-16" />
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {selectedBooking.departureFlight.stops === 0 ? 'Non-Stop' : '1 Stop'}
                    </span>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Date: {selectedBooking.departureFlight.departureDate}
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="md:col-span-4 text-center md:text-right">
                    <span className="text-3xl font-black text-slate-900 block font-mono">
                      {selectedBooking.departureFlight.destination.code}
                    </span>
                    <span className="text-xs font-bold text-slate-700 block">
                      {selectedBooking.departureFlight.destination.city}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      {selectedBooking.departureFlight.terminalArr} • {selectedBooking.departureFlight.destination.name}
                    </span>
                    <div className="mt-2 text-sm font-black text-amber-600 font-mono">
                      {selectedBooking.departureFlight.arrivalTime}
                    </div>
                  </div>
                </div>

                {/* Passenger Data Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-b border-dashed border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">PASSENGER NAME</span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {selectedBooking.passengers[0]?.title} {selectedBooking.passengers[0]?.firstName} {selectedBooking.passengers[0]?.lastName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      Passport: {selectedBooking.passengers[0]?.passportNumber}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">ASSIGNED SEAT</span>
                    <span className="font-mono text-xl font-black text-amber-600">
                      {selectedBooking.passengers[0]?.seatNumber || 'Unassigned'}
                    </span>
                    <span className="text-[10px] text-slate-500 block capitalize">
                      {selectedBooking.cabinClass} Class
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">GATE & BOARDING</span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      Gate {selectedBooking.departureFlight.gate}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Zone 2 • Closes 20m before dep
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">MEAL & BAGGAGE</span>
                    <span className="font-bold text-slate-800 text-xs truncate block">
                      {selectedBooking.passengers[0]?.mealPreference || 'Standard Meal'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Allowance: 2x 23kg Checked
                    </span>
                  </div>
                </div>

                {/* Boarding Pass Mobile Verification & QR Code Row */}
                <div className="pt-5 border-t border-dashed border-slate-200 flex flex-col md:flex-row items-center justify-between gap-5">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    {/* Generated QR Code representation of the PNR for mobile scanning and faster check-in */}
                    <div className="shrink-0">
                      <BookingQRCode 
                        booking={selectedBooking} 
                        size={100} 
                        showDetails={false} 
                      />
                    </div>
                    
                    <div className="space-y-1 text-left flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-xs text-slate-900">
                          PNR: {selectedBooking.pnr}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">• FLT {selectedBooking.departureFlight.flightNumber}</span>
                      </div>
                      
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <Smartphone className="w-3 h-3 text-emerald-600" />
                        <span>Fast-Track Mobile Check-In & Gate Verification</span>
                      </div>
                      
                      <p className="text-[10px] text-slate-500 leading-tight">
                        Present this high-resolution QR code at airline self-service kiosks or mobile boarding gates.
                      </p>

                      {/* Official Barcode Strip */}
                      <div className="h-6 w-48 bg-slate-900 flex items-center justify-center text-[9px] font-mono tracking-widest text-white px-2 rounded mt-1 shadow-2xs">
                        ||| | |||| | || ||| || ||| ||||
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2.5 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowWhatsAppModal(true)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                      title="Send automated confirmation message containing itinerary to passenger's registered phone"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Send to Passenger WhatsApp</span>
                    </button>
                    
                    <div className="text-right text-[10px] text-slate-400">
                      <span>e-Ticket #{selectedBooking.eticketNumber} • MMS Air Desk</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Strip */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowWhatsAppModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                title="Send automated confirmation message via WhatsApp API directly to passenger's registered phone"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Itinerary</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>Print Official Boarding Pass</span>
              </button>

              <button
                type="button"
                onClick={() => handleExportCalendar(selectedBooking)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center gap-1.5 border border-slate-300 shadow-2xs transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-sky-600" />
                <span>Sync to Calendar (.ics)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  exportBookingsToCSV(bookings);
                  showToast(`Exported all ${bookings.length} bookings to CSV!`);
                }}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center gap-1.5 border border-slate-300 shadow-2xs transition-colors cursor-pointer"
                title="Export all bookings to CSV file"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export Bookings (.csv)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSeatModal(true)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center gap-1.5 border border-slate-300 shadow-2xs transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-500" />
                <span>Change Seat</span>
              </button>

              <button
                type="button"
                onClick={() => setShowMealModal(true)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center gap-1.5 border border-slate-300 shadow-2xs transition-colors cursor-pointer"
              >
                <Utensils className="w-3.5 h-3.5 text-emerald-500" />
                <span>Change Meal</span>
              </button>
            </div>
          </div>

          {/* Right Column: Manage Itinerary Actions & Other Saved Trips */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Passenger & Contact Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Booking Contact & Payment
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Contact Email:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[170px]">{selectedBooking.contactEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Contact Phone:</span>
                  <span className="font-semibold text-slate-800">{selectedBooking.contactPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Status:</span>
                  <span className="font-bold text-emerald-600">{selectedBooking.paymentStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount Paid:</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {formatCurrency(selectedBooking.paidAmount, currency)}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setShowWhatsAppModal(true)}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Send Itinerary to Passenger WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleCancelTrip}
                  className="w-full py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Cancel Itinerary</span>
                </button>
              </div>
            </div>

            {/* List of All Saved Trips with Dedicated Search, Sort, Badges & CSV Export */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3.5">
              {/* Header and Export Action */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    Saved Bookings
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Showing {filteredBookings.length} of {bookings.length}
                  </span>
                </div>
                
                <button
                  type="button"
                  onClick={() => {
                    exportBookingsToCSV(filteredBookings);
                    showToast(`Exported ${filteredBookings.length} booking records to CSV!`);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
                  title="Export filtered bookings to CSV spreadsheet"
                >
                  <Download className="w-3 h-3 text-emerald-600" />
                  <span>Export CSV</span>
                </button>
              </div>

              {/* Dedicated Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter by 8-digit PNR or passenger name..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full pl-8 pr-7 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium placeholder:text-slate-400"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                {filterQuery && (
                  <button
                    type="button"
                    onClick={() => setFilterQuery('')}
                    className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-700 p-0.5"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Sorting Controls */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <div className="flex items-center gap-1 text-slate-500 font-semibold text-[11px]">
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  <span>Sort By:</span>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="date-desc">Date (Newest First)</option>
                  <option value="date-asc">Date (Oldest First)</option>
                  <option value="status">Status Priority</option>
                </select>
              </div>

              {/* Bookings List */}
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {filteredBookings.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                    <p className="font-semibold text-slate-600">No bookings match your filter.</p>
                    <button
                      type="button"
                      onClick={() => setFilterQuery('')}
                      className="text-amber-600 hover:underline text-[11px] font-bold mt-1.5 block mx-auto cursor-pointer"
                    >
                      Clear Search Filter
                    </button>
                  </div>
                ) : (
                  filteredBookings.map((b) => {
                    const isCurrent = b.id === selectedBookingId;
                    return (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBookingId(b.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-amber-50 border-amber-400 shadow-xs ring-1 ring-amber-400/50'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1 gap-2">
                          <span className="font-mono font-bold text-xs text-slate-900 truncate">
                            {b.pnr}
                          </span>
                          {renderStatusBadge(b.bookingStatus)}
                        </div>
                        <p className="text-xs font-semibold text-slate-800">
                          {b.departureFlight.origin.code} → {b.departureFlight.destination.code}
                          <span className="text-slate-400 font-normal ml-1">({b.departureFlight.airline})</span>
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5 flex items-center justify-between">
                          <span>{b.departureFlight.departureDate}</span>
                          <span className="font-medium text-slate-700 truncate max-w-[120px]">
                            {b.passengers[0]?.firstName} {b.passengers[0]?.lastName}
                          </span>
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <p className="text-sm font-bold text-slate-700">No active itinerary selected.</p>
        </div>
      )}

      {/* Change Seat Modal */}
      {showSeatModal && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl border border-slate-200 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-slate-900">Change Assigned Seat</h3>
              <button
                type="button"
                onClick={() => setShowSeatModal(false)}
                className="text-slate-400 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Select a new seat for {selectedBooking.passengers[0]?.firstName}:
            </p>

            <div className="grid grid-cols-4 gap-2">
              {['12A', '14A', '14B', '15C', '16D', '17A', '18F', '19B', '20D', '21E', '22A', '23C'].map((seat) => {
                const isSelected = selectedBooking.passengers[0]?.seatNumber === seat;
                return (
                  <button
                    key={seat}
                    type="button"
                    onClick={() => handleChangeSeat(seat)}
                    className={`py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-black ring-2 ring-amber-400'
                        : 'bg-slate-100 hover:bg-amber-100 text-slate-800'
                    }`}
                  >
                    {seat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Change Meal Modal */}
      {showMealModal && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl border border-slate-200 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-slate-900">Update Special Meal Preference</h3>
              <button
                type="button"
                onClick={() => setShowMealModal(false)}
                className="text-slate-400 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {[
                'Standard In-Flight Meal',
                'Asian Vegetarian Meal (AVML)',
                'Halal Certified Meal (MOML)',
                'Diabetic Meal (DBML)',
                'Gluten-Free Meal (GFML)',
                'Fruit Platter / Low Calorie (FPML)'
              ].map((meal) => (
                <button
                  key={meal}
                  type="button"
                  onClick={() => handleChangeMeal(meal)}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-xs font-semibold text-slate-800 transition-colors flex items-center justify-between"
                >
                  <span>{meal}</span>
                  {selectedBooking.passengers[0]?.mealPreference === meal && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Automated WhatsApp Itinerary Dispatch Modal */}
      {selectedBooking && (
        <WhatsAppDispatchModal
          isOpen={showWhatsAppModal}
          onClose={() => setShowWhatsAppModal(false)}
          booking={selectedBooking}
          defaultPhone={selectedBooking.contactPhone}
          recipientLabel={`Passenger Phone (${selectedBooking.passengers[0]?.firstName || 'Lead Passenger'})`}
          onSuccessToast={(msg) => showToast(msg)}
        />
      )}
    </div>
  );
};
