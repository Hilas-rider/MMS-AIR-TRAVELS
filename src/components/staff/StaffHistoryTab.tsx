import React, { useState } from 'react';
import { History, Search, ArrowRight, User, Calendar, ShieldAlert } from 'lucide-react';
import { FareHistoryEntry } from './types';

interface StaffHistoryTabProps {
  history: FareHistoryEntry[];
  isDark: boolean;
}

export const StaffHistoryTab: React.FC<StaffHistoryTabProps> = ({ history, isDark }) => {
  const [search, setSearch] = useState('');

  const filtered = history.filter((h) => 
    !search ||
    h.flightNumber.toLowerCase().includes(search.toLowerCase()) ||
    h.route.toLowerCase().includes(search.toLowerCase()) ||
    h.changedByName.toLowerCase().includes(search.toLowerCase()) ||
    h.reason.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <History className="w-5 h-5 text-sky-400" />
            Fare Price Revision History & Audit Trail
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Immutable log of all fare adjustments, before-and-after values, author attribution, and mandatory audit reasons.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className={`p-4 rounded-2xl border ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search price history by flight number, sector, staff member, or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Timeline Layout */}
      <div className="relative border-l border-slate-800 ml-4 pl-6 space-y-6">
        {filtered.map((entry) => {
          const isDecrease = entry.newTotal < entry.previousTotal;

          return (
            <div key={entry.id} className="relative group">
              {/* Timeline Node Dot */}
              <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-slate-950 shadow-xs" />

              <div className={`p-5 rounded-3xl border transition-all ${
                isDark ? 'bg-slate-900/90 border-slate-800 group-hover:border-slate-700' : 'bg-white border-slate-200 shadow-xs'
              }`}>
                
                {/* Header: Flight & Timestamp */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-amber-400">
                      {entry.flightNumber}
                    </span>
                    <span className="font-bold text-xs text-white">
                      {entry.route}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{new Date(entry.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  </div>
                </div>

                {/* Price Shift Comparison Pill */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 line-through num-tabular">
                      ₹{entry.previousTotal.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-bold text-slate-500">➔</span>
                    <span className={`text-base font-black num-tabular ${
                      isDecrease ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      ₹{entry.newTotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isDecrease 
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {isDecrease ? 'Rate Discount' : 'Rate Increase'}
                  </span>
                </div>

                {/* Reason & Staff Attribution */}
                <div className="space-y-1.5 text-xs">
                  <p className="text-slate-300">
                    <strong className="text-slate-400 font-medium">Audit Reason:</strong> "{entry.reason}"
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1 text-slate-400">
                      <User className="w-3 h-3 text-slate-500" />
                      {entry.changedByName} ({entry.changedBy})
                    </span>
                    <span>•</span>
                    <span className="font-mono">IP: {entry.ip}</span>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
