import React, { useState } from 'react';
import { MessageSquare, Search, Plus, Phone, Check, Clock, Send, ArrowRight, User, Copy } from 'lucide-react';
import { EnquiryRecord } from './types';
import { copyTextToClipboard } from '../../utils/referenceNumber';

interface StaffEnquiriesTabProps {
  enquiries: EnquiryRecord[];
  isDark: boolean;
  onUpdateStatus: (id: string, status: string, notes?: string) => Promise<void>;
  onCreateEnquiry: (data: any) => Promise<void>;
  onNotify: (type: 'success' | 'error', message: string) => void;
}

export const StaffEnquiriesTab: React.FC<StaffEnquiriesTabProps> = ({
  enquiries,
  isDark,
  onUpdateStatus,
  onCreateEnquiry,
  onNotify
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [newEnq, setNewEnq] = useState({
    customerName: '',
    phone: '',
    email: '',
    origin: 'Trichy (TRZ)',
    destination: 'Dubai (DXB)',
    travelDate: '2026-10-20',
    passengers: 1,
    cabinClass: 'Economy',
    budget: 15000,
    notes: 'Immediate seat requirement'
  });

  const filtered = enquiries.filter((e) => {
    const q = search.toLowerCase();
    const token = (e.token || e.referenceNumber || e.id || '').toLowerCase();
    const matchesSearch = !search || 
      e.customerName.toLowerCase().includes(q) ||
      e.destination.toLowerCase().includes(q) ||
      e.origin.toLowerCase().includes(q) ||
      token.includes(q) ||
      e.phone.includes(search);
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await onUpdateStatus(id, newStatus);
      onNotify('success', `Enquiry status updated to ${newStatus}`);
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to update enquiry status.');
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onCreateEnquiry(newEnq);
      setShowAddModal(false);
      onNotify('success', `Enquiry registered for ${newEnq.customerName}`);
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to create enquiry.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-sky-400" />
            Customer Enquiries & Fare Requests
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track quotation requests, response times, and convert enquiries into confirmed bookings.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Log Walk-in Enquiry
        </button>
      </div>

      {/* Filter & Search */}
      <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search enquiries by customer, destination, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold uppercase">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
          >
            <option value="ALL">All ({enquiries.length})</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Quotation Sent">Quotation Sent</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Enquiries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((e) => {
          const refCode = e.token || e.referenceNumber || `MMS-INQ-${e.id.slice(-5).toUpperCase()}`;
          const waMessage = encodeURIComponent(
            `Hello ${e.customerName},\n\nThis is MMS Air Travels regarding your travel inquiry for ${e.origin} to ${e.destination} on ${e.travelDate} (${e.passengers} Pax).\nOfficial Reference Number: ${refCode}.\n\nOur team has reviewed your request. Here are the options available for your sector...`
          );

          return (
            <div
              key={e.id}
              className={`p-5 rounded-3xl border transition-all ${
                isDark ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {/* Reference Number with copy */}
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800 text-sky-300 font-mono text-[11px] font-bold">
                      <span>{refCode}</span>
                      <button
                        onClick={async () => {
                          await copyTextToClipboard(refCode);
                          setCopiedToken(refCode);
                          setTimeout(() => setCopiedToken(null), 2000);
                        }}
                        className="p-0.5 hover:text-white rounded transition-colors"
                        title="Copy Reference"
                      >
                        {copiedToken === refCode ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-sky-400" />
                        )}
                      </button>
                    </div>

                    {e.serviceType && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {e.serviceType}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-white">{e.customerName}</h3>
                  <span className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <Phone className="w-3 h-3 text-slate-500" />
                    <span>{e.phone}</span>
                    {e.email && <span>• {e.email}</span>}
                  </span>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  e.status === 'New' 
                    ? 'bg-blue-950 text-sky-300 border border-blue-800 animate-pulse'
                    : e.status === 'Confirmed'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-purple-950 text-purple-300 border border-purple-800'
                }`}>
                  {e.status}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 mb-3 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Route Sector:</span>
                  <span className="font-bold text-white">{e.origin} ➔ {e.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Date & Pax:</span>
                  <span className="text-slate-200">{e.travelDate} • {e.passengers} Passenger(s) • {e.cabinClass}</span>
                </div>
                {e.budget && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Budget Estimate:</span>
                    <span className="font-bold text-amber-400">₹{e.budget.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {e.notes && (
                  <div className="pt-1.5 border-t border-slate-800 text-[11px] text-slate-400 italic">
                    "{e.notes}"
                  </div>
                )}
              </div>

              {/* Workflow Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500">Logged {e.createdAt}</span>
                  {/* WhatsApp Quick Send */}
                  <a
                    href={`https://wa.me/${e.phone.replace(/[^0-9]/g, '')}?text=${waMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                <div className="flex items-center gap-1.5">
                  {e.status === 'New' && (
                    <button
                      onClick={() => handleStatusChange(e.id, 'Quotation Sent')}
                      className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] cursor-pointer"
                    >
                      Send Quotation
                    </button>
                  )}
                  {e.status === 'Quotation Sent' && (
                    <button
                      onClick={() => handleStatusChange(e.id, 'Confirmed')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer"
                    >
                      Mark Confirmed
                    </button>
                  )}
                  {e.status !== 'Completed' && (
                    <button
                      onClick={() => handleStatusChange(e.id, 'Completed')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] cursor-pointer"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Log Enquiry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-700 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-base">Register Customer Enquiry</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mohamed Riyaz"
                  value={newEnq.customerName}
                  onChange={(e) => setNewEnq({ ...newEnq, customerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 94432..."
                    value={newEnq.phone}
                    onChange={(e) => setNewEnq({ ...newEnq, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Destination</label>
                  <input
                    type="text"
                    required
                    placeholder="Dubai (DXB)"
                    value={newEnq.destination}
                    onChange={(e) => setNewEnq({ ...newEnq, destination: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Travel Date</label>
                  <input
                    type="date"
                    required
                    value={newEnq.travelDate}
                    onChange={(e) => setNewEnq({ ...newEnq, travelDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Passengers</label>
                  <input
                    type="number"
                    value={newEnq.passengers}
                    onChange={(e) => setNewEnq({ ...newEnq, passengers: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Estimated Budget (₹)</label>
                <input
                  type="number"
                  value={newEnq.budget}
                  onChange={(e) => setNewEnq({ ...newEnq, budget: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Save Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
