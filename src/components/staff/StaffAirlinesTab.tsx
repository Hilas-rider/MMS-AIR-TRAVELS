import React, { useState } from 'react';
import { Building2, Plus, ShieldCheck, Globe, Plane, Check } from 'lucide-react';
import { AirlineRecord } from './types';

interface StaffAirlinesTabProps {
  airlines: AirlineRecord[];
  isDark: boolean;
  onCreateAirline: (airlineData: any) => Promise<void>;
  onNotify: (type: 'success' | 'error', message: string) => void;
}

export const StaffAirlinesTab: React.FC<StaffAirlinesTabProps> = ({
  airlines,
  isDark,
  onCreateAirline,
  onNotify
}) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    code: '',
    country: 'India',
    status: 'Active' as 'Active' | 'Inactive',
    notes: 'Direct API & wholesale ticketing agreement'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.code) {
      onNotify('error', 'Carrier name and airline code are required.');
      return;
    }
    try {
      await onCreateAirline(form);
      setShowModal(false);
      setForm({
        name: '',
        code: '',
        country: 'India',
        status: 'Active',
        notes: ''
      });
      onNotify('success', `Airline partner ${form.name} (${form.code.toUpperCase()}) added.`);
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to add airline.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-sky-400" />
            Airline Partners & GDS Bilaterals
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Accredited carrier ticketing authorities, airline 2-letter designators, and contract hubs.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Carrier
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {airlines.map((a) => (
          <div
            key={a.id}
            className={`p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
              isDark 
                ? 'bg-slate-900/90 border-slate-800 hover:border-blue-500/40 hover:shadow-xl' 
                : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-950/80 text-sky-400 border border-blue-800/60 flex items-center justify-center font-black text-base">
                {a.code}
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                a.status === 'Active' 
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {a.status}
              </span>
            </div>

            <h3 className="font-extrabold text-base text-white">{a.name}</h3>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{a.country} • Partner Carrier</span>
            </p>

            <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 mt-4 leading-relaxed">
              {a.notes || 'Full BSP ticketing integration enabled.'}
            </p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-700 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-base">Add Airline Carrier</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Airline Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Qatar Airways"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Airline 2-Letter Code</label>
                <input
                  type="text"
                  required
                  maxLength={3}
                  placeholder="e.g. QR"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Country / Registry</label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Operational Notes</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
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
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Save Carrier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
