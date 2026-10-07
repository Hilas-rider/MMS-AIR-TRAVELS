import React, { useState } from 'react';
import { BookmarkCheck, Search, Plus, Printer, Edit3, Trash2, CheckCircle, Clock, XCircle, FileText, ArrowRight, AlertTriangle, MessageSquare } from 'lucide-react';
import { BookingRecord } from './types';
import { cleanPhoneForWhatsApp, openWhatsAppLink } from '../../utils/whatsappHelper';

interface StaffBookingsTabProps {
  bookings: BookingRecord[];
  isDark: boolean;
  onUpdateBooking: (id: string, updatedData: any) => Promise<void>;
  onDeleteBooking: (id: string) => Promise<void>;
  onCreateBooking: (bookingData: any) => Promise<void>;
  onNotify: (type: 'success' | 'error', message: string) => void;
}

export const StaffBookingsTab: React.FC<StaffBookingsTabProps> = ({
  bookings,
  isDark,
  onUpdateBooking,
  onDeleteBooking,
  onCreateBooking,
  onNotify
}) => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<BookingRecord | null>(null);
  const [deletingBooking, setDeletingBooking] = useState<BookingRecord | null>(null);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [newBkg, setNewBkg] = useState({
    customerName: '',
    phone: '',
    email: '',
    airline: 'IndiGo',
    flightNumber: '6E 1475',
    route: 'TRZ → DXB',
    travelDate: '2026-10-15',
    departureTime: '10:30 AM',
    passengers: 1,
    amount: 14500,
    paymentStatus: 'Paid' as BookingRecord['paymentStatus'],
    bookingStatus: 'Ticketed' as BookingRecord['bookingStatus']
  });

  const filtered = bookings.filter(b =>
    !search ||
    b.customerName.toLowerCase().includes(search.toLowerCase()) ||
    b.pnr.toLowerCase().includes(search.toLowerCase()) ||
    b.airline.toLowerCase().includes(search.toLowerCase()) ||
    b.route.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onCreateBooking(newBkg);
      setShowModal(false);
      onNotify('success', `Booking registered with PNR generation.`);
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to create booking.');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;
    try {
      setIsSubmittingEdit(true);
      await onUpdateBooking(editingBooking.id, editingBooking);
      onNotify('success', `Ticket PNR ${editingBooking.pnr} updated successfully.`);
      setEditingBooking(null);
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to update ticket.');
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBooking) return;
    try {
      setIsDeleting(true);
      await onDeleteBooking(deletingBooking.id);
      onNotify('success', `Ticket PNR ${deletingBooking.pnr} permanently deleted.`);
      setDeletingBooking(null);
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to delete ticket.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePrintTicket = (b: BookingRecord) => {
    onNotify('success', `E-Ticket receipt formatted for PNR ${b.pnr}. Sending to dispatch printer.`);
  };

  const handleSendWhatsApp = (b: BookingRecord) => {
    const cleanPhone = cleanPhoneForWhatsApp(b.phone || '9500977442');
    const text = `✈️ *MMS TOURS & TRAVELS - FLIGHT ITINERARY CONFIRMATION*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nDear ${b.customerName},\nYour flight booking is confirmed:\n\n📌 *PNR:* *${b.pnr}*\n🛫 *Flight:* ${b.airline} (${b.flightNumber})\n📍 *Route:* ${b.route}\n📅 *Travel Date:* ${b.travelDate} at ${b.departureTime}\n👥 *Passengers:* ${b.passengers}\n⚡ *Booking Status:* ${b.bookingStatus}\n💳 *Payment Status:* ${b.paymentStatus}\n💰 *Total Fare:* ₹${b.amount.toLocaleString('en-IN')}\n\nScan your mobile boarding pass or present this PNR at the airport.\n📞 24x7 Helpline: +91 95009 77442\nHave a safe and pleasant journey!`;
    const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`;
    openWhatsAppLink(url);
    onNotify('success', `Opening WhatsApp automated dispatch to +${cleanPhone}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-emerald-400" />
            Confirmed Bookings & PNR Registry
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            GDS ticket issuances, payment collection status, and customer boarding manifests.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Direct Booking
        </button>
      </div>

      {/* Search */}
      <div className={`p-4 rounded-2xl border ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, PNR code (e.g. MMS-66520), airline, or route..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className={`rounded-3xl border overflow-hidden shadow-xl ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className={`border-b text-[10px] font-bold uppercase tracking-wider ${
              isDark ? 'bg-slate-950/80 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}>
              <tr>
                <th className="p-4">PNR</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Flight & Carrier</th>
                <th className="p-4">Sector Route</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">E-Ticket</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 font-medium">
              {filtered.map((b) => (
                <tr 
                  key={b.id}
                  className={`transition-colors ${isDark ? 'hover:bg-slate-850' : 'hover:bg-slate-50'}`}
                >
                  <td className="p-4 font-mono font-black text-sky-400">
                    {b.pnr}
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-white block">{b.customerName}</span>
                    <span className="text-[10px] text-slate-400">{b.phone}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-white block">{b.airline}</span>
                    <span className="font-mono text-amber-400 text-[11px]">{b.flightNumber}</span>
                  </td>
                  <td className="p-4 font-bold text-slate-200">
                    {b.route}
                  </td>
                  <td className="p-4 text-slate-300">
                    <div>{b.travelDate}</div>
                    <span className="text-[10px] text-slate-500">{b.departureTime}</span>
                  </td>
                  <td className="p-4 text-right font-black text-emerald-400 text-sm num-tabular">
                    ₹{b.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      b.paymentStatus === 'Paid'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      b.bookingStatus === 'Ticketed'
                        ? 'bg-blue-950 text-sky-300 border border-blue-800'
                        : 'bg-purple-950 text-purple-300 border border-purple-800'
                    }`}>
                      {b.bookingStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleSendWhatsApp(b)}
                        className="px-2 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 hover:text-white text-xs font-semibold flex items-center gap-1 border border-emerald-800/60 cursor-pointer transition-colors"
                        title="Send automated booking confirmation directly to customer's WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </button>

                      <button
                        onClick={() => handlePrintTicket(b)}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                        title="Print Ticket / Manifest"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-400" />
                        <span className="hidden md:inline">Print</span>
                      </button>

                      <button
                        onClick={() => setEditingBooking({ ...b })}
                        className="px-2 py-1 rounded-lg bg-blue-950/70 hover:bg-blue-900 text-blue-300 hover:text-white text-xs font-semibold flex items-center gap-1 border border-blue-700/50 cursor-pointer transition-colors"
                        title="Modify Ticket Details"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                        <span>Modify</span>
                      </button>

                      <button
                        onClick={() => setDeletingBooking(b)}
                        className="px-2 py-1 rounded-lg bg-rose-950/70 hover:bg-rose-900 text-rose-300 hover:text-white text-xs font-semibold flex items-center gap-1 border border-rose-800/50 cursor-pointer transition-colors"
                        title="Delete Ticket Record"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modify Ticket Modal */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-xl p-6 rounded-3xl bg-slate-900 border border-slate-700 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="font-black text-lg text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-blue-400" />
                  Modify Ticket — PNR: {editingBooking.pnr}
                </h3>
                <p className="text-xs text-slate-400">Update passenger, flight, payment, or carriage status</p>
              </div>
              <button 
                onClick={() => setEditingBooking(null)} 
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">PNR (System Locked)</label>
                  <input
                    type="text"
                    disabled
                    value={editingBooking.pnr}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-amber-400 font-mono font-bold cursor-not-allowed"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Customer / Passenger Name</label>
                  <input
                    type="text"
                    required
                    value={editingBooking.customerName}
                    onChange={(e) => setEditingBooking({ ...editingBooking, customerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editingBooking.phone}
                    onChange={(e) => setEditingBooking({ ...editingBooking, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editingBooking.email}
                    onChange={(e) => setEditingBooking({ ...editingBooking, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Airline Carrier</label>
                  <input
                    type="text"
                    required
                    value={editingBooking.airline}
                    onChange={(e) => setEditingBooking({ ...editingBooking, airline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Flight Number</label>
                  <input
                    type="text"
                    required
                    value={editingBooking.flightNumber}
                    onChange={(e) => setEditingBooking({ ...editingBooking, flightNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-400 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Route Sector</label>
                  <input
                    type="text"
                    required
                    value={editingBooking.route}
                    onChange={(e) => setEditingBooking({ ...editingBooking, route: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Travel Date</label>
                  <input
                    type="date"
                    required
                    value={editingBooking.travelDate}
                    onChange={(e) => setEditingBooking({ ...editingBooking, travelDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Departure Time</label>
                  <input
                    type="text"
                    required
                    value={editingBooking.departureTime}
                    onChange={(e) => setEditingBooking({ ...editingBooking, departureTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Passengers Count</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    required
                    value={editingBooking.passengers}
                    onChange={(e) => setEditingBooking({ ...editingBooking, passengers: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Total Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editingBooking.amount}
                    onChange={(e) => setEditingBooking({ ...editingBooking, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Payment Status</label>
                  <select
                    value={editingBooking.paymentStatus}
                    onChange={(e) => setEditingBooking({ ...editingBooking, paymentStatus: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Paid">Paid (Full)</option>
                    <option value="Partial">Partial</option>
                    <option value="Pending">Pending</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Booking Status</label>
                  <select
                    value={editingBooking.bookingStatus}
                    onChange={(e) => setEditingBooking({ ...editingBooking, bookingStatus: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Ticketed">Ticketed (Confirmed)</option>
                    <option value="Confirmed">Confirmed (Holding)</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    const b = editingBooking;
                    setEditingBooking(null);
                    setDeletingBooking(b);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Ticket</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingBooking(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingEdit}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{isSubmittingEdit ? 'Saving...' : 'Save Ticket Changes'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Ticket Confirmation Modal */}
      {deletingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-rose-700/60 text-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800 text-rose-400 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-950/80 border border-rose-800/80 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="font-black text-base text-white">Permanently Delete Ticket?</h3>
                <p className="text-xs text-rose-400/90">This action will erase the ticket record permanently.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs mb-5">
              <div className="flex justify-between">
                <span className="text-slate-400">PNR Reference:</span>
                <span className="font-mono font-bold text-amber-400">{deletingBooking.pnr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Passenger:</span>
                <span className="font-bold text-white">{deletingBooking.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Flight:</span>
                <span className="text-slate-200">{deletingBooking.airline} ({deletingBooking.flightNumber})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sector / Route:</span>
                <span className="text-slate-200">{deletingBooking.route}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Fare:</span>
                <span className="font-bold text-emerald-400">₹{deletingBooking.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mb-5 leading-relaxed">
              Deleting this ticket will purge the e-ticket from the GDS registry and log the administrative deletion in security audit trail.
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingBooking(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                No, Keep Ticket
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-900/40 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Deleting...' : 'Yes, Delete Ticket'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-700 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-base">Direct GDS Booking</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. A. Rahman"
                  value={newBkg.customerName}
                  onChange={(e) => setNewBkg({ ...newBkg, customerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Carrier</label>
                  <input
                    type="text"
                    required
                    value={newBkg.airline}
                    onChange={(e) => setNewBkg({ ...newBkg, airline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Flight Number</label>
                  <input
                    type="text"
                    required
                    value={newBkg.flightNumber}
                    onChange={(e) => setNewBkg({ ...newBkg, flightNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Route</label>
                  <input
                    type="text"
                    required
                    value={newBkg.route}
                    onChange={(e) => setNewBkg({ ...newBkg, route: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Total Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={newBkg.amount}
                    onChange={(e) => setNewBkg({ ...newBkg, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-bold"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Generate PNR & Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
