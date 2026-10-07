import React, { useState } from 'react';
import { Sparkles, Plus, Calendar, Tag, Percent, ArrowRight } from 'lucide-react';
import { OfferRecord } from './types';

interface StaffOffersTabProps {
  offers: OfferRecord[];
  isDark: boolean;
  onCreateOffer: (offerData: any) => Promise<void>;
  onNotify: (type: 'success' | 'error', message: string) => void;
}

export const StaffOffersTab: React.FC<StaffOffersTabProps> = ({
  offers,
  isDark,
  onCreateOffer,
  onNotify
}) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: 'IndiGo Gulf Summer Promo',
    airline: 'IndiGo',
    airlineCode: '6E',
    sector: 'South India to UAE',
    fare: 12400,
    discountNote: 'Instant ₹1,500 off for group bookings of 3+ pax',
    validTill: '2026-10-31'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onCreateOffer(form);
      setShowModal(false);
      onNotify('success', `Offer "${form.title}" published to agencies.`);
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to publish offer.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Special Deals & Wholesale Agent Offers
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Exclusive airline consolidator fares, seasonal group discounts, and festival promotions.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Publish Special Offer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((o) => (
          <div
            key={o.id}
            className={`p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
              isDark ? 'bg-slate-900/90 border-slate-800 hover:border-amber-500/40 hover:shadow-xl' : 'bg-white border-slate-200 hover:border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                {o.airline} Special
              </span>
              <span className="text-[10px] text-slate-400">Valid till {o.validTill}</span>
            </div>

            <h3 className="font-extrabold text-base text-white">{o.title}</h3>
            <p className="text-xs text-slate-400 mt-1">{o.sector}</p>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 mt-4 flex items-baseline justify-between">
              <span className="text-xs text-slate-400">Starting Net Rate:</span>
              <span className="font-black text-emerald-400 text-lg num-tabular">
                ₹{o.fare.toLocaleString('en-IN')}
              </span>
            </div>

            <p className="text-xs text-amber-300/90 bg-amber-950/20 p-2.5 rounded-xl border border-amber-900/40 mt-3">
              ★ {o.discountNote}
            </p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-700 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-base">Publish Promotional Deal</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Offer Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Airline Carrier</label>
                  <input
                    type="text"
                    required
                    value={form.airline}
                    onChange={(e) => setForm({ ...form, airline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Promotional Net Fare (₹)</label>
                  <input
                    type="number"
                    required
                    value={form.fare}
                    onChange={(e) => setForm({ ...form, fare: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Sector Corridor</label>
                <input
                  type="text"
                  value={form.sector}
                  onChange={(e) => setForm({ ...form, sector: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Discount & Commission Note</label>
                <input
                  type="text"
                  value={form.discountNote}
                  onChange={(e) => setForm({ ...form, discountNote: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Validity Expiration</label>
                <input
                  type="date"
                  value={form.validTill}
                  onChange={(e) => setForm({ ...form, validTill: e.target.value })}
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
                  Publish Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
