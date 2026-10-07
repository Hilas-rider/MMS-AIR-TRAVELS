import React, { useState } from 'react';
import { Users, Search, Plus, Phone, Mail, MapPin, Calendar, Clock, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { CustomerRecord } from './types';

interface StaffCustomersTabProps {
  customers: CustomerRecord[];
  isDark: boolean;
  onCreateCustomer: (customerData: any) => Promise<void>;
  onNotify: (type: 'success' | 'error', message: string) => void;
}

export const StaffCustomersTab: React.FC<StaffCustomersTabProps> = ({
  customers,
  isDark,
  onCreateCustomer,
  onNotify
}) => {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustForm, setNewCustForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Trichy',
    notes: 'Direct client'
  });

  const filtered = customers.filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustForm.name || !newCustForm.phone) {
      onNotify('error', 'Name and Phone number are required.');
      return;
    }
    try {
      await onCreateCustomer(newCustForm);
      setShowAddModal(false);
      setNewCustForm({ name: '', phone: '', email: '', city: 'Trichy', notes: '' });
      onNotify('success', `Customer profile created for ${newCustForm.name}.`);
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to create customer.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-400" />
            Customer & Client Directory
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Maintain client profiles, corporate accounts, travel histories, and past booking records.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Customer Profile
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
            placeholder="Search customers by name, phone number, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className={`rounded-3xl border overflow-hidden shadow-xl ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className={`border-b text-[10px] font-bold uppercase tracking-wider ${
              isDark ? 'bg-slate-950/80 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}>
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">City</th>
                <th className="p-4 text-center">Enquiries</th>
                <th className="p-4 text-center">Bookings</th>
                <th className="p-4 text-right">Total Spend</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 font-medium">
              {filtered.map((c) => (
                <tr 
                  key={c.id}
                  className={`transition-colors ${isDark ? 'hover:bg-slate-850' : 'hover:bg-slate-50'}`}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-950 text-sky-400 border border-blue-800/60 flex items-center justify-center font-bold text-xs">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-white block">{c.name}</span>
                        <span className="text-[10px] text-slate-400">{c.lastInteraction}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-300">
                    <div>{c.phone}</div>
                    <div className="text-[10px] text-slate-400">{c.email || '—'}</div>
                  </td>
                  <td className="p-4 text-slate-300">
                    {c.city}
                  </td>
                  <td className="p-4 text-center text-amber-400 font-bold">
                    {c.enquiriesCount}
                  </td>
                  <td className="p-4 text-center text-emerald-400 font-bold">
                    {c.bookingsCount}
                  </td>
                  <td className="p-4 text-right font-black text-white num-tabular">
                    ₹{c.totalSpend.toLocaleString('en-IN')}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      c.status === 'VIP'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-blue-950 text-sky-300 border border-blue-800'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(c)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-xl p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-700 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base">{selectedCustomer.name}</h3>
                  <span className="text-xs text-slate-400">{selectedCustomer.city} • {selectedCustomer.status} Client</span>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Phone</span>
                <span className="font-bold text-white mt-0.5 block">{selectedCustomer.phone}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Email</span>
                <span className="font-bold text-white mt-0.5 block">{selectedCustomer.email || 'None on file'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Lifetime Travel Spend</span>
                <span className="font-bold text-emerald-400 mt-0.5 block">₹{selectedCustomer.totalSpend.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Internal Notes</span>
                <span className="text-slate-300 mt-0.5 block">{selectedCustomer.notes || 'VIP frequent passenger.'}</span>
              </div>
            </div>

            {/* Travel History Timeline */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Past Travel & PNR History</h4>
              <div className="space-y-2">
                {selectedCustomer.travelHistory.length === 0 ? (
                  <p className="text-xs text-slate-500">No previous flight history on record.</p>
                ) : (
                  selectedCustomer.travelHistory.map((t, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white">{t.route}</span>
                        <span className="text-[10px] text-slate-400 block">{t.airline} • {t.date}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-sky-400 bg-slate-900 px-1.5 py-0.5 rounded text-[10px]">{t.pnr}</span>
                        <span className="font-bold text-emerald-400 block mt-0.5">₹{t.amount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-700 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-base">New Customer Profile</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Syed Ibrahim"
                  value={newCustForm.name}
                  onChange={(e) => setNewCustForm({ ...newCustForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 98421 23456"
                  value={newCustForm.phone}
                  onChange={(e) => setNewCustForm({ ...newCustForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. client@gmail.com"
                  value={newCustForm.email}
                  onChange={(e) => setNewCustForm({ ...newCustForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">City / Region</label>
                <input
                  type="text"
                  value={newCustForm.city}
                  onChange={(e) => setNewCustForm({ ...newCustForm, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Staff Notes</label>
                <textarea
                  rows={2}
                  value={newCustForm.notes}
                  onChange={(e) => setNewCustForm({ ...newCustForm, notes: e.target.value })}
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
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
